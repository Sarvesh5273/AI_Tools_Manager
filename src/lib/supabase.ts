import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using fallback values for development.');
}

// Use fallback values if environment variables are not set
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-anon-key';

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackKey
);

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Database types
export interface DatabaseAITool {
  id: string;
  name: string;
  description: string;
  link: string;
  category: string;
  usage_count: number;
  tags: string[];
  added_date: string;
  is_favorite: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Transform database record to app format
export const transformDatabaseTool = (dbTool: DatabaseAITool) => ({
  id: dbTool.id,
  name: dbTool.name,
  description: dbTool.description,
  link: dbTool.link,
  category: dbTool.category,
  usageCount: dbTool.usage_count,
  tags: dbTool.tags,
  addedDate: dbTool.added_date,
  isFavorite: dbTool.is_favorite,
  imageUrl: dbTool.image_url
});

// Transform app format to database format
export const transformAppTool = (appTool: any) => ({
  name: appTool.name,
  description: appTool.description,
  link: appTool.link,
  category: appTool.category,
  usage_count: appTool.usageCount || 0,
  tags: appTool.tags || [],
  added_date: appTool.addedDate || new Date().toISOString().split('T')[0],
  is_favorite: appTool.isFavorite || false,
  image_url: appTool.imageUrl || null
});