import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface UnansweredQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onReview: () => void;
  unansweredCount: number;
  unansweredQuestions: number[];
}

export const UnansweredQuestionsModal: React.FC<UnansweredQuestionsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onReview,
  unansweredCount,
  unansweredQuestions
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unanswered Questions
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You have <strong>{unansweredCount}</strong> unanswered question{unansweredCount !== 1 ? 's' : ''}.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unanswered questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {unansweredQuestions.map(questionId => (
                <span
                  key={questionId}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                >
                  #{questionId}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Would you like to review your answers or submit the quiz now?
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onReview}
            className="flex-1 px-4 py-2 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
          >
            Review Questions
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};