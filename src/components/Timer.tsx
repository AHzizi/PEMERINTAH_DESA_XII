import React, { useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

export const Timer: React.FC = () => {
  const { quizState, updateTimer, submitQuiz } = useQuiz();

  const QUIZ_DURATION = 90 * 60 * 1000; // 90 menit

  const formatTime = useCallback((timeInMs: number) => {
    const totalSeconds = Math.max(0, Math.floor(timeInMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (quizState.isCompleted) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - quizState.startTime;
      const remaining = Math.max(0, QUIZ_DURATION - elapsed);

      updateTimer(remaining);

      if (remaining <= 0) {
        submitQuiz();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState.isCompleted, quizState.startTime, updateTimer, submitQuiz]);

  const timePercentage = (quizState.timeRemaining / QUIZ_DURATION) * 100;
  const isLowTime = timePercentage <= 25;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-sky-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Remaining</span>
        </div>
        <span className={`text-lg font-bold ${isLowTime ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
          {formatTime(quizState.timeRemaining)}
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ${
            isLowTime 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600'
          }`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      {isLowTime && (
        <p className="text-xs text-red-500 mt-2 font-medium">
          ⚠️ Time is running low!
        </p>
      )}
    </div>
  );
};
