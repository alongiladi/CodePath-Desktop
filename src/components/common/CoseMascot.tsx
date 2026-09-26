import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export type MascotMood =
  | 'happy'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'proud'
  | 'confused'
  | 'jumping';

interface CoseMascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  className?: string;
}

/**
 * CosePath's friendly, bouncy mascot character "Codi".
 * Designed with Duolingo-inspired rounded baby-schema proportions,
 * big bright expressive eyes, green body (#58CC02), orange beak (#FF9600),
 * automatic blinking every 4-6s, and emotional reaction states.
 */
export const CoseMascot: React.FC<CoseMascotProps> = ({
  mood = 'happy',
  size = 'md',
  speechBubble,
  className = '',
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Automatic blink loop every 4.5s
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  const sizeDimensions = {
    sm: { w: 48, h: 48 },
    md: { w: 72, h: 72 },
    lg: { w: 100, h: 100 },
    xl: { w: 140, h: 140 },
  }[size];

  // Motion variants based on mood
  const getMotionAnimation = () => {
    switch (mood) {
      case 'celebrating':
      case 'jumping':
        return {
          y: [0, -12, 0, -6, 0],
          rotate: [0, -4, 4, -2, 0],
          transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1 },
        };
      case 'thinking':
        return {
          rotate: [0, -5, -5, 0],
          transition: { duration: 2, repeat: Infinity },
        };
      case 'encouraging':
        return {
          scale: [1, 1.04, 1],
          transition: { duration: 1.6, repeat: Infinity },
        };
      default:
        return {
          y: [0, -3, 0],
          transition: { duration: 2.5, repeat: Infinity },
        };
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <motion.div
        animate={getMotionAnimation()}
        style={{ width: sizeDimensions.w, height: sizeDimensions.h }}
        className="relative shrink-0 select-none cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mascot Body (Feather Green #58CC02) */}
          <path
            d="M50 10 C 24 10, 16 32, 16 62 C 16 84, 30 92, 50 92 C 70 92, 84 84, 84 62 C 84 32, 76 10, 50 10 Z"
            fill="#58CC02"
          />
          {/* Body Bottom Shadow/Border (#58A700) */}
          <path
            d="M20 72 C 26 86, 36 92, 50 92 C 64 92, 74 86, 80 72 C 70 82, 58 86, 50 86 C 42 86, 30 82, 20 72 Z"
            fill="#58A700"
          />

          {/* Cheerful Belly (#89E219) */}
          <path
            d="M34 54 C 34 76, 40 84, 50 84 C 60 84, 66 76, 66 54 C 66 44, 60 40, 50 40 C 40 40, 34 44, 34 54 Z"
            fill="#89E219"
          />

          {/* Left Ear / Feather Tuft */}
          <path d="M26 18 C 18 10, 28 6, 34 14 Z" fill="#58CC02" />
          {/* Right Ear / Feather Tuft */}
          <path d="M74 18 C 82 10, 72 6, 66 14 Z" fill="#58CC02" />

          {/* Left Eye */}
          <g>
            {/* White Sclera */}
            <ellipse cx="36" cy="38" rx="11" ry="13" fill="#FFFFFF" />
            {isBlinking ? (
              // Blink Line
              <path d="M27 38 Q 36 43 45 38" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" />
            ) : mood === 'celebrating' || mood === 'proud' ? (
              // Happy Arc Eye ^
              <path d="M27 38 Q 36 30 45 38" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" />
            ) : mood === 'thinking' ? (
              // Looking up
              <>
                <ellipse cx="36" cy="33" rx="6" ry="7" fill="#3C3C3C" />
                <circle cx="38" cy="31" r="2.5" fill="#FFFFFF" />
              </>
            ) : (
              // Normal Large Pupil
              <>
                <ellipse cx="37" cy="38" rx="6.5" ry="7.5" fill="#3C3C3C" />
                <circle cx="39" cy="35" r="2.5" fill="#FFFFFF" />
                <circle cx="34" cy="41" r="1.2" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* Right Eye */}
          <g>
            {/* White Sclera */}
            <ellipse cx="64" cy="38" rx="11" ry="13" fill="#FFFFFF" />
            {isBlinking ? (
              // Blink Line
              <path d="M55 38 Q 64 43 73 38" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" />
            ) : mood === 'celebrating' || mood === 'proud' ? (
              // Happy Arc Eye ^
              <path d="M55 38 Q 64 30 73 38" stroke="#3C3C3C" strokeWidth="3.5" strokeLinecap="round" />
            ) : mood === 'thinking' ? (
              // Looking up
              <>
                <ellipse cx="64" cy="33" rx="6" ry="7" fill="#3C3C3C" />
                <circle cx="66" cy="31" r="2.5" fill="#FFFFFF" />
              </>
            ) : (
              // Normal Large Pupil
              <>
                <ellipse cx="63" cy="38" rx="6.5" ry="7.5" fill="#3C3C3C" />
                <circle cx="65" cy="35" r="2.5" fill="#FFFFFF" />
                <circle cx="60" cy="41" r="1.2" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* Cute Orange Beak (#FF9600) */}
          <path
            d="M44 44 C 44 44, 50 56, 50 56 C 50 56, 56 44, 56 44 C 53 43, 47 43, 44 44 Z"
            fill="#FF9600"
          />
          <path
            d="M46 51 L 50 56 L 54 51 Z"
            fill="#CC7A00"
          />

          {/* Rosy Cheeks (#FF86D0) */}
          <ellipse cx="25" cy="48" rx="5" ry="3" fill="#FF86D0" opacity="0.75" />
          <ellipse cx="75" cy="48" rx="5" ry="3" fill="#FF86D0" opacity="0.75" />

          {/* Feet (#FF9600) */}
          <ellipse cx="38" cy="93" rx="7" ry="3.5" fill="#FF9600" />
          <ellipse cx="62" cy="93" rx="7" ry="3.5" fill="#FF9600" />
        </svg>
      </motion.div>

      {/* Optional Speech Bubble */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -6 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="relative bg-white border-2 border-[#E5E5E5] border-b-4 rounded-[16px] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#3C3C3C] shadow-xs max-w-xs"
        >
          {speechBubble}
          {/* Speech bubble pointer arrow */}
          <div
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#E5E5E5] border-b-[6px] border-b-transparent"
          />
          <div
            className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-r-[7px] border-r-white border-b-[5px] border-b-transparent"
          />
        </motion.div>
      )}
    </div>
  );
};
