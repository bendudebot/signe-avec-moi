/**
 * Configuration des 10 premiers signes LSQ
 */
export const SIGNS = [
  {
    id: 'bonjour',
    word: 'Bonjour',
    emoji: '👋',
    difficulty: 1,
    description: 'Main ouverte qui part du menton vers l\'avant',
    videoUrl: '/dataset/bonjour.mp4',
    imageUrl: '/assets/images/bonjour.png'
  },
  {
    id: 'merci',
    word: 'Merci',
    emoji: '🙏',
    difficulty: 1,
    description: 'Main plate qui touche le menton et descend',
    videoUrl: '/dataset/merci.mp4',
    imageUrl: '/assets/images/merci.png'
  },
  {
    id: 'sil-te-plait',
    word: 'S\'il te plaît',
    emoji: '🥺',
    difficulty: 2,
    description: 'Main qui frotte la poitrine en cercle',
    videoUrl: '/dataset/sil-te-plait.mp4',
    imageUrl: '/assets/images/sil-te-plait.png'
  },
  {
    id: 'au-revoir',
    word: 'Au revoir',
    emoji: '👋',
    difficulty: 1,
    description: 'Main qui fait bye-bye',
    videoUrl: '/dataset/au-revoir.mp4',
    imageUrl: '/assets/images/au-revoir.png'
  },
  {
    id: 'oui',
    word: 'Oui',
    emoji: '✅',
    difficulty: 1,
    description: 'Poing fermé qui hoche comme une tête',
    videoUrl: '/dataset/oui.mp4',
    imageUrl: '/assets/images/oui.png'
  },
  {
    id: 'non',
    word: 'Non',
    emoji: '❌',
    difficulty: 1,
    description: 'Index et majeur qui se ferment sur le pouce',
    videoUrl: '/dataset/non.mp4',
    imageUrl: '/assets/images/non.png'
  },
  {
    id: 'je-taime',
    word: 'Je t\'aime',
    emoji: '❤️',
    difficulty: 1,
    description: 'Pouce, index et auriculaire levés (ILY)',
    videoUrl: '/dataset/je-taime.mp4',
    imageUrl: '/assets/images/je-taime.png'
  },
  {
    id: 'maman',
    word: 'Maman',
    emoji: '👩',
    difficulty: 1,
    description: 'Pouce sur le menton',
    videoUrl: '/dataset/maman.mp4',
    imageUrl: '/assets/images/maman.png'
  },
  {
    id: 'papa',
    word: 'Papa',
    emoji: '👨',
    difficulty: 1,
    description: 'Pouce sur le front',
    videoUrl: '/dataset/papa.mp4',
    imageUrl: '/assets/images/papa.png'
  },
  {
    id: 'bravo',
    word: 'Bravo',
    emoji: '👏',
    difficulty: 1,
    description: 'Applaudissements',
    videoUrl: '/dataset/bravo.mp4',
    imageUrl: '/assets/images/bravo.png'
  }
];

/**
 * Retourne un signe par son ID
 */
export function getSignById(id) {
  return SIGNS.find(s => s.id === id);
}

/**
 * Retourne les signes triés par difficulté
 */
export function getSignsByDifficulty(maxDifficulty = 2) {
  return SIGNS.filter(s => s.difficulty <= maxDifficulty);
}

export default SIGNS;
