export const GAME_CONFIG = {
  version: '2.4.0',
  saveVersion: 3,
  worldWidth: 5600,
  worldHeight: 5600,
  finalBossTime: 20 * 60,
  pickupLife: 105,
  maxEnemies: 560,
  performanceMaxEnemies: 330,
  spawnMargin: 120,
  gridSize: 128,
  contactIFrames: 0.55,
  maxParticles: 420,
  maxProjectiles: 700,
  eventInterval: 150,
  colors: {
    physical: '#f1e5ca',
    fire: '#ff7043',
    ice: '#70d8ff',
    electric: '#ffe45b',
    shadow: '#b07cff',
    holy: '#fff0a6',
    poison: '#87d35b',
    wind: '#9ff0dc',
    earth: '#c59a65',
    nature: '#61d77f',
    arcane: '#ff72e8'
  }
};

export const DIFFICULTIES = {
  normal: { name: 'Normal', hp: 1, damage: 1, speed: 1, elite: 1, spawn: 1, coin: 1, description: 'Experiência padrão.' },
  hard: { name: 'Difícil', hp: 1.5, damage: 1.15, speed: 1.025, elite: 1.35, spawn: 1.12, coin: 1.2, description: '+50% HP inimigo e mais elites.' },
  nightmare: { name: 'Pesadelo', hp: 2.2, damage: 1.32, speed: 1.055, elite: 1.8, spawn: 1.25, coin: 1.55, description: 'Inimigos muito resistentes e agressivos.' },
  arcane: { name: 'Arcano', hp: 3, damage: 1.55, speed: 1.085, elite: 2.5, spawn: 1.38, coin: 2, description: '300% HP, hordas densas e elites frequentes.' }
};

export function xpRequired(level) {
  // Curva calibrada para começar rápida e crescer forte sem explodir cedo demais.
  return Math.round(75 + 25 * Math.pow(Math.max(1, level), 1.55));
}

export function timeHpMultiplier(seconds) {
  const m = seconds / 60;
  if (m <= 3) return 1 + (m / 3) * 0.25;
  if (m <= 7) return 1.30 + ((m - 3) / 4) * 0.30;
  if (m <= 12) return 1.80 + ((m - 7) / 5) * 0.50;
  if (m <= 20) return 2.50 + ((m - 12) / 8) * 1.00;
  return Math.min(4.35, 3.55 + (m - 20) * 0.055);
}

export const CHARACTERS = {
  mage: {
    name: 'Mago', icon: '🧙', startWeapon: 'fireball', passive: 'Laser Rúnico',
    description: 'Especialista em elementos. Magias possuem recarga menor e escalam muito bem.', unlock: 'Inicial',
    base: { hp: 125, speed: 158, damage: 1.08, armor: 0, crit: .06, critDamage: 1.8, attackSpeed: 1, cooldown: .92, area: 1.08, projectileSpeed: 1, amount: 0, pickup: 95, xp: 1.04 }
  },
  archer: {
    name: 'Arqueiro', icon: '🏹', startWeapon: 'arrow', passive: 'Chuva do Caçador',
    description: 'Críticos, perfuração, projéteis velozes e grande mobilidade.', unlock: 'Sobreviva 5 minutos',
    base: { hp: 135, speed: 176, damage: 1, armor: 1, crit: .15, critDamage: 2, attackSpeed: 1.14, cooldown: 1, area: 1, projectileSpeed: 1.22, amount: 0, pickup: 88, xp: 1 }
  },
  necromancer: {
    name: 'Necromante', icon: '💀', startWeapon: 'skeleton', passive: 'Exército dos Caídos',
    description: 'Comanda esqueletos, espíritos e maldições. Cresce com cada morte ao redor.', unlock: 'Derrote 1.000 inimigos no total',
    base: { hp: 130, speed: 154, damage: .98, armor: 1, crit: .05, critDamage: 1.75, attackSpeed: 1, cooldown: .98, area: 1, projectileSpeed: 1, amount: 0, pickup: 105, xp: 1.05 }
  },
  knight: {
    name: 'Cavaleiro Arcano', icon: '🛡️', startWeapon: 'sword', passive: 'Guarda Arcana',
    description: 'Mistura combate corpo a corpo, escudos e magia defensiva.', unlock: 'Derrote o primeiro miniboss',
    base: { hp: 205, speed: 142, damage: 1.05, armor: 8, crit: .06, critDamage: 1.75, attackSpeed: 1, cooldown: 1.02, area: 1.08, projectileSpeed: 1, amount: 0, pickup: 82, xp: .98 }
  },
  druid: {
    name: 'Druida', icon: '🌿', startWeapon: 'thorn', passive: 'Ira da Natureza',
    description: 'Natureza, veneno e controle de área com cura limitada.', unlock: 'Vença 2 partidas',
    base: { hp: 155, speed: 159, damage: 1, armor: 2, crit: .07, critDamage: 1.8, attackSpeed: 1.02, cooldown: .98, area: 1.12, projectileSpeed: 1, amount: 0, pickup: 100, xp: 1.03 }
  },
  assassin: {
    name: 'Assassino', icon: '🥷', startWeapon: 'shadowDagger', passive: 'Passo Sombrio',
    description: 'Alta mobilidade, ataques rápidos e críticos devastadores.', unlock: 'Alcance nível 20 em uma partida',
    base: { hp: 114, speed: 198, damage: 1.02, armor: 0, crit: .2, critDamage: 2.15, attackSpeed: 1.22, cooldown: .96, area: .95, projectileSpeed: 1.18, amount: 0, pickup: 82, xp: 1 }
  }
};

