-- Migration: Remove parent_id column from document_categories table
-- Date: 2024
-- Description: Remove parent_id to make document categories single-level only

-- Step 1: Drop foreign key constraint for parent_id
ALTER TABLE `document_categories` 
DROP FOREIGN KEY `document_categories_ibfk_1`;

-- Step 2: Drop index on parent_id
ALTER TABLE `document_categories` 
DROP INDEX `parent_id`;

-- Step 3: Drop the parent_id column
ALTER TABLE `document_categories` 
DROP COLUMN `parent_id`;

