import { useState, useEffect } from 'react';
import { supabase, transformDatabaseTool, transformAppTool, DatabaseAITool } from '../lib/supabase';
import { AITool } from '../types';

export const useAITools = () => {
  const [aiTools, setAiTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tools from Supabase
  const fetchTools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('ai_tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const transformedTools = data?.map(transformDatabaseTool) || [];
      setAiTools(transformedTools);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError(`Failed to fetch tools: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setAiTools([]);
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
      if (!tool) return;

      const { data, error: updateError } = await supabase
        .from('ai_tools')
        .update({ is_favorite: !tool.isFavorite })
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
      console.error('Error toggling favorite:', err);
      throw err;
    }
  };

  // Increment usage count
  const incrementUsage = async (id: string) => {
    try {
      const tool = aiTools.find(t => t.id === id);
      if (!tool) return;

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
  }, []);

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