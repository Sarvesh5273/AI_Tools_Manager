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

      let transformedTools: AITool[] = [];
      
      if (data && user) {
        // Fetch user's favorite tools
        const { data: favoriteData } = await supabase
          .from('user_favorite_tools')
          .select('tool_id')
          .eq('user_id', user.id);
        
        const favoriteToolIds = new Set(favoriteData?.map(fav => fav.tool_id) || []);
        
        transformedTools = data.map(tool => 
          transformDatabaseTool(tool, favoriteToolIds.has(tool.id))
        );
      } else {
        transformedTools = data?.map(tool => transformDatabaseTool(tool)) || [];
      }
      
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
          isUserFavorite: false,
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

      const transformedTool = transformDatabaseTool(data as DatabaseAITool, false);
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

      // Check if this tool is in user's favorites
      let isUserFavorite = false;
      if (user) {
        const { data: favoriteData } = await supabase
          .from('user_favorite_tools')
          .select('tool_id')
          .eq('user_id', user.id)
          .eq('tool_id', updatedTool.id)
          .single();
        isUserFavorite = !!favoriteData;
      }
      
      const transformedTool = transformDatabaseTool(data as DatabaseAITool, isUserFavorite);
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

      // If not authenticated or Supabase not configured, update local state only
      if (!shouldFetchFromDatabase) {
        setAiTools(prev => prev.map(t => 
          t.id === id ? { ...t, isUserFavorite: !t.isUserFavorite } : t
        ));
        console.warn('Favorite toggled in local state only - database not available');
        return;
      }

      if (tool.isUserFavorite) {
        // Remove from favorites
        const { error: deleteError } = await supabase
          .from('user_favorite_tools')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', id);

        if (deleteError) {
          throw deleteError;
        }
      } else {
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
      }

      // Update local state
      setAiTools(prev => prev.map(t => 
        t.id === id ? { ...t, isUserFavorite: !t.isUserFavorite } : t
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

      // Check if this tool is in user's favorites
      let isUserFavorite = false;
      if (user) {
        const { data: favoriteData } = await supabase
          .from('user_favorite_tools')
          .select('tool_id')
          .eq('user_id', user.id)
          .eq('tool_id', id)
          .single();
        isUserFavorite = !!favoriteData;
      }
      
      const transformedTool = transformDatabaseTool(data as DatabaseAITool, isUserFavorite);
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