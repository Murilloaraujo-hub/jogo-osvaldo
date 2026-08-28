import { Game } from '../js/game.js?v=2.7.0';

function victim(){return {x:10,y:20,color:'#fff',dead:false,elite:false,boss:false,type:'slime',xp:1,coin:0,maxHp:100,status:{freeze:0}};}
function fake(weapons){
  const log={areas:[],effects:[]};
  const g={
    player:{weapons:{...weapons},kills:0,eliteKills:0,bossKills:0,id:'mage',damage:1,souls:0},
    stats:{elites:0,bosses:0}, flags:{}, pickups:[], classPassives:null, delayedEffects:[], lightningArcs:[],
    spawnEnemyDeath(){}, spawnXp(){}, spawnChest(){}, rollChestTier(){return 'common';}, spawnRevenant(){},
    areaHit(x,y,r,d,el,fr,cont,src){log.areas.push({x,y,r,d,el,src});},
    addAbilityEffect(e){log.effects.push(e);}, emitElementParticles(){}, burst(){}, closestEnemies(){return [];}, damageEnemy(){}, end(){},
  };
  return {g,log};
}

// Burning Legion Lv.5 death blast exists and uses a non-recursive source id.
let {g,log}=fake({burningLegion:5});
Game.prototype.killEnemy.call(g,victim(),'burningLegion');
if(!log.areas.some(a=>a.src==='burningLegionBlast')) throw new Error('Burning Legion Lv.5 blast missing');

// Toxic Corpses death cloud starts at Lv.4, not earlier.
({g,log}=fake({toxicCorpses:3}));
const oldRandom=Math.random; Math.random=()=>0;
try { Game.prototype.killEnemy.call(g,victim(),'fireball'); } finally { Math.random=oldRandom; }
if(log.areas.some(a=>a.src==='toxicCorpsesCloud')) throw new Error('Toxic Corpses cloud active before Lv.4');

({g,log}=fake({toxicCorpses:4}));
Math.random=()=>0;
try { Game.prototype.killEnemy.call(g,victim(),'fireball'); } finally { Math.random=oldRandom; }
if(!log.areas.some(a=>a.src==='toxicCorpsesCloud')) throw new Error('Toxic Corpses Lv.4 cloud missing');

console.log('FUSION_KILL_EFFECTS_OK');
