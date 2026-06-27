import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Send, HelpCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Question } from '../types';

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onCorrectAnswer: (answer: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onCorrectAnswer,
}) => {
  const [textInput, setTextInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // For the run-away potato buttons
  const [fryPos, setFryPos] = useState({ x: 0, y: 0 });
  const [boilPos, setBoilPos] = useState({ x: 0, y: 0 });
  const fryRef = useRef<HTMLButtonElement>(null);
  const boilRef = useRef<HTMLButtonElement>(null);

  // Reset states on question change
  useEffect(() => {
    setTextInput('');
    setDateInput('');
    setShowHint(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(false);
    setFryPos({ x: 0, y: 0 });
    setBoilPos({ x: 0, y: 0 });
  }, [question]);

  // Runaway button mechanism for potato question
  const handlePotatoHover = (type: 'fry' | 'boil') => {
    const range = 130;
    const randomX = (Math.random() - 0.5) * 2 * range;
    const randomY = (Math.random() - 0.5) * 2 * range;

    if (type === 'fry') {
      setFryPos({ x: randomX, y: randomY });
    } else {
      setBoilPos({ x: randomX, y: randomY });
    }

    const comments = [
      "Nope, you can't cook me! 🏃‍♂️",
      "Catch me if you can! 🍟",
      "Too slow! 🥔",
      "No boiling allowed! 🍲",
      "Error: Potato escape protocol activated! 🚨"
    ];
    setErrorMessage(comments[Math.floor(Math.random() * comments.length)]);
  };

  const celebrate = () => {
    const duration = 1.2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#f43f5e']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#f43f5e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleSelection = (option: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    celebrate();
    setSuccessMessage(question.successMessage || 'Answering... 🥰');
    setTimeout(() => {
      onCorrectAnswer(option);
    }, 1500);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    celebrate();
    setSuccessMessage(question.successMessage || 'Thank you for answering! 🥰');
    setErrorMessage(null);
    setTimeout(() => {
      onCorrectAnswer(textInput);
    }, 1800);
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput || isSubmitting) return;

    setIsSubmitting(true);
    celebrate();
    setSuccessMessage(question.successMessage || 'Saved date! 🗓️✨');
    setErrorMessage(null);
    setTimeout(() => {
      onCorrectAnswer(dateInput);
    }, 1800);
  };

  // Render different inputs based on question types
  const renderInput = () => {
    switch (question.type) {
      case 'choice':
      case 'emoji':
        return (
          <div className={`grid ${question.type === 'emoji' ? 'grid-cols-4 gap-3' : 'grid-cols-1 gap-3'} w-full mt-4`}>
            {question.options?.map((option, idx) => (
              <button
                key={idx}
                disabled={isSubmitting}
                onClick={() => handleSelection(option)}
                className={`py-3 px-5 rounded-2xl font-bold transition-all duration-300 text-center cursor-pointer shadow-sm border border-pink-100/60 hover:scale-[1.01] hover:shadow active:scale-95 disabled:opacity-50 disabled:pointer-events-none
                  ${question.type === 'emoji'
                    ? 'text-3xl bg-white/80 hover:bg-pink-100/50'
                    : 'text-base text-gray-700 bg-white/80 hover:bg-pink-500 hover:text-white'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'would-you-rather':
        return (
          <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
            {question.options?.map((option, idx) => (
              <button
                key={idx}
                disabled={isSubmitting}
                onClick={() => handleSelection(option)}
                className={`flex-1 p-6 rounded-2xl font-bold border border-pink-100/60 shadow-sm cursor-pointer hover:shadow hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 flex flex-col justify-center items-center text-center
                  ${idx === 0 
                    ? 'bg-rose-50/70 text-rose-700 hover:bg-rose-500 hover:text-white' 
                    : 'bg-indigo-50/70 text-indigo-700 hover:bg-indigo-500 hover:text-white'
                  }`}
              >
                <span className="text-[10px] tracking-wider uppercase opacity-75 mb-2">Option {idx + 1}</span>
                <span className="text-base">{option}</span>
              </button>
            ))}
          </div>
        );

      case 'potato':
        return (
          <div className="flex flex-col md:flex-row gap-4 w-full mt-6 justify-center items-center relative min-h-[140px]">
            <button
              ref={fryRef}
              style={{ transform: `translate(${fryPos.x}px, ${fryPos.y}px)` }}
              onMouseEnter={() => handlePotatoHover('fry')}
              onClick={() => handlePotatoHover('fry')}
              disabled={isSubmitting}
              className="absolute left-1/4 md:relative md:left-auto py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-transform duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              Fry me 🍟
            </button>

            <button
              ref={boilRef}
              style={{ transform: `translate(${boilPos.x}px, ${boilPos.y}px)` }}
              onMouseEnter={() => handlePotatoHover('boil')}
              onClick={() => handlePotatoHover('boil')}
              disabled={isSubmitting}
              className="absolute right-1/4 md:relative md:right-auto py-3 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-transform duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              Boil me 🍲
            </button>

            <button
              onClick={() => handleSelection('Marry me 💍')}
              disabled={isSubmitting}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-lg shadow-md hover:shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 z-10 disabled:opacity-50 disabled:pointer-events-none"
            >
              Marry me 💍
            </button>
          </div>
        );

      case 'cutest':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
            {question.options?.map((option, idx) => (
              <button
                key={idx}
                disabled={isSubmitting}
                onClick={() => handleSelection(option)}
                className={`py-4 px-5 rounded-2xl font-bold transition-all duration-300 text-center cursor-pointer border border-pink-100/60 shadow-sm disabled:opacity-50 disabled:pointer-events-none
                  ${idx === 3 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95 md:col-span-2 py-5 text-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-pink-100/50'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <form onSubmit={handleTextSubmit} className="w-full mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={textInput}
              disabled={isSubmitting}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={question.placeholder || 'Type your answer...'}
              className="flex-grow py-3.5 px-5 rounded-2xl border border-pink-200 bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all shadow-inner text-base disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Submit</span>
              <Send className="w-4 h-4 fill-white" />
            </button>
          </form>
        );

      case 'date':
        return (
          <form onSubmit={handleDateSubmit} className="w-full mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 pointer-events-none" />
              <input
                type="date"
                value={dateInput}
                disabled={isSubmitting}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full py-3.5 pl-12 pr-5 rounded-2xl border border-pink-200 bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all shadow-inner text-base cursor-pointer disabled:opacity-70"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold transition-all duration-300 cursor-pointer shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>Check Date</span>
              <Sparkles className="w-4 h-4 text-white" />
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  // Progress percentage
  const progressPercent = Math.min(((questionIndex + 1) / totalQuestions) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 z-10 relative w-full">
      <div className="max-w-xl w-full bg-white/75 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-[0_20px_50px_rgba(244,143,177,0.12)] flex flex-col transform transition-all duration-300">
        
        {/* Progress & Walking Animation */}
        <div className="w-full mb-6">
          <div className="flex justify-between items-center text-xs font-semibold text-pink-400 uppercase tracking-widest mb-2.5">
            <span>Question {questionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progressPercent)}% Completed</span>
          </div>
          <div className="w-full h-3 bg-pink-100/50 rounded-full relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
            <span
              className="absolute top-1/2 -translate-y-1/2 text-sm transition-all duration-500 ease-out -ml-2"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            >
              🏃‍♀️
            </span>
          </div>
        </div>

        {/* Question content */}
        <div className="flex-grow flex flex-col justify-center mb-6 min-h-[100px]">
          <h4 className="text-[10px] tracking-wider uppercase text-pink-400 font-extrabold mb-1">
            Question {questionIndex + 1}
          </h4>
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 leading-snug">
            {question.question}
          </h3>
        </div>

        {/* Dynamic Input Block */}
        {renderInput()}

        {/* Hints & Feedback Messages */}
        <div className="mt-6 min-h-[48px] flex flex-col justify-center items-center">
          {successMessage && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100/50 animate-fade-in text-center">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {!successMessage && errorMessage && (
            <div className="flex items-center gap-2 text-rose-500 bg-rose-50/50 px-4 py-2 rounded-xl text-sm font-bold border border-rose-100/50 animate-fade-in text-center">
              <span>{errorMessage}</span>
            </div>
          )}

          {!successMessage && !errorMessage && showHint && (
            <div className="flex items-center gap-2 text-pink-600 bg-pink-50/50 px-4 py-2 rounded-xl text-sm font-semibold border border-pink-100/50 animate-fade-in text-center">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>{question.hint}</span>
            </div>
          )}

          {!successMessage && !errorMessage && !showHint && question.hint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-pink-400 hover:text-pink-600 text-sm font-semibold flex items-center gap-1 cursor-pointer transition-colors duration-200"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Need a hint? 🥺</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
