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
  },
  solarFragment: { name:'Fragmento Solar', icon:'☀️💎', rarity:'legendary', desc:'Catalisador para Fusions solares e sagradas.', source:'infernalWyrm', alternate:['Baús Lendários','Altares especiais'] },
  abyssalEye: { name:'Olho Abissal', icon:'👁️🕳️', rarity:'arcane', desc:'Olho condensado do vazio usado em Fusions sombrias.', source:'voidReaper', alternate:['Eventos Amaldiçoados'] },
  primalSeed: { name:'Semente Primordial', icon:'🌱✨', rarity:'legendary', desc:'Semente ancestral usada em Fusions naturais.', source:'titanRoots', alternate:['Altares','Baús Épicos'] },
  dragonScale: { name:'Escama de Dragão', icon:'🐉', rarity:'legendary', desc:'Escama resistente usada em Fusions físicas e de fogo.', source:'infernalWyrm', alternate:['Bosses de fogo'] },
  arcaneGear: { name:'Engrenagem Arcana', icon:'⚙️✦', rarity:'arcane', desc:'Mecanismo rúnico para Fusions do Tecnômante.', source:'arcaneBehemoth', alternate:['Baús Arcanos'] },
  moonstone: { name:'Pedra Lunar', icon:'🌙💠', rarity:'legendary', desc:'Catalisador dual de luz e sombra.', source:'voidReaper', alternate:['Eventos noturnos'] },
  arcaneCrown: { name:'Coroa Arcana', icon:'👑🔮', rarity:'arcane', desc:'Foco supremo para Fusions exclusivas do Mago.', source:'arcaneBehemoth', alternate:['Baús Arcanos'] }

};

export function fusionItemLabel(id) {
  const item = FUSION_ITEMS[id];
  return item ? `${item.icon} ${item.name}` : id;
}
