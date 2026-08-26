const lv = (...levels) => levels;

export const WEAPONS = {
  fireball: {
    name: 'Bola de Fogo', icon: '🔥', type: 'projectile', element: 'fire', max: 5,
    damage: 34, cooldown: 1.05, speed: 385, area: 42, pierce: 0, desc: 'Procura um inimigo e explode.',
    levels: lv('+1 projétil', '+24% dano', '+1 projétil e +15% velocidade', '+30% área', 'Queima forte e +1 perfuração')
  },
  arrow: {
    name: 'Arco', icon: '🏹', type: 'projectile', element: 'physical', max: 5,
    damage: 25, cooldown: .62, speed: 570, area: 9, pierce: 1, desc: 'Flechas rápidas e perfurantes.',
    levels: lv('+1 perfuração', '+20% velocidade', '+1 projétil', '+25% dano', '+2 perfurações e crítico melhorado')
  },
  skeleton: {
    name: 'Esqueleto Guerreiro', icon: '💀', type: 'summon', element: 'shadow', max: 5,
    damage: 23, cooldown: 2.1, desc: 'Invoca esqueletos autônomos e velozes.',
    levels: lv('+1 esqueleto', '+25% dano', '+1 esqueleto', '+20% velocidade de ataque', '+2 esqueletos e aura profana')
  },
  sword: {
    name: 'Espada Rúnica', icon: '🗡️', type: 'melee', element: 'physical', max: 5,
    damage: 44, cooldown: .82, area: 86, desc: 'Golpe circular próximo.',
    levels: lv('+18% área', '+25% dano', '-12% cooldown', '+1 golpe fantasma', '+35% área e sangramento arcano')
  },
  lightning: {
    name: 'Raio', icon: '⚡', type: 'lightning', element: 'electric', max: 5,
    damage: 38, cooldown: 1.25, chains: 2, desc: 'Atinge inimigos instantaneamente.',
    levels: lv('+1 alvo', '+25% dano', '+2 alvos', '-15% cooldown', 'Choque em cadeia e +2 alvos')
  },
  ice: {
    name: 'Fragmentos de Gelo', icon: '❄️', type: 'projectile', element: 'ice', max: 5,
    damage: 27, cooldown: 1.1, speed: 345, area: 13, pierce: 0, desc: 'Projéteis que desaceleram inimigos.',
    levels: lv('+1 projétil', '+20% dano', '+1 perfuração', '+25% duração do congelamento', '+1 projétil e congelamento forte')
  },
  frostNova: {
    name: 'Nova de Gelo', icon: '🧊', type: 'nova', element: 'ice', max: 5,
    damage: 36, cooldown: 3.2, area: 155, desc: 'Explosão circular de gelo ao redor do herói.',
    levels: lv('+18% raio', '+20% dano', '-12% cooldown', '+25% raio', 'Congelamento prolongado')
  },
  axe: {
    name: 'Machado Rúnico', icon: '🪓', type: 'projectile', element: 'physical', max: 5,
    damage: 43, cooldown: 1.4, speed: 270, area: 18, pierce: 2, desc: 'Machado pesado atravessa inimigos.',
    levels: lv('+1 perfuração', '+25% dano', '+1 projétil', '+20% tamanho', '+2 perfurações')
  },
  aura: {
    name: 'Aura Arcana', icon: '🟣', type: 'aura', element: 'arcane', max: 5,
    damage: 12, cooldown: .32, area: 102, desc: 'Dano contínuo ao redor.',
    levels: lv('+15% área', '+20% dano', '-10% cooldown', '+20% área', 'Pulso arcano periódico')
  },
  meteor: {
    name: 'Meteoro', icon: '☄️', type: 'meteor', element: 'fire', max: 5,
    damage: 82, cooldown: 2.8, area: 78, desc: 'Meteoros caem perto dos inimigos.',
    levels: lv('+1 meteoro', '+25% dano', '+25% área', '-15% cooldown', '+1 meteoro e queimadura')
  },
  boomerang: {
    name: 'Bumerangue', icon: '➰', type: 'projectile', element: 'physical', max: 5,
    damage: 34, cooldown: 1.15, speed: 300, area: 16, pierce: 3, desc: 'Projétil perfurante de longo alcance.',
    levels: lv('+1 perfuração', '+20% velocidade', '+1 projétil', '+25% dano', '+2 perfurações')
  },
  poison: {
    name: 'Flecha Venenosa', icon: '☠️', type: 'projectile', element: 'poison', max: 5,
    damage: 22, cooldown: .86, speed: 435, area: 11, pierce: 0, desc: 'Aplica veneno acumulável.',
    levels: lv('+1 projétil', '+35% veneno', '+1 perfuração', '-12% cooldown', 'Veneno se espalha ao morrer')
  },
  deathAura: {
    name: 'Aura da Morte', icon: '🕯️', type: 'aura', element: 'shadow', max: 5,
    damage: 16, cooldown: .40, area: 118, desc: 'Drena inimigos próximos.',
    levels: lv('+15% área', '+20% dano', '-12% cooldown', '+20% área', 'Inimigos mortos geram almas')
  },
  shield: {
    name: 'Escudo Giratório', icon: '🛡️', type: 'orbit', element: 'physical', max: 5,
    damage: 28, cooldown: .25, area: 28, desc: 'Escudos orbitam o herói.',
    levels: lv('+1 escudo', '+20% dano', '+1 escudo', '+20% raio orbital', '+2 escudos')
  },
  holySpear: {
    name: 'Lança Sagrada', icon: '🔱', type: 'projectile', element: 'holy', max: 5,
    damage: 49, cooldown: 1.3, speed: 475, area: 13, pierce: 2, desc: 'Lança perfurante de longo alcance.',
    levels: lv('+1 perfuração', '+25% dano', '+1 projétil', '-12% cooldown', '+2 perfurações')
  },
  storm: {
    name: 'Tempestade', icon: '🌩️', type: 'lightning', element: 'electric', max: 5,
    damage: 31, cooldown: .92, chains: 3, desc: 'Raios saltam entre vários alvos.',
    levels: lv('+2 alvos', '+20% dano', '-10% cooldown', '+2 alvos', 'Cada salto causa explosão elétrica')
  },
  windBlade: {
    name: 'Lâmina de Vento', icon: '🌪️', type: 'projectile', element: 'wind', max: 5,
    damage: 29, cooldown: .78, speed: 520, area: 14, pierce: 1, desc: 'Cortes de vento rápidos e perfurantes.',
    levels: lv('+1 projétil', '+20% velocidade', '+1 perfuração', '-10% cooldown', '+1 projétil')
  },
  thorn: {
    name: 'Espinhos Vivos', icon: '🌿', type: 'nova', element: 'nature', max: 5,
    damage: 32, cooldown: 2.1, area: 135, desc: 'Espinhos surgem ao redor do druida.',
    levels: lv('+18% área', '+25% dano', '-12% cooldown', 'Aplica veneno', '+30% área e cura pequena')
  },
  shadowDagger: {
    name: 'Adaga Sombria', icon: '🗡️', type: 'projectile', element: 'shadow', max: 5,
    damage: 24, cooldown: .42, speed: 650, area: 8, pierce: 0, desc: 'Disparos rápidos com alta sinergia crítica.',
    levels: lv('+1 projétil', '+20% dano', '+1 perfuração', '-10% cooldown', '+1 projétil e crítico aumentado')
  },
  stoneSpike: {
    name: 'Espinho de Pedra', icon: '🪨', type: 'meteor', element: 'earth', max: 5,
    damage: 68, cooldown: 2.4, area: 64, desc: 'Pilares de pedra emergem sob inimigos.',
    levels: lv('+1 pilar', '+25% dano', '+20% área', '-15% cooldown', '+1 pilar e atordoamento curto')
  },

  // Evoluções
  infernalSun: { name: 'Sol Carmesim', icon: '☀️', type: 'projectile', element: 'fire', max: 1, damage: 155, cooldown: .95, speed: 300, area: 120, pierce: 20, evolved: true, rarity: 'legendary', desc: 'Esfera flamejante devastadora que substitui Bola de Fogo.' },
  frozenStorm: { name: 'Tempestade Congelante', icon: '🌨️', type: 'aura', element: 'ice', max: 1, damage: 46, cooldown: .24, area: 180, evolved: true, rarity: 'legendary', desc: 'Campo glacial que congela e destrói hordas.' },
  cursedLegion: { name: 'Legião Amaldiçoada', icon: '👑', type: 'summon', element: 'shadow', max: 1, damage: 62, cooldown: 1, evolved: true, rarity: 'legendary', desc: 'Substitui os esqueletos por uma legião fortalecida.' },
  divineEye: { name: 'Olho Divino', icon: '🎯', type: 'projectile', element: 'holy', max: 1, damage: 74, cooldown: .30, speed: 720, area: 12, pierce: 5, evolved: true, rarity: 'legendary', desc: 'Disparos sagrados em altíssima velocidade.' },
  eternalBulwark: { name: 'Bastião Eterno', icon: '🛡️', type: 'orbit', element: 'holy', max: 1, damage: 58, cooldown: .2, area: 34, evolved: true, rarity: 'legendary', desc: 'Escudos rúnicos densos cercam o herói.' },
  plagueGarden: { name: 'Jardim da Praga', icon: '🥀', type: 'aura', element: 'poison', max: 1, damage: 42, cooldown: .25, area: 175, evolved: true, rarity: 'legendary', desc: 'Natureza venenosa toma a área ao redor.' },

  // Arcane Fusions
  thermalCollapse: { name: 'THERMAL COLLAPSE', icon: '🌡️', type: 'thermal', element: 'arcane', max: 1, damage: 185, cooldown: 3.3, area: 230, evolved: true, fusion: true, rarity: 'arcane', desc: 'Congela primeiro e explode com choque térmico logo depois.' },
  undeadConductor: { name: 'UNDEAD CONDUCTOR', icon: '⚡💀', type: 'summon', element: 'electric', max: 1, damage: 86, cooldown: .85, evolved: true, fusion: true, rarity: 'arcane', desc: 'Legião eletrificada conecta correntes entre inimigos.' },
  flameTornado: { name: 'TORNADO DE CHAMAS', icon: '🔥🌪️', type: 'aura', element: 'fire', max: 1, damage: 58, cooldown: .22, area: 205, evolved: true, fusion: true, rarity: 'arcane', desc: 'Vórtice flamejante móvel ao redor do herói.' },
  toxicCorpses: { name: 'CADÁVERES TÓXICOS', icon: '☠️💀', type: 'aura', element: 'poison', max: 1, damage: 54, cooldown: .28, area: 188, evolved: true, fusion: true, rarity: 'arcane', desc: 'Mortes espalham nuvens venenosas e almas corrompidas.' },
  volcanicEruption: { name: 'ERUPÇÃO VULCÂNICA', icon: '🌋', type: 'meteor', element: 'fire', max: 1, damage: 205, cooldown: 2.25, area: 105, evolved: true, fusion: true, rarity: 'arcane', desc: 'Múltiplas erupções de magma surgem sob os inimigos.' }
};

export function getWeaponLevelDescription(id, currentLevel) {
  const w = WEAPONS[id];
  if (!w) return '';
  if (w.evolved) return w.desc;
  const next = Math.min(w.max, currentLevel + 1);
  return w.levels?.[next - 1] || w.desc;
}

export function getWeaponStats(id, level = 1) {
  const w = WEAPONS[id];
  if (!w) return null;
  const s = { ...w };
  if (w.evolved) return s;
  const l = Math.max(1, Math.min(w.max, level));
  const bonusLv = l - 1;
  s.damage *= 1 + bonusLv * .18;
  s.area = (s.area || 0) * (1 + bonusLv * .07);
  s.speed = (s.speed || 0) * (1 + bonusLv * .045);
  s.cooldown *= Math.max(.62, 1 - bonusLv * .055);
  s.pierce = (s.pierce || 0) + (l >= 3 ? 1 : 0) + (l >= 5 ? 1 : 0);
  s.chains = (s.chains || 0) + (l >= 3 ? 1 : 0) + (l >= 5 ? 2 : 0);
  return s;
}
