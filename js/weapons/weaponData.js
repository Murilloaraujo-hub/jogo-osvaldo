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
    name: 'Relâmpago', icon: '⚡', type: 'thunderStrike', role: 'AOE', element: 'electric', max: 5,
    damage: 52, cooldown: 1.7, area: 72, desc: 'Marca um alvo e, após breve atraso, um raio vertical cai do céu.',
    levels: lv('+20% área', '+25% dano', '+1 impacto secundário', '-15% cooldown', 'Explosão elétrica maior ao atingir')
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


  curse: {
    name: 'Maldição Sombria', icon: '🜏', type: 'curse', role: 'TRAP', element: 'shadow', max: 5,
    damage: 38, cooldown: 2.35, area: 125, desc: 'Marca um grupo; após um atraso a maldição implode e pode se espalhar.',
    levels: lv('+1 alvo marcado', '+25% dano', 'Explosão maior', '-15% cooldown', 'Marca se espalha para um alvo próximo')
  },
  holyBlade: {
    name: 'Lâmina Sagrada', icon: '🗡️☀️', type: 'holyBlade', role: 'MELEE', element: 'holy', max: 5,
    damage: 49, cooldown: 1.0, area: 112, desc: 'Corte frontal luminoso que também concede uma barreira curta.',
    levels: lv('+20% área', '+25% dano', 'Barreira mais forte', '-12% cooldown', 'Segundo corte de luz')
  },
  elementalBolt: {
    name: 'Selo Elemental', icon: '🔷✦', type: 'elementalCycle', role: 'PROJECTILE', element: 'arcane', max: 5,
    damage: 34, cooldown: .88, speed: 455, area: 28, pierce: 1, desc: 'Uma runa orbital alterna fogo, gelo, raio e terra; cada elemento muda o disparo.',
    levels: lv('+1 projétil', '+20% dano', 'Efeito elemental fortalecido', '+1 perfuração', 'Dispara dois elementos em sequência')
  },
  arcaneSlash: {
    name: 'Corte Arcano', icon: '⚔️✦', type: 'beam', role: 'BEAM', element: 'arcane', max: 5,
    damage: 58, cooldown: 1.45, area: 24, desc: 'Crescente de energia atravessa uma linha à frente.',
    levels: lv('+20% largura', '+25% dano', '+20% alcance', '-15% cooldown', 'Eco arcano repete o corte')
  },
  familiar: {
    name: 'Familiar Luminoso', icon: '✨', type: 'familiar', role: 'SUMMON', element: 'arcane', max: 5,
    damage: 26, cooldown: .95, area: 16, desc: 'Uma luz mágica orbita suavemente o jogador e dispara automaticamente.',
    levels: lv('1 projétil por ataque', '2 projéteis por ataque', '3 projéteis por ataque', '4 projéteis por ataque', '5 projéteis por ataque • EVOLUI PARA CELESTIAL WISP')
  },
  bloodNova: {
    name: 'Nova Sanguínea', icon: '🩸', type: 'bloodNova', role: 'AOE', element: 'shadow', max: 5,
    damage: 42, cooldown: 2.45, area: 145, desc: 'Onda rubra ao redor; dano recebe bônus moderado da vida máxima.',
    levels: lv('+18% raio', '+25% dano', '-12% cooldown', 'Drena 2 HP por alvo até limite e cura', 'Segunda onda menor')
  },
  kiBurst: {
    name: 'Explosão de Ki', icon: '🥋', type: 'wave', role: 'CONTROL', element: 'wind', max: 5,
    damage: 39, cooldown: 1.05, area: 120, desc: 'Onda direcional de energia que empurra inimigos.',
    levels: lv('+20% largura', '+25% dano', 'Empurrão maior', '-12% cooldown', 'Segunda onda lateral')
  },
  arcaneDrone: {
    name: 'Drone Arcano', icon: '⚙️', type: 'drone', role: 'SUMMON', element: 'arcane', max: 5,
    damage: 31, cooldown: .82, area: 14, desc: 'Drone permanente mantém distância e dispara feixes curtos.',
    levels: lv('+20% dano', 'Dispara mais rápido', '+1 drone', 'Tiro ricocheteia', 'Pulso arcano periódico')
  },


  // Signature Abilities exclusivas por classe — Lv.1–5 → evolução automática.
  runeBarrage:{name:'Rune Barrage',icon:'✦📖',type:'signature',role:'SIGNATURE',signaturePattern:'mageRunes',signature:true,signatureClass:'mage',element:'arcane',max:5,damage:24,cooldown:1.05,area:18,speed:520,pierce:0,desc:'Runas orbitais disparam fragmentos arcanos.',levels:lv('2 runas','+1 runa','Cada runa dispara +1 projétil','+1 runa','+1 perfuração • EVOLUI PARA ARCHMAGE CIRCLE')},
  boneCovenant:{name:'Bone Covenant',icon:'☠️📜',type:'signature',role:'SIGNATURE',signaturePattern:'boneCovenant',signature:true,signatureClass:'necromancer',element:'shadow',max:5,damage:24,cooldown:1.25,area:80,desc:'Servos ósseos exclusivos lutam pelo Necromante.',levels:lv('1 Bone Servant','+1 Bone Servant','Ataque em arco','+1 Bone Servant','Servos maiores + aura • EVOLUI PARA BONE COLOSSUS')},
  huntersVolley:{name:"Hunter's Volley",icon:'🏹✦',type:'signature',role:'SIGNATURE',signaturePattern:'hunterVolley',signature:true,signatureClass:'archer',element:'physical',max:5,damage:26,cooldown:.92,area:10,speed:610,pierce:0,desc:'Sequência de flechas reais em leque.',levels:lv('3 flechas','+1 flecha','+1 perfuração','+2 flechas','Marca alvos • EVOLUI PARA THOUSAND ARROWS')},
  arcaneBladeSignature:{name:'Arcane Blade',icon:'⚔️🔷',type:'signature',role:'SIGNATURE',signaturePattern:'arcaneBlade',signature:true,signatureClass:'knight',element:'arcane',max:5,damage:48,cooldown:1.0,area:115,desc:'Corte da espada seguido por onda arcana.',levels:lv('1 corte','+1 onda arcana','Corte mais largo','+1 corte secundário','Explosão rúnica • EVOLUI PARA KING\'S ARCANE EDGE')},
  livingThorns:{name:'Living Thorns',icon:'🌿🗡️',type:'signature',role:'SIGNATURE',signaturePattern:'livingThorns',signature:true,signatureClass:'druid',element:'nature',max:5,damage:31,cooldown:1.55,area:125,desc:'Espinhos vivos emergem e avançam contra inimigos.',levels:lv('2 espinhos','+1 espinho','Espinhos perfuram','+2 espinhos','Deixam raízes • EVOLUI PARA WORLD ROOTS')},
  shadowKnivesSignature:{name:'Shadow Knives',icon:'🌑🗡️',type:'signature',role:'SIGNATURE',signaturePattern:'shadowKnives',signature:true,signatureClass:'assassin',element:'shadow',max:5,damage:25,cooldown:.62,area:9,speed:680,pierce:0,desc:'Adagas sombrias caçam inimigos próximos.',levels:lv('2 adagas','+1 adaga','+1 ricochete','+2 adagas','Afterimages • EVOLUI PARA NIGHTMARE BLADES')},
  abyssalSigilSignature:{name:'Abyssal Sigil',icon:'🜏🕳️',type:'signature',role:'SIGNATURE',signaturePattern:'abyssalSigil',signature:true,signatureClass:'warlock',element:'shadow',max:5,damage:42,cooldown:1.85,area:120,desc:'Selos em grupos liberam tentáculos e maldição.',levels:lv('1 selo','+1 selo','Maldição dura mais','Área maior','Contágio • EVOLUI PARA GATE OF THE ABYSS')},
  sacredWaveSignature:{name:'Sacred Wave',icon:'☀️🌊',type:'signature',role:'SIGNATURE',signaturePattern:'sacredWave',signature:true,signatureClass:'paladin',element:'holy',max:5,damage:48,cooldown:1.15,area:145,desc:'Golpe de espada cria uma onda luminosa frontal.',levels:lv('1 onda','+20% largura','Barreira curta','+1 onda','Coluna de luz • EVOLUI PARA DIVINE CRUSADE')},
  primalCoreSignature:{name:'Primal Core',icon:'🔥❄️⚡🪨',type:'signature',role:'SIGNATURE',signaturePattern:'primalCore',signature:true,signatureClass:'elementalist',element:'arcane',max:5,damage:31,cooldown:.78,area:42,desc:'Quatro núcleos elementais orbitais usam ataques realmente diferentes.',levels:lv('4 núcleos','Ataques mais rápidos','Efeitos elementais maiores','Duas ativações por ciclo','Reação combinada • EVOLUI PARA ELEMENTAL SINGULARITY')},
  arcaneGreatswordSignature:{name:'Arcane Greatsword',icon:'🗡️✨',type:'signature',role:'SIGNATURE',signaturePattern:'greatsword',signature:true,signatureClass:'battlemage',element:'arcane',max:5,damage:58,cooldown:1.1,area:150,desc:'Grande espada mágica executa cortes em cone.',levels:lv('1 corte','Cone maior','+1 eco rúnico','-15% cooldown','Explosão final • EVOLUI PARA SPELLBREAKER')},
  celestialLightSignature:{name:'Celestial Light',icon:'✨⭕',type:'signature',role:'SIGNATURE',signaturePattern:'celestialLight',signature:true,signatureClass:'summoner',element:'arcane',max:5,damage:25,cooldown:.78,area:18,desc:'Luz mágica orbital dispara automaticamente.',levels:lv('1 projétil','2 projéteis','3 projéteis','4 projéteis','5 projéteis • EVOLUI PARA CELESTIAL STAR')},
  bloodLancesSignature:{name:'Blood Lances',icon:'🩸🔱',type:'signature',role:'SIGNATURE',signaturePattern:'bloodLances',signature:true,signatureClass:'bloodMage',element:'shadow',max:5,damage:34,cooldown:1.05,area:13,speed:540,desc:'Lanças rubras aparecem em volta e atacam inimigos.',levels:lv('2 lanças','+1 lança','Perfuração','+2 lanças','Símbolos no chão • EVOLUI PARA CRIMSON CATHEDRAL')},
  kiFistsSignature:{name:'Ki Fists',icon:'🥋👊',type:'signature',role:'SIGNATURE',signaturePattern:'kiFists',signature:true,signatureClass:'monk',element:'wind',max:5,damage:30,cooldown:.72,area:105,desc:'Punhos de energia atingem grupos em sequências.',levels:lv('2 punhos','+1 punho','Empurrão maior','+2 punhos','Onda final • EVOLUI PARA THOUSAND ARMS')},
  arcaneDronesSignature:{name:'Arcane Drones',icon:'⚙️🛰️',type:'signature',role:'SIGNATURE',signaturePattern:'arcaneDrones',signature:true,signatureClass:'technomancer',element:'arcane',max:5,damage:28,cooldown:.72,area:18,desc:'Pequenos drones rúnicos orbitais travam alvos e disparam.',levels:lv('1 drone','+1 drone','Lasers curtos','+1 drone','Barragem • EVOLUI PARA ARCANE SATELLITE')},

  archmageCircle:{name:'ARCHMAGE CIRCLE',icon:'🔮✦',type:'signature',role:'SIGNATURE',signaturePattern:'mageRunes',signature:true,signatureClass:'mage',signatureEvolved:true,evolved:true,element:'arcane',max:1,damage:72,cooldown:.58,area:34,speed:620,pierce:3,rarity:'legendary',desc:'Círculo mágico completo dispara rajadas e lasers curtos.'},
  boneColossusSignature:{name:'BONE COLOSSUS',icon:'☠️🗿',type:'signature',role:'SIGNATURE',signaturePattern:'boneCovenant',signature:true,signatureClass:'necromancer',signatureEvolved:true,evolved:true,element:'shadow',max:1,damage:118,cooldown:.8,area:135,rarity:'legendary',desc:'Um esqueleto gigante exclusivo substitui os Bone Servants.'},
  thousandArrows:{name:'THOUSAND ARROWS',icon:'🏹🌧️',type:'signature',role:'SIGNATURE',signaturePattern:'hunterVolley',signature:true,signatureClass:'archer',signatureEvolved:true,evolved:true,element:'physical',max:1,damage:58,cooldown:.58,area:145,speed:680,pierce:3,rarity:'legendary',desc:'Rajada extrema em leque com flechas adicionais caindo do céu.'},
  kingsArcaneEdge:{name:"KING'S ARCANE EDGE",icon:'👑⚔️',type:'signature',role:'SIGNATURE',signaturePattern:'arcaneBlade',signature:true,signatureClass:'knight',signatureEvolved:true,evolved:true,element:'arcane',max:1,damage:108,cooldown:.66,area:175,rarity:'legendary',desc:'Cortes gigantes, runas e explosões ligadas ao escudo.'},
  worldRootsSignature:{name:'WORLD ROOTS',icon:'🌳🌿',type:'signature',role:'SIGNATURE',signaturePattern:'livingThorns',signature:true,signatureClass:'druid',signatureEvolved:true,evolved:true,element:'nature',max:1,damage:84,cooldown:.92,area:190,rarity:'legendary',desc:'Grandes raízes atacam várias regiões e prendem hordas.'},
  nightmareBlades:{name:'NIGHTMARE BLADES',icon:'🌑⚔️',type:'signature',role:'SIGNATURE',signaturePattern:'shadowKnives',signature:true,signatureClass:'assassin',signatureEvolved:true,evolved:true,element:'shadow',max:1,damage:70,cooldown:.36,area:16,speed:800,pierce:5,rarity:'legendary',desc:'Lâminas espectrais orbitam, ricocheteiam e deixam afterimages.'},
  gateOfAbyss:{name:'GATE OF THE ABYSS',icon:'🕳️🜏',type:'signature',role:'SIGNATURE',signaturePattern:'abyssalSigil',signature:true,signatureClass:'warlock',signatureEvolved:true,evolved:true,element:'shadow',max:1,damage:96,cooldown:1.05,area:195,rarity:'legendary',desc:'Fenda sombria puxa inimigos e espalha maldição.'},
  divineCrusade:{name:'DIVINE CRUSADE',icon:'☀️⚔️',type:'signature',role:'SIGNATURE',signaturePattern:'sacredWave',signature:true,signatureClass:'paladin',signatureEvolved:true,evolved:true,element:'holy',max:1,damage:104,cooldown:.82,area:195,rarity:'legendary',desc:'Lâminas de luz e colunas sagradas atingem grandes áreas.'},
  elementalSingularitySignature:{name:'ELEMENTAL SINGULARITY',icon:'🌀🔶',type:'signature',role:'SIGNATURE',signaturePattern:'primalCore',signature:true,signatureClass:'elementalist',signatureEvolved:true,evolved:true,element:'arcane',max:1,damage:92,cooldown:.48,area:210,rarity:'legendary',desc:'Quatro núcleos formam um círculo e executam ataques combinados.'},
  spellbreakerSignature:{name:'SPELLBREAKER',icon:'🌙🗡️',type:'signature',role:'SIGNATURE',signaturePattern:'greatsword',signature:true,signatureClass:'battlemage',signatureEvolved:true,evolved:true,element:'arcane',max:1,damage:128,cooldown:.68,area:205,rarity:'legendary',desc:'A espada libera cortes, ondas, runas e explosões secundárias.'},
  celestialStar:{name:'CELESTIAL STAR',icon:'🌟⭕',type:'signature',role:'SIGNATURE',signaturePattern:'celestialLight',signature:true,signatureClass:'summoner',signatureEvolved:true,evolved:true,element:'arcane',max:1,damage:66,cooldown:.42,area:26,rarity:'legendary',desc:'Luz maior, múltiplos anéis e rajadas especiais.'},
  crimsonCathedral:{name:'CRIMSON CATHEDRAL',icon:'🩸⛪',type:'signature',role:'SIGNATURE',signaturePattern:'bloodLances',signature:true,signatureClass:'bloodMage',signatureEvolved:true,evolved:true,element:'shadow',max:1,damage:94,cooldown:.72,area:185,rarity:'legendary',desc:'Símbolos rubros no chão lançam múltiplas lanças.'},
  thousandArms:{name:'THOUSAND ARMS',icon:'🥋👐',type:'signature',role:'SIGNATURE',signaturePattern:'kiFists',signature:true,signatureClass:'monk',signatureEvolved:true,evolved:true,element:'wind',max:1,damage:74,cooldown:.38,area:165,rarity:'legendary',desc:'Braços espectrais executam uma sequência de golpes e uma onda final.'},
  arcaneSatellite:{name:'ARCANE SATELLITE',icon:'🛰️✦',type:'signature',role:'SIGNATURE',signaturePattern:'arcaneDrones',signature:true,signatureClass:'technomancer',signatureEvolved:true,evolved:true,element:'arcane',max:1,damage:76,cooldown:.4,area:28,rarity:'legendary',desc:'Estrutura orbital maior dispara lasers e mantém drones secundários.'},

  // Evoluções automáticas de todas as habilidades principais
  infernalSun: {
    "name": "Sol Carmesim",
    "icon": "☀️",
    "type": "projectile",
    "element": "fire",
    "max": 1,
    "damage": 155,
    "cooldown": 0.95,
    "speed": 300,
    "area": 120,
    "pierce": 20,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Pequeno sol arcano que atravessa hordas e explode."
  },
  divineEye: {
    "name": "Olho Divino",
    "icon": "🎯",
    "type": "projectile",
    "element": "holy",
    "max": 1,
    "damage": 74,
    "cooldown": 0.3,
    "speed": 720,
    "area": 12,
    "pierce": 5,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Rajada sagrada de precisão e perfuração extrema."
  },
  cursedLegion: {
    "name": "Legião Amaldiçoada",
    "icon": "👑",
    "type": "summon",
    "element": "shadow",
    "max": 1,
    "damage": 62,
    "cooldown": 1,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Esqueletos fortalecidos por energia profana."
  },
  runicExecutioner: {
    "name": "Executor Rúnico",
    "icon": "⚔️",
    "type": "melee",
    "element": "arcane",
    "max": 1,
    "damage": 92,
    "cooldown": 0.58,
    "area": 132,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Golpes rúnicos largos com ecos arcanos."
  },
  thunderLord: {
    "name": "Senhor do Trovão",
    "icon": "⚡",
    "type": "thunderStrike",
    "role": "AOE",
    "element": "electric",
    "max": 1,
    "damage": 110,
    "cooldown": 0.72,
    "chains": 7,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Tempestades verticais marcam e esmagam grupos com explosões elétricas."
  },
  frozenStorm: {
    "name": "Tempestade Congelante",
    "icon": "🌨️",
    "type": "aura",
    "element": "ice",
    "max": 1,
    "damage": 46,
    "cooldown": 0.24,
    "area": 180,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Campo glacial que congela e destrói hordas."
  },
  absoluteZero: {
    "name": "Zero Absoluto",
    "icon": "🧊",
    "type": "nova",
    "element": "ice",
    "max": 1,
    "damage": 92,
    "cooldown": 2.35,
    "area": 235,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Uma onda glacial enorme congela inimigos próximos."
  },
  worldSplitter: {
    "name": "Fende-Mundos",
    "icon": "🪓",
    "type": "projectile",
    "element": "physical",
    "max": 1,
    "damage": 118,
    "cooldown": 0.92,
    "speed": 330,
    "area": 25,
    "pierce": 8,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Machado colossal atravessa múltiplas fileiras."
  },
  arcaneHalo: {
    "name": "Halo Arcano",
    "icon": "🔮",
    "type": "aura",
    "element": "arcane",
    "max": 1,
    "damage": 38,
    "cooldown": 0.2,
    "area": 165,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Runas orbitais pulsam energia arcana continuamente."
  },
  cataclysm: {
    "name": "Cataclysm",
    "icon": "☄️",
    "type": "meteor",
    "element": "fire",
    "max": 1,
    "damage": 168,
    "cooldown": 1.9,
    "area": 112,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Meteoros enormes atingem regiões densas da horda."
  },
  recallBlade: {
    "name": "Lâmina do Retorno",
    "icon": "➰",
    "type": "projectile",
    "element": "physical",
    "max": 1,
    "damage": 82,
    "cooldown": 0.72,
    "speed": 390,
    "area": 22,
    "pierce": 9,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Bumerangues rúnicos perfuram a arena em alta frequência."
  },
  plagueArrow: {
    "name": "Flecha da Peste",
    "icon": "☣️",
    "type": "projectile",
    "element": "poison",
    "max": 1,
    "damage": 58,
    "cooldown": 0.52,
    "speed": 510,
    "area": 15,
    "pierce": 3,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Projéteis infectam e espalham veneno entre grupos."
  },
  soulRequiem: {
    "name": "Réquiem das Almas",
    "icon": "👻",
    "type": "aura",
    "element": "shadow",
    "max": 1,
    "damage": 45,
    "cooldown": 0.22,
    "area": 180,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Almas espectrais drenam inimigos ao redor."
  },
  eternalBulwark: {
    "name": "Bastião Eterno",
    "icon": "🛡️",
    "type": "orbit",
    "element": "holy",
    "max": 1,
    "damage": 58,
    "cooldown": 0.2,
    "area": 34,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Escudos rúnicos densos cercam o herói."
  },
  seraphLance: {
    "name": "Lança do Serafim",
    "icon": "✨",
    "type": "projectile",
    "element": "holy",
    "max": 1,
    "damage": 106,
    "cooldown": 0.78,
    "speed": 610,
    "area": 18,
    "pierce": 8,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Lanças luminosas atravessam a arena."
  },
  tempestCrown: {
    "name": "Coroa da Tempestade",
    "icon": "🌩️",
    "type": "lightning",
    "element": "electric",
    "max": 1,
    "damage": 66,
    "cooldown": 0.56,
    "chains": 10,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Uma tempestade real caça grupos inteiros."
  },
  galeReaper: {
    "name": "Ceifador do Vendaval",
    "icon": "🌪️",
    "type": "projectile",
    "element": "wind",
    "max": 1,
    "damage": 71,
    "cooldown": 0.48,
    "speed": 650,
    "area": 21,
    "pierce": 6,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Lâminas curvas de vento atravessam grandes grupos."
  },
  plagueGarden: {
    "name": "Jardim da Praga",
    "icon": "🥀",
    "type": "aura",
    "element": "poison",
    "max": 1,
    "damage": 42,
    "cooldown": 0.25,
    "area": 175,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Natureza venenosa toma a área ao redor."
  },
  voidFang: {
    "name": "Presa do Vazio",
    "icon": "🌑",
    "type": "projectile",
    "element": "shadow",
    "max": 1,
    "damage": 64,
    "cooldown": 0.28,
    "speed": 760,
    "area": 11,
    "pierce": 4,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Adagas espectrais atravessam alvos em altíssima velocidade."
  },
  earthshatter: {
    "name": "Ruptura da Terra",
    "icon": "⛰️",
    "type": "meteor",
    "element": "earth",
    "max": 1,
    "damage": 145,
    "cooldown": 1.62,
    "area": 96,
    "evolved": true,
    "rarity": "legendary",
    "desc": "Pilares e ondas sísmicas erguem-se sob inimigos."
  },

  // Arcane Fusions: cada uma possui progressão própria Lv.1–5.

  skeletonColossus: {
    name: 'Colosso Esquelético', icon: '☠️', type: 'summon', role: 'SUMMON', element: 'shadow', max: 1,
    damage: 105, cooldown: 1.0, area: 120, evolved: true, rarity: 'legendary',
    desc: 'Um único gigante ósseo substitui a tropa e alterna golpes pesados com impactos em área.'
  },
  abyssalHex: { name:'Hex Abissal', icon:'🜏', type:'curse', role:'TRAP', element:'shadow', max:1, damage:92, cooldown:1.45, area:175, evolved:true, rarity:'legendary', desc:'Maldição ampla que implode e contagia alvos próximos.' },
  solarEdict: { name:'Édito Solar', icon:'☀️🗡️', type:'holyBlade', role:'MELEE', element:'holy', max:1, damage:112, cooldown:.72, area:165, evolved:true, rarity:'legendary', desc:'Dois arcos de luz e uma barreira luminosa mais duradoura.' },
  primalConvergence: { name:'Convergência Primordial', icon:'🔶', type:'elementalCycle', role:'PROJECTILE', element:'arcane', max:1, damage:86, cooldown:.55, speed:560, area:48, pierce:4, evolved:true, rarity:'legendary', desc:'Dispara pares elementais com reações distintas.' },
  spellbreakerCrescent: { name:'Crescente Quebra-Feitiço', icon:'🌙⚔️', type:'beam', role:'BEAM', element:'arcane', max:1, damage:138, cooldown:.86, area:42, evolved:true, rarity:'legendary', desc:'Corte largo de longo alcance seguido por eco rúnico.' },
  eidolonPrime: { name:'Celestial Wisp', icon:'✨✦', type:'familiar', role:'SUMMON', element:'arcane', max:1, damage:78, cooldown:.48, area:26, evolved:true, rarity:'legendary', desc:'Luz arcana maior com dois anéis rúnicos; dispara cinco projéteis em padrões alternados.' },
  sanguineEclipse: { name:'Eclipse Sanguíneo', icon:'🌑🩸', type:'bloodNova', role:'AOE', element:'shadow', max:1, damage:118, cooldown:1.55, area:205, evolved:true, rarity:'legendary', desc:'Duas ondas rubras consecutivas escalam com a vida máxima.' },
  dragonPulse: { name:'Pulso do Dragão', icon:'🐉', type:'wave', role:'CONTROL', element:'wind', max:1, damage:104, cooldown:.68, area:175, evolved:true, rarity:'legendary', desc:'Duas ondas convergentes empurram e atravessam a horda.' },
  runicOverseer: { name:'Supervisor Rúnico', icon:'🛰️', type:'drone', role:'SUMMON', element:'arcane', max:1, damage:82, cooldown:.42, area:24, evolved:true, rarity:'legendary', desc:'Dois drones autônomos criam feixes cruzados e pulsos arcanos.' },

  apocalypseRain: {
    "name": "CHUVA DO APOCALIPSE",
    "icon": "🌋",
    "type": "fusion",
    "fusionPattern": "apocalypseRain",
    "element": "fire",
    "max": 5,
    "damage": 130,
    "cooldown": 2.5,
    "area": 100,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: CHUVA DO APOCALIPSE.",
    "levels": [
      "3 meteoros + 2 Fireballs por impacto",
      "+1 meteoro",
      "+2 Fireballs por meteoro",
      "+1 meteoro e +20% área",
      "Meteoros deixam chão em chamas"
    ],
    "fusionLevels": [
      {
        "meteorCount": 3,
        "secondaryCount": 2,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "meteorCount": 4,
        "secondaryCount": 2,
        "areaMult": 1.0,
        "damageMult": 1.08
      },
      {
        "meteorCount": 4,
        "secondaryCount": 4,
        "areaMult": 1.05,
        "damageMult": 1.12
      },
      {
        "meteorCount": 5,
        "secondaryCount": 4,
        "areaMult": 1.22,
        "damageMult": 1.18
      },
      {
        "meteorCount": 5,
        "secondaryCount": 5,
        "areaMult": 1.28,
        "damageMult": 1.25,
        "groundFire": true
      }
    ]
  },
  flameTornado: {
    "name": "TORNADO DE CHAMAS",
    "icon": "🔥🌪️",
    "type": "fusion",
    "fusionPattern": "flameTornado",
    "element": "fire",
    "max": 5,
    "damage": 62,
    "cooldown": 0.42,
    "area": 150,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: TORNADO DE CHAMAS.",
    "levels": [
      "1 tornado flamejante",
      "+20% tamanho",
      "+1 tornado",
      "Puxão mais forte",
      "Deixa trilha de fogo"
    ],
    "fusionLevels": [
      {
        "vortices": 1,
        "pull": 18,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "vortices": 1,
        "pull": 18,
        "areaMult": 1.2,
        "damageMult": 1.08
      },
      {
        "vortices": 2,
        "pull": 22,
        "areaMult": 1.15,
        "damageMult": 1.1
      },
      {
        "vortices": 2,
        "pull": 36,
        "areaMult": 1.2,
        "damageMult": 1.16
      },
      {
        "vortices": 2,
        "pull": 42,
        "areaMult": 1.3,
        "damageMult": 1.24,
        "trail": true
      }
    ]
  },
  plasmaOrb: {
    "name": "ORBE DE PLASMA",
    "icon": "⚡🔥",
    "type": "fusion",
    "fusionPattern": "plasmaOrb",
    "element": "electric",
    "max": 5,
    "damage": 105,
    "cooldown": 1.05,
    "area": 72,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: ORBE DE PLASMA.",
    "levels": [
      "Orbe explode e encadeia 2 raios",
      "+1 salto",
      "+25% explosão",
      "+1 projétil",
      "Descargas secundárias maiores"
    ],
    "fusionLevels": [
      {
        "projectiles": 1,
        "chains": 2,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "projectiles": 1,
        "chains": 3,
        "areaMult": 1.0,
        "damageMult": 1.08
      },
      {
        "projectiles": 1,
        "chains": 3,
        "areaMult": 1.25,
        "damageMult": 1.12
      },
      {
        "projectiles": 2,
        "chains": 3,
        "areaMult": 1.18,
        "damageMult": 1.15
      },
      {
        "projectiles": 2,
        "chains": 5,
        "areaMult": 1.25,
        "damageMult": 1.24
      }
    ]
  },
  cryostorm: {
    "name": "CRYOSTORM",
    "icon": "🌩️❄️",
    "type": "fusion",
    "fusionPattern": "cryostorm",
    "element": "ice",
    "max": 5,
    "damage": 72,
    "cooldown": 0.72,
    "area": 180,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: CRYOSTORM.",
    "levels": [
      "4 raios congelantes",
      "+2 raios",
      "+15% área",
      "+1 salto",
      "Alvos congelados estilhaçam"
    ],
    "fusionLevels": [
      {
        "bolts": 4,
        "chains": 1,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "bolts": 6,
        "chains": 1,
        "areaMult": 1.0,
        "damageMult": 1.06
      },
      {
        "bolts": 6,
        "chains": 1,
        "areaMult": 1.15,
        "damageMult": 1.1
      },
      {
        "bolts": 6,
        "chains": 2,
        "areaMult": 1.15,
        "damageMult": 1.15
      },
      {
        "bolts": 7,
        "chains": 2,
        "areaMult": 1.22,
        "damageMult": 1.22,
        "shatter": true
      }
    ]
  },
  blizzard: {
    "name": "BLIZZARD",
    "icon": "🌨️🌪️",
    "type": "fusion",
    "fusionPattern": "blizzard",
    "element": "ice",
    "max": 5,
    "damage": 34,
    "cooldown": 0.34,
    "area": 185,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: BLIZZARD.",
    "levels": [
      "Nevasca + cristais",
      "+20% área",
      "+2 cristais",
      "Congelamento mais forte",
      "Rajadas periódicas"
    ],
    "fusionLevels": [
      {
        "shards": 2,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "shards": 2,
        "areaMult": 1.2,
        "damageMult": 1.05
      },
      {
        "shards": 4,
        "areaMult": 1.2,
        "damageMult": 1.08
      },
      {
        "shards": 4,
        "areaMult": 1.25,
        "damageMult": 1.14,
        "freeze": 1.5
      },
      {
        "shards": 6,
        "areaMult": 1.3,
        "damageMult": 1.2,
        "freeze": 1.8
      }
    ]
  },
  glacialComet: {
    "name": "COMETA GLACIAL",
    "icon": "☄️❄️",
    "type": "fusion",
    "fusionPattern": "glacialComet",
    "element": "ice",
    "max": 5,
    "damage": 155,
    "cooldown": 2.05,
    "area": 118,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: COMETA GLACIAL.",
    "levels": [
      "2 cometas de gelo",
      "+1 cometa",
      "+3 fragmentos por impacto",
      "+20% área",
      "Solo congelado após impacto"
    ],
    "fusionLevels": [
      {
        "meteorCount": 2,
        "fragments": 2,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "meteorCount": 3,
        "fragments": 2,
        "areaMult": 1.0,
        "damageMult": 1.08
      },
      {
        "meteorCount": 3,
        "fragments": 5,
        "areaMult": 1.05,
        "damageMult": 1.1
      },
      {
        "meteorCount": 3,
        "fragments": 5,
        "areaMult": 1.22,
        "damageMult": 1.15
      },
      {
        "meteorCount": 4,
        "fragments": 6,
        "areaMult": 1.25,
        "damageMult": 1.22,
        "frostGround": true
      }
    ]
  },
  undeadConductor: {
    "name": "UNDEAD CONDUCTOR",
    "icon": "⚡💀",
    "type": "fusion",
    "fusionPattern": "undeadConductor",
    "element": "electric",
    "max": 5,
    "damage": 82,
    "cooldown": 0.8,
    "area": 150,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: UNDEAD CONDUCTOR.",
    "levels": [
      "Corrente salta 1 vez",
      "+1 salto",
      "+25% alcance",
      "+1 corrente",
      "Descarga ao derrotar inimigos"
    ],
    "fusionLevels": [
      {
        "summons": 9,
        "chains": 1,
        "range": 150,
        "damageMult": 1.0
      },
      {
        "summons": 10,
        "chains": 2,
        "range": 150,
        "damageMult": 1.06
      },
      {
        "summons": 11,
        "chains": 2,
        "range": 188,
        "damageMult": 1.1
      },
      {
        "summons": 12,
        "chains": 3,
        "range": 195,
        "damageMult": 1.14
      },
      {
        "summons": 14,
        "chains": 3,
        "range": 210,
        "damageMult": 1.22,
        "deathShock": true
      }
    ]
  },
  burningLegion: {
    "name": "LEGIÃO ARDENTE",
    "icon": "🔥💀",
    "type": "fusion",
    "fusionPattern": "burningLegion",
    "element": "fire",
    "max": 5,
    "damage": 78,
    "cooldown": 0.82,
    "area": 125,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: LEGIÃO ARDENTE.",
    "levels": [
      "Esqueletos com armas em chamas",
      "+2 esqueletos",
      "+20% dano",
      "Aura de fogo",
      "Explodem ao desaparecer"
    ],
    "fusionLevels": [
      {
        "summons": 9,
        "damageMult": 1.0
      },
      {
        "summons": 11,
        "damageMult": 1.0
      },
      {
        "summons": 11,
        "damageMult": 1.2
      },
      {
        "summons": 12,
        "damageMult": 1.22,
        "aura": true
      },
      {
        "summons": 14,
        "damageMult": 1.28,
        "aura": true,
        "deathBlast": true
      }
    ]
  },
  plagueLegion: {
    "name": "LEGIÃO DA PESTE",
    "icon": "☣️💀",
    "type": "fusion",
    "fusionPattern": "plagueLegion",
    "element": "poison",
    "max": 5,
    "damage": 70,
    "cooldown": 0.8,
    "area": 125,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: LEGIÃO DA PESTE.",
    "levels": [
      "Esqueletos aplicam veneno",
      "+2 esqueletos",
      "Nuvem tóxica no ataque",
      "+25% dano",
      "Poças venenosas ao matar"
    ],
    "fusionLevels": [
      {
        "summons": 9,
        "damageMult": 1.0
      },
      {
        "summons": 11,
        "damageMult": 1.0
      },
      {
        "summons": 11,
        "damageMult": 1.08,
        "cloud": true
      },
      {
        "summons": 12,
        "damageMult": 1.33,
        "cloud": true
      },
      {
        "summons": 14,
        "damageMult": 1.38,
        "cloud": true,
        "puddles": true
      }
    ]
  },
  toxicCombustion: {
    "name": "COMBUSTÃO TÓXICA",
    "icon": "💥☣️",
    "type": "fusion",
    "fusionPattern": "toxicCombustion",
    "element": "fire",
    "max": 5,
    "damage": 72,
    "cooldown": 0.52,
    "area": 115,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: COMBUSTÃO TÓXICA.",
    "levels": [
      "Fogo detona inimigos envenenados",
      "+20% área",
      "+25% dano",
      "Reação pode encadear",
      "Explosões deixam veneno"
    ],
    "fusionLevels": [
      {
        "areaMult": 1.0,
        "damageMult": 1.0,
        "chainChance": 0
      },
      {
        "areaMult": 1.2,
        "damageMult": 1.0,
        "chainChance": 0
      },
      {
        "areaMult": 1.2,
        "damageMult": 1.25,
        "chainChance": 0
      },
      {
        "areaMult": 1.25,
        "damageMult": 1.28,
        "chainChance": 0.35
      },
      {
        "areaMult": 1.3,
        "damageMult": 1.35,
        "chainChance": 0.45,
        "poisonAfter": true
      }
    ]
  },
  toxicCyclone: {
    "name": "CICLONE TÓXICO",
    "icon": "☣️🌪️",
    "type": "fusion",
    "fusionPattern": "toxicCyclone",
    "element": "poison",
    "max": 5,
    "damage": 48,
    "cooldown": 0.38,
    "area": 165,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: CICLONE TÓXICO.",
    "levels": [
      "1 ciclone venenoso",
      "+20% área",
      "+1 ciclone",
      "Puxa inimigos",
      "Nuvem residual"
    ],
    "fusionLevels": [
      {
        "vortices": 1,
        "pull": 15,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "vortices": 1,
        "pull": 15,
        "areaMult": 1.2,
        "damageMult": 1.05
      },
      {
        "vortices": 2,
        "pull": 18,
        "areaMult": 1.15,
        "damageMult": 1.08
      },
      {
        "vortices": 2,
        "pull": 34,
        "areaMult": 1.2,
        "damageMult": 1.12
      },
      {
        "vortices": 2,
        "pull": 38,
        "areaMult": 1.28,
        "damageMult": 1.2,
        "trail": true
      }
    ]
  },
  volcanicEruption: {
    "name": "ERUPÇÃO VULCÂNICA",
    "icon": "🌋",
    "type": "fusion",
    "fusionPattern": "volcanicEruption",
    "element": "fire",
    "max": 5,
    "damage": 170,
    "cooldown": 1.75,
    "area": 105,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: ERUPÇÃO VULCÂNICA.",
    "levels": [
      "4 erupções",
      "+1 erupção",
      "+20% área",
      "Pedras secundárias",
      "Lava persiste"
    ],
    "fusionLevels": [
      {
        "meteorCount": 4,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "meteorCount": 5,
        "areaMult": 1.0,
        "damageMult": 1.05
      },
      {
        "meteorCount": 5,
        "areaMult": 1.2,
        "damageMult": 1.1
      },
      {
        "meteorCount": 6,
        "areaMult": 1.2,
        "damageMult": 1.16,
        "fragments": 3
      },
      {
        "meteorCount": 6,
        "areaMult": 1.28,
        "damageMult": 1.22,
        "fragments": 4,
        "groundFire": true
      }
    ]
  },
  frozenSpires: {
    "name": "PINÁCULOS CONGELADOS",
    "icon": "🧊🪨",
    "type": "fusion",
    "fusionPattern": "frozenSpires",
    "element": "ice",
    "max": 5,
    "damage": 110,
    "cooldown": 1.15,
    "area": 92,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: PINÁCULOS CONGELADOS.",
    "levels": [
      "3 pilares congelados",
      "+1 pilar",
      "+20% área",
      "Empurrão maior",
      "Cristais explodem"
    ],
    "fusionLevels": [
      {
        "spires": 3,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "spires": 4,
        "areaMult": 1.0,
        "damageMult": 1.05
      },
      {
        "spires": 4,
        "areaMult": 1.2,
        "damageMult": 1.1
      },
      {
        "spires": 5,
        "areaMult": 1.2,
        "damageMult": 1.15,
        "push": true
      },
      {
        "spires": 6,
        "areaMult": 1.25,
        "damageMult": 1.22,
        "push": true,
        "shatter": true
      }
    ]
  },
  magneticField: {
    "name": "CAMPO MAGNÉTICO",
    "icon": "🧲⚡",
    "type": "fusion",
    "fusionPattern": "magneticField",
    "element": "electric",
    "max": 5,
    "damage": 40,
    "cooldown": 0.28,
    "area": 180,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: CAMPO MAGNÉTICO.",
    "levels": [
      "Campo puxa e eletrocuta",
      "+20% área",
      "Puxão maior",
      "+2 descargas",
      "Pulso magnético"
    ],
    "fusionLevels": [
      {
        "pull": 22,
        "bolts": 1,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "pull": 22,
        "bolts": 1,
        "areaMult": 1.2,
        "damageMult": 1.05
      },
      {
        "pull": 38,
        "bolts": 1,
        "areaMult": 1.2,
        "damageMult": 1.08
      },
      {
        "pull": 40,
        "bolts": 3,
        "areaMult": 1.22,
        "damageMult": 1.12
      },
      {
        "pull": 48,
        "bolts": 4,
        "areaMult": 1.28,
        "damageMult": 1.2,
        "pulse": true
      }
    ]
  },
  infernalVolley: {
    "name": "RAJADA INFERNAL",
    "icon": "🔥🏹",
    "type": "fusion",
    "fusionPattern": "infernalVolley",
    "element": "fire",
    "max": 5,
    "damage": 58,
    "cooldown": 0.48,
    "area": 46,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: RAJADA INFERNAL.",
    "levels": [
      "4 flechas flamejantes",
      "+2 flechas",
      "+1 perfuração",
      "Explosão maior",
      "Queimadura intensa"
    ],
    "fusionLevels": [
      {
        "projectiles": 4,
        "pierce": 2,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "projectiles": 6,
        "pierce": 2,
        "areaMult": 1.0,
        "damageMult": 1.05
      },
      {
        "projectiles": 6,
        "pierce": 3,
        "areaMult": 1.0,
        "damageMult": 1.1
      },
      {
        "projectiles": 7,
        "pierce": 3,
        "areaMult": 1.25,
        "damageMult": 1.15
      },
      {
        "projectiles": 8,
        "pierce": 4,
        "areaMult": 1.28,
        "damageMult": 1.22,
        "burnBonus": true
      }
    ]
  },
  thunderVolley: {
    "name": "RAJADA DO TROVÃO",
    "icon": "⚡🏹",
    "type": "fusion",
    "fusionPattern": "thunderVolley",
    "element": "electric",
    "max": 5,
    "damage": 52,
    "cooldown": 0.45,
    "area": 38,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: RAJADA DO TROVÃO.",
    "levels": [
      "4 flechas elétricas",
      "+2 flechas",
      "+1 salto",
      "+20% dano",
      "Correntes maiores"
    ],
    "fusionLevels": [
      {
        "projectiles": 4,
        "chains": 1,
        "damageMult": 1.0
      },
      {
        "projectiles": 6,
        "chains": 1,
        "damageMult": 1.04
      },
      {
        "projectiles": 6,
        "chains": 2,
        "damageMult": 1.08
      },
      {
        "projectiles": 7,
        "chains": 2,
        "damageMult": 1.28
      },
      {
        "projectiles": 8,
        "chains": 3,
        "damageMult": 1.34
      }
    ]
  },
  phantomBlades: {
    "name": "LÂMINAS FANTASMAS",
    "icon": "🌑🗡️",
    "type": "fusion",
    "fusionPattern": "phantomBlades",
    "element": "shadow",
    "max": 5,
    "damage": 42,
    "cooldown": 0.24,
    "area": 115,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: LÂMINAS FANTASMAS.",
    "levels": [
      "3 lâminas orbitais",
      "+1 lâmina",
      "+20% raio",
      "+1 lâmina",
      "Lâminas executam cortes extras"
    ],
    "fusionLevels": [
      {
        "blades": 3,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "blades": 4,
        "areaMult": 1.0,
        "damageMult": 1.05
      },
      {
        "blades": 4,
        "areaMult": 1.2,
        "damageMult": 1.08
      },
      {
        "blades": 5,
        "areaMult": 1.2,
        "damageMult": 1.12
      },
      {
        "blades": 6,
        "areaMult": 1.25,
        "damageMult": 1.2,
        "execution": true
      }
    ]
  },
  arcaneStorm: {
    "name": "TEMPESTADE ARCANA",
    "icon": "⚡🔮",
    "type": "fusion",
    "fusionPattern": "arcaneStorm",
    "element": "arcane",
    "max": 5,
    "damage": 64,
    "cooldown": 0.55,
    "area": 210,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: TEMPESTADE ARCANA.",
    "levels": [
      "4 runas disparam raios",
      "+2 runas",
      "+20% alcance",
      "+1 salto",
      "Runas pulsam em área"
    ],
    "fusionLevels": [
      {
        "bolts": 4,
        "chains": 1,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "bolts": 6,
        "chains": 1,
        "areaMult": 1.0,
        "damageMult": 1.05
      },
      {
        "bolts": 6,
        "chains": 1,
        "areaMult": 1.2,
        "damageMult": 1.1
      },
      {
        "bolts": 6,
        "chains": 2,
        "areaMult": 1.22,
        "damageMult": 1.15
      },
      {
        "bolts": 8,
        "chains": 2,
        "areaMult": 1.25,
        "damageMult": 1.22,
        "pulse": true
      }
    ]
  },
  arcaneSun: {
    "name": "SOL ARCANO",
    "icon": "☀️🔮",
    "type": "fusion",
    "fusionPattern": "arcaneSun",
    "element": "arcane",
    "max": 5,
    "damage": 54,
    "cooldown": 0.35,
    "area": 155,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: SOL ARCANO.",
    "levels": [
      "Sol acompanha e pulsa",
      "+20% área",
      "Lança 2 chamas",
      "+25% dano",
      "Erupção arcana periódica"
    ],
    "fusionLevels": [
      {
        "projectiles": 0,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "projectiles": 0,
        "areaMult": 1.2,
        "damageMult": 1.05
      },
      {
        "projectiles": 2,
        "areaMult": 1.2,
        "damageMult": 1.08
      },
      {
        "projectiles": 2,
        "areaMult": 1.25,
        "damageMult": 1.33
      },
      {
        "projectiles": 3,
        "areaMult": 1.3,
        "damageMult": 1.38,
        "pulse": true
      }
    ]
  },
  aegisBlade: {
    "name": "LÂMINA DA ÉGIDE",
    "icon": "🛡️⚔️",
    "type": "fusion",
    "fusionPattern": "aegisBlade",
    "element": "holy",
    "max": 5,
    "damage": 78,
    "cooldown": 0.42,
    "area": 138,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: LÂMINA DA ÉGIDE.",
    "levels": [
      "Golpe + barreira orbital",
      "+20% área",
      "+1 eco de golpe",
      "Escudos causam dano",
      "Explosão defensiva"
    ],
    "fusionLevels": [
      {
        "echoes": 0,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "echoes": 0,
        "areaMult": 1.2,
        "damageMult": 1.06
      },
      {
        "echoes": 1,
        "areaMult": 1.2,
        "damageMult": 1.1
      },
      {
        "echoes": 1,
        "areaMult": 1.25,
        "damageMult": 1.16,
        "shieldHit": true
      },
      {
        "echoes": 2,
        "areaMult": 1.3,
        "damageMult": 1.24,
        "shieldHit": true,
        "blast": true
      }
    ]
  },
  stormCleaver: {
    "name": "MACHADO DA TEMPESTADE",
    "icon": "🪓⚡",
    "type": "fusion",
    "fusionPattern": "stormCleaver",
    "element": "electric",
    "max": 5,
    "damage": 112,
    "cooldown": 0.72,
    "area": 54,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: MACHADO DA TEMPESTADE.",
    "levels": [
      "2 machados elétricos",
      "+1 machado",
      "+1 salto",
      "+20% tamanho",
      "Explosão elétrica no impacto"
    ],
    "fusionLevels": [
      {
        "projectiles": 2,
        "chains": 1,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "projectiles": 3,
        "chains": 1,
        "areaMult": 1.0,
        "damageMult": 1.05
      },
      {
        "projectiles": 3,
        "chains": 2,
        "areaMult": 1.0,
        "damageMult": 1.1
      },
      {
        "projectiles": 3,
        "chains": 2,
        "areaMult": 1.2,
        "damageMult": 1.15
      },
      {
        "projectiles": 4,
        "chains": 3,
        "areaMult": 1.25,
        "damageMult": 1.22,
        "impactBlast": true
      }
    ]
  },
  thunderRing: {
    "name": "ANEL DO TROVÃO",
    "icon": "⚡➰",
    "type": "fusion",
    "fusionPattern": "thunderRing",
    "element": "electric",
    "max": 5,
    "damage": 40,
    "cooldown": 0.23,
    "area": 115,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: ANEL DO TROVÃO.",
    "levels": [
      "3 lâminas elétricas",
      "+1 lâmina",
      "+20% raio",
      "+1 corrente",
      "Descarga a cada contato"
    ],
    "fusionLevels": [
      {
        "blades": 3,
        "chains": 1,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "blades": 4,
        "chains": 1,
        "areaMult": 1.0,
        "damageMult": 1.05
      },
      {
        "blades": 4,
        "chains": 1,
        "areaMult": 1.2,
        "damageMult": 1.08
      },
      {
        "blades": 5,
        "chains": 2,
        "areaMult": 1.2,
        "damageMult": 1.12
      },
      {
        "blades": 6,
        "chains": 2,
        "areaMult": 1.25,
        "damageMult": 1.2,
        "contactBurst": true
      }
    ]
  },
  celestialArray: {
    "name": "FORMAÇÃO CELESTIAL",
    "icon": "✨🔮",
    "type": "fusion",
    "fusionPattern": "celestialArray",
    "element": "holy",
    "max": 5,
    "damage": 88,
    "cooldown": 0.88,
    "area": 135,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: FORMAÇÃO CELESTIAL.",
    "levels": [
      "4 lanças em formação",
      "+2 lanças",
      "+20% alcance",
      "Segunda onda",
      "Lanças explodem em runas"
    ],
    "fusionLevels": [
      {
        "projectiles": 4,
        "waves": 1,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "projectiles": 6,
        "waves": 1,
        "areaMult": 1.0,
        "damageMult": 1.05
      },
      {
        "projectiles": 6,
        "waves": 1,
        "areaMult": 1.2,
        "damageMult": 1.1
      },
      {
        "projectiles": 6,
        "waves": 2,
        "areaMult": 1.2,
        "damageMult": 1.15
      },
      {
        "projectiles": 8,
        "waves": 2,
        "areaMult": 1.25,
        "damageMult": 1.22,
        "runeBlast": true
      }
    ]
  },
  briarTempest: {
    "name": "TEMPESTADE DE ESPINHOS",
    "icon": "🌿🌪️",
    "type": "fusion",
    "fusionPattern": "briarTempest",
    "element": "nature",
    "max": 5,
    "damage": 56,
    "cooldown": 0.52,
    "area": 170,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: TEMPESTADE DE ESPINHOS.",
    "levels": [
      "Raízes e vento em área",
      "+20% área",
      "+2 ondas",
      "Puxa inimigos",
      "Espinhos deixam veneno"
    ],
    "fusionLevels": [
      {
        "waves": 1,
        "pull": 12,
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "waves": 1,
        "pull": 12,
        "areaMult": 1.2,
        "damageMult": 1.05
      },
      {
        "waves": 3,
        "pull": 16,
        "areaMult": 1.2,
        "damageMult": 1.1
      },
      {
        "waves": 3,
        "pull": 32,
        "areaMult": 1.22,
        "damageMult": 1.14
      },
      {
        "waves": 4,
        "pull": 36,
        "areaMult": 1.28,
        "damageMult": 1.2,
        "poison": true
      }
    ]
  },
  thermalCollapse: {
    "name": "THERMAL COLLAPSE",
    "icon": "🌡️",
    "type": "fusion",
    "fusionPattern": "thermalCollapse",
    "element": "arcane",
    "max": 5,
    "damage": 185,
    "cooldown": 2.7,
    "area": 230,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: THERMAL COLLAPSE.",
    "levels": [
      "Congela e explode",
      "+15% raio",
      "Explosão mais forte",
      "Segunda onda térmica",
      "Choque térmico deixa zona residual"
    ],
    "fusionLevels": [
      {
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "areaMult": 1.15,
        "damageMult": 1.04
      },
      {
        "areaMult": 1.15,
        "damageMult": 1.22
      },
      {
        "areaMult": 1.22,
        "damageMult": 1.28,
        "secondWave": true
      },
      {
        "areaMult": 1.3,
        "damageMult": 1.35,
        "secondWave": true,
        "residual": true
      }
    ]
  },
  toxicCorpses: {
    "name": "CADÁVERES TÓXICOS",
    "icon": "☠️💀",
    "type": "fusion",
    "fusionPattern": "toxicCorpses",
    "element": "poison",
    "max": 5,
    "damage": 55,
    "cooldown": 0.38,
    "area": 188,
    "evolved": true,
    "fusion": true,
    "rarity": "arcane",
    "desc": "Arcane Fusion: CADÁVERES TÓXICOS.",
    "levels": [
      "Aura tóxica de almas",
      "+20% área",
      "+25% dano",
      "Mortes espalham veneno",
      "Nuvens maiores e persistentes"
    ],
    "fusionLevels": [
      {
        "areaMult": 1.0,
        "damageMult": 1.0
      },
      {
        "areaMult": 1.2,
        "damageMult": 1.05
      },
      {
        "areaMult": 1.2,
        "damageMult": 1.3
      },
      {
        "areaMult": 1.25,
        "damageMult": 1.34,
        "deathCloud": true
      },
      {
        "areaMult": 1.32,
        "damageMult": 1.42,
        "deathCloud": true,
        "persistent": true
      }
    ]
  },

  solarJudgment: { name:'JULGAMENTO SOLAR', icon:'☀️⚔️', type:'fusion', fusionPattern:'solarJudgment', element:'holy', max:5, damage:118, cooldown:1.15, area:190, evolved:true, fusion:true, rarity:'arcane', desc:'Édito Solar + Sol Carmesim: coluna de luz seguida por arcos flamejantes.', levels:lv('Coluna solar','+25% área','+2 arcos solares','Barreira após impacto','Explosão solar dupla'), fusionLevels:[{areaMult:1,damageMult:1},{areaMult:1.25,damageMult:1.05},{areaMult:1.25,damageMult:1.12,arcs:2},{areaMult:1.3,damageMult:1.18,arcs:2,barrier:true},{areaMult:1.38,damageMult:1.28,arcs:4,barrier:true,double:true}] },
  pestilentHex: { name:'HEX PESTILENTO', icon:'☣️🜏', type:'fusion', fusionPattern:'pestilentHex', element:'poison', max:5, damage:78, cooldown:.72, area:175, evolved:true, fusion:true, rarity:'arcane', desc:'Hex Abissal + Flecha da Peste: marcas contagiosas explodem em nuvens tóxicas.', levels:lv('3 marcas tóxicas','+2 marcas','Nuvem maior','Contágio automático','Cadeia pestilenta'), fusionLevels:[{marks:3,areaMult:1,damageMult:1},{marks:5,areaMult:1,damageMult:1.05},{marks:5,areaMult:1.22,damageMult:1.1},{marks:6,areaMult:1.25,damageMult:1.18,spread:true},{marks:7,areaMult:1.32,damageMult:1.28,spread:true,chain:true}] },
  elementalSingularity: { name:'SINGULARIDADE ELEMENTAL', icon:'🌀🔷', type:'fusion', fusionPattern:'elementalSingularity', element:'arcane', max:5, damage:64, cooldown:.62, area:185, evolved:true, fusion:true, rarity:'arcane', desc:'Convergência Primordial + Halo Arcano: núcleo rotativo alterna quatro elementos.', levels:lv('Pulso elemental','+20% área','Dois elementos por pulso','Puxa inimigos','Quatro elementos simultâneos'), fusionLevels:[{areaMult:1,damageMult:1},{areaMult:1.2,damageMult:1.05},{areaMult:1.22,damageMult:1.12,double:true},{areaMult:1.28,damageMult:1.18,double:true,pull:true},{areaMult:1.35,damageMult:1.28,double:true,pull:true,all:true}] },
  arcaneVanguard: { name:'VANGUARDA ARCANA', icon:'🛡️🌙', type:'fusion', fusionPattern:'arcaneVanguard', element:'arcane', max:5, damage:92, cooldown:.7, area:165, evolved:true, fusion:true, rarity:'arcane', desc:'Crescente Quebra-Feitiço + Bastião Eterno: cortes orbitais e barreira ofensiva.', levels:lv('Corte + escudos','+1 escudo','+20% largura','Contra-ataque','Muralha cortante'), fusionLevels:[{areaMult:1,damageMult:1,shields:4},{areaMult:1,damageMult:1.05,shields:5},{areaMult:1.2,damageMult:1.1,shields:5},{areaMult:1.24,damageMult:1.18,shields:6,counter:true},{areaMult:1.32,damageMult:1.28,shields:7,counter:true,wall:true}] },
  thunderFamiliar: { name:'FAMILIAR TROVEJANTE', icon:'✨⚡', type:'fusion', fusionPattern:'thunderFamiliar', element:'electric', max:5, damage:72, cooldown:.48, area:145, evolved:true, fusion:true, rarity:'arcane', desc:'Eidolon Prime + Senhor do Trovão: familiar dispara correntes elétricas.', levels:lv('1 familiar elétrico','+1 salto','+25% alcance','+1 familiar','Tempestade do familiar'), fusionLevels:[{damageMult:1,chains:1,range:150},{damageMult:1.06,chains:2,range:150},{damageMult:1.1,chains:2,range:188},{damageMult:1.16,chains:3,range:195,count:2},{damageMult:1.26,chains:4,range:220,count:2,storm:true}] },
  bloodRequiem: { name:'RÉQUIEM RUBRO', icon:'🩸👻', type:'fusion', fusionPattern:'bloodRequiem', element:'shadow', max:5, damage:84, cooldown:.78, area:195, evolved:true, fusion:true, rarity:'arcane', desc:'Eclipse Sanguíneo + Réquiem das Almas: ondas rubras liberam almas drenantes.', levels:lv('Onda + almas','+20% área','+2 almas','Cura limitada','Eclipse duplo'), fusionLevels:[{areaMult:1,damageMult:1,souls:2},{areaMult:1.2,damageMult:1.05,souls:2},{areaMult:1.22,damageMult:1.1,souls:4},{areaMult:1.25,damageMult:1.16,souls:4,heal:true},{areaMult:1.35,damageMult:1.28,souls:6,heal:true,double:true}] },
  dragonGale: { name:'VENDAVAL DO DRAGÃO', icon:'🐉🌪️', type:'fusion', fusionPattern:'dragonGale', element:'wind', max:5, damage:76, cooldown:.58, area:180, evolved:true, fusion:true, rarity:'arcane', desc:'Pulso do Dragão + Ceifador do Vendaval: ondas curvas formam uma cabeça de dragão de ar.', levels:lv('Onda dracônica','+20% largura','+1 onda','Empurrão maior','Rastro de vento cortante'), fusionLevels:[{areaMult:1,damageMult:1,waves:1},{areaMult:1.2,damageMult:1.05,waves:1},{areaMult:1.2,damageMult:1.1,waves:2},{areaMult:1.25,damageMult:1.16,waves:2,push:true},{areaMult:1.32,damageMult:1.28,waves:3,push:true,trail:true}] },
  stormDroneSwarm: { name:'ENXAME RÚNICO', icon:'🛰️⚡', type:'fusion', fusionPattern:'stormDroneSwarm', element:'electric', max:5, damage:68, cooldown:.46, area:150, evolved:true, fusion:true, rarity:'arcane', desc:'Supervisor Rúnico + Senhor do Trovão: drones criam uma rede elétrica móvel.', levels:lv('2 drones','+1 salto','+1 drone','Feixes cruzados','Pulso de tempestade'), fusionLevels:[{damageMult:1,count:2,chains:1},{damageMult:1.06,count:2,chains:2},{damageMult:1.1,count:3,chains:2},{damageMult:1.18,count:3,chains:3,cross:true},{damageMult:1.28,count:4,chains:4,cross:true,storm:true}] },


  solarGrimoire:{name:'SOLAR GRIMOIRE',icon:'📖☀️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'mage',element:'fire',max:14,damage:108,cooldown:.72,area:190,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Mago: círculos rúnicos disparam lasers solares.'},
  plagueColossus:{name:'PLAGUE COLOSSUS',icon:'☠️☣️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'necromancer',element:'poison',max:14,damage:112,cooldown:.78,area:190,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Necromante: colosso espalha peste e ondas ósseas.'},
  tempestHunter:{name:'TEMPEST HUNTER',icon:'🏹⚡',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'archer',element:'electric',max:14,damage:96,cooldown:.5,area:175,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Arqueiro: chuvas de flechas elétricas.'},
  arcaneEmperor:{name:'ARCANE EMPEROR',icon:'👑🛡️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'knight',element:'arcane',max:14,damage:118,cooldown:.62,area:210,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Cavaleiro: cortes, barreiras e ondas imperiais.'},
  worldTreePlague:{name:'WORLD TREE PLAGUE',icon:'🌳☣️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'druid',element:'poison',max:14,damage:90,cooldown:.72,area:220,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Druida: raízes gigantes infectam o campo.'},
  voidExecutioner:{name:'VOID EXECUTIONER',icon:'🌑⚔️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'assassin',element:'shadow',max:14,damage:105,cooldown:.38,area:165,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Assassino: múltiplas execuções sombrias.'},
  abyssalPlague:{name:'ABYSSAL PLAGUE',icon:'🕳️☣️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'warlock',element:'shadow',max:14,damage:96,cooldown:.7,area:215,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Warlock: portais amaldiçoados contaminam hordas.'},
  sunCrusader:{name:'SUN CRUSADER',icon:'☀️🛡️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'paladin',element:'holy',max:14,damage:116,cooldown:.66,area:215,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Paladino: cruzada solar e barreiras.'},
  primalOverlord:{name:'PRIMAL OVERLORD',icon:'🔶🌀',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'elementalist',element:'arcane',max:14,damage:104,cooldown:.55,area:220,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Elementalista: quatro elementos entram em sobrecarga.'},
  arcaneJuggernaut:{name:'ARCANE JUGGERNAUT',icon:'🗡️🛡️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'battlemage',element:'arcane',max:14,damage:126,cooldown:.58,area:210,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Mago de Batalha: espada colossal e barreira ofensiva.'},
  stormFamiliarSignature:{name:'STORM FAMILIAR PRIME',icon:'🌟⚡',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'summoner',element:'electric',max:14,damage:88,cooldown:.42,area:185,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Invocador: estrela orbital dispara e encadeia raios.'},
  bloodSanctum:{name:'BLOOD SANCTUM',icon:'🩸🔮',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'bloodMage',element:'shadow',max:14,damage:112,cooldown:.62,area:215,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Mago Sanguíneo: catedral rúnica lança ondas e lanças.'},
  dragonAvatar:{name:'DRAGON AVATAR',icon:'🐉🥋',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'monk',element:'wind',max:14,damage:102,cooldown:.4,area:195,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Monge: braços espectrais e vendavais em sequência.'},
  grandArcaneArsenal:{name:'GRAND ARCANE ARSENAL',icon:'🛰️⚙️',type:'fusion',fusionPattern:'signatureFusion',signatureFusionKind:'technomancer',element:'arcane',max:14,damage:92,cooldown:.38,area:180,evolved:true,fusion:true,rarity:'arcane',desc:'Fusion exclusiva do Tecnômante: satélite, drones e lasers coordenados.'},

};


WEAPONS.solarFamiliar = {
  name:'FAMILIAR SOLAR', icon:'☀️✨', type:'fusion', fusionPattern:'solarFamiliar',
  element:'fire', max:5, damage:82, cooldown:.48, area:150, evolved:true, fusion:true, rarity:'arcane',
  desc:'Celestial Wisp + Sol Carmesim: uma luz solar orbital dispara projéteis flamejantes e pequenas explosões.',
  levels:lv('Luz solar orbital','+1 projétil','Projéteis explodem','Segundo anel solar','Supernova periódica'),
  fusionLevels:[
    {damageMult:1,projectiles:3,areaMult:1},
    {damageMult:1.06,projectiles:4,areaMult:1},
    {damageMult:1.10,projectiles:4,areaMult:1.12,explode:true},
    {damageMult:1.18,projectiles:5,areaMult:1.18,explode:true,doubleRing:true},
    {damageMult:1.28,projectiles:6,areaMult:1.28,explode:true,doubleRing:true,storm:true}
  ]
};

const FUSION_PROGRESS_TEXT = [
  'Forma da Fusion estabilizada',
  '+1 ataque secundário ou alvo adicional',
  'Maior alcance e nova camada de projéteis',
  '+15% área e telegraph aprimorado',
  'MARCO I • nova propriedade ofensiva',
  '+1 perfuração/ricochete/corrente conforme a Fusion',
  'Zona residual ou efeito elemental persistente',
  '+2 ataques secundários',
  '+20% área efetiva e maior duração',
  'MARCO II • explosão/pulso secundário',
  '+1 entidade, meteoro, onda ou cadeia',
  'Efeito persistente dura mais',
  'Ataque maior ocasional / sobrecarga',
  'FORMA MÁXIMA • sequência Arcana final'
];

function numericBump(out, keys, amount = 1) {
  for (const key of keys) if (typeof out[key] === 'number') out[key] += amount;
}
function buildFusionLevel(baseStep, level) {
  const out = { ...(baseStep || {}) };
  out.damageMult = (out.damageMult || 1) * (1 + Math.min(.55, (level - 1) * .035));
  out.areaMult = (out.areaMult || 1) * (1 + Math.min(.42, (level - 1) * .025));

  // Cada nível muda comportamento, quantidade, alcance, duração ou propriedade.
  if ([2, 6, 11].includes(level)) numericBump(out, ['meteorCount','secondaryCount','vortices','projectiles','chains','bolts','marks','shields','souls','waves','count'], 1);
  if ([3, 8].includes(level)) numericBump(out, ['secondaryCount','projectiles','chains','bolts','marks','souls','waves'], level === 8 ? 2 : 1);
  if ([4, 9].includes(level)) {
    out.areaMult *= level === 9 ? 1.18 : 1.12;
    if (typeof out.range === 'number') out.range *= level === 9 ? 1.18 : 1.12;
    if (typeof out.pull === 'number') out.pull *= 1.15;
  }
  if (level >= 5) out.apex = true;
  if (level >= 7) { out.trail = true; out.zone = true; }
  if (level >= 10) { out.overdrive = true; out.double = out.double ?? true; }
  if (level >= 12) out.linger = true;
  if (level >= 13) out.majorCast = true;
  if (level >= 14) { out.ultimate = true; out.storm = true; out.all = true; out.cross = true; }
  return out;
}

for (const [fusionId, fusion] of Object.entries(WEAPONS)) {
  if (!fusion?.fusion) continue;
  const old = fusion.fusionLevels?.length ? fusion.fusionLevels : [{}];
  const seed = old[old.length - 1] || {};
  const expanded = [];
  for (let level = 1; level <= 14; level++) {
    const base = level <= old.length ? old[level - 1] : seed;
    expanded.push(buildFusionLevel(base, level));
  }
  fusion.max = 14;
  fusion.fusionLevels = expanded;
  fusion.levels = FUSION_PROGRESS_TEXT.map((text, i) => i === 13 ? `Lv.14 • ${text}` : text);
}


export function getWeaponLevelDescription(id, currentLevel) {
  const w = WEAPONS[id];
  if (!w) return '';
  const next = Math.min(w.max || 1, currentLevel + 1);
  if (w.fusion) return w.levels?.[next - 1] || w.desc;
  if (w.evolved) return w.desc;
  return w.levels?.[next - 1] || w.desc;
}

export function getWeaponStats(id, level = 1) {
  const w = WEAPONS[id];
  if (!w) return null;
  const s = { ...w };
  const l = Math.max(1, Math.min(w.max || 1, level));

  if (w.fusion) {
    const step = w.fusionLevels?.[l - 1] || {};
    Object.assign(s, step);
    s.damage = (w.damage || 0) * (step.damageMult || 1);
    s.area = (w.area || 0) * (step.areaMult || 1);
    s.cooldown = (w.cooldown || 1) * Math.max(.58, 1 - (l - 1) * .032);
    s.fusionLevel = l;
    return s;
  }

  if (w.evolved) return s;

  const bonusLv = l - 1;
  s.damage *= 1 + bonusLv * .18;
  s.area = (s.area || 0) * (1 + bonusLv * .07);
  s.speed = (s.speed || 0) * (1 + bonusLv * .045);
  s.cooldown *= Math.max(.62, 1 - bonusLv * .055);
  s.pierce = (s.pierce || 0) + (l >= 3 ? 1 : 0) + (l >= 5 ? 1 : 0);
  s.chains = (s.chains || 0) + (l >= 3 ? 1 : 0) + (l >= 5 ? 2 : 0);
  return s;
}
