import React, { useState } from 'react';
import { ExternalLink, Star, BarChart3, Calendar, Tag, Bot, Edit, Trash2, MoreVertical } from 'lucide-react';
import { AITool } from '../types';

interface AIToolCardProps {
  tool: AITool;
  onToggleFavorite: (id: string) => void;
  onIncrementUsage: (id: string) => void;
  onEditTool?: (tool: AITool) => void;
  onDeleteTool?: (id: string) => void;
  isAdmin: boolean;
}

const AIToolCard: React.FC<AIToolCardProps> = ({ tool, onToggleFavorite, onIncrementUsage, onEditTool, onDeleteTool, isAdmin }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleVisit = () => {
    onIncrementUsage(tool.id);
    window.open(tool.link, '_blank');
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditTool) {
      onEditTool(tool);
    }
    setShowActions(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteTool && window.confirm(`Are you sure you want to delete "${tool.name}"? This action cannot be undone.`)) {
      onDeleteTool(tool.id);
    }
    setShowActions(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Conversational AI': 'from-emerald-500 to-teal-600',
      'Image Generation': 'from-pink-500 to-rose-600',
      'Development': 'from-orange-500 to-red-600',
      'Productivity': 'from-violet-500 to-purple-600',
      'Video Generation': 'from-indigo-500 to-blue-600',
      'Audio Generation': 'from-green-500 to-emerald-600',
      'Search & Research': 'from-cyan-500 to-blue-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div
      className={`group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer ${
        isHovered ? 'transform translate-y-[-8px]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tool Image */}
      <div className="relative w-full h-32 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        {tool.imageUrl && !imageError ? (
          <img
            src={tool.imageUrl}
            alt={tool.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Bot className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Top Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(tool.id);
          }}
          className={`p-2 rounded-lg transition-all duration-300 ${
            tool.isUserFavorite
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-yellow-500'
          } hover:scale-110`}
        >
          <Star className={`w-4 h-4 ${tool.isUserFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Actions Menu */}
        {isAdmin && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Actions Dropdown */}
            {showActions && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[120px] z-10">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(tool.category)} mb-4`}>
        {tool.category}
      </div>

      {/* Tool Name and Description */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
        {tool.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {tool.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <BarChart3 className="w-4 h-4" />
          <span>{tool.usageCount} uses</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Added {new Date(tool.addedDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Visit Button */}
      <button
        onClick={handleVisit}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <ExternalLink className="w-4 h-4" />
        Visit Tool
      </button>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`} />
    </div>
  );
};

export default AIToolCard;