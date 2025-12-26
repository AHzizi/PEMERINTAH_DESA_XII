// QuizContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Question, QuizState, UserAnswer, User } from '../types/quiz';
import questionsData from '../data/questions.json';

interface QuizContextType {
  questions: Question[];
  quizState: QuizState;
  user: User | null;
  setUser: (user: User) => void;
  updateAnswer: (questionId: number, answer: number | null) => void;
  goToQuestion: (questionIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  skipQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  updateTimer: (timeRemaining: number) => void;
  getUnansweredQuestions: () => number[];
  isQuizStarted: boolean;
  startQuiz: () => void;
  calculateScore: () => number;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const QUIZ_DURATION = 90 * 60 * 1000; // 90 minutes in milliseconds
const STORAGE_KEY = 'quiz-state'; // Menyimpan semua data kuis (progress dan hasil)
const USER_STORAGE_KEY = 'quiz-user';
const START_STORAGE_KEY = 'quiz-started';

// Ambil data pertanyaan sekali
const initialQuestions: Question[] = questionsData as Question[];

const getInitialQuizState = (questions: Question[]): QuizState => ({
  currentQuestion: 0,
  answers: questions.map(q => ({
    questionId: q.id,
    selectedAnswer: null,
    isAnswered: false
  })),
  timeRemaining: QUIZ_DURATION,
  isCompleted: false,
  startTime: Date.now()
});

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [questions] = useState<Question[]>(initialQuestions); 
  const [user, setUserState] = useState<User | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  // --- KRITIKAL: LOGIKA PEMUATAN STATE AWAL ---
  const [quizState, setQuizState] = useState<QuizState>(() => {
    // 1. Coba ambil state yang tersimpan (Progress ATAU Hasil Selesai)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Pastikan data konsisten (jumlah jawaban sesuai jumlah pertanyaan)
        if (parsedState.answers?.length === questions.length) { 
           return {
              ...parsedState,
              // Pastikan startTime ada atau gunakan waktu sekarang
              startTime: parsedState.startTime || Date.now() 
           };
        }
      } catch (e) {
        console.error("Error parsing saved quiz state", e);
      }
    }
    
    // 2. Fallback ke state awal jika tidak ada data tersimpan atau data korup
    return getInitialQuizState(questions);
  });

  // --- Efek Pemuatan User dan Status Mulai ---
  useEffect(() => {
    // Load User
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      setUserState(JSON.parse(savedUser));
    }

    // Load Quiz Started status
    // Kita harus cek apakah kuis sudah selesai (dari quizState) sebelum memuat status 'started'
    if (!quizState.isCompleted) {
        const savedQuizStarted = localStorage.getItem(START_STORAGE_KEY);
        if (savedQuizStarted === 'true') {
          setIsQuizStarted(true);
        }
    } else {
      // Jika kuis sudah selesai (dimuat dari localStorage), kita anggap sudah tidak 'started' lagi.
      setIsQuizStarted(false);
    }
    
    // CATATAN: Status isQuizStarted hanya digunakan untuk mengontrol tampilan QuizInterface,
    // sedangkan isCompleted yang mengontrol tampilan ResultsPage.
  }, [quizState.isCompleted]); // Tambahkan dependency agar status start dihitung ulang saat isCompleted berubah

  // --- KRITIKAL: LOGIKA PENYIMPANAN STATE KUIS ---
  useEffect(() => {
    // Simpan state jika kuis sudah dimulai (progress) ATAU sudah selesai (hasil)
    if (isQuizStarted || quizState.isCompleted) { 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizState));
    }
    // Dependency: quizState (untuk melacak jawaban/timer) dan isQuizStarted
  }, [quizState, isQuizStarted]);
  
  // --- Aksi Kuis ---

  const startQuiz = () => {
    setIsQuizStarted(true);
    localStorage.setItem(START_STORAGE_KEY, 'true');
    
    // Jika kuis dimulai, pastikan state tidak completed (jika dimuat dari hasil sebelumnya)
    if (quizState.isCompleted) {
        setQuizState(getInitialQuizState(questions));
    } else {
    	// Jika kuis sedang dilanjutkan, hanya update waktu mulai jika perlu
    	setQuizState(prev => ({
            ...prev,
            startTime: prev.startTime || Date.now(),
        	timeRemaining: prev.timeRemaining || QUIZ_DURATION // Pastikan ada nilai
    	}));
    }
  };

  const updateAnswer = (questionId: number, answer: number | null) => {
    setQuizState(prev => ({
      ...prev,
      answers: prev.answers.map(a => 
        a.questionId === questionId 
          ? { 
              ...a, 
              selectedAnswer: answer, 
              isAnswered: answer !== null 
            }
          : a
      )
    }));
  };

  const goToQuestion = (questionIndex: number) => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      setQuizState(prev => ({ ...prev, currentQuestion: questionIndex }));
    }
  };

  const nextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: Math.min(prev.currentQuestion + 1, questions.length - 1)
    }));
  };

  const previousQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: Math.max(prev.currentQuestion - 1, 0)
    }));
  };

  const skipQuestion = () => {
    if (quizState.currentQuestion < questions.length - 1) {
      nextQuestion();
    }
  };

  // --- KRITIKAL: submitQuiz DILARANG MENGHAPUS STORAGE_KEY ---
  const submitQuiz = () => {
    setQuizState(prev => ({ ...prev, isCompleted: true }));
    setIsQuizStarted(false); // Kuis selesai, status started dihilangkan
    
    // Hapus kunci START_STORAGE_KEY saja, kunci hasil akan disimpan oleh useEffect
    localStorage.removeItem(START_STORAGE_KEY);
  };

  const resetQuiz = useCallback(() => {
    setQuizState(getInitialQuizState(questions));
    setIsQuizStarted(false);
    
    // Hapus semua data kuis terkait
    localStorage.removeItem(STORAGE_KEY); // Hapus hasil kuis yang tersimpan
    localStorage.removeItem(START_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY); 
    setUserState(null);
  }, [questions]);

  const updateTimer = (timeRemaining: number) => {
    // Hanya update jika kuis belum selesai
    if (!quizState.isCompleted) {
        setQuizState(prev => ({ ...prev, timeRemaining }));
    }
  };

  const getUnansweredQuestions = () => {
    return quizState.answers
      .map((answer, index) => ({ answer, index }))
      .filter(({ answer }) => !answer.isAnswered)
      .map(({ index }) => index);
  };
  
  const calculateScore = () => {
    // Boleh menghitung skor meski belum completed (untuk preview), tapi biasanya hanya dihitung setelah selesai
    let correctCount = 0;
    
    quizState.answers.forEach(userAnswer => {
        const questionData = questions.find(q => q.id === userAnswer.questionId);
        
        if (questionData && userAnswer.selectedAnswer === questionData.correctAnswer) {
            correctCount++;
        }
    });
    
    return correctCount;
  };

  const contextValue: QuizContextType = {
    questions,
    quizState,
    user,
    setUser: (user: User) => {
      setUserState(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    },
    updateAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    submitQuiz,
    resetQuiz,
    updateTimer,
    getUnansweredQuestions,
    isQuizStarted,
    startQuiz,
    calculateScore
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};