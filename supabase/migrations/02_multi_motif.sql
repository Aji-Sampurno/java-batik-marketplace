-- Create join table for many-to-many relationship between products and motifs
CREATE TABLE IF NOT EXISTS product_motifs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  motif_id uuid REFERENCES motifs(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(product_id, motif_id)
);

-- Enable RLS for the new table
ALTER TABLE product_motifs ENABLE ROW LEVEL SECURITY;

-- Add Public Access Policy (Consistent with existing schema)
CREATE POLICY "Public Access Product Motifs" ON product_motifs FOR ALL USING (true);

-- Grant permissions (Consistent with existing schema)
GRANT ALL ON TABLE product_motifs TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- MIGRATE DATA: Move existing motif_id from products to product_motifs
INSERT INTO product_motifs (product_id, motif_id)
SELECT id, motif_id FROM products WHERE motif_id IS NOT NULL;

-- Optional: You can drop the motif_id column from products table now or later
-- ALTER TABLE products DROP COLUMN motif_id;
