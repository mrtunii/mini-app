import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
    </div>
  );
};

export default LoadingScreen;