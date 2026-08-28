import assert from 'node:assert/strict';
import { Game } from '../js/game.js';
import { Enemy } from '../js/entities/enemy.js';
import { ENEMIES } from '../js/config.js';
import { FUSION_RECIPES } from '../js/fusions.js';
import { FUSION_ITEMS } from '../js/items/fusionItems.js';
import { WEAPONS } from '../js/weapons/weaponData.js';

// Boss deck / scheduler: one ticket every 120s and no uncontrolled overlap.
{
  const spawned=[];
  const fake={
    time: 121, nextBossTime:120, bossQueue:[], bossDeck:[], bossDeckIndex:0, finalSpawned:false,
    enemies:[], shuffle(a){return a.reverse();},
    bossPool:Game.prototype.bossPool,
    refillBossDeck:Game.prototype.refillBossDeck,
    nextBossType:Game.prototype.nextBossType,
    activeBoss:Game.prototype.activeBoss,
    spawnBoss(type){spawned.push(type);this.enemies=[{boss:true,dead:false,type}];}
  };
  Game.prototype.updateBossSchedule.call(fake);
  assert.equal(spawned.length,1);
  assert.equal(fake.nextBossTime,240);

  fake.time=361; // tickets at 240 and 360; current boss still alive
  Game.prototype.updateBossSchedule.call(fake);
  assert.equal(spawned.length,1);
  assert.equal(fake.bossQueue.length,2);

  fake.enemies[0].dead=true;
  Game.prototype.updateBossSchedule.call(fake);
  assert.equal(spawned.length,2);
}

// No boss repeat until the deck is exhausted.
{
  const fake={bossDeck:[],bossDeckIndex:0,shuffle(a){return a;},bossPool:Game.prototype.bossPool,refillBossDeck:Game.prototype.refillBossDeck};
  const seen=[];
  for(let i=0;i<fake.bossPool().length;i++) seen.push(Game.prototype.nextBossType.call(fake));
  assert.equal(new Set(seen).size, seen.length);
}

// Bone Archer caps remain intentionally low.
{
  const fake={time:60};
  assert.equal(Game.prototype.boneArcherCap.call(fake),3);
  fake.time=360; assert.equal(Game.prototype.boneArcherCap.call(fake),5);
  fake.time=780; assert.equal(Game.prototype.boneArcherCap.call(fake),7);
  fake.time=1500; assert.equal(Game.prototype.boneArcherCap.call(fake),8);
}

// Familiar is an orbital light and fires exactly the configured projectile count.
{
  const shots=[];
  const target={x:200,y:0,dead:false,hitboxRadius:10};
  const fake={
    player:{x:0,y:0,speed:160},
    summons:[{id:'familiar',x:0,y:0,damage:10,cd:0,life:Infinity,target:null,orbitalLight:true,projectileCount:5,orbitRadius:64,orbitAngle:0,electric:false,doubleRing:false}],
    nearestEnemy(){return target;},
    spawnProjectile(p){shots.push(p);},
  };
  Game.prototype.updateSummons.call(fake,.1);
  assert.equal(shots.length,5);
  assert.ok(Math.hypot(fake.summons[0].x, fake.summons[0].y) > 55);
}

// Every required item has a boss source capable of dropping it.
for (const [id,item] of Object.entries(FUSION_ITEMS)) {
  const source=ENEMIES[item.source];
  assert.ok(source?.boss, `source boss missing for ${id}`);
  const drops=[...(source.fusionItems||[]), ...(source.fusionItem?[source.fusionItem]:[])];
  assert.ok(drops.includes(id), `boss ${item.source} cannot drop ${id}`);
}

// Gated fusion consumes item only when applied.
{
  const recipe=FUSION_RECIPES.find(r=>r.item);
  const player={
    weapons:Object.fromEntries(recipe.abilities.map(id=>[id,1])),
    weaponOrder:[...recipe.abilities],
    fusionItems:{[recipe.item]:1},
    hasFusionItem(id){return (this.fusionItems[id]||0)>0;},
    consumeFusionItem(id){if(!this.hasFusionItem(id))return false;this.fusionItems[id]--;if(this.fusionItems[id]<=0)delete this.fusionItems[id];return true;}
  };
  const fake={
    player,
    save:{discoverFusion(){},discoverEvolution(){}},
    stats:{fusions:0,evolutions:0},
    ui:{flashMessage(){},refreshWeaponBar(){},refreshFusionItems(){},showFusionBanner(){},showEvolutionBanner(){}},
    weaponSystem:{timers:{}}
  };
  Game.prototype.applyTransformation.call(fake,recipe,true);
  assert.equal(player.fusionItems[recipe.item],undefined);
  assert.equal(player.weapons[recipe.result],1);
  for(const id of recipe.replace) assert.equal(player.weapons[id],undefined);
}

// Lv.14 is a real maximum for all Fusions.
for(const recipe of FUSION_RECIPES){
  assert.equal(WEAPONS[recipe.result].max,14);
  assert.ok(WEAPONS[recipe.result].fusionLevels[13].ultimate);
}

console.log('GAMEPLAY_SYSTEMS_2_7_OK');
