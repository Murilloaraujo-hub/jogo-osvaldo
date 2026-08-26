export const RELICS = {
  chaosHeart: {
    name: 'Coração do Caos', icon: '❤️‍🔥', rarity: 'legendary',
    desc: 'Cada terceira habilidade ofensiva repete uma habilidade aleatória equipada.',
    apply(game) { game.flags.chaosHeart = true; }
  },
  bookDead: {
    name: 'Livro dos Mortos', icon: '📖', rarity: 'epic',
    desc: 'Mortes próximas podem erguer revenantes temporários para lutar por você.',
    apply(game) { game.flags.bookDead = true; }
  },
  glacialCrown: {
    name: 'Coroa Glacial', icon: '👑', rarity: 'epic',
    desc: 'Inimigos congelados explodem ao morrer e congelam inimigos próximos.',
    apply(game) { game.flags.glacialCrown = true; }
  },
  voidEye: {
    name: 'Olho do Vazio', icon: '👁️‍🗨️', rarity: 'legendary',
    desc: 'Críticos têm chance de criar uma singularidade que puxa e fere inimigos.',
    apply(game) { game.flags.voidEye = true; }
  },
  mirrorRune: {
    name: 'Runa do Espelho', icon: '🪞', rarity: 'rare',
    desc: 'Projéteis possuem chance de gerar uma cópia enfraquecida em direção próxima.',
    apply(game) { game.flags.mirrorRune = true; }
  },
  bloodHourglass: {
    name: 'Ampulheta Rubra', icon: '⏳', rarity: 'epic',
    desc: 'Ao cair abaixo de 35% HP, ganha velocidade e recarga até se recuperar.',
    apply(game) { game.flags.bloodHourglass = true; }
  },
  arcaneMagnet: {
    name: 'Magnetar Arcano', icon: '🧲', rarity: 'rare',
    desc: 'A cada 45 segundos, todos os cristais de XP são atraídos automaticamente.',
    apply(game) { game.flags.arcaneMagnet = true; }
  },
  titanSigil: {
    name: 'Selo do Titã', icon: '🔱', rarity: 'arcane',
    desc: 'Chefes recebem mais dano, mas inimigos comuns tornam-se 12% mais resistentes.',
    apply(game) { game.flags.titanSigil = true; game.extraEnemyHp *= 1.12; }
  }
};

export function rollRelic(owned = [], tier = 'common') {
  const weights = { common: 0, rare: 1, epic: 2, legendary: 3, arcane: 4 };
  const tierRank = weights[tier] ?? 0;
  const choices = Object.entries(RELICS)
    .filter(([id]) => !owned.includes(id))
    .filter(([, r]) => (weights[r.rarity] ?? 0) <= Math.min(4, tierRank + 2));
  if (!choices.length) return null;
  const weighted = [];
  for (const [id, r] of choices) {
    const rank = weights[r.rarity] ?? 0;
    const copies = Math.max(1, 7 - rank * 2 + tierRank);
    for (let i = 0; i < copies; i++) weighted.push([id, r]);
  }
  return weighted[(Math.random() * weighted.length) | 0];
}
