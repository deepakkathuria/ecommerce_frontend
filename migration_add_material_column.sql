-- Migration: Add material column to products table
-- Run this SQL script on your database

ALTER TABLE `products` 
ADD COLUMN `material` VARCHAR(50) DEFAULT NULL AFTER `subcategory`;

-- Set all existing products to 'antitarnish' by default
-- (You can manually update 2-3 brass products later if needed)
UPDATE `products` 
SET `material` = 'antitarnish' 
WHERE `material` IS NULL;

-- If you have any brass products, update them manually like this:
-- UPDATE `products` SET `material` = 'brass' WHERE `item_id` IN (71, 72, 73);

