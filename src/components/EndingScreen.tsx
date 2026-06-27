import React, { useState } from 'react';
import { Heart, Mail, Copy, MessageSquare, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUESTIONS, RELATIONSHIP_CONFIG } from '../questions';
import couplePhoto from '../assets/couple.jpg';

interface EndingScreenProps {
  answers: Record<number, string>;
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  answers,
  onRestart,
}) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatAnswersForSharing = () => {
    let msg = `Hey! 💕 I just finished the Dating Partner Q&A Game. Here are my answers:\n\n`;
    QUESTIONS.forEach((q, idx) => {
      const userAnswer = answers[idx] || "No answer";
      msg += `❓ Q${idx + 1}: ${q.question}\n👉 A: ${userAnswer}\n\n`;
    });
    return msg;
  };

  const handleCopyAnswers = () => {
    const text = formatAnswersForSharing();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      confetti({
        particleCount: 15,
        spread: 30,
        colors: ['#ff69b4', '#ff1493']
      });
    });
  };

  const handleSendWhatsApp = () => {
    const text = formatAnswersForSharing();
    const encoded = encodeURIComponent(text);
    
    // Check if phone number is configured, if not default to direct send URL
    const cleanPhone = RELATIONSHIP_CONFIG.whatsappNumber
      ? RELATIONSHIP_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')
      : '';
    
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
      
    window.open(waUrl, '_blank');
  };

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#f43f5e', '#fb7185', '#f472b6']
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 z-10 relative w-full">
      <div className="max-w-2xl w-full flex flex-col gap-8">
        
        {/* Certificate Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-[0_20px_50px_rgba(244,143,177,0.12)] flex flex-col items-center text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 shadow-sm animate-heartbeat">
            <Heart className="w-10 h-10 text-pink-500 fill-pink-300" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-snug mb-2">
            Game Completed! 🎉
          </h2>
          <p className="text-sm font-semibold tracking-wider text-pink-400 uppercase mb-5">
            Dating Compatibility Game
          </p>
          <div className="bg-pink-50/50 border border-pink-100/60 text-gray-700 p-5 rounded-2xl text-base leading-relaxed text-left md:text-center max-w-lg mb-6">
            <strong>Thank you for answering! 💌</strong> You've successfully finished all 25 questions. Now it's time to share your answers directly with your partner!
          </div>

          {/* Action Buttons to Send Answers */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button
              onClick={handleSendWhatsApp}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-md hover:shadow-lg cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5 fill-white text-emerald-500" />
              <span>Send via WhatsApp 💬</span>
            </button>

            <button
              onClick={handleCopyAnswers}
              className={`flex-1 py-4 px-6 rounded-2xl font-extrabold text-sm shadow-md hover:shadow-lg cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border
                ${copied 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50/20'
                }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied Responses! 📋</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Answers 📋</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Answers Summary Section */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-[0_20px_50px_rgba(244,143,177,0.12)] flex flex-col animate-fade-in-up delay-75">
          <h3 className="text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            💝 Review Your Answers
          </h3>
          <p className="text-sm text-gray-600 mb-6 font-sans">
            Here are the exact answers you submitted during the game:
          </p>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 text-left">
            {QUESTIONS.map((q, idx) => {
              const userAnswer = answers[idx] || "No answer";
              return (
                <div key={q.id} className="p-4 bg-pink-50/20 border border-pink-100/60 rounded-2xl flex flex-col gap-1.5 font-sans animate-fade-in">
                  <div className="text-[10px] font-extrabold text-pink-400 tracking-wider uppercase">
                    Question {idx + 1}
                  </div>
                  <div className="font-extrabold text-gray-800 text-sm md:text-base leading-snug">
                    {q.question}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mt-1 text-sm">
                    <span className="text-gray-500 font-semibold">Answered:</span>
                    <span className="font-extrabold text-rose-600 bg-rose-50/70 py-0.5 px-2.5 rounded-lg border border-rose-100/40 w-fit break-all">
                      {userAnswer}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hidden Love Letter Envelope */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-pink-100 shadow-[0_20px_50px_rgba(244,143,177,0.12)] flex flex-col items-center animate-fade-in-up delay-100 overflow-hidden">
          <h3 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
            💌 Your Hidden Rewards
          </h3>

          <div className="w-full flex flex-col items-center">
            {!envelopeOpened ? (
              <div 
                onClick={handleOpenEnvelope}
                className="w-full max-w-md aspect-[1.6] bg-pink-100/50 rounded-2xl border-2 border-dashed border-pink-300 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-100/80 transition-all duration-300 group relative overflow-hidden shadow-inner"
              >
                <Mail className="w-14 h-14 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="mt-3 text-sm font-bold text-pink-500">Click to break wax seal & open letter 💖</span>
                
                <div className="absolute w-12 h-12 bg-rose-600 rounded-full border-4 border-rose-500 shadow-md flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Heart className="w-5 h-5 fill-white text-white" />
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center animate-fade-in">
                <div className="w-full bg-orange-50/50 border border-orange-100/60 rounded-2xl p-6 md:p-8 font-serif text-gray-800 leading-relaxed shadow-sm text-left relative max-w-xl">
                  <div className="absolute top-3 right-4 text-3xl opacity-20">✍️</div>
                  <p className="font-extrabold text-rose-700 text-lg mb-4">Dearest Partner, ❤️</p>
                  
                  {/* Polaroid Image */}
                  <div className="flex justify-center mb-6 animate-fade-in">
                    <div className="bg-white p-3 pb-8 rounded-lg shadow-md border border-pink-100/40 rotate-[-2deg] max-w-[200px] w-full transform hover:rotate-0 transition-transform duration-300">
                      <img src={couplePhoto} alt="Us 💕" className="rounded-md object-cover aspect-[0.75] w-full" />
                      <div className="text-center font-sans text-[10px] font-bold text-gray-400 mt-2">
                        Us 💕
                      </div>
                    </div>
                  </div>

                  <p className="mb-4">
                    Thank you for taking this silly little exam, but more than that... thank you for coming into my life and making me feel so special.
                  </p>
                  
                  <p className="mb-4">
                    I know I always joke that I'm only a <strong>5/10</strong>, but somehow you always look at me like I'm a <strong>10/10</strong>. Whether you mean it or not, you've made me believe it too. And honestly, that's one of the most beautiful gifts you've ever given me.
                  </p>
                  
                  <p className="mb-4">
                    You know... when you first texted me, I only replied because I saw your dance videos on your profile. Since I love dancing too, I thought, "Okay, this person seems interesting." Funny how one random reply turned into <em>us</em>. I don't even remember what our very first message was anymore, but somehow that one little conversation brought us here.
                  </p>
                  
                  <p className="mb-4">
                    At first, I genuinely wondered, "Why is this guy spending so much time talking to me? Isn't this a complete waste of his time?" But you proved me completely wrong. Thank you for showing me that I was worth your time.
                  </p>
                  
                  <p className="mb-4">
                    Even though we've been in a long-distance relationship and haven't had as much time together as I wish, every moment we've shared means so much to me. I still wish we could spend so much more time together. Maybe one day, we won't have to count the days between our meetings anymore.
                  </p>
                  
                  <p className="mb-4">
                    I don't know where our story will go from here, but if life gives me the choice, I'd love to see where 'us' could lead. Maybe... just maybe... all the way to <strong>forever</strong>. ❤️
                  </p>
                  
                  <p className="mb-4">
                    I also know I've irritated you more times than I can count (and let's be honest... I'll probably continue doing that 😌). But that's just my way of loving you. So yes, I'll keep annoying you for as long as you'll have me.
                  </p>
                  
                  <p className="mb-4">
                    Thank you for making me smile, for believing in me, for making me feel loved, and for becoming such an important part of my life.
                  </p>
                  
                  <p className="mb-6">
                    No matter how many quizzes you pass or fail, you'll always be my favorite person.
                  </p>

                  <div className="text-right mt-6">
                    <p className="font-extrabold text-rose-700">Love,</p>
                    <p className="font-extrabold text-rose-700 italic">Your Professional Annoyance ❤️</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="self-center flex items-center gap-2 py-3 px-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 active:scale-95 z-10"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Restart Quiz</span>
        </button>

      </div>
    </div>
  );
};

export default EndingScreen;
