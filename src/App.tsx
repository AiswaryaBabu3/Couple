import { useState } from 'react';
import HeartBackground from './components/HeartBackground';
import Introduction from './components/Introduction';
import QuizCard from './components/QuizCard';
import EndingScreen from './components/EndingScreen';
import { QUESTIONS } from './questions';
import type { QuizState } from './types';

const initialQuizState = (): QuizState => ({
  currentQuestionIndex: 0,
  answers: {},
  quizCompleted: false,
});

function App() {
  const [view, setView] = useState<'intro' | 'quiz' | 'ending'>('intro');
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState());

  const handleStart = () => {
    setQuizState(initialQuizState());
    setView('quiz');
  };

  const handleCorrectAnswer = (answer: string) => {
    setQuizState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const isCompleted = nextIndex >= QUESTIONS.length;
      const newAnswers = { ...prev.answers, [prev.currentQuestionIndex]: answer };

      if (isCompleted) {
        localStorage.setItem('couple_quiz_responses', JSON.stringify(newAnswers));
      }

      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: isCompleted ? prev.currentQuestionIndex : nextIndex,
        quizCompleted: isCompleted,
      };
    });

    if (quizState.currentQuestionIndex + 1 >= QUESTIONS.length) {
      setTimeout(() => setView('ending'), 800);
    }
  };

  const handleRestart = () => {
    setQuizState(initialQuizState());
    setView('intro');
  };

  return (
    <div className="relative min-h-screen font-sans antialiased text-gray-800 flex flex-col justify-between overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      {/* Floating hearts background animation */}
      <HeartBackground />

      {/* Primary Quiz/Questionnaire Layout Panel */}
      <main className="flex-grow flex items-center justify-center w-full max-w-7xl mx-auto px-4 z-10 relative">
        {view === 'intro' && <Introduction onStart={handleStart} />}
        {view === 'quiz' && quizState.currentQuestionIndex < QUESTIONS.length && (
          <QuizCard
            question={QUESTIONS[quizState.currentQuestionIndex]}
            questionIndex={quizState.currentQuestionIndex}
            totalQuestions={QUESTIONS.length}
            onCorrectAnswer={handleCorrectAnswer}
          />
        )}
        {view === 'ending' && (
          <EndingScreen
            answers={quizState.answers}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer banner */}
      <footer className="w-full text-center py-4 text-[10px] sm:text-xs text-pink-400 font-semibold tracking-widest bg-gradient-to-t from-pink-50/20 to-transparent pointer-events-none z-10 select-none">
        Made with ❤️ for my favorite person
      </footer>
    </div>
  );
}

export default App;
