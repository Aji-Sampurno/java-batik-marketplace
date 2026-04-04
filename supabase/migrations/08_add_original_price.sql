-- Add original_price column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price numeric;

-- Backfill: Set original_price to null for existing products (already default, but good to be explicit)
COMMENT ON COLUMN products.original_price IS 'The crossed-out comparison price to show discounts.';
