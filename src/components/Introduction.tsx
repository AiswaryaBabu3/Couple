import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface IntroductionProps {
  onStart: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({ onStart }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Welcome to the Getting to Know Us Quiz 💕\n\nThis isn't an exam—just a fun little quiz about us.\n\nSome questions are easy, some are impossible, and a few are just there to make you panic. 😌\n\nIf you get something wrong... well... I happily accept chocolates, and paani poori requests as compensation. ✨\n\nGood luck!";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 z-10 relative">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-pink-100 shadow-[0_20px_50px_rgba(244,143,177,0.15)] flex flex-col items-center text-center transform transition-all duration-500 scale-100 animate-fade-in-up">
        {/* Cute Pulsing Icon */}
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6 animate-heartbeat shadow-sm">
          <Heart className="w-8 h-8 text-pink-500 fill-pink-300" />
        </div>

        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 mb-1 tracking-tight">
          Welcome! 💕
        </h1>
        <p className="text-xs font-bold tracking-widest text-pink-400 uppercase mb-6">
          Getting to Know Us
        </p>

        {/* Story Intro Card */}
        <div className="min-h-[160px] w-full text-gray-700 text-sm md:text-base leading-relaxed text-left font-sans whitespace-pre-line bg-pink-50/40 p-5 rounded-2xl border border-pink-100/50 mb-8 shadow-inner overflow-y-auto max-h-[250px]">
          {typedText}
          <span className="animate-blink text-pink-500 font-bold ml-0.5">|</span>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg py-4 px-10 rounded-full shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/35 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer"
        >
          <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span>Start Quiz</span>
          <Heart className="w-5 h-5 fill-white group-hover:animate-ping-once text-white" />
        </button>
      </div>
    </div>
  );
};

export default Introduction;
