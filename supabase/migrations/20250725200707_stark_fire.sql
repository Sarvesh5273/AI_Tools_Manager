/*
  # Create AI Tools Table

  1. New Tables
    - `ai_tools`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `link` (text, not null)
      - `category` (text, not null)
      - `usage_count` (integer, default 0)
      - `tags` (text array, default empty array)
      - `added_date` (date, default now)
      - `is_favorite` (boolean, default false)
      - `image_url` (text, nullable)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `ai_tools` table
    - Add policies for public read access and authenticated write access
*/

CREATE TABLE IF NOT EXISTS ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  link text NOT NULL,
  category text NOT NULL,
  usage_count integer DEFAULT 0 NOT NULL,
  tags text[] DEFAULT '{}' NOT NULL,
  added_date date DEFAULT CURRENT_DATE NOT NULL,
  is_favorite boolean DEFAULT false NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these later for admin-only access)
CREATE POLICY "Allow public read access to ai_tools"
  ON ai_tools
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to ai_tools"
  ON ai_tools
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to ai_tools"
  ON ai_tools
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to ai_tools"
  ON ai_tools
  FOR DELETE
  TO public
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ai_tools_updated_at
  BEFORE UPDATE ON ai_tools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();