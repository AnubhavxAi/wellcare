-- SQL Migration: Add missing columns to 'products' table

-- 1. Add 'additional_images' as a text array
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS additional_images TEXT[] DEFAULT '{}';

-- 2. Ensure other potential missing columns exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS mrp NUMERIC;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS unit TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS requires_prescription BOOLEAN DEFAULT FALSE;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS how_to_use TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ingredients TEXT[] DEFAULT '{}';

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS form TEXT;
