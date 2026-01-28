import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { SIGNS } from '../data/signs';

// Fonction pour lire le texte à voix haute
function speak(text) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-CA';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith('fr'));
    if (frenchVoice) utterance.voice = frenchVoice;
    window.speechSynthesis.speak(utterance);
  }
}

// Écran d'introduction
function IntroScreen({ onStart }) {
  useEffect(() => {
    // Lire l'introduction
    setTimeout(() => {
      speak("Bonjour! On va apprendre les signes ensemble! Regarde la vidéo, puis montre le signe avec tes mains. Quand tu réussis, tu gagnes une étoile! C'est parti?");
    }, 500);
  }, []);

  return (
    <div className="intro-screen">
      <div className="intro-content">
        <div className="intro-mascot">🦊</div>
        <h1>🤟 Signe avec moi!</h1>
        
        <div className="intro-steps">
          <div className="intro-step">
            <span className="step-icon">👀</span>
            <p>Regarde la vidéo</p>
          </div>
          <div className="intro-step">
            <span className="step-icon">✋</span>
            <p>Fais le signe avec tes mains</p>
          </div>
          <div className="intro-step">
            <span className="step-icon">⭐</span>
            <p>Gagne des étoiles!</p>
          </div>
        </div>

        <button className="start-btn" onClick={onStart}>
          🎮 C'est parti!
        </button>
      </div>
    </div>
  );
}

// Composant étoiles flottantes
function FloatingStars() {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const emojis = ['⭐', '🌟', '✨', '💫'];
    const generated = [...Array(12)].map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 4}s`
    }));
    setStars(generated);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="floating-stars">
      {stars.map((star) => (
        <div key={star.id} className="star" style={{
          left: star.left,
          animationDelay: star.delay,
          animationDuration: star.duration
        }}>{star.emoji}</div>
      ))}
    </div>
  );
}

// Composant Webcam avec détection automatique
function WebcamView({ onSuccess, disabled, autoStart }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [progress, setProgress] = useState(0);
  const detectionStartRef = useRef(null);

  const DETECTION_DURATION = 3000;

  const startCamera = async () => {
    if (isActive || isLoading) return;
    setIsLoading(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
        initMediaPipe();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Oups! La caméra ne marche pas 😕');
    }
    setIsLoading(false);
  };

  const initMediaPipe = async () => {
    try {
      const { Hands } = await import('@mediapipe/hands');
      
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 0,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      hands.onResults(handleResults);
      handsRef.current = hands;
      
      // Boucle de détection
      detectLoop();
    } catch (err) {
      console.error('MediaPipe error:', err);
    }
  };

  const detectLoop = () => {
    if (videoRef.current && handsRef.current && videoRef.current.readyState >= 2) {
      handsRef.current.send({ image: videoRef.current });
    }
    requestAnimationFrame(detectLoop);
  };

  const handleResults = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Dessiner vidéo miroir
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const hasHands = results.multiHandLandmarks?.length > 0;
    setHandDetected(hasHands);

    if (hasHands && !disabled) {
      // Dessiner les points verts sur les mains
      results.multiHandLandmarks.forEach(landmarks => {
        landmarks.forEach(point => {
          const x = canvas.width - (point.x * canvas.width); // miroir
          const y = point.y * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2 * Math.PI);
          ctx.fillStyle = '#00ff00';
          ctx.fill();
          ctx.strokeStyle = '#009900';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      // Progression
      if (!detectionStartRef.current) {
        detectionStartRef.current = Date.now();
      }
      const elapsed = Date.now() - detectionStartRef.current;
      const prog = Math.min(100, (elapsed / DETECTION_DURATION) * 100);
      setProgress(prog);

      if (elapsed >= DETECTION_DURATION) {
        detectionStartRef.current = null;
        setProgress(0);
        onSuccess?.();
      }
    } else {
      detectionStartRef.current = null;
      setProgress(0);
    }
  };

  // Auto-start
  useEffect(() => {
    if (autoStart && !isActive && !isLoading) {
      startCamera();
    }
  }, [autoStart]);

  // Reset quand disabled change
  useEffect(() => {
    detectionStartRef.current = null;
    setProgress(0);
  }, [disabled]);

  return (
    <div className="webcam-container">
      <div className="webcam-header">
        <span>{handDetected ? '✋ Super!' : '📷 Caméra'}</span>
      </div>
      
      <div className="webcam-view">
        {error ? (
          <div className="webcam-error">
            <span>😕</span>
            <p>{error}</p>
          </div>
        ) : isLoading ? (
          <div className="webcam-loading">
            <span>⏳</span>
            <p>Chargement...</p>
          </div>
        ) : (
          <>
            <video ref={videoRef} playsInline muted style={{ display: 'none' }} />
            <canvas ref={canvasRef} className="webcam-canvas" />
          </>
        )}
      </div>
      
      {isActive && (
        <div className="detection-progress">
          <div className="detection-bar">
            <div className="detection-fill" style={{ width: `${progress}%` }} />
          </div>
          <span>{progress > 0 ? '👏 Continue!' : '👋 Montre tes mains!'}</span>
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

  useEffect(() => {
    if (celebrating) speak('Bravo! Super!');
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

// Carte du signe
function SignCard({ sign }) {
  useEffect(() => {
    setTimeout(() => speak(sign.word), 500);
  }, [sign.word]);

  return (
    <div className="sign-card">
      <div className="sign-header">
        <span className="sign-emoji-big">{sign.emoji}</span>
        <h2 className="sign-word">{sign.word}</h2>
        <button className="speak-btn" onClick={() => speak(sign.word)}>🔊</button>
      </div>
      <p className="sign-desc">{sign.description}</p>
      
      {sign.youtubeId && (
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${sign.youtubeId}?start=${sign.timestamp || 0}&autoplay=1&mute=1&loop=1&playlist=${sign.youtubeId}&rel=0&modestbranding=1`}
            title={`Signe: ${sign.word}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
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

// Confettis
function Confetti({ show }) {
  const [pieces, setPieces] = useState([]);
  
  useEffect(() => {
    if (show) {
      const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181'];
      setPieces([...Array(50)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${Math.random() * 0.5}s`
      })));
    } else {
      setPieces([]);
    }
  }, [show]);

  if (!show) return null;
  
  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{
          left: p.left, backgroundColor: p.color, animationDelay: p.delay
        }} />
      ))}
    </div>
  );
}

