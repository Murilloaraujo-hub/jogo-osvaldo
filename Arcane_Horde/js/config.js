export const GAME_CONFIG = {
  version: '1.0.0', worldWidth: 5200, worldHeight: 5200, finalBossTime: 20*60,
  pickupLife: 90, maxEnemies: 520, performanceMaxEnemies: 330, spawnMargin: 90,
  baseXp: 12, xpGrowth: 1.19, contactIFrames: .55, gridSize: 120,
  colors: { physical:'#f1e5ca', fire:'#ff7043', ice:'#70d8ff', electric:'#ffe45b', shadow:'#b07cff', holy:'#fff0a6', poison:'#87d35b' }
};

export const CHARACTERS = {
  mage:{name:'Mago',icon:'🧙',startWeapon:'fireball',passive:'Sobrecarga Arcana',description:'Especialista em magia elemental e grandes áreas.',unlock:'Inicial',base:{hp:82,speed:210,damage:1.12,armor:0,crit:.06,critDamage:1.8,attackSpeed:1,cooldown:1,area:1.08,projectileSpeed:1,amount:0,pickup:90,xp:1.05}},
  archer:{name:'Arqueiro',icon:'🏹',startWeapon:'arrow',passive:'Olho do Caçador',description:'Velocidade, alcance, projéteis e crítico.',unlock:'Sobreviva 5 minutos',base:{hp:92,speed:235,damage:1,armor:1,crit:.14,critDamage:2,attackSpeed:1.12,cooldown:1,area:1,projectileSpeed:1.18,amount:0,pickup:85,xp:1}},
  necromancer:{name:'Necromante',icon:'💀',startWeapon:'skeleton',passive:'Colheita de Almas',description:'Invoca aliados e cresce com almas colhidas.',unlock:'Derrote 1.000 inimigos no total',base:{hp:88,speed:205,damage:.96,armor:1,crit:.05,critDamage:1.7,attackSpeed:1,cooldown:1,area:1,projectileSpeed:1,amount:0,pickup:95,xp:1.05}},
  knight:{name:'Cavaleiro',icon:'🛡️',startWeapon:'sword',passive:'Determinação',description:'Resistência, armadura e combate próximo.',unlock:'Derrote o primeiro miniboss',base:{hp:145,speed:185,damage:1.04,armor:7,crit:.05,critDamage:1.7,attackSpeed:1,cooldown:1.04,area:1.05,projectileSpeed:1,amount:0,pickup:80,xp:.98}}
};

export const MAPS = {
  ruins:{name:'Ruínas Esmeralda',icon:'🏚️',description:'Campos antigos, pedras rúnicas e vegetação esquecida.',unlock:true,ground:'#0c2520',accent:'#17392e'},
  ash:{name:'Terras de Cinzas',icon:'🌋',description:'Arena vulcânica mais agressiva. Desbloqueia após uma vitória.',unlock:'victory',ground:'#241916',accent:'#4d2921'}
};

export const ENEMIES = {
 slime:{name:'Slime',color:'#67c86d',hp:22,damage:8,speed:72,xp:7,size:16,behavior:'chase',coin:.025},
 goblin:{name:'Goblin',color:'#9ad14b',hp:32,damage:10,speed:116,xp:9,size:15,behavior:'chase',coin:.035},
 skeleton:{name:'Esqueleto',color:'#ded8bf',hp:55,damage:12,speed:86,xp:12,size:17,behavior:'chase',coin:.04},
 bat:{name:'Morcego',color:'#9c70d9',hp:24,damage:9,speed:150,xp:8,size:13,behavior:'chase',coin:.03},
 orc:{name:'Orc',color:'#62873e',hp:135,damage:20,speed:60,xp:24,size:24,behavior:'chase',coin:.08},
 darkMage:{name:'Mago Sombrio',color:'#7a4ba3',hp:78,damage:16,speed:66,xp:20,size:19,behavior:'ranged',coin:.07},
 elite:{name:'Elite',color:'#e6b64b',hp:390,damage:25,speed:82,xp:70,size:31,behavior:'chase',coin:.45},
 ogreBoss:{name:'Ogro Rúnico',color:'#b3663e',hp:1700,damage:28,speed:70,xp:180,size:48,behavior:'bossDash',coin:6,boss:true},
 lichBoss:{name:'Lich das Cinzas',color:'#7953b8',hp:3200,damage:24,speed:64,xp:300,size:44,behavior:'bossCaster',coin:10,boss:true},
 finalBoss:{name:'Rei do Eclipse',color:'#d53e72',hp:9800,damage:34,speed:76,xp:1000,size:62,behavior:'finalBoss',coin:40,boss:true}
};

