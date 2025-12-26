import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-sky-100 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <a
            href="https://github.com/ahzizi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <Github className="w-5 h-5" />
            <span className="font-medium">AHzizi</span>
          </a>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Made With 💙</p>
        </div>
      </div>
    </footer>
  );
};