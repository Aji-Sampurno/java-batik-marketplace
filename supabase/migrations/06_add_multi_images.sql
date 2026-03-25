-- Add images column to products table to store multiple image URLs
ALTER TABLE products ADD COLUMN images text[] DEFAULT '{}';

-- Migration to populate 'images' with the existing 'image_url' for backward compatibility
UPDATE products SET images = ARRAY[image_url] WHERE image_url IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);
