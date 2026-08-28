const RANK={common:0,rare:1,epic:2,legendary:3,cursed:3};
export const RUN_ITEMS={
  swiftFeather:{name:'Pena Veloz',icon:'🪶',rarity:'common',desc:'+7% velocidade de movimento.',apply(g){g.player.setMoveSpeed(g.player.speed*1.07);}},
  ironCharm:{name:'Amuleto de Ferro',icon:'⛓️',rarity:'common',desc:'+26 HP máximo e cura 26.',apply(g){g.player.maxHp+=26;g.player.hp=Math.min(g.player.maxHp,g.player.hp+26);}},
  arcaneDust:{name:'Pó Arcano',icon:'✨',rarity:'common',desc:'+8% experiência recebida.',apply(g){g.player.xp*=1.08;}},
  huntersEye:{name:'Olho do Caçador',icon:'🎯',rarity:'common',desc:'+5% chance crítica.',apply(g){g.player.crit+=.05;}},
  echoCrystal:{name:'Cristal do Eco',icon:'🔹',rarity:'rare',desc:'Ataques automáticos têm chance de repetir uma versão enfraquecida.',apply(g){g.flags.echoCrystal=true;}},
  frostRing:{name:'Anel de Gelo',icon:'💍❄️',rarity:'rare',desc:'Inimigos muito próximos ficam levemente mais lentos.',apply(g){g.flags.frostRing=true;}},
  emberCore:{name:'Núcleo de Brasa',icon:'🔥',rarity:'rare',desc:'Acertos podem aplicar uma queimadura curta.',apply(g){g.flags.emberCore=true;}},
  piercingFang:{name:'Presa Perfurante',icon:'🦷',rarity:'rare',desc:'Projéteis ganham +1 perfuração.',apply(g){g.player.pierceBonus=(g.player.pierceBonus||0)+1;}},
  mirrorRuneItem:{name:'Runa Espelhada',icon:'🪞',rarity:'epic',desc:'Periodicamente duplica um projétil ofensivo.',apply(g){g.flags.mirrorRune=true;g.flags.itemMirrorRune=true;}},
  stormBattery:{name:'Bateria da Tempestade',icon:'🔋⚡',rarity:'epic',desc:'A cada 8 ativações ofensivas, gera uma descarga em cadeia.',apply(g){g.flags.stormBattery=true;g.flags.stormBatteryCount=0;}},
  boneCrown:{name:'Coroa Óssea',icon:'👑🦴',rarity:'epic',desc:'Summons causam +24% dano e recebem aura visual.',apply(g){g.flags.boneCrown=true;}},
  gravityStone:{name:'Pedra da Gravidade',icon:'🪨🌀',rarity:'epic',desc:'Algumas ativações puxam levemente inimigos próximos.',apply(g){g.flags.gravityStone=true;}},
  infinityOrb:{name:'Orbe do Infinito',icon:'♾️',rarity:'legendary',desc:'Periodicamente repete uma habilidade equipada em potência reduzida.',apply(g){g.flags.infinityOrb=true;}},
  crownArchmage:{name:'Coroa do Arquimago',icon:'👑✦',rarity:'legendary',desc:'Habilidades arcanas ganham mais quantidade e presença visual.',apply(g){g.flags.crownArchmage=true;g.player.amount+=1;}},
  titanHeart:{name:'Coração de Titã',icon:'❤️🗿',rarity:'legendary',desc:'+70 HP máximo, +3 armadura e cura 70.',apply(g){g.player.maxHp+=70;g.player.hp=Math.min(g.player.maxHp,g.player.hp+70);g.player.armor+=3;}},
  deathBell:{name:'Sino da Morte',icon:'🔔',rarity:'legendary',desc:'A cada 45 inimigos derrotados, libera uma grande onda.',apply(g){g.flags.deathBell=true;g.flags.deathBellKills=0;}},
  cursedHourglass:{name:'Ampulheta Amaldiçoada',icon:'⏳☠️',rarity:'cursed',desc:'+18% velocidade de ataque, MAS bosses ganham +16% HP.',apply(g){g.player.attackSpeed*=1.18;g.flags.cursedHourglass=true;}},
  hungryCrown:{name:'Coroa Faminta',icon:'👑🩸',rarity:'cursed',desc:'+16% dano, MAS elites aparecem com maior frequência.',apply(g){g.player.damage*=1.16;g.flags.hungryCrown=true;}}
};

export function rollRunItem(owned=[],tier='common'){
  const tierRank={common:0,rare:1,epic:2,legendary:3,arcane:3}[tier]??0;
  const list=Object.entries(RUN_ITEMS).filter(([id,it])=>!owned.includes(id)&&RANK[it.rarity]<=Math.min(3,tierRank+1));
  if(!list.length)return null;
  const weighted=[];
  for(const pair of list){const rank=RANK[pair[1].rarity];const n=Math.max(1,9-rank*2+tierRank);for(let i=0;i<n;i++)weighted.push(pair);}
  return weighted[(Math.random()*weighted.length)|0];
}
export function applyRunItem(game,id){const it=RUN_ITEMS[id];if(!it)return false;if(!game.player.items.includes(id))game.player.items.push(id);it.apply?.(game);return true;}
