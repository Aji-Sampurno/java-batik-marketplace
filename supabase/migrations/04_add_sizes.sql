-- Add sizes column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT '{}';

-- Update RLS (already open but good to ensure)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
