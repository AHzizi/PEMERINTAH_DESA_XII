import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, SkipBack as Skip, Send } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';
import { Question } from './Question';
import { QuestionNavigator } from './QuestionNavigator';
import { Timer } from './Timer';
import { ProgressBar } from './ProgressBar';
import { UnansweredQuestionsModal } from './UnansweredQuestionsModal';

export const QuizInterface: React.FC = () => {
  const {
    questions,
    quizState,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    submitQuiz,
    getUnansweredQuestions,
    goToQuestion,
    startQuiz,
    isQuizStarted
  } = useQuiz();

  const [showUnansweredModal, setShowUnansweredModal] = useState(false);

  const currentQuestion = questions[quizState.currentQuestion];
  const isLastQuestion = quizState.currentQuestion === questions.length - 1;
  const isFirstQuestion = quizState.currentQuestion === 0;

  const handleStartQuiz = () => {
    startQuiz();
  };

  const handleSubmitClick = () => {
    const unansweredQuestions = getUnansweredQuestions();
    if (unansweredQuestions.length > 0) {
      setShowUnansweredModal(true);
    } else {
      submitQuiz();
    }
  };

  const handleSubmitFromModal = () => {
    setShowUnansweredModal(false);
    submitQuiz();
  };

  const handleReviewFromModal = () => {
    setShowUnansweredModal(false);
    const unansweredQuestions = getUnansweredQuestions();
    if (unansweredQuestions.length > 0) {
      // Go to the first unanswered question
      const firstUnansweredIndex = questions.findIndex(q => unansweredQuestions.includes(q.id));
      if (firstUnansweredIndex !== -1) {
        goToQuestion(firstUnansweredIndex);
      }
    }
  };

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-sky-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Semoga Berhasil, 
            <br />
            <br /><br />
            Selamat Mengerjakan!
          </p>
          <button
            onClick={handleStartQuiz}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Stats Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <Timer />
          <ProgressBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Navigator - Left Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <QuestionNavigator />
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            <Question question={currentQuestion} />

            {/* Navigation Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-sky-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={previousQuestion}
                  disabled={isFirstQuestion}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isFirstQuestion
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-sky-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-sky-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-3">
                  {!isLastQuestion && (
                    <button
                      onClick={skipQuestion}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <Skip className="w-4 h-4" />
                      <span>Skip</span>
                    </button>
                  )}

                  {isLastQuestion ? (
                    <button
                      onClick={handleSubmitClick}
                      className="flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Quiz</span>
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unanswered Questions Modal */}
      <UnansweredQuestionsModal
        isOpen={showUnansweredModal}
        onClose={() => setShowUnansweredModal(false)}
        onSubmit={handleSubmitFromModal}
        onReview={handleReviewFromModal}
        unansweredCount={getUnansweredQuestions().length}
        unansweredQuestions={getUnansweredQuestions()}
      />
    </div>
  );
};