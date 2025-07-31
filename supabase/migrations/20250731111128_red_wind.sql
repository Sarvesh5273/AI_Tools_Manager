/*
  # Create user_favorite_tools table for user-specific favorites

  1. New Tables
    - `user_favorite_tools`
      - `user_id` (uuid, foreign key to auth.users.id)
      - `tool_id` (uuid, foreign key to ai_tools.id)
      - `created_at` (timestamp)
      - Composite primary key (user_id, tool_id)

  2. Security
    - Enable RLS on `user_favorite_tools` table
    - Add policy for users to read their own favorites
    - Add policy for users to insert their own favorites
    - Add policy for users to delete their own favorites

  3. Changes
    - Users can now have individual favorite tools
    - Favorite status is per-user, not global
*/

-- Create the user_favorite_tools table
CREATE TABLE IF NOT EXISTS user_favorite_tools (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id uuid NOT NULL REFERENCES ai_tools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, tool_id)
);

-- Enable Row Level Security
ALTER TABLE user_favorite_tools ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own favorites
CREATE POLICY "Users can read own favorites"
  ON user_favorite_tools
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy for users to insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON user_favorite_tools
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy for users to delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON user_favorite_tools
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());