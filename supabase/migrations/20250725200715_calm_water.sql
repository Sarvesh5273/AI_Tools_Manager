/*
  # Insert Sample AI Tools Data

  This migration inserts the sample AI tools data into the ai_tools table.
*/

INSERT INTO ai_tools (name, description, link, category, usage_count, tags, added_date, is_favorite, image_url) VALUES
(
  'ChatGPT',
  'Advanced conversational AI for writing, coding, and problem-solving',
  'https://chat.openai.com',
  'Conversational AI',
  145,
  ARRAY['writing', 'coding', 'general'],
  '2024-01-15',
  true,
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Claude',
  'Anthropic''s AI assistant for complex reasoning and creative tasks',
  'https://claude.ai',
  'Conversational AI',
  98,
  ARRAY['reasoning', 'analysis', 'writing'],
  '2024-01-20',
  true,
  'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Midjourney',
  'AI image generation with stunning artistic capabilities',
  'https://www.midjourney.com',
  'Image Generation',
  76,
  ARRAY['art', 'design', 'creative'],
  '2024-01-10',
  false,
  'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'GitHub Copilot',
  'AI-powered code completion and programming assistant',
  'https://github.com/features/copilot',
  'Development',
  203,
  ARRAY['coding', 'development', 'productivity'],
  '2024-01-05',
  true,
  'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Notion AI',
  'Integrated AI for writing, summarizing, and organizing content',
  'https://www.notion.so/product/ai',
  'Productivity',
  67,
  ARRAY['writing', 'organization', 'productivity'],
  '2024-01-25',
  false,
  'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400'
),
(
  'RunwayML',
  'AI-powered video editing and generation platform',
  'https://runwayml.com',
  'Video Generation',
  34,
  ARRAY['video', 'editing', 'creative'],
  '2024-02-01',
  false,
  'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'ElevenLabs',
  'High-quality AI voice synthesis and cloning',
  'https://elevenlabs.io',
  'Audio Generation',
  42,
  ARRAY['voice', 'audio', 'synthesis'],
  '2024-01-30',
  false,
  'https://images.pexels.com/photos/6686445/pexels-photo-6686445.jpeg?auto=compress&cs=tinysrgb&w=400'
),
(
  'Perplexity',
  'AI-powered search engine with real-time information',
  'https://www.perplexity.ai',
  'Search & Research',
  89,
  ARRAY['search', 'research', 'information'],
  '2024-02-05',
  true,
  'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=400'
);