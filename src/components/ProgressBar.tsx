import React from 'react';
import { useQuiz } from '../contexts/QuizContext';

export const ProgressBar: React.FC = () => {
  const { quizState, questions } = useQuiz();
  
  const answeredCount = quizState.answers.filter(a => a.isAnswered).length;
  const totalQuestions = questions.length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-sky-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress
        </span>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {answeredCount} of {totalQuestions} questions answered
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>0%</span>
        <span>{Math.round(progressPercentage)}%</span>
        <span>100%</span>
      </div>
    </div>
  );
};