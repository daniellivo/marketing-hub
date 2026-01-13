-- Whitelist System for Authorization
-- This migration creates a whitelist table to control who can access the platform

-- ============================================================================
-- WHITELIST TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS whitelist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  reason TEXT,
  added_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_whitelist_email ON whitelist(email);
CREATE INDEX idx_whitelist_active ON whitelist(is_active);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE whitelist ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can check if an email is whitelisted
CREATE POLICY "Anyone can view whitelist" ON whitelist FOR SELECT USING (true);

-- Only admins can manage whitelist
CREATE POLICY "Admins can insert whitelist" ON whitelist FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can update whitelist" ON whitelist FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
CREATE POLICY "Admins can delete whitelist" ON whitelist FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_whitelist_updated_at BEFORE UPDATE ON whitelist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION TO CHECK IF USER IS WHITELISTED
-- ============================================================================
CREATE OR REPLACE FUNCTION is_email_whitelisted(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM whitelist
    WHERE email = user_email
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEED DATA - Add initial whitelisted emails
-- ============================================================================
-- Add your initial whitelisted emails here
-- INSERT INTO whitelist (email, reason, is_active) VALUES
--   ('admin@livo.com', 'Admin user', true),
--   ('[email protected]', 'Team member', true);
