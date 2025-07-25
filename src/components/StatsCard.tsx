import React from 'react';
import { TrendingUp, Star, Zap, Target } from 'lucide-react';
import { AITool } from '../types';

interface StatsCardProps {
  tools: AITool[];
}

const StatsCard: React.FC<StatsCardProps> = ({ tools }) => {
  const totalUsage = tools.reduce((sum, tool) => sum + tool.usageCount, 0);
  const favorites = tools.filter(tool => tool.isFavorite).length;
  const mostUsed = tools.reduce((prev, current) => (prev.usageCount > current.usageCount) ? prev : current);
  const categories = new Set(tools.map(tool => tool.category)).size;

  const stats = [
    {
      icon: Target,
      label: 'Total Tools',
      value: tools.length,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      label: 'Total Uses',
      value: totalUsage,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Star,
      label: 'Favorites',
      value: favorites,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Zap,
      label: 'Categories',
      value: categories,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dashboard Stats</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg mb-2`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {tools.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Most Used Tool:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {mostUsed.name} ({mostUsed.usageCount} uses)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;