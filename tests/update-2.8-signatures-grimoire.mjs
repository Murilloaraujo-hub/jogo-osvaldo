import assert from 'node:assert/strict';
import { CHARACTERS } from '../js/config.js';
import { WEAPONS, getWeaponStats } from '../js/weapons/weaponData.js';
import { WeaponSystem } from '../js/weapons/weapons.js';
import { EVOLUTIONS } from '../js/evolutions.js';
import { FUSION_RECIPES, meetsFusion } from '../js/fusions.js';
import { FUSION_ITEMS } from '../js/items/fusionItems.js';
import { RUN_ITEMS } from '../js/items/itemCatalog.js';
import { SIGNATURE_ABILITIES } from '../js/abilities/signatures.js';
import { recipeState, runRequirement, baseForEvolution } from '../js/grimoire.js';
import { Game } from '../js/game.js';

const classes=Object.keys(CHARACTERS);
assert.equal(classes.length,14,'14 classes expected');
assert.equal(Object.keys(SIGNATURE_ABILITIES).length,14,'14 signatures expected');

const evoByBase=new Map(EVOLUTIONS.map(e=>[e.base,e]));
for(const classId of classes){
  const sig=SIGNATURE_ABILITIES[classId];
  assert.ok(sig,`signature missing: ${classId}`);
  assert.equal(CHARACTERS[classId].startWeapon,sig.base,`wrong start weapon: ${classId}`);
  const base=WEAPONS[sig.base];
  const evolved=WEAPONS[sig.evolution];
  assert.ok(base,`signature weapon missing: ${sig.base}`);
  assert.equal(base.signature,true,`signature flag missing: ${sig.base}`);
  assert.equal(base.signatureClass,classId,`wrong signature class: ${sig.base}`);
  assert.equal(base.max,5,`signature must max at 5: ${sig.base}`);
  assert.ok(evolved,`signature evolution missing: ${sig.evolution}`);
  assert.equal(evoByBase.get(sig.base)?.result,sig.evolution,`evolution recipe mismatch: ${sig.base}`);
  const exclusive=FUSION_RECIPES.filter(r=>r.classId===classId && r.abilities.includes(sig.evolution));
  assert.ok(exclusive.length>=1,`signature evolution lacks exclusive fusion: ${classId}`);
  for(const r of exclusive){
    const p={id:classId,weapons:Object.fromEntries(r.abilities.map(id=>[id,1])),fusionItems:{}};
    if(r.item)p.fusionItems[r.item]=1;
    assert.equal(meetsFusion(p,r),true,`exclusive fusion should work for ${classId}/${r.id}`);
    const other=classes.find(id=>id!==classId);
    assert.equal(meetsFusion({...p,id:other},r),false,`exclusive fusion leaked to ${other}/${r.id}`);
  }
}


const mageExclusive=FUSION_RECIPES.find(r=>r.classId==='mage');
const classReq=runRequirement({player:{id:'mage',weapons:{},fusionItems:{}}},mageExclusive);
assert.equal(classReq[0].kind,'class');
assert.equal(classReq[0].ready,true);
assert.equal(runRequirement({player:{id:'archer',weapons:{},fusionItems:{}}},mageExclusive)[0].ready,false);

// Runtime smoke: all 14 signature abilities and their evolved forms execute through WeaponSystem.
function fakeGame(){
  const enemy={x:140,y:0,size:18,hitboxRadius:15,dead:false,hp:100,status:{freeze:0}};
  return {
    player:{x:0,y:0,damage:1,amount:0,projectileSpeed:1,area:1,lastMoveX:1,lastMoveY:0,damageTakenMultiplier:1,attackSpeed:1,cooldown:1,weapons:{},weaponOrder:[]},
    enemies:[enemy],flags:{},projectiles:[],delayedEffects:[],lightningArcs:[],orbitVisuals:[],shake:0,
    nearestEnemy:()=>enemy,closestEnemies:(_x,_y,_r,n)=>Array.from({length:Math.min(n,4)},(_,i)=>({...enemy,x:140+i*20,y:i*12,status:{freeze:0}})),randomEnemy:()=>enemy,
    spawnProjectile(p){this.projectiles.push(p);},ensureSummons(){},areaHit(){},damageEnemy(){return 1;},addAbilityEffect(){},emitElementParticles(){},createMeteor(){},healPlayer(){},onAbilityCast(){},colorFor(){return '#fff';},
    grid:{query:()=>[]}
  };
}
for(const [classId,sig] of Object.entries(SIGNATURE_ABILITIES)){
  for(let lv=1;lv<=5;lv++){
    const g=fakeGame(),ws=new WeaponSystem(g),w=getWeaponStats(sig.base,lv);
    assert.doesNotThrow(()=>ws.fire(sig.base,w,lv),`${classId} signature runtime Lv.${lv}`);
  }
  const g=fakeGame(),ws=new WeaponSystem(g),w=getWeaponStats(sig.evolution,1);
  assert.doesNotThrow(()=>ws.fire(sig.evolution,w,1),`${classId} evolved signature runtime`);
}

