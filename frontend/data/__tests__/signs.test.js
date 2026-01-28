import { SIGNS, getSignById, getSignsByDifficulty } from '../signs';

describe('SIGNS data', () => {
  test('contient exactement 10 signes', () => {
    expect(SIGNS).toHaveLength(10);
  });

  test('chaque signe a les propriétés requises', () => {
    SIGNS.forEach(sign => {
      expect(sign).toHaveProperty('id');
      expect(sign).toHaveProperty('word');
      expect(sign).toHaveProperty('emoji');
      expect(sign).toHaveProperty('difficulty');
      expect(sign).toHaveProperty('description');
    });
  });

  test('les IDs sont uniques', () => {
    const ids = SIGNS.map(s => s.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toHaveLength(uniqueIds.length);
  });

  test('contient les mots de base', () => {
    const words = SIGNS.map(s => s.word.toLowerCase());
    expect(words).toContain('bonjour');
    expect(words).toContain('merci');
    expect(words).toContain('maman');
    expect(words).toContain('papa');
  });
});

describe('getSignById', () => {
  test('retourne le bon signe', () => {
    const sign = getSignById('bonjour');
    expect(sign.word).toBe('Bonjour');
  });

  test('retourne undefined pour un ID inexistant', () => {
    expect(getSignById('inexistant')).toBeUndefined();
  });
});

describe('getSignsByDifficulty', () => {
  test('filtre par difficulté', () => {
    const easyOnly = getSignsByDifficulty(1);
    easyOnly.forEach(sign => {
      expect(sign.difficulty).toBeLessThanOrEqual(1);
    });
  });

  test('inclut tous les signes avec difficulté max 2', () => {
    const all = getSignsByDifficulty(2);
    expect(all).toHaveLength(10);
  });
});
