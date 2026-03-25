-- Add is_active column to products table
ALTER TABLE products ADD COLUMN is_active boolean DEFAULT true;

-- Update existing products to be active (though the default takes care of it)
UPDATE products SET is_active = true WHERE is_active IS NULL;
