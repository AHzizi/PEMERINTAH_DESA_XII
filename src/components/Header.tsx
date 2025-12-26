import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-sky-100 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              PEMDES XI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Untuk Tes Perangkat Desa 2025
            </p>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};