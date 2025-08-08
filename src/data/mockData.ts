import { AITool } from '../types';

export const mockAITools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced conversational AI for writing, coding, and problem-solving',
    link: 'https://chat.openai.com',
    category: 'Conversational AI',
    usageCount: 145,
    tags: ['writing', 'coding', 'general'],
    addedDate: '2024-01-15',
    isUserFavorite: true,
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Claude',
    description: 'Anthropic\'s AI assistant for complex reasoning and creative tasks',
    link: 'https://claude.ai',
    category: 'Conversational AI',
    usageCount: 98,
    tags: ['reasoning', 'analysis', 'writing'],
    addedDate: '2024-01-20',
    isUserFavorite: true,
    imageUrl: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Midjourney',
    description: 'AI image generation with stunning artistic capabilities',
    link: 'https://www.midjourney.com',
    category: 'Image Generation',
    usageCount: 76,
    tags: ['art', 'design', 'creative'],
    addedDate: '2024-01-10',
    isUserFavorite: false,
    imageUrl: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'GitHub Copilot',
    description: 'AI-powered code completion and programming assistant',
    link: 'https://github.com/features/copilot',
    category: 'Development',
    usageCount: 203,
    tags: ['coding', 'development', 'productivity'],
    addedDate: '2024-01-05',
    isUserFavorite: true,
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    name: 'Notion AI',
    description: 'Integrated AI for writing, summarizing, and organizing content',
    link: 'https://www.notion.so/product/ai',
    category: 'Productivity',
    usageCount: 67,
    tags: ['writing', 'organization', 'productivity'],
    addedDate: '2024-01-25',
    isUserFavorite: false,
    imageUrl: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    name: 'RunwayML',
    description: 'AI-powered video editing and generation platform',
    link: 'https://runwayml.com',
    category: 'Video Generation',
    usageCount: 34,
    tags: ['video', 'editing', 'creative'],
    addedDate: '2024-02-01',
    isUserFavorite: false,
    imageUrl: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '7',
    name: 'ElevenLabs',
    description: 'High-quality AI voice synthesis and cloning',
    link: 'https://elevenlabs.io',
    category: 'Audio Generation',
    usageCount: 42,
    tags: ['voice', 'audio', 'synthesis'],
    addedDate: '2024-01-30',
    isUserFavorite: false,
    imageUrl: 'https://images.pexels.com/photos/6686445/pexels-photo-6686445.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '8',
    name: 'Perplexity',
    description: 'AI-powered search engine with real-time information',
    link: 'https://www.perplexity.ai',
    category: 'Search & Research',
    usageCount: 89,
    tags: ['search', 'research', 'information'],
    addedDate: '2024-02-05',
    isUserFavorite: true,
    imageUrl: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];
