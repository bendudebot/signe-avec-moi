import { useState, useEffect } from 'react';
import Head from 'next/head';
import { SIGNS } from '../data/signs';

// Composant étoiles flottantes (rendu côté client seulement)
function FloatingStars() {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Générer les étoiles côté client seulement
    const emojis = ['⭐', '🌟', '✨', '💫'];
    const generated = [...Array(15)].map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`
    }));
    setStars(generated);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="floating-stars">
      {stars.map((star) => (
        <div 
          key={star.id} 
          className="star" 
          style={{
            left: star.left,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        >
          {star.emoji}
        </div>
      ))}
    </div>
  );
}

// Personnage animé
function Mascot({ celebrating }) {
  const [mascot, setMascot] = useState('🦊');
  
  useEffect(() => {
    const mascots = ['🦊', '🐰', '🐻', '🦁', '🐨'];
    setMascot(mascots[Math.floor(Math.random() * mascots.length)]);
  }, []);
  
  return (
    <div className={`mascot ${celebrating ? 'celebrating' : 'bounce'}`}>
      <div className="mascot-emoji">{mascot}</div>
      <div className="speech-bubble">
        {celebrating ? '🎉 BRAVO! 🎉' : 'Fais comme moi!'}
      </div>
    </div>
  );
}

// Carte du signe avec vidéo YouTube
function SignCard({ sign }) {
  return (
    <div className="sign-card">
      <div className="sign-emoji-big">{sign.emoji}</div>
      <h2 className="sign-word">{sign.word}</h2>
      <p className="sign-desc">{sign.description}</p>
      
      {sign.youtubeId ? (
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${sign.youtubeId}?start=${sign.timestamp || 0}&autoplay=0&rel=0`}
            title={`Signe: ${sign.word}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="video-placeholder">
          <span>🎬</span>
          <p>Vidéo bientôt!</p>
        </div>
      )}
    </div>
  );
}

// Barre d'étoiles collectées
function StarsBar({ count, max }) {
  return (
    <div className="stars-bar">
      {[...Array(max)].map((_, i) => (
        <span 
          key={i} 
          className={`star-slot ${i < count ? 'earned' : ''}`}
        >
          {i < count ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
}

// Boutons de navigation
function NavButtons({ onPrev, onNext, canPrev, canNext }) {
  return (
    <div className="nav-buttons">
      <button 
        onClick={onPrev} 
        disabled={!canPrev}
        className="nav-btn prev"
      >
        ◀️ Avant
      </button>
      <button 
        onClick={onNext}
        disabled={!canNext}
        className="nav-btn next"
      >
        Suivant ▶️
      </button>
    </div>
  );
}

// Confettis
function Confetti({ show }) {
  const [pieces, setPieces] = useState([]);
  
  useEffect(() => {
    if (show) {
      const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'];
      const generated = [...Array(50)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${Math.random() * 0.5}s`
      }));
      setPieces(generated);
    } else {
      setPieces([]);
    }
  }, [show]);

  if (!show || pieces.length === 0) return null;
  
  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: piece.left,
            backgroundColor: piece.color,
            animationDelay: piece.delay
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const currentSign = SIGNS[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < SIGNS.length - 1) {
      setCurrentIndex(i => i + 1);
      setStars(s => Math.min(s + 1, SIGNS.length));
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2000);
    }
  };

  return (
    <>
      <Head>
        <title>🤟 Signe avec moi!</title>
        <meta name="description" content="Apprends la LSQ en jouant!" />
      </Head>

      <main className="game">
        <FloatingStars />
        <Confetti show={celebrating} />
        
        <header className="header">
          <h1>🤟 Signe avec moi!</h1>
          <StarsBar count={stars} max={SIGNS.length} />
        </header>

        <div className="content">
          <Mascot celebrating={celebrating} />
          <SignCard sign={currentSign} />
        </div>

        <div className="progress-section">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${((currentIndex + 1) / SIGNS.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">{currentIndex + 1} / {SIGNS.length}</span>
        </div>

        <NavButtons 
          onPrev={handlePrev}
          onNext={handleNext}
          canPrev={currentIndex > 0}
          canNext={currentIndex < SIGNS.length - 1}
        />
      </main>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'Comic Sans MS', 'Chalkboard', cursive, sans-serif;
          background: linear-gradient(180deg, #a8e6cf 0%, #88d8b0 50%, #7fcdbb 100%);
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        .game {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          position: relative;
        }
        
        .floating-stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .floating-stars .star {
          position: absolute;
          font-size: 2rem;
          animation: float 5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 {
          font-size: 3rem;
          color: #2d3436;
          text-shadow: 3px 3px 0 #fff, -1px -1px 0 #fff;
          margin-bottom: 15px;
        }
        
        .stars-bar { display: flex; justify-content: center; gap: 5px; font-size: 2rem; }
        .star-slot { transition: transform 0.3s; }
        .star-slot.earned { animation: pop 0.5s ease; }
        .star-slot:not(.earned) { opacity: 0.3; }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }
        
        .mascot { text-align: center; }
        .mascot-emoji { font-size: 8rem; }
        .mascot.bounce .mascot-emoji { animation: bounce 1s ease infinite; }
        .mascot.celebrating .mascot-emoji { animation: spin 0.5s ease; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .speech-bubble {
          background: white;
          border-radius: 20px;
          padding: 15px 25px;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d3436;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          position: relative;
          margin-top: 10px;
        }
        .speech-bubble::before {
          content: '';
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          border: 10px solid transparent;
          border-bottom-color: white;
        }
        
        .sign-card {
          background: white;
          border-radius: 30px;
          padding: 30px 40px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          max-width: 400px;
          width: 100%;
        }
        .sign-card.wiggle { animation: wiggle 3s ease-in-out infinite; }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        .sign-emoji-big { font-size: 6rem; margin-bottom: 10px; }
        .sign-word { font-size: 3rem; color: #e17055; margin-bottom: 10px; }
        .sign-desc { font-size: 1.2rem; color: #636e72; margin-bottom: 20px; }
        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 */
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 15px;
        }
        .video-placeholder {
          background: #dfe6e9;
          border-radius: 15px;
          padding: 20px;
          color: #636e72;
        }
        .video-placeholder span { font-size: 3rem; }
        
        .progress-section {
          margin: 30px 0;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .progress-bar-container {
          flex: 1;
          height: 25px;
          background: rgba(255,255,255,0.5);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb);
          border-radius: 15px;
          transition: width 0.5s ease;
        }
        .progress-text { font-size: 1.5rem; font-weight: bold; color: #2d3436; }
        
        .nav-buttons { display: flex; justify-content: center; gap: 20px; }
        .nav-btn {
          font-family: inherit;
          font-size: 1.5rem;
          font-weight: bold;
          padding: 15px 40px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .nav-btn.prev { background: #74b9ff; color: white; }
        .nav-btn.next { background: #ff6b6b; color: white; }
        .nav-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .confetti-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1000;
        }
        .confetti-piece {
          position: absolute;
          width: 15px;
          height: 15px;
          top: -20px;
          animation: confetti-fall 3s ease-out forwards;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </>
  );
}