export const PASSIVES = {
 might:{name:'Selo da Força',icon:'⚔️',desc:'+12% dano',max:5,apply:p=>p.damage*=1.12},
 vitality:{name:'Coração do Gigante',icon:'❤️',desc:'+20 HP máximo e cura 20',max:5,apply:p=>{p.maxHp+=20;p.hp=Math.min(p.maxHp,p.hp+20)}},
 agility:{name:'Botas do Vento',icon:'💨',desc:'+9% velocidade',max:5,apply:p=>p.speed*=1.09},
 tome:{name:'Tomo Arcano',icon:'📕',desc:'-8% cooldown',max:5,apply:p=>p.cooldown*=.92},
 armor:{name:'Placa Ancestral',icon:'🛡️',desc:'+2 armadura',max:5,apply:p=>p.armor+=2},
 area:{name:'Círculo Rúnico',icon:'⭕',desc:'+10% área',max:5,apply:p=>p.area*=1.10},
 amount:{name:'Eco Duplicador',icon:'✦',desc:'+1 projétil/quantidade',max:2,apply:p=>p.amount+=1},
 crit:{name:'Olho Carmesim',icon:'👁️',desc:'+5% crítico',max:5,apply:p=>p.crit+=.05},
 critDamage:{name:'Presa Rubra',icon:'🩸',desc:'+18% dano crítico',max:5,apply:p=>p.critDamage+=.18},
 magnet:{name:'Ímã Astral',icon:'🧲',desc:'+25 alcance de coleta',max:5,apply:p=>p.pickup+=25},
 wisdom:{name:'Coroa da Sabedoria',icon:'🧠',desc:'+8% XP',max:5,apply:p=>p.xp*=1.08},
 haste:{name:'Runa da Rapidez',icon:'⚡',desc:'+8% velocidade de ataque',max:5,apply:p=>p.attackSpeed*=1.08}
};

export const META_UPGRADES = {
 strength:{name:'Força',desc:'+2% dano por nível',max:10,baseCost:60},
 vitality:{name:'Vitalidade',desc:'+5 HP máximo por nível',max:10,baseCost:55},
 agility:{name:'Agilidade',desc:'+2% velocidade por nível',max:8,baseCost:65},
 wisdom:{name:'Sabedoria',desc:'+3% XP por nível',max:8,baseCost:70}
};

export const EVOLUTIONS = [
 {id:'infernalSun',name:'SOL INFERNAL',requires:['fireball','might'],desc:'Bola de Fogo Nv.5 + Selo da Força',weapon:'infernalSun'},
 {id:'frozenStorm',name:'TEMPESTADE CONGELANTE',requires:['ice','lightning'],desc:'Gelo Nv.5 + Raio Nv.5',weapon:'frozenStorm'},
 {id:'cursedLegion',name:'LEGIÃO AMALDIÇOADA',requires:['skeleton','deathAura'],desc:'Esqueletos Nv.5 + Aura da Morte',weapon:'cursedLegion'},
 {id:'divineEye',name:'OLHO DIVINO',requires:['arrow','crit'],desc:'Arco Nv.5 + Olho Carmesim',weapon:'divineEye'}
];
