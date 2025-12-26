import React, { useMemo } from 'react';
import { CheckCircle, XCircle, Clock, User, Trophy, RotateCcw } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

export const ResultsPage: React.FC = () => {
  // Ambil calculateScore yang sudah ada di context
  const { questions, quizState, user, resetQuiz, calculateScore } = useQuiz();

  // Hitung skor hanya sekali menggunakan useMemo
  const score = useMemo(() => calculateScore(), [quizState.isCompleted]);
  
  const totalQuestions = questions.length;
  // Asumsi QUIZ_DURATION (90 menit) ada di QuizContext, tapi di sini hardcoded 20*60*1000
  // Saya akan mengasumsikan durasi kuis adalah total waktu yang dihabiskan
  // Waktu yang dihabiskan = (Waktu mulai + Durasi total) - Waktu tersisa
  // Jika asumsi Anda 20*60*1000, saya pakai itu untuk menghitung waktu yang terpakai.
  const QUIZ_DURATION_MS = 90 * 60 * 1000; // Asumsi dari QuizContext
  const timeSpent = QUIZ_DURATION_MS - quizState.timeRemaining; 
  
  const percentage = Math.round((score / totalQuestions) * 100);

  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Excellent work! Outstanding performance!", color: "text-green-600 dark:text-green-400" };
    if (percentage >= 80) return { message: "Great job! Very good performance!", color: "text-blue-600 dark:text-blue-400" };
    if (percentage >= 70) return { message: "Good work! Solid performance!", color: "text-yellow-600 dark:text-yellow-400" };
    if (percentage >= 60) return { message: "Not bad! Room for improvement.", color: "text-orange-600 dark:text-orange-400" };
    return { message: "Keep studying! You can do better!", color: "text-red-600 dark:text-red-400" };
  };

  const performance = getPerformanceMessage();
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 border border-sky-100 dark:border-gray-700 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 dark:bg-blue-900 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed!
          </h1>
          
          <p className={`text-lg font-medium ${performance.color} mb-4`}>
            {performance.message}
          </p>

          {user && (
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
              <User className="w-5 h-5" />
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-sky-100 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Correct Answers
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-sky-100 dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {percentage}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Nilai Kamu
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-sky-100 dark:border-gray-700 text-center">
            <div className="flex items-center justify-center space-x-2 text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              <Clock className="w-8 h-8" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Time Spent
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-sky-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Detailed Results
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {questions.map((question, index) => {
              const userAnswer = quizState.answers.find(a => a.questionId === question.id);
              // Perbandingan menggunakan indeks asli (selectedAnswer vs correctAnswer)
              const isCorrect = userAnswer?.selectedAnswer === question.correctAnswer;
              const isAnswered = userAnswer?.isAnswered || false;

              return (
                <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {!isAnswered ? (
                        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">?</span>
                        </div>
                      ) : isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {index + 1}. {question.question}
                      </h3>
                      
                      <div className="space-y-2 mb-3">
                        {/* Di sini, kita harus menampilkan opsi dalam URUTAN ASLI dari JSON */}
                        {question.options.map((option, optionIndex) => {
                          // Karena kita menampilkan opsi dalam urutan asli (index = original index)
                          const isUserAnswer = userAnswer?.selectedAnswer === optionIndex;
                          const isCorrectAnswer = optionIndex === question.correctAnswer;
                          
                          let optionClasses = "p-2 rounded text-sm ";
                          
                          if (isCorrectAnswer) {
                            optionClasses += "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-bold ";
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            optionClasses += "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 font-bold ";
                          } else {
                            optionClasses += "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ";
                          }
                          
                          return (
                            <div key={optionIndex} className={optionClasses}>
                              <span className="font-medium">{optionLabels[optionIndex]}.</span> {option}
                              {isUserAnswer && (
                                <span className="ml-2 text-xs font-medium">
                                  (Jawaban Kamu)
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <span className="ml-2 text-xs font-medium">
                                  (Jawaban Benar)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {!isAnswered && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                          Question not answered
                        </p>
                      )}
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
                        <p className="text-blue-800 dark:text-blue-200">
                          <span className="font-medium">Explanation:</span> {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 text-center">
          <button
            onClick={resetQuiz}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Quiz Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};