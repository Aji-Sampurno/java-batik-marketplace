-- Add item_code column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS item_code text;

-- Add comment for clarity
COMMENT ON COLUMN products.item_code IS 'Internal item code for automated naming concatenated prefix/suffix';
