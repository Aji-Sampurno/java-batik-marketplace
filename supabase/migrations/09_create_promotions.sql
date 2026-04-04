-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text DEFAULT '/products',
  is_active boolean DEFAULT true,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running migration)
DROP POLICY IF EXISTS "Allow public read access on promotions" ON promotions;
DROP POLICY IF EXISTS "Allow admin all access on promotions" ON promotions;

-- Allow public read access
CREATE POLICY "Allow public read access on promotions"
ON promotions FOR SELECT
USING (true);

-- Allow authenticated admin all access (assuming all operations are done by admin)
CREATE POLICY "Allow admin all access on promotions"
ON promotions FOR ALL
USING (true)
WITH CHECK (true);
