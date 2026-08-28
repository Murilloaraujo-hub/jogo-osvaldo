import { pathToFileURL } from 'url';
const root = new URL('../', import.meta.url);
const { CHARACTERS } = await import(new URL('../js/config.js', import.meta.url));
const { WEAPONS } = await import(new URL('../js/weapons/weaponData.js', import.meta.url));
const { EVOLUTIONS } = await import(new URL('../js/evolutions.js', import.meta.url));
const { FUSION_RECIPES } = await import(new URL('../js/fusions.js', import.meta.url));
const { CLASS_PASSIVES } = await import(new URL('../js/systems/classPassives.js', import.meta.url));
const { ABILITY_ROLES } = await import(new URL('../js/abilities/catalog.js', import.meta.url));

const assert=(cond,msg)=>{if(!cond)throw new Error(msg)};
assert(Object.keys(CHARACTERS).length===14,'Expected 14 classes');
for(const [id,c] of Object.entries(CHARACTERS)){
  assert(WEAPONS[c.startWeapon],`Missing start weapon for ${id}`);
  assert(CLASS_PASSIVES[id],`Missing class passive for ${id}`);
}
const bases=Object.entries(WEAPONS).filter(([,w])=>!w.evolved&&!w.fusion).map(([id])=>id);
const evoByBase=new Map(EVOLUTIONS.map(e=>[e.base,e]));
for(const id of bases){
  assert(evoByBase.has(id),`Base ability has no evolution: ${id}`);
  assert(WEAPONS[evoByBase.get(id).result],`Evolution result missing for ${id}`);
  assert(ABILITY_ROLES[id],`Role missing for base ability ${id}`);
}
for(const f of FUSION_RECIPES){
  assert(WEAPONS[f.result],`Fusion result missing: ${f.id}`);
  for(const a of f.abilities)assert(WEAPONS[a],`Fusion ingredient missing: ${f.id}/${a}`);
}
assert(evoByBase.get('skeleton').result==='skeletonColossus','Skeleton must evolve to Skeleton Colossus');
assert(WEAPONS.lightning.type==='thunderStrike','Lightning should be vertical thunder strike');
assert(WEAPONS.storm.type==='lightning','Storm should remain chain lightning');
console.log(JSON.stringify({classes:Object.keys(CHARACTERS).length,baseAbilities:bases.length,evolutions:EVOLUTIONS.length,fusions:FUSION_RECIPES.length,skeletonEvolution:evoByBase.get('skeleton').result,newClasses:['warlock','paladin','elementalist','battlemage','summoner','bloodMage','monk','technomancer']},null,2));
