import React, { useState, useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import SearchAndFilter from './components/SearchAndFilter';
import AIToolCard from './components/AIToolCard';
import AddToolForm from './components/AddToolForm';
import EditToolForm from './components/EditToolForm';
import { mockAITools } from './data/mockData';
import { AITool, Category } from './types';
import { Plus } from 'lucide-react';

function AppContent() {
  const [aiTools, setAiTools] = useState<AITool[]>(mockAITools);
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

  const handleToggleFavorite = (id: string) => {
    setAiTools(tools => 
      tools.map(tool => 
        tool.id === id ? { ...tool, isFavorite: !tool.isFavorite } : tool
      )
    );
  };

  const handleIncrementUsage = (id: string) => {
    setAiTools(tools => 
      tools.map(tool => 
        tool.id === id ? { ...tool, usageCount: tool.usageCount + 1 } : tool
      )
    );
  };

  const handleAddTool = (toolData: {
    name: string;
    description: string;
    link: string;
    category: string;
    tags: string[];
    imageUrl?: string;
  }) => {
    const newTool: AITool = {
      id: Date.now().toString(),
      name: toolData.name,
      description: toolData.description,
      link: toolData.link,
      category: toolData.category,
      tags: toolData.tags,
      usageCount: 0,
      addedDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
      imageUrl: toolData.imageUrl
    };

    setAiTools(tools => [...tools, newTool]);
  };

  const handleEditTool = (tool: AITool) => {
    setEditingTool(tool);
    setShowEditToolForm(true);
  };

  const handleUpdateTool = (updatedTool: AITool) => {
    setAiTools(tools => 
      tools.map(tool => 
        tool.id === updatedTool.id ? updatedTool : tool
      )
    );
    setShowEditToolForm(false);
    setEditingTool(null);
  };

  const handleDeleteTool = (id: string) => {
    setAiTools(tools => tools.filter(tool => tool.id !== id));
  };

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
                  onEditTool={handleEditTool}
                  onDeleteTool={handleDeleteTool}
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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;