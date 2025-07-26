import { createClient } from '@supabase/supabase-js';
import { mockAITools } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client with error handling
let supabase: any;
let isSupabaseConfigured = false;
let supabaseConnectionError: string | null = null;

try {
  // Check if environment variables are properly configured
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your-supabase-url-here' || 
      supabaseAnonKey === 'your-supabase-anon-key-here') {
    
    console.warn('Supabase environment variables not configured. Using fallback values for development.');
    isSupabaseConfigured = false;
    supabaseConnectionError = 'Supabase not configured - using local data';
    
    // Create a dummy client that won't cause errors
    supabase = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ error: new Error('Supabase not configured') })
      })
    };
  } else {
    // Try to create the actual Supabase client
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseConfigured = true;
    console.log('Supabase client initialized successfully');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  supabaseConnectionError = `Supabase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  isSupabaseConfigured = false;
  
  // Create a dummy client that won't cause errors
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      delete: () => Promise.resolve({ error: new Error('Supabase initialization failed') })
    })
  };
}

// Export the client and configuration status
export { supabase, isSupabaseConfigured, supabaseConnectionError };

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