// Navigation
function NavButtons({ onPrev, onNext, canPrev, canNext }) {
  return (
    <div className="nav-buttons">
      <button onClick={onPrev} disabled={!canPrev} className="nav-btn prev">◀️</button>
      <button onClick={onNext} disabled={!canNext} className="nav-btn next">▶️</button>
    </div>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const currentSign = SIGNS[currentIndex];

  const handleSuccess = () => {
    setStars(s => Math.min(s + 1, SIGNS.length));
    setCelebrating(true);
    setTimeout(() => {
      setCelebrating(false);
      if (currentIndex < SIGNS.length - 1) {
        setCurrentIndex(i => i + 1);
      }
    }, 2500);
  };

  if (!started) {
    return (
      <>
        <Head><title>🤟 Signe avec moi!</title></Head>
        <IntroScreen onStart={() => setStarted(true)} />
        <style jsx global>{styles}</style>
      </>
    );
  }

  return (
    <>
      <Head><title>🤟 Signe avec moi!</title></Head>
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
          <WebcamView onSuccess={handleSuccess} disabled={celebrating} autoStart={true} />
        </div>

        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / SIGNS.length) * 100}%` }} />
          </div>
          <span className="progress-text">{currentIndex + 1} / {SIGNS.length}</span>
        </div>

        <NavButtons 
          onPrev={() => setCurrentIndex(i => Math.max(0, i - 1))}
          onNext={() => setCurrentIndex(i => Math.min(SIGNS.length - 1, i + 1))}
          canPrev={currentIndex > 0}
          canNext={currentIndex < SIGNS.length - 1}
        />
      </main>
      <style jsx global>{styles}</style>
    </>
  );
}

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  html, body {
    font-family: 'Comic Sans MS', 'Chalkboard', cursive, sans-serif;
    background: linear-gradient(180deg, #a8e6cf 0%, #88d8b0 50%, #7fcdbb 100%);
    height: 100vh;
    overflow: hidden;
  }
  
  /* Intro Screen */
  .intro-screen {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .intro-content {
    background: white;
    border-radius: 30px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    max-width: 500px;
  }
  .intro-mascot {
    font-size: 6rem;
    animation: bounce 1s ease infinite;
  }
  .intro-content h1 {
    font-size: 2.5rem;
    color: #2d3436;
    margin: 15px 0;
  }
  .intro-steps {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 25px 0;
  }
  .intro-step {
    text-align: center;
  }
  .step-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 8px;
  }
  .intro-step p {
    font-size: 1rem;
    color: #636e72;
  }
  .start-btn {
    font-family: inherit;
    font-size: 1.8rem;
    font-weight: bold;
    padding: 15px 50px;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(238,90,36,0.4);
    transition: transform 0.2s;
  }
  .start-btn:hover { transform: scale(1.05); }
  
  /* Game */
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
    animation: float 6s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(100vh); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-50px); opacity: 0; }
  }
  @keyframes bounce {
    50% { transform: translateY(-15px); }
  }
  
  .header { text-align: center; margin-bottom: 5px; }
  .header h1 {
    font-size: 1.8rem;
    color: #2d3436;
    text-shadow: 2px 2px 0 #fff;
  }
  
  .stars-bar { display: flex; justify-content: center; gap: 2px; font-size: 1.2rem; }
  .star-slot.earned { animation: pop 0.5s ease; }
  .star-slot:not(.earned) { opacity: 0.3; }
  @keyframes pop { 50% { transform: scale(1.5); } }
  
  .mascot { text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 5px; }
  .mascot-emoji { font-size: 3rem; }
  .mascot.bounce .mascot-emoji { animation: bounce 1s ease infinite; }
  .mascot.celebrating .mascot-emoji { animation: spin 0.5s ease; }
  @keyframes spin { 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg); } }
  .speech-bubble {
    background: white;
    border-radius: 15px;
    padding: 8px 15px;
    font-size: 1rem;
    font-weight: bold;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  }
  
  .game-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    flex: 1;
    min-height: 0;
  }
  
  .sign-card {
    background: white;
    border-radius: 20px;
    padding: 12px;
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
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .speak-btn:hover { transform: scale(1.1); }
  .sign-desc { font-size: 0.85rem; color: #636e72; margin-bottom: 8px; }
  
  .video-container {
    flex: 1;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    min-height: 0;
    background: #000;
  }
  .video-container iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  
  .webcam-container {
    background: white;
    border-radius: 20px;
    padding: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .webcam-header {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 8px;
    text-align: center;
  }
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
  .webcam-canvas {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .webcam-loading, .webcam-error {
    color: white;
    text-align: center;
  }
  .webcam-loading span, .webcam-error span {
    font-size: 3rem;
    display: block;
    margin-bottom: 10px;
  }
  .detection-progress {
    margin-top: 8px;
    text-align: center;
    font-weight: bold;
    font-size: 0.9rem;
  }
  .detection-bar {
    height: 14px;
    background: #dfe6e9;
    border-radius: 7px;
    overflow: hidden;
    margin-bottom: 5px;
  }
  .detection-fill {
    height: 100%;
    background: linear-gradient(90deg, #00b894, #00cec9, #0984e3);
    border-radius: 7px;
    transition: width 0.1s;
  }
  
  .progress-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 8px 0;
  }
  .progress-bar-container {
    flex: 1;
    height: 12px;
    background: rgba(255,255,255,0.5);
    border-radius: 6px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb);
    border-radius: 6px;
  }
  .progress-text { font-size: 1rem; font-weight: bold; }
  
  .nav-buttons { display: flex; justify-content: center; gap: 15px; }
  .nav-btn {
    font-size: 1.5rem;
    padding: 10px 30px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .nav-btn.prev { background: #74b9ff; color: white; }
  .nav-btn.next { background: #ff6b6b; color: white; }
  .nav-btn:disabled { opacity: 0.3; }
  
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
`;
