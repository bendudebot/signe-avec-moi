import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * Affiche les étoiles collectées
 */
export function StarCounter({ count, max = 10 }) {
  return (
    <div className="star-counter" data-testid="star-counter">
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: i < count ? 1 : 0.5 }}
          className={`star ${i < count ? 'earned' : 'empty'}`}
        >
          {i < count ? '⭐' : '☆'}
        </motion.span>
      ))}
    </div>
  );
}

/**
 * Animation de célébration quand un signe est réussi
 */
export function Celebration({ show, onComplete }) {
  useEffect(() => {
    if (show) {
      // Confettis!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
      });

      // Son de célébration
      const audio = new Audio('/sounds/bravo.mp3');
      audio.play().catch(() => {}); // Ignore si autoplay bloqué

      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="celebration-overlay"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          data-testid="celebration"
        >
          <motion.div
            className="celebration-text"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            🎉 BRAVO! 🎉
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Barre de progression dans le niveau
 */
export function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-bar" data-testid="progress-bar">
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="progress-text">
        {current} / {total}
      </span>
    </div>
  );
}

export default { StarCounter, Celebration, ProgressBar };
