export const FUSION_ITEMS = {
  heartVolcano: {
    name: 'Coração do Vulcão', icon: '🌋', rarity: 'legendary',
    desc: 'Núcleo ígneo necessário para Fusions de impacto apocalíptico.',
    source: 'infernalWyrm'
  },
  frozenCore: {
    name: 'Núcleo Congelado', icon: '🧊', rarity: 'legendary',
    desc: 'Cristal glacial condensado, preservado no coração de um colosso.',
    source: 'frostColossus'
  },
  stormCrystal: {
    name: 'Cristal da Tempestade', icon: '⚡', rarity: 'legendary',
    desc: 'Cristal carregado capaz de sustentar redes elétricas arcanas.',
    source: 'stormHerald'
  },
  necromancerCrown: {
    name: 'Coroa do Necromante', icon: '👑💀', rarity: 'legendary',
    desc: 'Relíquia funerária usada em Fusions de legiões e mortos-vivos.',
    source: 'graveTyrant'
  },
  voidFragment: {
    name: 'Fragmento do Vazio', icon: '🕳️', rarity: 'arcane',
    desc: 'Estilhaço instável de sombra condensada.',
    source: 'voidReaper'
  },
  ancientRoot: {
    name: 'Raiz Ancestral', icon: '🌿', rarity: 'legendary',
    desc: 'Raiz viva que pulsa com magia primitiva.',
    source: 'titanRoots'
  },
  celestialFeather: {
    name: 'Pena Celestial', icon: '🪽', rarity: 'arcane',
    desc: 'Catalisador de Fusions solares e sagradas.',
    source: 'arcaneBehemoth'
  },
  bloodMoonShard: {
    name: 'Estilhaço da Lua de Sangue', icon: '🌙🩸', rarity: 'legendary',
    desc: 'Fragmento rubro usado em ritos de sangue avançados.',
    source: 'beastBoss'
  },
  titanCore: {
    name: 'Núcleo Titânico', icon: '🔷', rarity: 'arcane',
    desc: 'Coração de energia usado em convergências elementais extremas.',
    source: 'arcaneBehemoth'
  },
  soulLantern: {
    name: 'Lanterna das Almas', icon: '🏮👻', rarity: 'legendary',
    desc: 'Aprisiona ecos espirituais e estabiliza Fusions de familiares.',
    source: 'plagueMother'
  }
};

export function fusionItemLabel(id) {
  const item = FUSION_ITEMS[id];
  return item ? `${item.icon} ${item.name}` : id;
}
