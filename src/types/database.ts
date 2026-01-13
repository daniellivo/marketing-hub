/**
 * Database Types
 * Generated from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      content_ideas: {
        Row: {
          id: string
          title: string
          description: string | null
          target_audience: 'Healthcare Professionals' | 'Healthcare Facilities' | 'Industry' | null
          job_category: 'All' | 'Enfermería' | 'TCAEs' | 'Médicos' | null
          template_type: 'pillar' | 'how-to' | 'listicle' | 'case-study' | 'comparison' | 'thought-leadership'
          keywords: string[]
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'new' | 'in-progress' | 'outline-ready' | 'article-ready' | 'published'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          target_audience?: 'Healthcare Professionals' | 'Healthcare Facilities' | 'Industry' | null
          job_category?: 'All' | 'Enfermería' | 'TCAEs' | 'Médicos' | null
          template_type: 'pillar' | 'how-to' | 'listicle' | 'case-study' | 'comparison' | 'thought-leadership'
          keywords?: string[]
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'new' | 'in-progress' | 'outline-ready' | 'article-ready' | 'published'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          target_audience?: 'Healthcare Professionals' | 'Healthcare Facilities' | 'Industry' | null
          job_category?: 'All' | 'Enfermería' | 'TCAEs' | 'Médicos' | null
          template_type?: 'pillar' | 'how-to' | 'listicle' | 'case-study' | 'comparison' | 'thought-leadership'
          keywords?: string[]
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'new' | 'in-progress' | 'outline-ready' | 'article-ready' | 'published'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      outlines: {
        Row: {
          id: string
          idea_id: string | null
          content: Json
          template_used: string
          generation_metadata: Json
          status: 'draft' | 'reviewed' | 'approved' | 'archived'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id?: string | null
          content: Json
          template_used: string
          generation_metadata?: Json
          status?: 'draft' | 'reviewed' | 'approved' | 'archived'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string | null
          content?: Json
          template_used?: string
          generation_metadata?: Json
          status?: 'draft' | 'reviewed' | 'approved' | 'archived'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          idea_id: string | null
          outline_id: string | null
          title: string
          slug: string
          content: Json
          meta_description: string | null
          alt_text: string | null
          category: 'Healthcare Professionals' | 'Healthcare Facilities' | 'Industry'
          job: 'All' | 'Enfermería' | 'TCAEs' | 'Médicos'
          tags: string[]
          author: string | null
          keywords: string[]
          word_count: number | null
          reading_time: number | null
          status: 'draft' | 'in-review' | 'ready' | 'published'
          version: number
          generation_metadata: Json
          notion_page_id: string | null
          published_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id?: string | null
          outline_id?: string | null
          title: string
          slug: string
          content: Json
          meta_description?: string | null
          alt_text?: string | null
          category: 'Healthcare Professionals' | 'Healthcare Facilities' | 'Industry'
          job: 'All' | 'Enfermería' | 'TCAEs' | 'Médicos'
          tags?: string[]
          author?: string | null
          keywords?: string[]
          word_count?: number | null
          reading_time?: number | null
          status?: 'draft' | 'in-review' | 'ready' | 'published'
          version?: number
          generation_metadata?: Json
          notion_page_id?: string | null
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string | null
          outline_id?: string | null
          title?: string
          slug?: string
          content?: Json
          meta_description?: string | null
          alt_text?: string | null
          category?: 'Healthcare Professionals' | 'Healthcare Facilities' | 'Industry'
          job?: 'All' | 'Enfermería' | 'TCAEs' | 'Médicos'
          tags?: string[]
          author?: string | null
          keywords?: string[]
          word_count?: number | null
          reading_time?: number | null
          status?: 'draft' | 'in-review' | 'ready' | 'published'
          version?: number
          generation_metadata?: Json
          notion_page_id?: string | null
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comment_threads: {
        Row: {
          id: string
          content_type: 'outline' | 'article'
          content_id: string
          anchor_position: Json
          resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_type: 'outline' | 'article'
          content_id: string
          anchor_position: Json
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content_type?: 'outline' | 'article'
          content_id?: string
          anchor_position?: Json
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          content_type: 'outline' | 'article'
          content_id: string
          thread_id: string | null
          parent_id: string | null
          text_content: string
          highlighted_text: string | null
          position_data: Json
          resolved: boolean
          resolved_by: string | null
          resolved_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_type: 'outline' | 'article'
          content_id: string
          thread_id?: string | null
          parent_id?: string | null
          text_content: string
          highlighted_text?: string | null
          position_data: Json
          resolved?: boolean
          resolved_by?: string | null
          resolved_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content_type?: 'outline' | 'article'
          content_id?: string
          thread_id?: string | null
          parent_id?: string | null
          text_content?: string
          highlighted_text?: string | null
          position_data?: Json
          resolved?: boolean
          resolved_by?: string | null
          resolved_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_base_files: {
        Row: {
          id: string
          file_path: string
          file_type: 'company' | 'seo' | 'geo' | 'quality'
          file_name: string
          content: string
          last_synced: string
          created_at: string
        }
        Insert: {
          id?: string
          file_path: string
          file_type: 'company' | 'seo' | 'geo' | 'quality'
          file_name: string
          content: string
          last_synced?: string
          created_at?: string
        }
        Update: {
          id?: string
          file_path?: string
          file_type?: 'company' | 'seo' | 'geo' | 'quality'
          file_name?: string
          content?: string
          last_synced?: string
          created_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          template_type: 'pillar' | 'how-to' | 'listicle' | 'case-study' | 'comparison' | 'thought-leadership'
          file_path: string
          content: string
          structure: Json
          last_synced: string
          created_at: string
        }
        Insert: {
          id?: string
          template_type: 'pillar' | 'how-to' | 'listicle' | 'case-study' | 'comparison' | 'thought-leadership'
          file_path: string
          content: string
          structure?: Json
          last_synced?: string
          created_at?: string
        }
        Update: {
          id?: string
          template_type?: 'pillar' | 'how-to' | 'listicle' | 'case-study' | 'comparison' | 'thought-leadership'
          file_path?: string
          content?: string
          structure?: Json
          last_synced?: string
          created_at?: string
        }
      }
      generation_history: {
        Row: {
          id: string
          operation_type: 'outline_generation' | 'article_generation' | 'revision'
          input_data: Json
          output_data: Json | null
          ai_model: string
          tokens_used: number | null
          cost_usd: number | null
          duration_ms: number | null
          success: boolean
          error_message: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          operation_type: 'outline_generation' | 'article_generation' | 'revision'
          input_data: Json
          output_data?: Json | null
          ai_model: string
          tokens_used?: number | null
          cost_usd?: number | null
          duration_ms?: number | null
          success?: boolean
          error_message?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          operation_type?: 'outline_generation' | 'article_generation' | 'revision'
          input_data?: Json
          output_data?: Json | null
          ai_model?: string
          tokens_used?: number | null
          cost_usd?: number | null
          duration_ms?: number | null
          success?: boolean
          error_message?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      notion_publish_log: {
        Row: {
          id: string
          article_id: string | null
          notion_page_id: string | null
          notion_database_id: string | null
          properties_sent: Json | null
          success: boolean | null
          error_message: string | null
          published_by: string | null
          published_at: string
        }
        Insert: {
          id?: string
          article_id?: string | null
          notion_page_id?: string | null
          notion_database_id?: string | null
          properties_sent?: Json | null
          success?: boolean | null
          error_message?: string | null
          published_by?: string | null
          published_at?: string
        }
        Update: {
          id?: string
          article_id?: string | null
          notion_page_id?: string | null
          notion_database_id?: string | null
          properties_sent?: Json | null
          success?: boolean | null
          error_message?: string | null
          published_by?: string | null
          published_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
