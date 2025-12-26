import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { QuizProvider, useQuiz } from './contexts/QuizContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UserEntryForm } from './components/UserEntryForm';
import { QuizInterface } from './components/QuizInterface';
import { ResultsPage } from './components/ResultsPage';

const AppContent: React.FC = () => {
  const { user, quizState } = useQuiz();

  const renderContent = () => {
    if (!user) {
      return <UserEntryForm />;
    }
    
    if (quizState.isCompleted) {
      return (
        <>
          <Header />
          <main className="flex-1">
            <ResultsPage />
          </main>
          <Footer />
        </>
      );
    }

    return (
      <>
        <Header />
        <main className="flex-1">
          <QuizInterface />
        </main>
        <Footer />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800">
      {renderContent()}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <QuizProvider>
        <AppContent />
      </QuizProvider>
    </ThemeProvider>
  );
}

export default App;