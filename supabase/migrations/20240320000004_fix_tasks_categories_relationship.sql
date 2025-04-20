-- Drop existing foreign key constraint if it exists
ALTER TABLE tasks
  DROP CONSTRAINT IF EXISTS tasks_category_id_fkey;

-- Add proper foreign key constraint
ALTER TABLE tasks
  ADD CONSTRAINT tasks_category_id_fkey
  FOREIGN KEY (category_id)
  REFERENCES categories(id)
  ON DELETE SET NULL; 