import React, { useMemo } from 'react';
import { Question as QuestionType } from '../types/quiz';
import { useQuiz } from '../contexts/QuizContext';

interface QuestionProps {
  question: QuestionType;
}

// Interface untuk melacak indeks asli dari setiap opsi
interface ShuffledOption {
  originalIndex: number; // Indeks opsi ini di array 'options' asli (di JSON)
  value: string;         // Nilai opsi (teks jawaban)
}

// Fungsi helper untuk mengacak array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const Question: React.FC<QuestionProps> = ({ question }) => {
  const { quizState, updateAnswer } = useQuiz();
  
  // Jawaban yang tersimpan adalah **indeks asli** (originalIndex)
  const currentAnswer = quizState.answers.find(a => a.questionId === question.id);
  const selectedOriginalIndex = currentAnswer?.selectedAnswer;

  // 1. Lakukan pengacakan opsi hanya sekali per ID pertanyaan menggunakan useMemo
  const shuffledOptions: ShuffledOption[] = useMemo(() => {
    const optionsWithIndex: ShuffledOption[] = question.options.map((option, index) => ({
      originalIndex: index, // Simpan indeks asli (0, 1, 2, ...)
      value: option,
    }));
    
    // Kembalikan array yang sudah diacak
    return shuffleArray(optionsWithIndex);
  }, [question.id, question.options]); 

  // 2. Fungsi untuk menangani pemilihan jawaban
  // selectedShuffledIndex adalah indeks tampilan saat ini (0, 1, 2, ...)
  const handleAnswerSelect = (selectedShuffledIndex: number) => {
    // Ambil indeks asli (originalIndex) dari opsi yang dipilih
    const originalIndexToSave = shuffledOptions[selectedShuffledIndex].originalIndex;
    
    // Kirim indeks asli ke QuizContext. Penilaian akan menggunakan indeks asli ini
    updateAnswer(question.id, originalIndexToSave);
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-sky-100 dark:border-gray-700">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Question {question.id}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {quizState.currentQuestion + 1} of {quizState.answers.length}
          </span>
        </div>
        
        <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed">
          {question.question}
        </p>
      </div>

      <div className="space-y-3">
        {/* 3. Mapping menggunakan array yang sudah diacak (shuffledOptions) */}
        {shuffledOptions.map((shuffledOption, index) => {
          // Cek apakah opsi yang sedang di-loop adalah yang dipilih
          const isSelected = selectedOriginalIndex === shuffledOption.originalIndex;

          return (
            <button
              // Key menggunakan originalIndex untuk stabilitas
              key={shuffledOption.originalIndex}
              // index di sini adalah indeks tampilan (0, 1, 2, ...) yang dikirim ke handleAnswerSelect
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-sky-300 dark:hover:border-blue-400'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-400'
                }`}>
                  {/* Tampilkan label A, B, C, D, E berdasarkan indeks tampilan */}
                  {optionLabels[index]}
                </div>
                {/* Tampilkan nilai opsi yang sudah diacak */}
                <span className="flex-1">{shuffledOption.value}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};