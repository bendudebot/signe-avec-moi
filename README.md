# 🤟 Signe avec moi

> Jeu interactif pour apprendre la Langue des Signes Québécoise (LSQ) — conçu pour les enfants de 4-5 ans

![LSQ](https://img.shields.io/badge/Langue-LSQ-blue)
![Age](https://img.shields.io/badge/Âge-4%2B-green)
![Status](https://img.shields.io/badge/Status-En%20développement-orange)

## 🎯 Concept

Un personnage animé montre un signe LSQ, l'enfant le reproduit devant la webcam, et le jeu valide avec des confettis et des étoiles! 🎉

## 🖐️ Les 10 premiers mots

| # | Mot | Difficulté |
|---|-----|------------|
| 1 | Bonjour | ⭐ |
| 2 | Merci | ⭐ |
| 3 | S'il te plaît | ⭐⭐ |
| 4 | Au revoir | ⭐ |
| 5 | Oui | ⭐ |
| 6 | Non | ⭐ |
| 7 | Je t'aime | ⭐ |
| 8 | Maman | ⭐ |
| 9 | Papa | ⭐ |
| 10 | Bravo | ⭐ |

## 🏗️ Architecture

```
signe-avec-moi/
├── frontend/          # Interface React pour TV
│   ├── components/    # Personnage, confettis, étoiles
│   └── pages/         # Écrans du jeu
├── detector/          # Détection des signes
│   ├── mediapipe/     # Hand tracking
│   └── classifier/    # Reconnaissance des gestes
├── assets/
│   ├── images/        # Illustrations des signes
│   └── sounds/        # "Bravo!", applaudissements
└── dataset/           # Vidéos d'entraînement maison
```

## 🛠️ Stack technique

- **Frontend**: React + Framer Motion (animations)
- **Détection**: MediaPipe Hands (Google)
- **Classifier**: TensorFlow.js ou Python (à déterminer)
- **Webcam**: USB standard

## 🚀 Démarrage

```bash
# Installation
npm install

# Lancer le frontend
npm run dev

# Lancer le détecteur (Python)
cd detector && python main.py
```

## 📹 Créer le dataset

Pour entraîner le modèle, filmer chaque signe 10-20 fois:

```bash
python detector/record.py --sign "bonjour" --count 20
```

## 🎨 Interface enfant

- 🌈 Couleurs vives et contrastées
- ⭐ Système d'étoiles à collecter
- 🎊 Confettis et animations de récompense
- 🔊 Feedback audio positif
- 👾 Personnage guide attachant

## 📄 License

MIT © 2026

---

*Fait avec ❤️ pour apprendre la LSQ en s'amusant*
