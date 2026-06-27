import React, { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

export const HeartBackground: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Generate initial set of hearts
    const heartArray: Heart[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: Math.random() * 24 + 12, // px size (12px to 36px)
      delay: Math.random() * -20, // negative delay so they start at different scroll offsets
      duration: Math.random() * 12 + 8, // float speed (8s to 20s)
    }));
    setHearts(heartArray);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-tr from-rose-50 via-pink-50 to-purple-50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/20 via-transparent to-transparent pointer-events-none" />
      
      {hearts.map((heart) => (
        <svg
          key={heart.id}
          className="absolute text-pink-300/35 fill-current animate-heart-float"
          style={{
            left: `${heart.left}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            bottom: '-40px',
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}
    </div>
  );
};
export default HeartBackground;
