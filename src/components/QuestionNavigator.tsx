import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

export const QuestionNavigator: React.FC = () => {
  const { questions, quizState, goToQuestion } = useQuiz();
  const [isOpen, setIsOpen] = useState(false);

  const getQuestionStatus = (questionIndex: number) => {
    const answer = quizState.answers[questionIndex];
    const isCurrent = questionIndex === quizState.currentQuestion;
    const isAnswered = answer?.isAnswered || false;

    if (isCurrent) {
      return 'current';
    } else if (isAnswered) {
      return 'answered';
    } else {
      return 'unanswered';
    }
  };

  const getButtonClasses = (status: string) => {
    const baseClasses = 'w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800';
    
    switch (status) {
      case 'current':
        return `${baseClasses} bg-red-500 text-white shadow-lg ring-2 ring-red-300 dark:ring-red-600`;
      case 'answered':
        return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500`;
      case 'unanswered':
        return `${baseClasses} bg-white dark:bg-gray-700 border-2 border-sky-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-sky-300 dark:hover:border-blue-400 focus:ring-blue-500`;
      default:
        return baseClasses;
    }
  };

  const currentQuestionNumber = quizState.currentQuestion + 1;
  const answeredCount = quizState.answers.filter(a => a.isAnswered).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-sky-100 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
      >
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Question Navigator
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Current: {currentQuestionNumber} | Answered: {answeredCount}/{questions.length}
          </p>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-5 gap-2 mb-4">
            {questions.map((_, index) => {
              const status = getQuestionStatus(index);
              return (
                <button
                  key={index}
                  onClick={() => {
                    goToQuestion(index);
                    setIsOpen(false);
                  }}
                  className={getButtonClasses(status)}
                  aria-label={`Go to question ${index + 1}${status === 'current' ? ' (current)' : ''}${status === 'answered' ? ' (answered)' : ''}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-white dark:bg-gray-700 border border-sky-200 dark:border-gray-600"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};