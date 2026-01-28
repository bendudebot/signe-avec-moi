import { useEffect, useRef, useState } from 'react';

/**
 * Composant de détection via webcam avec MediaPipe
 * @param {Object} props
 * @param {function} props.onSignDetected - Callback quand un signe est reconnu
 * @param {string} props.expectedSign - Le signe attendu
 */
export function WebcamDetector({ onSignDetected, expectedSign }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [handDetected, setHandDetected] = useState(false);

  useEffect(() => {
    let hands = null;
    let camera = null;

    async function initMediaPipe() {
      // Dynamic import pour éviter SSR issues
      const { Hands } = await import('@mediapipe/hands');
      const { Camera } = await import('@mediapipe/camera_utils');

      hands = new Hands({
        locateFile: (file) => 
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
      });

      hands.onResults(handleResults);

      if (videoRef.current) {
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current });
          },
          width: 640,
          height: 480
        });
        camera.start();
        setIsReady(true);
      }
    }

    function handleResults(results) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks?.length > 0) {
        setHandDetected(true);
        
        // Dessiner les landmarks
        results.multiHandLandmarks.forEach(landmarks => {
          drawHand(ctx, landmarks);
        });

        // TODO: Classifier le geste
        // const detectedSign = classifyGesture(results.multiHandLandmarks);
        // if (detectedSign === expectedSign) {
        //   onSignDetected(detectedSign);
        // }
      } else {
        setHandDetected(false);
      }
    }

    function drawHand(ctx, landmarks) {
      ctx.fillStyle = '#00FF00';
      landmarks.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x * 640, point.y * 480, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    initMediaPipe();

    return () => {
      hands?.close();
    };
  }, [expectedSign, onSignDetected]);

  return (
    <div className="webcam-container" data-testid="webcam-detector">
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        playsInline
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="webcam-canvas"
      />
      <div className="webcam-status">
        {!isReady && <span>📷 Chargement caméra...</span>}
        {isReady && !handDetected && <span>👋 Montre tes mains!</span>}
        {isReady && handDetected && <span>✨ Je te vois!</span>}
      </div>
    </div>
  );
}

export default WebcamDetector;