export const MAPS = {
  ruins: { name: 'Ruínas Arcanas', icon: '🏚️', description: 'Ruínas cobertas por energia esmeralda.', unlock: true, ground: '#0c2520', accent: '#17392e', danger: 'none' },
  forest: { name: 'Floresta Amaldiçoada', icon: '🌲', description: 'Vegetação hostil e maior presença de veneno.', unlock: 'time300', ground: '#102318', accent: '#295437', danger: 'poison' },
  ash: { name: 'Deserto Escarlate', icon: '🌋', description: 'Cinzas e calor. Inimigos velozes aparecem mais cedo.', unlock: 'victory1', ground: '#241916', accent: '#4d2921', danger: 'fire' },
  frost: { name: 'Terras Congeladas', icon: '🏔️', description: 'Solo glacial e inimigos resistentes a gelo.', unlock: 'victory2', ground: '#14262b', accent: '#27505d', danger: 'ice' },
  city: { name: 'Cidade Destruída', icon: '🏙️', description: 'Corredores de ruínas e grande densidade de hordas.', unlock: 'kills5000', ground: '#222323', accent: '#454c4a', danger: 'dense' },
  void: { name: 'Vazio Arcano', icon: '🌀', description: 'Bioma final com elites e eventos amaldiçoados frequentes.', unlock: 'victory4', ground: '#171126', accent: '#3e245b', danger: 'arcane' }
};

