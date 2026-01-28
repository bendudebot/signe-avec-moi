import { useState, useCallback } from 'react';
import Head from 'next/head';
import Character from '../components/Character';
import { StarCounter, Celebration, ProgressBar } from '../components/Rewards';
import { SIGNS } from '../data/signs';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const currentSign = SIGNS[currentIndex];

  const handleSignDetected = useCallback((sign) => {
    if (sign === currentSign.id) {
      setCelebrating(true);
      setStars(s => s + 1);
    }
  }, [currentSign]);

  const handleCelebrationComplete = useCallback(() => {
    setCelebrating(false);
    if (currentIndex < SIGNS.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  }, [currentIndex]);

  return (
    <>
      <Head>
        <title>🤟 Signe avec moi</title>
        <meta name="description" content="Apprends la LSQ en jouant!" />
      </Head>

      <main className="game-container">
        <header className="game-header">
          <h1>🤟 Signe avec moi!</h1>
          <StarCounter count={stars} max={SIGNS.length} />
        </header>

        <div className="game-content">
          <div className="sign-display">
            <Character 
              mood={celebrating ? 'celebrating' : 'happy'}
              currentSign={currentSign.word}
            />
            <div className="sign-card">
              <span className="sign-emoji">{currentSign.emoji}</span>
              <h2>{currentSign.word}</h2>
              <p>{currentSign.description}</p>
            </div>
          </div>

          <div className="webcam-area">
            <div className="webcam-placeholder">
              📷 Webcam ici
              <p>Montre le signe: <strong>{currentSign.word}</strong></p>
            </div>
          </div>
        </div>

        <ProgressBar current={currentIndex + 1} total={SIGNS.length} />
        
        <Celebration 
          show={celebrating} 
          onComplete={handleCelebrationComplete}
        />
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
        }
        .game-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .game-header h1 {
          font-size: 2.5rem;
        }
        .game-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        .sign-card {
          background: white;
          color: #333;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .sign-emoji {
          font-size: 4rem;
        }
        .sign-card h2 {
          font-size: 2rem;
          margin: 15px 0;
        }
        .webcam-placeholder {
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          border: 3px dashed rgba(255,255,255,0.3);
        }
        .webcam-placeholder p {
          font-size: 1.2rem;
          margin-top: 20px;
        }
        .star-counter {
          font-size: 1.5rem;
        }
        .star-counter .empty {
          opacity: 0.3;
        }
        .progress-bar {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .progress-track {
          flex: 1;
          height: 20px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #4ECDC4;
          border-radius: 10px;
        }
        .celebration-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.5);
          z-index: 100;
        }
        .celebration-text {
          font-size: 5rem;
          background: white;
          color: #333;
          padding: 40px 80px;
          border-radius: 30px;
        }
      `}</style>
    </>
  );
}
