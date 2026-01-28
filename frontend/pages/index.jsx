import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { SIGNS } from '../data/signs';

// Fonction pour lire le texte à voix haute
function speak(text) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    // Annuler toute lecture en cours
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-CA'; // Français canadien
    utterance.rate = 0.8; // Un peu plus lent pour les enfants
    utterance.pitch = 1.1; // Voix légèrement plus aiguë
    
    // Trouver une voix française si disponible
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith('fr'));
    if (frenchVoice) utterance.voice = frenchVoice;
    
    window.speechSynthesis.speak(utterance);
  }
}

// Composant étoiles flottantes
function FloatingStars() {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
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

// Composant Webcam
function WebcamView({ onReady }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        onReady?.(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Impossible d\'accéder à la caméra');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="webcam-container">
      <div className="webcam-header">
        <span>📷 Ta caméra</span>
        {!isActive ? (
          <button onClick={startCamera} className="cam-btn start">
            ▶️ Activer
          </button>
        ) : (
          <button onClick={stopCamera} className="cam-btn stop">
            ⏹️ Arrêter
          </button>
        )}
      </div>
      
      <div className="webcam-view">
        {error ? (
          <div className="webcam-error">
            <span>😕</span>
            <p>{error}</p>
          </div>
        ) : !isActive ? (
          <div className="webcam-placeholder">
            <span>🎥</span>
            <p>Clique sur "Activer" pour te voir!</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            style={{ transform: 'scaleX(-1)' }}
          />
        )}
      </div>
      
      {isActive && (
        <div className="webcam-status">
          <span className="status-dot"></span>
          Montre le signe! 👋
        </div>
      )}
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

  // Dire "Bravo!" quand on célèbre
  useEffect(() => {
    if (celebrating) {
      speak('Bravo! Super!');
    }
  }, [celebrating]);
  
  return (
    <div className={`mascot ${celebrating ? 'celebrating' : 'bounce'}`}>
      <div className="mascot-emoji">{mascot}</div>
      <div className="speech-bubble">
        {celebrating ? '🎉 BRAVO! 🎉' : 'Regarde et imite!'}
      </div>
    </div>
  );
}

// Carte du signe avec vidéo YouTube
function SignCard({ sign }) {
  // Lire le mot quand le signe change
  useEffect(() => {
    // Petit délai pour que ce soit plus naturel
    const timer = setTimeout(() => {
      speak(sign.word);
    }, 500);
    return () => clearTimeout(timer);
  }, [sign.word]);

  return (
    <div className="sign-card">
      <div className="sign-header">
        <span className="sign-emoji-big">{sign.emoji}</span>
        <h2 className="sign-word">{sign.word}</h2>
        <button 
          className="speak-btn" 
          onClick={() => speak(sign.word)}
          title="Écouter"
        >
          🔊
        </button>
      </div>
      <p className="sign-desc">{sign.description}</p>
      
      {sign.youtubeId ? (
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${sign.youtubeId}?start=${sign.timestamp || 0}&autoplay=1&mute=1&loop=1&playlist=${sign.youtubeId}&rel=0&modestbranding=1`}
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

// Barre d'étoiles
function StarsBar({ count, max }) {
  return (
    <div className="stars-bar">
      {[...Array(max)].map((_, i) => (
        <span key={i} className={`star-slot ${i < count ? 'earned' : ''}`}>
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
      <button onClick={onPrev} disabled={!canPrev} className="nav-btn prev">
        ◀️ Avant
      </button>
      <button onClick={onNext} disabled={!canNext} className="nav-btn next">
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
  const [cameraReady, setCameraReady] = useState(false);

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

        <Mascot celebrating={celebrating} />

        <div className="game-area">
          <SignCard sign={currentSign} />
          <WebcamView onReady={setCameraReady} />
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
        
        html, body {
          font-family: 'Comic Sans MS', 'Chalkboard', cursive, sans-serif;
          background: linear-gradient(180deg, #a8e6cf 0%, #88d8b0 50%, #7fcdbb 100%);
          height: 100vh;
          overflow: hidden;
        }
        
        .game {
          max-width: 1400px;
          margin: 0 auto;
          padding: 10px 20px;
          height: 100vh;
          display: flex;
          flex-direction: column;
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
        
        .header { text-align: center; margin-bottom: 5px; }
        .header h1 {
          font-size: 2rem;
          color: #2d3436;
          text-shadow: 2px 2px 0 #fff;
          margin-bottom: 5px;
        }
        
        .stars-bar { display: flex; justify-content: center; gap: 2px; font-size: 1.2rem; }
        .star-slot.earned { animation: pop 0.5s ease; }
        .star-slot:not(.earned) { opacity: 0.3; }
        @keyframes pop {
          50% { transform: scale(1.5); }
        }
        
        .mascot { text-align: center; margin-bottom: 5px; display: flex; align-items: center; justify-content: center; gap: 15px; }
        .mascot-emoji { font-size: 3.5rem; }
        .mascot.bounce .mascot-emoji { animation: bounce 1s ease infinite; }
        .mascot.celebrating .mascot-emoji { animation: spin 0.5s ease; }
        @keyframes bounce {
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg); }
        }
        .speech-bubble {
          display: inline-block;
          background: white;
          border-radius: 15px;
          padding: 8px 15px;
          font-size: 1rem;
          font-weight: bold;
          color: #2d3436;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        /* Zone de jeu côte à côte */
        .game-area {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          flex: 1;
          min-height: 0;
        }
        @media (max-width: 800px) {
          .game-area {
            grid-template-columns: 1fr;
          }
        }
        
        .sign-card {
          background: white;
          border-radius: 20px;
          padding: 15px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sign-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
        }
        .sign-emoji-big { font-size: 2.5rem; }
        .sign-word { font-size: 1.5rem; color: #e17055; flex: 1; }
        .speak-btn {
          background: #74b9ff;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 1.3rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .speak-btn:hover { transform: scale(1.1); }
        .speak-btn:active { transform: scale(0.95); }
        .sign-desc { font-size: 0.9rem; color: #636e72; margin-bottom: 10px; }
        
        .video-container {
          flex: 1;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          min-height: 0;
        }
        .video-container iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        
        /* Webcam */
        .webcam-container {
          background: white;
          border-radius: 20px;
          padding: 15px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .webcam-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 1.1rem;
          font-weight: bold;
        }
        .cam-btn {
          font-family: inherit;
          font-size: 0.9rem;
          padding: 6px 12px;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          font-weight: bold;
        }
        .cam-btn.start { background: #00b894; color: white; }
        .cam-btn.stop { background: #d63031; color: white; }
        .cam-btn:hover { transform: scale(1.05); }
        
        .webcam-view {
          background: #2d3436;
          border-radius: 12px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          min-height: 0;
        }
        .webcam-view video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }
        .webcam-placeholder, .webcam-error {
          color: white;
          text-align: center;
          padding: 15px;
        }
        .webcam-placeholder span, .webcam-error span {
          font-size: 3rem;
          display: block;
          margin-bottom: 8px;
        }
        .webcam-status {
          margin-top: 8px;
          text-align: center;
          font-weight: bold;
          color: #00b894;
          font-size: 0.9rem;
        }
        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #00b894;
          border-radius: 50%;
          margin-right: 6px;
          animation: pulse 1s ease infinite;
        }
        @keyframes pulse {
          50% { opacity: 0.5; }
        }
        
        .progress-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0;
        }
        .progress-bar-container {
          flex: 1;
          height: 15px;
          background: rgba(255,255,255,0.5);
          border-radius: 8px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb);
          border-radius: 8px;
          transition: width 0.5s;
        }
        .progress-text { font-size: 1rem; font-weight: bold; }
        
        .nav-buttons { display: flex; justify-content: center; gap: 15px; padding-bottom: 5px; }
        .nav-btn {
          font-family: inherit;
          font-size: 1.1rem;
          font-weight: bold;
          padding: 10px 25px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: transform 0.2s;
        }
        .nav-btn.prev { background: #74b9ff; color: white; }
        .nav-btn.next { background: #ff6b6b; color: white; }
        .nav-btn:hover:not(:disabled) { transform: scale(1.05); }
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
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </>
  );
}
