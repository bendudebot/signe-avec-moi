/**
 * Configuration des 10 premiers signes LSQ
 * Vidéos YouTube trouvées pour chaque signe
 */
export const SIGNS = [
  {
    id: 'bonjour',
    word: 'Bonjour',
    emoji: '👋',
    difficulty: 1,
    description: 'Main ouverte qui part du menton vers l\'avant',
    // Vidéo: Salutations et signes de base en LSQ
    videoUrl: 'https://www.youtube.com/embed/Edp58-iP8-0?start=0&end=15',
    youtubeId: 'Edp58-iP8-0',
    timestamp: 0
  },
  {
    id: 'merci',
    word: 'Merci',
    emoji: '🙏',
    difficulty: 1,
    description: 'Main plate qui touche le menton et descend',
    // Vidéo: Mots utiles en LSQ
    videoUrl: 'https://www.youtube.com/embed/tBWqxO2xfjc?start=30&end=45',
    youtubeId: 'tBWqxO2xfjc',
    timestamp: 30
  },
  {
    id: 'sil-te-plait',
    word: 'S\'il te plaît',
    emoji: '🥺',
    difficulty: 2,
    description: 'Main qui frotte la poitrine en cercle',
    videoUrl: 'https://www.youtube.com/embed/tBWqxO2xfjc?start=60&end=75',
    youtubeId: 'tBWqxO2xfjc',
    timestamp: 60
  },
  {
    id: 'au-revoir',
    word: 'Au revoir',
    emoji: '👋',
    difficulty: 1,
    description: 'Main qui fait bye-bye',
    videoUrl: 'https://www.youtube.com/embed/Edp58-iP8-0?start=20&end=35',
    youtubeId: 'Edp58-iP8-0',
    timestamp: 20
  },
  {
    id: 'oui',
    word: 'Oui',
    emoji: '✅',
    difficulty: 1,
    description: 'Poing fermé qui hoche comme une tête',
    videoUrl: 'https://www.youtube.com/embed/tBWqxO2xfjc?start=90&end=105',
    youtubeId: 'tBWqxO2xfjc',
    timestamp: 90
  },
  {
    id: 'non',
    word: 'Non',
    emoji: '❌',
    difficulty: 1,
    description: 'Index et majeur qui se ferment sur le pouce',
    videoUrl: 'https://www.youtube.com/embed/tBWqxO2xfjc?start=105&end=120',
    youtubeId: 'tBWqxO2xfjc',
    timestamp: 105
  },
  {
    id: 'je-taime',
    word: 'Je t\'aime',
    emoji: '❤️',
    difficulty: 1,
    description: 'Pouce, index et auriculaire levés (ILY)',
    // Vidéo: Comptine J'aime papa maman en LSQ
    videoUrl: 'https://www.youtube.com/embed/nbnEplcGOZI?start=30&end=50',
    youtubeId: 'nbnEplcGOZI',
    timestamp: 30
  },
  {
    id: 'maman',
    word: 'Maman',
    emoji: '👩',
    difficulty: 1,
    description: 'Pouce sur le menton',
    // Vidéo: Comptine J'aime papa maman
    videoUrl: 'https://www.youtube.com/embed/nbnEplcGOZI?start=10&end=25',
    youtubeId: 'nbnEplcGOZI',
    timestamp: 10
  },
  {
    id: 'papa',
    word: 'Papa',
    emoji: '👨',
    difficulty: 1,
    description: 'Pouce sur le front',
    // Vidéo: Lundi LSQ - La famille
    videoUrl: 'https://www.youtube.com/embed/9Y-UdGqz4jo',
    youtubeId: '9Y-UdGqz4jo',
    timestamp: 0
  },
  {
    id: 'bravo',
    word: 'Bravo',
    emoji: '👏',
    difficulty: 1,
    description: 'Applaudissements',
    videoUrl: 'https://www.youtube.com/embed/slOzqp4TyoM?start=60&end=75',
    youtubeId: 'slOzqp4TyoM',
    timestamp: 60
  }
];

/**
 * Ressources vidéo LSQ complètes
 */
export const VIDEO_RESOURCES = [
  {
    title: 'Mes débuts en LSQ - AQEPA',
    url: 'https://www.youtube.com/watch?v=slOzqp4TyoM',
    description: 'Programme officiel d\'apprentissage LSQ'
  },
  {
    title: 'Salutations et signes de base en LSQ',
    url: 'https://www.youtube.com/watch?v=Edp58-iP8-0',
    description: 'Bonjour, au revoir, merci...'
  },
  {
    title: 'Mots utiles en LSQ',
    url: 'https://www.youtube.com/watch?v=tBWqxO2xfjc',
    description: 'Vocabulaire de base'
  },
  {
    title: 'Comptine J\'aime papa maman en LSQ',
    url: 'https://www.youtube.com/watch?v=nbnEplcGOZI',
    description: 'Parfait pour les enfants!'
  },
  {
    title: 'La famille en LSQ',
    url: 'https://www.youtube.com/watch?v=9Y-UdGqz4jo',
    description: 'Papa, maman, famille'
  }
];

export function getSignById(id) {
  return SIGNS.find(s => s.id === id);
}

export function getSignsByDifficulty(maxDifficulty = 2) {
  return SIGNS.filter(s => s.difficulty <= maxDifficulty);
}

export default SIGNS;
