import { WEAPONS } from './weapons/weaponData.js?v=2.7.0';
import { FUSION_RECIPES, availableFusions } from './fusions.js?v=2.7.0';

export const EVOLUTIONS = [
  { id: 'infernalSun', name: 'SOL CARMESIM', result: 'infernalSun', base: 'fireball', replace: ['fireball'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'divineEye', name: 'OLHO DIVINO', result: 'divineEye', base: 'arrow', replace: ['arrow'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'skeletonColossus', name: 'COLOSSO ESQUELÉTICO', result: 'skeletonColossus', base: 'skeleton', replace: ['skeleton'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'runicExecutioner', name: 'EXECUTOR RÚNICO', result: 'runicExecutioner', base: 'sword', replace: ['sword'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'thunderLord', name: 'SENHOR DO TROVÃO', result: 'thunderLord', base: 'lightning', replace: ['lightning'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'frozenStorm', name: 'TEMPESTADE CONGELANTE', result: 'frozenStorm', base: 'ice', replace: ['ice'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'absoluteZero', name: 'ZERO ABSOLUTO', result: 'absoluteZero', base: 'frostNova', replace: ['frostNova'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'worldSplitter', name: 'FENDE-MUNDOS', result: 'worldSplitter', base: 'axe', replace: ['axe'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'arcaneHalo', name: 'HALO ARCANO', result: 'arcaneHalo', base: 'aura', replace: ['aura'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'cataclysm', name: 'CATACLYSM', result: 'cataclysm', base: 'meteor', replace: ['meteor'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'recallBlade', name: 'LÂMINA DO RETORNO', result: 'recallBlade', base: 'boomerang', replace: ['boomerang'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'plagueArrow', name: 'FLECHA DA PESTE', result: 'plagueArrow', base: 'poison', replace: ['poison'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'soulRequiem', name: 'RÉQUIEM DAS ALMAS', result: 'soulRequiem', base: 'deathAura', replace: ['deathAura'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'eternalBulwark', name: 'BASTIÃO ETERNO', result: 'eternalBulwark', base: 'shield', replace: ['shield'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'seraphLance', name: 'LANÇA DO SERAFIM', result: 'seraphLance', base: 'holySpear', replace: ['holySpear'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'tempestCrown', name: 'COROA DA TEMPESTADE', result: 'tempestCrown', base: 'storm', replace: ['storm'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'galeReaper', name: 'CEIFADOR DO VENDAVAL', result: 'galeReaper', base: 'windBlade', replace: ['windBlade'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'plagueGarden', name: 'JARDIM DA PRAGA', result: 'plagueGarden', base: 'thorn', replace: ['thorn'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'voidFang', name: 'PRESA DO VAZIO', result: 'voidFang', base: 'shadowDagger', replace: ['shadowDagger'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'earthshatter', name: 'RUPTURA DA TERRA', result: 'earthshatter', base: 'stoneSpike', replace: ['stoneSpike'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'abyssalHex', name: 'HEX ABISSAL', result: 'abyssalHex', base: 'curse', replace: ['curse'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'solarEdict', name: 'ÉDITO SOLAR', result: 'solarEdict', base: 'holyBlade', replace: ['holyBlade'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'primalConvergence', name: 'CONVERGÊNCIA PRIMORDIAL', result: 'primalConvergence', base: 'elementalBolt', replace: ['elementalBolt'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'spellbreakerCrescent', name: 'CRESCENTE QUEBRA-FEITIÇO', result: 'spellbreakerCrescent', base: 'arcaneSlash', replace: ['arcaneSlash'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'eidolonPrime', name: 'EIDOLON PRIME', result: 'eidolonPrime', base: 'familiar', replace: ['familiar'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'sanguineEclipse', name: 'ECLIPSE SANGUÍNEO', result: 'sanguineEclipse', base: 'bloodNova', replace: ['bloodNova'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'dragonPulse', name: 'PULSO DO DRAGÃO', result: 'dragonPulse', base: 'kiBurst', replace: ['kiBurst'], desc: 'Evolução automática ao atingir Nv.5' },
  { id: 'runicOverseer', name: 'SUPERVISOR RÚNICO', result: 'runicOverseer', base: 'arcaneDrone', replace: ['arcaneDrone'], desc: 'Evolução automática ao atingir Nv.5' },
];

export const ARCANE_FUSIONS = FUSION_RECIPES;

export function evolutionForBase(id) {
  return EVOLUTIONS.find(e => e.base === id) || null;
}

export function autoEvolutionFor(player) {
  for (const recipe of EVOLUTIONS) {
    if (player.weapons[recipe.result]) continue;
    if ((player.weapons[recipe.base] || 0) >= 5) return { ...recipe, fusion: false, automatic: true };
  }
  return null;
}

export function availableTransformations(player) {
  return availableFusions(player);
}

export function replaceAbility(player, recipe) {
  const slotOrder = player.weaponOrder || Object.keys(player.weapons);
  const replaceIds = recipe.replace || recipe.abilities || [];
  const indexes = replaceIds.map(id => slotOrder.indexOf(id)).filter(i => i >= 0);
  const targetIndex = indexes.length ? Math.min(...indexes) : slotOrder.length;

  for (const oldId of replaceIds) {
    delete player.weapons[oldId];
    const idx = slotOrder.indexOf(oldId);
    if (idx >= 0) slotOrder.splice(idx, 1);
  }

  player.weapons[recipe.result] = 1;
  slotOrder.splice(Math.min(targetIndex, slotOrder.length), 0, recipe.result);
  player.weaponOrder = [...new Set(slotOrder.filter(id => WEAPONS[id] && player.weapons[id]))];
  return recipe.result;
}
