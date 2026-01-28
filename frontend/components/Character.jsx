import { motion } from 'framer-motion';

/**
 * Personnage animé qui guide l'enfant
 * @param {Object} props
 * @param {string} props.mood - 'happy' | 'waiting' | 'celebrating'
 * @param {string} props.currentSign - Le signe à montrer
 */
export function Character({ mood = 'happy', currentSign }) {
  const animations = {
    happy: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 2 }
    },
    waiting: {
      rotate: [-5, 5, -5],
      transition: { repeat: Infinity, duration: 1.5 }
    },
    celebrating: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="character"
      animate={animations[mood]}
      data-testid="character"
    >
      <div className="character-body">
        {/* Placeholder - sera remplacé par une vraie illustration */}
        <div className="character-face">
          {mood === 'celebrating' ? '🥳' : '😊'}
        </div>
        <div className="character-hands">
          {currentSign && (
            <span className="sign-indicator">
              Montre: {currentSign}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Character;
