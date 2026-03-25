-- Drop tables if they exist
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS motifs;
DROP TABLE IF EXISTS types;

-- Table for Product Types (Kemeja, Kain, etc.)
CREATE TABLE types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

-- Table for Batik Motifs (Parang, Megamendung, etc.)
CREATE TABLE motifs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

-- Table for Batik Products
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  tokopedia_url text,
  wa_number text DEFAULT '628123456789',
  code text, -- Kolom baru untuk kode counter/sku
  type_id uuid REFERENCES types(id),
  motif_id uuid REFERENCES motifs(id),
  created_at timestamp with time zone DEFAULT now()
);

-- SUPABASE FOOLPROOF RLS (Buka akses penuh untuk Anon)
ALTER TABLE types ENABLE ROW LEVEL SECURITY;
ALTER TABLE motifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Access Types" ON types FOR ALL USING (true);
CREATE POLICY "Public Access Motifs" ON motifs FOR ALL USING (true);
CREATE POLICY "Public Access Products" ON products FOR ALL USING (true);

-- IZINKAN ANON (PUBIC) UNTUK SEMUA AKSES SEQUENCES
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;

-- SETUP STORAGE PERMISSIONS (FIX UNTUK UPLOAD FOTO)
-- Jika Anda melihat error 'relation storage.policies does not exist', gunakan cara ini:
-- 1. Pastikan RLS Aktif pada bucket 'products'
-- 2. Jalankan ini di SQL Editor:
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
CREATE POLICY "Public SELECT" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public UPDATE" ON storage.objects FOR UPDATE USING (bucket_id = 'products');

-- Initial Data for Types
INSERT INTO types (name) VALUES ('Kemeja'), ('Kain'), ('Dress'), ('Outer');

-- Initial Data for Motifs
INSERT INTO motifs (name) VALUES ('Parang'), ('Megamendung'), ('Sekar Jagad'), ('Kawung'), ('Lainnya');
