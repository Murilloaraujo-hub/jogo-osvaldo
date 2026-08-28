import { WEAPONS } from './weapons/weaponData.js?v=2.8.0';
import { EVOLUTIONS } from './evolutions.js?v=2.8.0';
import { FUSION_RECIPES } from './fusions.js?v=2.8.0';
import { FUSION_ITEMS } from './items/fusionItems.js?v=2.8.0';
import { SIGNATURE_ABILITIES } from './abilities/signatures.js?v=2.8.0';
import { CHARACTERS } from './config.js?v=2.8.0';

const SOURCE_LABEL=id=>({infernalWyrm:'Infernal Wyrm',frostColossus:'Frost Colossus',stormHerald:'Storm Herald',graveTyrant:'Grave Tyrant',voidReaper:'Void Reaper',titanRoots:'Titan of Roots',arcaneBehemoth:'Arcane Behemoth',plagueMother:'Plague Mother',beastBoss:'Fera Carmesim'}[id]||id||'Bosses/Eventos');
export function baseForEvolution(evolvedId){const e=EVOLUTIONS.find(x=>x.result===evolvedId);return e?.base||null;}
export function recipeState(save,recipe){
  if(save?.data?.settings?.recipeMode==='all')return 'discovered';
  if(save?.data?.fusions?.includes(recipe.id))return 'discovered';
  const knownAbilities=new Set(save?.data?.abilities||[]), knownEvos=new Set(save?.data?.evolutions||[]), knownItems=new Set(save?.data?.fusionItemsDiscovered||[]);
  let known=0,total=recipe.abilities.length+(recipe.item?1:0);
  for(const id of recipe.abilities){if(knownAbilities.has(id)||knownEvos.has(id)||knownAbilities.has(baseForEvolution(id)))known++;}
  if(recipe.item&&knownItems.has(recipe.item))known++;
  // Conhecer todos os ingredientes não significa já ter criado a Fusion. A receita só
  // fica completamente revelada depois da primeira criação (ou no modo MOSTRAR TODAS).
  return known===0?'unknown':'partial';
}
export function runRequirement(game,recipe){
  const rows=[];
  if(recipe.classId){rows.push({kind:'class',id:recipe.classId,ready:game?.player?.id===recipe.classId,label:`Classe: ${CHARACTERS[recipe.classId]?.name||recipe.classId}`});}
  for(const id of recipe.abilities){
    const ready=!!game?.player?.weapons?.[id]; const base=baseForEvolution(id); const baseLv=base?(game?.player?.weapons?.[base]||0):0;
    rows.push({kind:'ability',id,ready,base,baseLv,target:WEAPONS[id]?.name||id,label:ready?`${WEAPONS[id]?.icon||'✦'} ${WEAPONS[id]?.name||id}`:baseLv?`${WEAPONS[base]?.name||base} Lv.${baseLv}/5 → ${WEAPONS[id]?.name||id}`:`${WEAPONS[id]?.name||id}`});
  }
  if(recipe.item){rows.push({kind:'item',id:recipe.item,ready:!!game?.player?.fusionItems?.[recipe.item],label:`${FUSION_ITEMS[recipe.item]?.icon||'✦'} ${FUSION_ITEMS[recipe.item]?.name||recipe.item}`,source:FUSION_ITEMS[recipe.item]?.source});}
  return rows;
}
export function howToUnlock(recipe){
  const out=[];let n=1;
  if(recipe.classId) out.push(`${n++}. Use a classe ${CHARACTERS[recipe.classId]?.name||recipe.classId}; esta Fusion é exclusiva.`);
  for(const evolved of recipe.abilities){const base=baseForEvolution(evolved);if(base){out.push(`${n++}. Adquira ${WEAPONS[base]?.name||base}.`);out.push(`${n++}. Eleve ${WEAPONS[base]?.name||base} ao Lv.5 para evoluir para ${WEAPONS[evolved]?.name||evolved}.`);}else out.push(`${n++}. Obtenha ${WEAPONS[evolved]?.name||evolved}.`);}
  if(recipe.item){const it=FUSION_ITEMS[recipe.item];out.push(`${n++}. Obtenha ${it?.name||recipe.item}${it?.source?` derrotando principalmente ${SOURCE_LABEL(it.source)}`:''}.`);}
  out.push(`${n}. Com todos os requisitos presentes, a Arcane Fusion acontece automaticamente.`);return out;
}
export function fusionSearchText(recipe){return [recipe.id,recipe.name,WEAPONS[recipe.result]?.name,recipe.classId,recipe.classId&&CHARACTERS[recipe.classId]?.name,...recipe.abilities.map(id=>WEAPONS[id]?.name),recipe.item&&FUSION_ITEMS[recipe.item]?.name,WEAPONS[recipe.result]?.element].filter(Boolean).join(' ').toLowerCase();}
export function signatureRows(){return Object.entries(SIGNATURE_ABILITIES).map(([classId,s])=>({classId,...s,weapon:WEAPONS[s.base],evolution:WEAPONS[s.evolution]}));}
