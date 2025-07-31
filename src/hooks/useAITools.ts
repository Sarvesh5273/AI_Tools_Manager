import { useState, useEffect } from 'react';
import { supabase, transformDatabaseTool, transformAppTool, DatabaseAITool, isSupabaseConfigured, supabaseConnectionError } from '../lib/supabase';
import { mockAITools } from '../data/mockData';
import { AITool } from '../types';
import { useAuth } from '../context/AuthContext';

export const useAITools = () => {
  const { user } = useAuth();
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only fetch tools if Supabase is configured (authentication is now handled at app level)
  const shouldFetchFromDatabase = isSupabaseConfigured && !supabaseConnectionError;

  // Fetch user's favorite tools
  const fetchUserFavorites = async (): Promise<string[]> => {
    if (!shouldFetchFromDatabase || !user) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('user_favorite_tools')
        .select('tool_id')
        .eq('user_id', user.id);

      if (error) {
        console.warn('Failed to fetch user favorites:', error);
        return [];
      }

      return data?.map(item => item.tool_id) || [];
    } catch (err) {
      console.warn('Error fetching user favorites:', err);
      return [];
    }
  };

  // Fetch all tools from Supabase or use mock data
  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // If not authenticated or Supabase not configured, use mock data
      if (!shouldFetchFromDatabase) {
        const reason = supabaseConnectionError || 'Supabase not configured';
        console.warn('Using mock data:', reason);
        setAiTools(mockAITools);
        setError(`Using local data - ${reason}`);
        return;
      }

      // Try to fetch from Supabase
      const { data, error: fetchError } = await supabase
        .from('ai_tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.warn('Database fetch failed, falling back to mock data:', fetchError);
        setAiTools(mockAITools);
        setError(`Using local data - database connection failed: ${fetchError.message}`);
        return;
      }

      // Fetch user's favorite tools
      const userFavoriteToolIds = await fetchUserFavorites();

      // Transform tools and set user-specific favorite status
      const transformedTools = data?.map(dbTool => {
        const tool = transformDatabaseTool(dbTool);
        // Override the global isFavorite with user-specific favorite status
        tool.isFavorite = userFavoriteToolIds.includes(tool.id);
        return tool;
      }) || [];

      setAiTools(transformedTools);
      console.log('Successfully loaded tools from database');
    } catch (err) {
      console.error('Error in fetchTools:', err);
      console.warn('Falling back to mock data due to error');
      setAiTools(mockAITools);
      setError(`Using local data - ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Add a new tool
  const addTool = async (toolData: {
    name: string;
    description: string;
    link: string;
    category: string;
    tags: string[];
    imageUrl?: string;
  }) => {
    try {
      // If not authenticated or Supabase not configured, add to local state only
      if (!shouldFetchFromDatabase) {
        const newTool: AITool = {
          id: Date.now().toString(),
          name: toolData.name,
          description: toolData.description,
          link: toolData.link,
          category: toolData.category,
          tags: toolData.tags,
          usageCount: 0,
          isFavorite: false,
          addedDate: new Date().toISOString().split('T')[0],
          imageUrl: toolData.imageUrl
        };
        
        setAiTools(prev => [newTool, ...prev]);
        console.warn('Tool added to local state only - database not available');
        return newTool;
      }

      const newTool = transformAppTool({
        ...toolData,
        usageCount: 0,
        isFavorite: false,
        addedDate: new Date().toISOString().split('T')[0]
      });

      const { data, error: insertError } = await supabase
        .from('ai_tools')
        .insert([newTool])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      const transformedTool = transformDatabaseTool(data as DatabaseAITool);
      setAiTools(prev => [transformedTool, ...prev]);
      
      return transformedTool;
    } catch (err) {
      console.error('Error adding tool:', err);
      throw err;
    }
  };

  // Update an existing tool
  const updateTool = async (updatedTool: AITool) => {
    try {
      // If not authenticated or Supabase not configured, update local state only
      if (!shouldFetchFromDatabase) {
        setAiTools(prev => prev.map(tool => 
          tool.id === updatedTool.id ? updatedTool : tool
        ));
        console.warn('Tool updated in local state only - database not available');
        return updatedTool;
      }

      const dbTool = transformAppTool(updatedTool);

      const { data, error: updateError } = await supabase
        .from('ai_tools')
        .update(dbTool)
        .eq('id', updatedTool.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const transformedTool = transformDatabaseTool(data as DatabaseAITool);
      setAiTools(prev => prev.map(tool => 
        tool.id === updatedTool.id ? transformedTool : tool
      ));
      
      return transformedTool;
    } catch (err) {
      console.error('Error updating tool:', err);
      throw err;
    }
  };

  // Delete a tool
  const deleteTool = async (id: string) => {
    try {
      // If not authenticated or Supabase not configured, delete from local state only
      if (!shouldFetchFromDatabase) {
        setAiTools(prev => prev.filter(tool => tool.id !== id));
        console.warn('Tool deleted from local state only - database not available');
        return;
      }

      const { error: deleteError } = await supabase
        .from('ai_tools')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setAiTools(prev => prev.filter(tool => tool.id !== id));
    } catch (err) {
      console.error('Error deleting tool:', err);
      throw err;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (id: string) => {
    try {
      const tool = aiTools.find(t => t.id === id);
      if (!tool || !user) return;

      const newFavoriteStatus = !tool.isFavorite;

      // If not authenticated or Supabase not configured, update local state only
      if (!shouldFetchFromDatabase) {
        setAiTools(prev => prev.map(t => 
          t.id === id ? { ...t, isFavorite: newFavoriteStatus } : t
        ));
        console.warn('Favorite toggled in local state only - database not available');
        return;
      }

      if (newFavoriteStatus) {
        // Add to favorites
        const { error: insertError } = await supabase
          .from('user_favorite_tools')
          .insert({
            user_id: user.id,
            tool_id: id
          });

        if (insertError) {
          throw insertError;
        }
      } else {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('user_favorite_tools')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', id);

        if (deleteError) {
          throw deleteError;
        }
      }

      // Update local state
      setAiTools(prev => prev.map(t => 
        t.id === id ? { ...t, isFavorite: newFavoriteStatus } : t
      ));
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  };

  // Increment usage count
  const incrementUsage = async (id: string) => {
    try {
      const tool = aiTools.find(t => t.id === id);
      if (!tool) return;

      // If not authenticated or Supabase not configured, update local state only
      if (!shouldFetchFromDatabase) {
        setAiTools(prev => prev.map(t => 
          t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t
        ));
        console.warn('Usage count updated in local state only - database not available');
        return;
      }

      const { data, error: updateError } = await supabase
        .from('ai_tools')
        .update({ usage_count: tool.usageCount + 1 })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const transformedTool = transformDatabaseTool(data as DatabaseAITool);
      setAiTools(prev => prev.map(t => 
        t.id === id ? transformedTool : t
      ));
    } catch (err) {
      console.error('Error incrementing usage:', err);
      throw err;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchTools();
  }, [user]); // Re-fetch when user changes to get their favorites

  return {
    aiTools,
    loading,
    error,
    addTool,
    updateTool,
    deleteTool,
    toggleFavorite,
    incrementUsage,
    refetch: fetchTools
  };
};