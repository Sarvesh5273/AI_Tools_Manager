import { createClient } from '@supabase/supabase-js';
import { mockAITools } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client with error handling
let supabase: any;
let isSupabaseConfigured = false;
let supabaseConnectionError: string | null = null;

// Temporary variables for initialization
let tempSupabase: any;
let tempIsConfigured = false;
let tempConnectionError: string | null = null;

try {
  // Check if environment variables are properly configured
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your-supabase-url-here' || 
      supabaseAnonKey === 'your-supabase-anon-key-here' ||
      supabaseUrl.trim() === '' || 
      supabaseAnonKey.trim() === '') {
    
    console.warn('Supabase environment variables not configured. Using fallback values for development.');
    tempIsConfigured = false;
    tempConnectionError = 'Supabase not configured - using local data';
    
    // Create a dummy client that won't cause errors
    tempSupabase = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ error: new Error('Supabase not configured') })
      })
    };
  } else {
    // Validate URL format before attempting to create client
    try {
      new URL(supabaseUrl);
      
      // Try to create the actual Supabase client
      try {
        tempSupabase = createClient(supabaseUrl, supabaseAnonKey);
        tempIsConfigured = true;
        console.log('Supabase client initialized successfully');
      } catch (clientError) {
        console.warn('Failed to create Supabase client:', clientError);
        tempIsConfigured = false;
        tempConnectionError = `Supabase client creation failed: ${clientError instanceof Error ? clientError.message : 'Unknown error'}`;
        
        // Create a dummy client that won't cause errors
        tempSupabase = {
          from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: null, error: new Error('Supabase client creation failed') }),
            update: () => Promise.resolve({ data: null, error: new Error('Supabase client creation failed') }),
            delete: () => Promise.resolve({ error: new Error('Supabase client creation failed') })
          })
        };
      }
    } catch (urlError) {
      console.warn('Invalid Supabase URL format. Using fallback values for development.');
      tempIsConfigured = false;
      tempConnectionError = 'Invalid Supabase URL format - using local data';
      
      // Create a dummy client that won't cause errors
      tempSupabase = {
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase URL') }),
          update: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase URL') }),
          delete: () => Promise.resolve({ error: new Error('Invalid Supabase URL') })
        })
      };
    }
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  tempConnectionError = `Supabase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  tempIsConfigured = false;
  
  // Create a dummy client that won't cause errors
  tempSupabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase initialization failed') }),
      delete: () => Promise.resolve({ error: new Error('Supabase initialization failed') })
    })
  };
}

// Assign temporary values to module-scoped variables
supabase = tempSupabase;
isSupabaseConfigured = tempIsConfigured;
supabaseConnectionError = tempConnectionError;

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
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Transform database record to app format
export const transformDatabaseTool = (dbTool: DatabaseAITool, isUserFavorite = false) => ({
  id: dbTool.id,
  name: dbTool.name,
  description: dbTool.description,
  link: dbTool.link,
  category: dbTool.category,
  usageCount: dbTool.usage_count,
  tags: dbTool.tags,
  addedDate: dbTool.added_date,
  isUserFavorite,
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
  image_url: appTool.imageUrl || null
});
