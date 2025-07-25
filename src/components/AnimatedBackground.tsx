import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-700" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
      
      {/* Animated mesh grid */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(59,130,246,0.05)_25px,rgba(59,130,246,0.05)_26px,transparent_27px,transparent_49px,rgba(59,130,246,0.05)_50px,rgba(59,130,246,0.05)_51px,transparent_52px),linear-gradient(rgba(59,130,246,0.05)_24px,transparent_25px,transparent_26px,rgba(59,130,246,0.05)_27px,rgba(59,130,246,0.05)_49px,transparent_50px,transparent_51px,rgba(59,130,246,0.05)_52px)] bg-[length:100px_100px] animate-pulse" />
      </div>
    </div>
  );
};

export default AnimatedBackground;