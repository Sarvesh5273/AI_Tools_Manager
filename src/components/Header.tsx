import React from 'react';
import { Moon, Sun, Sparkles, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                AI Tools Manager
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your personal AI arsenal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* User Info (when authenticated) */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || user.email || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="relative w-6 h-6">
                <Sun className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-500 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
                <Moon className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-500 ${isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
              </div>
            </button>

            {/* Sign Out Button (when authenticated) */}
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;