// Item catalog coverage.
assert.equal(Object.keys(FUSION_ITEMS).length,17,'17 fusion items expected');
for(const id of ['solarFragment','abyssalEye','primalSeed','dragonScale','arcaneGear','moonstone','arcaneCrown']) assert.ok(FUSION_ITEMS[id],id);
assert.equal(Object.keys(RUN_ITEMS).length,18,'18 run items expected');
const rarities=new Set(Object.values(RUN_ITEMS).map(x=>x.rarity));
for(const r of ['common','rare','epic','legendary','cursed']) assert.ok(rarities.has(r),`missing item rarity ${r}`);

// Grimoire state/progress is generated from recipe data.
const apocalypse=FUSION_RECIPES.find(r=>r.id==='apocalypseRain');
assert.ok(apocalypse);
assert.equal(baseForEvolution('infernalSun'),'fireball');
assert.equal(baseForEvolution('cataclysm'),'meteor');
const fakeSave={data:{settings:{recipeMode:'discovery'},fusions:[],abilities:['fireball'],evolutions:[],fusionItemsDiscovered:[]}};
assert.equal(recipeState(fakeSave,apocalypse),'partial');
const allKnownNoFusion={data:{settings:{recipeMode:'discovery'},fusions:[],abilities:['fireball','meteor'],evolutions:['infernalSun','cataclysm'],fusionItemsDiscovered:['heartVolcano']}};
assert.equal(recipeState(allKnownNoFusion,apocalypse),'partial','ingredients known should not equal first Fusion discovery');
allKnownNoFusion.data.fusions.push('apocalypseRain');
assert.equal(recipeState(allKnownNoFusion,apocalypse),'discovered','created Fusion should be permanently revealed');
const progressGame={player:{weapons:{fireball:3,meteor:4},fusionItems:{}}};
const req=runRequirement(progressGame,apocalypse);
assert.equal(req.length,3);
assert.equal(req[0].ready,false);
assert.equal(req[0].baseLv,3);
assert.equal(req[1].baseLv,4);
assert.equal(req[2].kind,'item');
assert.equal(req[2].ready,false);

// Level-up pool must never leak another class's signature.
const fake={
  player:{id:'mage',weapons:{runeBarrage:1},weaponOrder:['runeBarrage'],passives:{},passiveOrder:[]},
  banished:new Set(),
  rollRarity:()=> 'common',
  weightedChoices:(options)=>options
};
const choices=Game.prototype.getChoices.call(fake,999);
const leaked=choices.filter(c=>c.kind==='weapon' && WEAPONS[c.id]?.signature && WEAPONS[c.id]?.signatureClass!=='mage');
assert.equal(leaked.length,0,'other-class signatures leaked into Mage level-up pool');
assert.ok(choices.some(c=>c.id==='runeBarrage'),'own signature upgrade should remain available');

// Spawn balancing source-code guard: Bone Archer has its own lower caps.
const gameSource=await (await import('node:fs/promises')).readFile(new URL('../js/game.js',import.meta.url),'utf8');
assert.match(gameSource,/boneArcherCap\(\)[\s\S]*?return\s+2;[\s\S]*?return\s+4;[\s\S]*?return\s+6;[\s\S]*?return\s+7;/,'Bone Archer 2/4/6/7 cap expected');
assert.match(gameSource,/enemy\.elite\s*&&\s*Math\.random\(\)\s*<\s*\.11/,'elite chest chance should be 11%');

console.log(JSON.stringify({
  classes:classes.length,
  signatures:Object.keys(SIGNATURE_ABILITIES).length,
  baseAbilities:Object.entries(WEAPONS).filter(([,w])=>!w.evolved&&!w.fusion).length,
  evolutions:EVOLUTIONS.length,
  fusions:FUSION_RECIPES.length,
  fusionItems:Object.keys(FUSION_ITEMS).length,
  runItems:Object.keys(RUN_ITEMS).length,
  signatureRuntimeCases:Object.keys(SIGNATURE_ABILITIES).length*6,
  boneArcherCaps:[2,4,6,7],
  eliteChestChance:0.11
},null,2));
