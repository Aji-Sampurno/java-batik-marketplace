-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'Batik Nusantara',
  logo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Initial record
INSERT INTO settings (id, site_name) 
VALUES (1, 'Batik Nusantara') 
ON CONFLICT (id) DO NOTHING;

-- Attempt to create buckets via SQL (requires permissions)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true), ('settings', 'settings', true)
ON CONFLICT (id) DO NOTHING;

-- Expand settings table with contact and social info
ALTER TABLE settings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS url_instagram TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS url_tiktok TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS url_tokopedia TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS url_shopee TEXT;

-- DISABLING RLS (Simplest fix for this marketplace demo)
-- Run this to allow the Admin Dashboard to insert/update data
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_motifs DISABLE ROW LEVEL SECURITY;
ALTER TABLE types DISABLE ROW LEVEL SECURITY;
ALTER TABLE motifs DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Storage Policies (Allow public uploads for demo)
-- These might need to be set manually in the Supabase Dashboard if this fails
CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id IN ('products', 'settings'));
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id IN ('products', 'settings'));
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE TO public USING (bucket_id IN ('products', 'settings'));