export const ENEMIES = {
  slime: {
    name: 'Slime Corrompido', color: '#67c86d', hp: 48, damage: 8, speed: 62, xp: 12,
    size: 18, visualSize: 18, hitboxRadius: 12.5, behavior: 'chase', coin: .035, typeMult: 1
  },
  goblin: {
    name: 'Goblin Arcano', color: '#9ad14b', hp: 62, damage: 10, speed: 92, xp: 15,
    size: 18, visualSize: 18, hitboxRadius: 11.5, behavior: 'skirmisher', coin: .045, typeMult: 1
  },
  skeleton: {
    name: 'Esqueleto Errante', color: '#ded8bf', hp: 92, damage: 13, speed: 72, xp: 19,
    size: 20, visualSize: 20, hitboxRadius: 12.5, hitboxOffsetY: 2, behavior: 'chase', coin: .05, typeMult: 1.05
  },
  bat: {
    name: 'Morcego Sombrio', color: '#9c70d9', hp: 44, damage: 9, speed: 122, xp: 13,
    size: 21, visualSize: 21, hitboxRadius: 10.5, behavior: 'orbitChase', coin: .04, typeMult: .9
  },
  orc: {
    name: 'Orc Blindado', color: '#62873e', hp: 240, damage: 21, speed: 50, xp: 34,
    size: 29, visualSize: 29, hitboxRadius: 20, behavior: 'tank', coin: .09, typeMult: 1.25
  },
  darkMage: {
    name: 'Mago Sombrio', color: '#7a4ba3', hp: 145, damage: 17, speed: 54, xp: 29,
    size: 24, visualSize: 24, hitboxRadius: 14, hitboxOffsetY: 3, behavior: 'ranged',
    projectileStyle: 'shadowShard', coin: .08, typeMult: 1.1
  },
  boneArcher: {
    name: 'Arqueiro Ósseo', color: '#c9c18c', hp: 118, damage: 15, speed: 59, xp: 25,
    size: 22, visualSize: 22, hitboxRadius: 13, hitboxOffsetY: 2, behavior: 'rangedFast',
    projectileStyle: 'boneArrow', coin: .07, typeMult: 1.05
  },
  bomber: {
    name: 'Ímpeto Explosivo', color: '#f07756', hp: 96, damage: 35, speed: 98, xp: 27,
    size: 22, visualSize: 22, hitboxRadius: 14.5, behavior: 'explosive', coin: .07, typeMult: 1
  },
  summoner: {
    name: 'Invocador Abissal', color: '#b76ae3', hp: 250, damage: 12, speed: 44, xp: 42,
    size: 27, visualSize: 27, hitboxRadius: 15.5, hitboxOffsetY: 3, behavior: 'summoner',
    projectileStyle: 'shadowShard', coin: .11, typeMult: 1.2
  },
  stoneGolem: {
    name: 'Golem de Pedra', color: '#8b8170', hp: 520, damage: 28, speed: 34, xp: 58,
    size: 35, visualSize: 35, hitboxRadius: 25, behavior: 'tank', coin: .14, typeMult: 1.45
  },
  elite: {
    name: 'Elite Corrompido', color: '#e6b64b', hp: 760, damage: 28, speed: 67, xp: 105,
    size: 34, visualSize: 34, hitboxRadius: 24, behavior: 'chase', coin: .65, elite: true, typeMult: 1.65
  },
  ogreBoss: {
    name: 'Ogro Rúnico', color: '#b3663e', hp: 5200, damage: 30, speed: 54, xp: 360,
    size: 55, visualSize: 55, hitboxRadius: 38, behavior: 'bossDash', projectileStyle: 'beastSpine',
    coin: 8, boss: true, miniboss: true, typeMult: 2.2
  },
  lichBoss: {
    name: 'Lich das Cinzas', color: '#7953b8', hp: 7800, damage: 27, speed: 50, xp: 520,
    size: 52, visualSize: 52, hitboxRadius: 32, hitboxOffsetY: 3, behavior: 'bossCaster',
    projectileStyle: 'lichBolt', coin: 12, boss: true, miniboss: true, typeMult: 2.35
  },
  wardenBoss: {
    name: 'Guardião da Fratura', color: '#4e93a3', hp: 11200, damage: 31, speed: 54, xp: 650,
    size: 58, visualSize: 58, hitboxRadius: 39, behavior: 'bossWarden', projectileStyle: 'wardenShard',
    coin: 15, boss: true, miniboss: true, typeMult: 2.5
  },
  beastBoss: {
    name: 'Fera Carmesim', color: '#b83e4e', hp: 14800, damage: 37, speed: 70, xp: 800,
    size: 62, visualSize: 62, hitboxRadius: 39, behavior: 'bossBeast', projectileStyle: 'beastSpine',
    coin: 18, boss: true, miniboss: true, typeMult: 2.7
  },
  finalBoss: {
    name: 'ARCANE TITAN', color: '#d53e72', hp: 36000, damage: 42, speed: 58, xp: 1800,
    size: 74, visualSize: 74, hitboxRadius: 49, behavior: 'finalBoss', projectileStyle: 'titanRune',
    coin: 55, boss: true, typeMult: 3.2
  }
};

