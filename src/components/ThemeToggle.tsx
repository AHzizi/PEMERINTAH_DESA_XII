import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center justify-center rounded-full bg-sky-200 dark:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
          theme === 'dark' ? 'translate-x-3' : '-translate-x-3'
        }`}
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4 text-blue-600 m-1" />
        ) : (
          <Moon className="h-4 w-4 text-blue-600 m-1" />
        )}
      </span>
    </button>
  );
};