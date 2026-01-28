#!/usr/bin/env python3
"""
Détecteur de signes LSQ avec MediaPipe Hands
"""

import cv2
import mediapipe as mp
import numpy as np
from pathlib import Path

# MediaPipe setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Les 10 signes à reconnaître
SIGNS = [
    'bonjour', 'merci', 'sil-te-plait', 'au-revoir', 'oui',
    'non', 'je-taime', 'maman', 'papa', 'bravo'
]


class SignDetector:
    """Détecte les signes LSQ via webcam"""
    
    def __init__(self, model_path: str = None):
        self.hands = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.model = None
        if model_path and Path(model_path).exists():
            self._load_model(model_path)
    
    def _load_model(self, path: str):
        """Charge le modèle de classification"""
        # TODO: Implémenter le chargement TensorFlow/sklearn
        pass
    
    def extract_landmarks(self, frame) -> np.ndarray:
        """Extrait les landmarks des mains"""
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb)
        
        if not results.multi_hand_landmarks:
            return None
        
        landmarks = []
        for hand_landmarks in results.multi_hand_landmarks:
            for lm in hand_landmarks.landmark:
                landmarks.extend([lm.x, lm.y, lm.z])
        
        return np.array(landmarks)
    
    def predict(self, landmarks: np.ndarray) -> tuple:
        """Prédit le signe à partir des landmarks"""
        if self.model is None or landmarks is None:
            return None, 0.0
        
        # TODO: Implémenter la prédiction
        return None, 0.0
    
    def draw_landmarks(self, frame, results):
        """Dessine les landmarks sur le frame"""
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS
                )
        return frame


def main():
    """Boucle principale de détection"""
    detector = SignDetector()
    cap = cv2.VideoCapture(0)
    
    print("🤟 Signe avec moi - Détecteur LSQ")
    print("Appuie sur 'q' pour quitter")
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Miroir pour une meilleure expérience
        frame = cv2.flip(frame, 1)
        
        # Détection
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = detector.hands.process(rgb)
        
        # Affichage
        frame = detector.draw_landmarks(frame, results)
        
        if results.multi_hand_landmarks:
            cv2.putText(frame, "Main detectee!", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        cv2.imshow('Signe avec moi', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()
