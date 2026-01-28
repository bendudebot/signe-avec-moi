#!/usr/bin/env python3
"""
Script pour enregistrer les signes LSQ et créer le dataset
Usage: python record.py --sign bonjour --count 20
"""

import argparse
import cv2
import os
import time
from pathlib import Path

DATASET_DIR = Path(__file__).parent.parent / 'dataset'


def record_sign(sign_name: str, count: int = 20, delay: float = 2.0):
    """
    Enregistre plusieurs échantillons d'un signe
    
    Args:
        sign_name: Nom du signe (ex: 'bonjour')
        count: Nombre d'échantillons à enregistrer
        delay: Délai entre chaque capture (secondes)
    """
    sign_dir = DATASET_DIR / sign_name
    sign_dir.mkdir(parents=True, exist_ok=True)
    
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    print(f"🎬 Enregistrement du signe: {sign_name}")
    print(f"📁 Dossier: {sign_dir}")
    print(f"🔢 Échantillons: {count}")
    print(f"⏱️  Délai: {delay}s entre chaque capture")
    print()
    print("Appuie sur ESPACE pour capturer, 'q' pour quitter")
    print("-" * 40)
    
    recorded = 0
    
    while recorded < count and cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Miroir
        frame = cv2.flip(frame, 1)
        
        # Instructions à l'écran
        cv2.putText(frame, f"Signe: {sign_name}", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(frame, f"Captures: {recorded}/{count}", (10, 70),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
        cv2.putText(frame, "ESPACE = capturer | Q = quitter", (10, 450),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        
        cv2.imshow('Enregistrement LSQ', frame)
        
        key = cv2.waitKey(1) & 0xFF
        
        if key == ord(' '):  # ESPACE
            timestamp = int(time.time() * 1000)
            filename = sign_dir / f"{sign_name}_{timestamp}.jpg"
            
            # Sauvegarder sans le texte overlay
            clean_frame = cv2.flip(cap.read()[1], 1)
            cv2.imwrite(str(filename), clean_frame)
            
            recorded += 1
            print(f"✅ Capture {recorded}/{count}: {filename.name}")
            
            # Feedback visuel
            cv2.rectangle(frame, (0, 0), (640, 480), (0, 255, 0), 10)
            cv2.imshow('Enregistrement LSQ', frame)
            cv2.waitKey(200)
            
        elif key == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    
    print()
    print(f"🎉 Terminé! {recorded} captures sauvegardées dans {sign_dir}")


def main():
    parser = argparse.ArgumentParser(description='Enregistrer des signes LSQ')
    parser.add_argument('--sign', required=True, help='Nom du signe')
    parser.add_argument('--count', type=int, default=20, help='Nombre de captures')
    parser.add_argument('--delay', type=float, default=2.0, help='Délai entre captures')
    
    args = parser.parse_args()
    record_sign(args.sign, args.count, args.delay)


if __name__ == '__main__':
    main()