export const ELITE_MODIFIERS = {
  flaming: { icon: '🔥', name: 'Flamejante', hp: 1.15, damage: 1.15, speed: 1, aura: 'fire' },
  electric: { icon: '⚡', name: 'Eletrificado', hp: 1.05, damage: 1.18, speed: 1.08, aura: 'electric' },
  freezing: { icon: '❄️', name: 'Congelante', hp: 1.18, damage: 1.08, speed: .96, aura: 'ice' },
  cursed: { icon: '💀', name: 'Amaldiçoado', hp: 1.28, damage: 1.2, speed: 1, aura: 'shadow' },
  vampiric: { icon: '🩸', name: 'Vampírico', hp: 1.18, damage: 1.08, speed: 1.04, lifesteal: .12 },
  armored: { icon: '🛡️', name: 'Blindado', hp: 1.5, damage: 1, speed: .9, armor: 14 },
  swift: { icon: '💨', name: 'Veloz', hp: .95, damage: 1.06, speed: 1.18 }
};

export const PASSIVES = {
  might: { name: 'Selo da Força', icon: '⚔️', desc: '+12% dano', max: 5, apply: p => p.damage *= 1.12 },
  vitality: { name: 'Coração do Gigante', icon: '❤️', desc: '+22 HP máximo e cura 22', max: 5, apply: p => { p.maxHp += 22; p.hp = Math.min(p.maxHp, p.hp + 22); } },
  agility: { name: 'Botas Arcanas', icon: '💨', desc: '+8% velocidade de movimento', max: 5, apply: p => p.setMoveSpeed ? p.setMoveSpeed(p.speed * 1.08) : (p.speed *= 1.08) },
  tome: { name: 'Tomo Arcano', icon: '📕', desc: '-8% cooldown', max: 5, apply: p => p.cooldown *= .92 },
  armor: { name: 'Placa Ancestral', icon: '🛡️', desc: '+2 armadura', max: 5, apply: p => p.armor += 2 },
  area: { name: 'Círculo Rúnico', icon: '⭕', desc: '+10% área', max: 5, apply: p => p.area *= 1.10 },
  amount: { name: 'Eco Duplicador', icon: '✦', desc: '+1 projétil/quantidade', max: 2, apply: p => p.amount += 1 },
  crit: { name: 'Olho Carmesim', icon: '👁️', desc: '+5% crítico', max: 5, apply: p => p.crit += .05 },
  critDamage: { name: 'Presa Rubra', icon: '🩸', desc: '+18% dano crítico', max: 5, apply: p => p.critDamage += .18 },
  magnet: { name: 'Ímã Astral', icon: '🧲', desc: '+28 alcance de coleta', max: 5, apply: p => p.pickup += 28 },
  wisdom: { name: 'Coroa da Sabedoria', icon: '🧠', desc: '+7% XP', max: 5, apply: p => p.xp *= 1.07 },
  haste: { name: 'Runa da Rapidez', icon: '⚡', desc: '+8% velocidade de ataque', max: 5, apply: p => p.attackSpeed *= 1.08 },
  elementalCore: { name: 'Núcleo Elemental', icon: '🔮', desc: 'Permite Arcane Fusions elementais.', max: 1, apply: p => { p.elementalCore = true; } },
  necroCore: { name: 'Códice Profano', icon: '📓', desc: 'Permite fusões necromânticas.', max: 1, apply: p => { p.necroCore = true; } }
};

export const META_UPGRADES = {
  strength: { name: 'Força', desc: '+2% dano por nível', max: 10, baseCost: 75 },
  vitality: { name: 'Vitalidade', desc: '+5 HP máximo por nível', max: 10, baseCost: 70 },
  agility: { name: 'Agilidade', desc: '+2% velocidade por nível', max: 8, baseCost: 80 },
  wisdom: { name: 'Sabedoria', desc: '+2.5% XP por nível', max: 8, baseCost: 85 }
};

export const ACHIEVEMENTS = {
  firstBlood: { name: 'Primeiro Sangue', desc: 'Mate 100 inimigos no total.', reward: 60 },
  armyDead: { name: 'Exército dos Mortos', desc: 'Tenha 10 invocações simultaneamente.', reward: 120 },
  demigod: { name: 'Semideus Arcano', desc: 'Consiga uma habilidade Arcana.', reward: 180 },
  exterminator: { name: 'Exterminador', desc: 'Mate 10.000 inimigos no total.', reward: 300 },
  survivor: { name: 'Sobrevivente', desc: 'Sobreviva 20 minutos.', reward: 160 },
  bossHunter: { name: 'Caçador de Titãs', desc: 'Derrote o chefe final.', reward: 250 }
};
