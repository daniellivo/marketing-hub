-- Livo Content Platform - Initial Database Schema
-- This migration creates all necessary tables for the content management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable vector extension for embeddings (optional, for semantic search)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- USER PROFILES
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTENT IDEAS
-- ============================================================================
CREATE TABLE content_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  target_audience TEXT CHECK (target_audience IN ('Healthcare Professionals', 'Healthcare Facilities', 'Industry')),
  job_category TEXT CHECK (job_category IN ('All', 'Enfermería', 'TCAEs', 'Médicos')),
  template_type TEXT NOT NULL CHECK (template_type IN ('pillar', 'how-to', 'listicle', 'case-study', 'comparison', 'thought-leadership')),
  keywords TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'outline-ready', 'article-ready', 'published')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- OUTLINES
-- ============================================================================
CREATE TABLE outlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES content_ideas(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  template_used TEXT NOT NULL,
  generation_metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'approved', 'archived')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ARTICLES
-- ============================================================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idea_id UUID REFERENCES content_ideas(id),
  outline_id UUID REFERENCES outlines(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  meta_description TEXT,
  alt_text TEXT,
  category TEXT NOT NULL CHECK (category IN ('Healthcare Professionals', 'Healthcare Facilities', 'Industry')),
  job TEXT NOT NULL CHECK (job IN ('All', 'Enfermería', 'TCAEs', 'Médicos')),
  tags TEXT[] DEFAULT '{}',
  author TEXT,
  keywords TEXT[] DEFAULT '{}',
  word_count INT,
  reading_time INT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-review', 'ready', 'published')),
  version INT DEFAULT 1,
  generation_metadata JSONB DEFAULT '{}',
  notion_page_id TEXT,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMENT THREADS
-- ============================================================================
CREATE TABLE comment_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL CHECK (content_type IN ('outline', 'article')),
  content_id UUID NOT NULL,
  anchor_position JSONB NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMENTS
-- ============================================================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL CHECK (content_type IN ('outline', 'article')),
  content_id UUID NOT NULL,
  thread_id UUID REFERENCES comment_threads(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text_content TEXT NOT NULL,
  highlighted_text TEXT,
  position_data JSONB NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- KNOWLEDGE BASE FILES
-- ============================================================================
CREATE TABLE knowledge_base_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_path TEXT UNIQUE NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('company', 'seo', 'geo', 'quality')),
  file_name TEXT NOT NULL,
  content TEXT NOT NULL,
  -- embedding VECTOR(1536), -- Uncomment if using pgvector for semantic search
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TEMPLATES
-- ============================================================================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_type TEXT UNIQUE NOT NULL CHECK (template_type IN ('pillar', 'how-to', 'listicle', 'case-study', 'comparison', 'thought-leadership')),
  file_path TEXT NOT NULL,
  content TEXT NOT NULL,
  structure JSONB DEFAULT '{}',
  last_synced TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AI GENERATION HISTORY
-- ============================================================================
CREATE TABLE generation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('outline_generation', 'article_generation', 'revision')),
  input_data JSONB NOT NULL,
  output_data JSONB,
  ai_model TEXT NOT NULL,
  tokens_used INT,
  cost_usd DECIMAL(10,4),
  duration_ms INT,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTION PUBLISHING LOG
-- ============================================================================
CREATE TABLE notion_publish_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id),
  notion_page_id TEXT,
  notion_database_id TEXT,
  properties_sent JSONB,
  success BOOLEAN,
  error_message TEXT,
  published_by UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_content_ideas_status ON content_ideas(status);
CREATE INDEX idx_content_ideas_priority ON content_ideas(priority);
CREATE INDEX idx_content_ideas_created_by ON content_ideas(created_by);
CREATE INDEX idx_outlines_idea_id ON outlines(idea_id);
CREATE INDEX idx_outlines_status ON outlines(status);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_idea_id ON articles(idea_id);
CREATE INDEX idx_articles_outline_id ON articles(outline_id);
CREATE INDEX idx_comments_content ON comments(content_type, content_id);
CREATE INDEX idx_comments_thread ON comments(thread_id);
CREATE INDEX idx_comment_threads_content ON comment_threads(content_type, content_id);
CREATE INDEX idx_knowledge_base_type ON knowledge_base_files(file_type);
CREATE INDEX idx_generation_history_operation ON generation_history(operation_type);
CREATE INDEX idx_notion_publish_article ON notion_publish_log(article_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_publish_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all profiles, update own profile
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Content Ideas: All authenticated users can view, editors+ can create/edit
CREATE POLICY "Anyone can view ideas" ON content_ideas FOR SELECT USING (true);
CREATE POLICY "Editors can insert ideas" ON content_ideas FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Editors can update ideas" ON content_ideas FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Admins can delete ideas" ON content_ideas FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Outlines: Similar to ideas
CREATE POLICY "Anyone can view outlines" ON outlines FOR SELECT USING (true);
CREATE POLICY "Editors can insert outlines" ON outlines FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Editors can update outlines" ON outlines FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Admins can delete outlines" ON outlines FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Articles: Similar to ideas
CREATE POLICY "Anyone can view articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Editors can insert articles" ON articles FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Editors can update articles" ON articles FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Admins can delete articles" ON articles FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Comments: All can view, editors can create/update, creator can delete own
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Editors can insert comments" ON comments FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE
  USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE
  USING (auth.uid() = created_by OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Comment Threads: Similar to comments
CREATE POLICY "Anyone can view threads" ON comment_threads FOR SELECT USING (true);
CREATE POLICY "Editors can insert threads" ON comment_threads FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));
CREATE POLICY "Editors can update threads" ON comment_threads FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('editor', 'admin')));

-- Knowledge Base & Templates: Read-only for all, admin can modify
CREATE POLICY "Anyone can view KB files" ON knowledge_base_files FOR SELECT USING (true);
CREATE POLICY "Admins can insert KB files" ON knowledge_base_files FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update KB files" ON knowledge_base_files FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Anyone can view templates" ON templates FOR SELECT USING (true);
CREATE POLICY "Admins can insert templates" ON templates FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update templates" ON templates FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- History & Logs: Read-only for all
CREATE POLICY "Anyone can view generation history" ON generation_history FOR SELECT USING (true);
CREATE POLICY "System can insert history" ON generation_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view publish log" ON notion_publish_log FOR SELECT USING (true);
CREATE POLICY "System can insert publish log" ON notion_publish_log FOR INSERT WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_ideas_updated_at BEFORE UPDATE ON content_ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_outlines_updated_at BEFORE UPDATE ON outlines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comment_threads_updated_at BEFORE UPDATE ON comment_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- REAL-TIME SUBSCRIPTIONS (Enable for collaborative features)
-- ============================================================================

-- Enable real-time for comments (collaborative commenting)
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE comment_threads;

-- Optionally enable for articles (collaborative editing)
-- ALTER PUBLICATION supabase_realtime ADD TABLE articles;

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert default admin user (replace with actual user ID after signup)
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('YOUR-UUID-HERE', 'admin@livo.com', 'Admin User', 'admin');
