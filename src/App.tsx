import React, { useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import AuthCallback from './components/AuthCallback';
import SearchAndFilter from './components/SearchAndFilter';
import AIToolCard from './components/AIToolCard';
import AddToolForm from './components/AddToolForm';
import EditToolForm from './components/EditToolForm';
import { useAITools } from './hooks/useAITools';
import { AITool, Category } from './types';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // Check if we're on the auth callback route
  const isAuthCallback = window.location.pathname === '/auth/callback';
  
  // Show auth callback page if on callback route
  if (isAuthCallback) {
    return <AuthCallback />;
  }
  
  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  // Show main app if authenticated
  return <MainApp />;
}

function MainApp() {
  const {
    aiTools,
    loading,
    error,
    addTool,
    updateTool,
    deleteTool,
    toggleFavorite,
    incrementUsage
  } = useAITools();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAddToolForm, setShowAddToolForm] = useState(false);
  const [showEditToolForm, setShowEditToolForm] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);

  // Dynamic categories based on current tools
  const categories = useMemo((): Category[] => {
    const categoryMap = new Map<string, number>();
    
    aiTools.forEach(tool => {
      categoryMap.set(tool.category, (categoryMap.get(tool.category) || 0) + 1);
    });

    const categoryColors = [
      'bg-gradient-to-r from-emerald-500 to-teal-600',
      'bg-gradient-to-r from-pink-500 to-rose-600',
      'bg-gradient-to-r from-orange-500 to-red-600',
      'bg-gradient-to-r from-violet-500 to-purple-600',
      'bg-gradient-to-r from-indigo-500 to-blue-600',
      'bg-gradient-to-r from-green-500 to-emerald-600',
      'bg-gradient-to-r from-cyan-500 to-blue-600',
      'bg-gradient-to-r from-yellow-500 to-orange-600',
      'bg-gradient-to-r from-purple-500 to-pink-600',
      'bg-gradient-to-r from-blue-500 to-cyan-600'
    ];

    const dynamicCategories: Category[] = [
      { name: 'All', count: aiTools.length, color: 'bg-gradient-to-r from-blue-500 to-purple-600' }
    ];

    Array.from(categoryMap.entries()).forEach(([name, count], index) => {
      dynamicCategories.push({
        name,
        count,
        color: categoryColors[index % categoryColors.length]
      });
    });

    return dynamicCategories;
  }, [aiTools]);

  const filteredTools = useMemo(() => {
    return aiTools.filter(tool => {
      const matchesSearch = !searchTerm || 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      const matchesFavorites = !showFavorites || tool.isFavorite;
      
      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [aiTools, searchTerm, selectedCategory, showFavorites]);

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      // You could add a toast notification here
    }
  };

  const handleIncrementUsage = async (id: string) => {
    try {
      await incrementUsage(id);
    } catch (err) {
      console.error('Failed to increment usage:', err);
      // You could add a toast notification here
    }
  };

  const handleAddTool = async (toolData: {
    name: string;
    description: string;
    link: string;
    category: string;
    tags: string[];
    imageUrl?: string;
  }) => {
    try {
      await addTool(toolData);
      setShowAddToolForm(false);
    } catch (err) {
      console.error('Failed to add tool:', err);
      // You could add a toast notification here
      throw err; // Re-throw to let the form handle the error
    }
  };

  const handleEditTool = (tool: AITool) => {
    setEditingTool(tool);
    setShowEditToolForm(true);
  };

  const handleUpdateTool = async (updatedTool: AITool) => {
    try {
      await updateTool(updatedTool);
      setShowEditToolForm(false);
      setEditingTool(null);
    } catch (err) {
      console.error('Failed to update tool:', err);
    }
  };

  const handleDeleteTool = async (id: string) => {
    try {
      await deleteTool(id);
    } catch (err) {
      console.error('Failed to delete tool:', err);
      // You could add a toast notification here
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen transition-colors duration-700">
        <AnimatedBackground />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Loading AI Tools...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we fetch your tools from the database.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen transition-colors duration-700">
        <AnimatedBackground />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Failed to Load Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please check your Supabase configuration and try again.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-700">
      <AnimatedBackground />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            categories={categories}
          />
        </div>

        {/* Results Header with Add Button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredTools.length === 0 
                ? 'No tools found' 
                : `${filteredTools.length} ${filteredTools.length === 1 ? 'tool' : 'tools'} found`
              }
            </h2>
            {searchTerm && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Showing results for "{searchTerm}"
              </p>
            )}
          </div>
          
          <button
            onClick={() => setShowAddToolForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Tool
          </button>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No AI tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Try adjusting your search terms or filters to find the tools you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <div
                key={tool.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AIToolCard
                  tool={tool}
                  onToggleFavorite={handleToggleFavorite}
                  onIncrementUsage={handleIncrementUsage}
                  // Only show edit and delete options for admin users
                  onEditTool={isAuthenticated && userRole === 'admin' ? handleEditTool : undefined}
                  onDeleteTool={isAuthenticated && userRole === 'admin' ? handleDeleteTool : undefined}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Tool Form Modal */}
      {showAddToolForm && (
        <AddToolForm
          onAddTool={handleAddTool}
          onClose={() => setShowAddToolForm(false)}
        />
      )}

      {/* Edit Tool Form Modal */}
      {showEditToolForm && editingTool && (
        <EditToolForm
          toolToEdit={editingTool}
          onUpdateTool={handleUpdateTool}
          onClose={() => {
            setShowEditToolForm(false);
            setEditingTool(null);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
