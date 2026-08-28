import { WEAPONS, getWeaponStats } from '../js/weapons/weaponData.js?v=2.7.0';
import { EVOLUTIONS, availableTransformations, replaceAbility, autoEvolutionFor } from '../js/evolutions.js?v=2.7.0';
import { FUSION_RECIPES } from '../js/fusions.js?v=2.7.0';

function playerWith(ids,id=null){
  const weapons={};
  for(const wid of ids) weapons[wid]=1;
  return {id,weapons,weaponOrder:[...ids],fusionItems:{}};
}

// Every base ability has an automatic Lv.5 evolution.
for(const evo of EVOLUTIONS){
  const p=playerWith([evo.base]);
  p.weapons[evo.base]=5;
  const found=autoEvolutionFor(p);
  if(!found || found.result!==evo.result) throw new Error(`Auto evolution failed: ${evo.base}`);
  replaceAbility(p,found);
  if(p.weapons[evo.base]) throw new Error(`Base remained after evolution: ${evo.base}`);
  if(p.weapons[evo.result]!==1) throw new Error(`Evolution missing: ${evo.result}`);
}

// Every fusion consumes exactly two inputs and creates exactly one Lv.1 result.
for(const recipe of FUSION_RECIPES){
  const p=playerWith(recipe.abilities, recipe.classId || null);
  if(recipe.item) p.fusionItems[recipe.item]=1;
  const available=availableTransformations(p);
  if(!available.some(r=>r.id===recipe.id)) throw new Error(`Fusion not detected: ${recipe.id}`);
  const before=p.weaponOrder.length;
  replaceAbility(p,recipe);
  for(const id of recipe.replace) if(p.weapons[id]) throw new Error(`Consumed ability remained: ${recipe.id}/${id}`);
  if(p.weapons[recipe.result]!==1) throw new Error(`Fusion result missing: ${recipe.id}`);
  if(p.weaponOrder.length!==before-1) throw new Error(`Fusion slot count wrong: ${recipe.id}`);

  // Fusion Lv.1-14 must materially change stats/config at each step.
  let prev=null;
  for(let lv=1;lv<=14;lv++){
    const cur=getWeaponStats(recipe.result,lv);
    if(!cur) throw new Error(`No stats: ${recipe.id} Lv.${lv}`);
    const signature=JSON.stringify(cur);
    if(prev===signature) throw new Error(`No progression change: ${recipe.id} Lv.${lv}`);
    prev=signature;
  }
}

// Find one pair of evolved abilities that has no recipe; it must not fuse.
const evolved=EVOLUTIONS.map(e=>e.result);
let nonPair=null;
outer: for(let i=0;i<evolved.length;i++) for(let j=i+1;j<evolved.length;j++){
  const a=evolved[i],b=evolved[j];
  if(!FUSION_RECIPES.some(r=>r.abilities.includes(a)&&r.abilities.includes(b))){ nonPair=[a,b]; break outer; }
}
if(!nonPair) throw new Error('Could not find a negative fusion pair');
if(availableTransformations(playerWith(nonPair)).length!==0) throw new Error(`Wrong abilities fused: ${nonPair.join('+')}`);

// Every evolved/main line participates in at least one Arcane Fusion.
for(const id of evolved){
  const count=FUSION_RECIPES.filter(r=>r.abilities.includes(id)).length;
  if(count<1) throw new Error(`Isolated evolved ability: ${id}`);
}

console.log(`FUSION_SYSTEM_OK evolutions=${EVOLUTIONS.length} fusions=${FUSION_RECIPES.length}`);
