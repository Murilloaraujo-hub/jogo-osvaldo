import { WEAPONS } from './weapons/weaponData.js?v=2.4.0';

// Evoluções diretas: ao chegar ao Nv.5, substituem automaticamente a habilidade base.
export const EVOLUTIONS = [
  { id: 'infernalSun', name: 'SOL CARMESIM', result: 'infernalSun', base: 'fireball', replace: ['fireball'], desc: 'Bola de Fogo Nv.5 → evolução automática.' },
  { id: 'frozenStorm', name: 'TEMPESTADE CONGELANTE', result: 'frozenStorm', base: 'ice', replace: ['ice'], desc: 'Fragmentos de Gelo Nv.5 → evolução automática.' },
  { id: 'cursedLegion', name: 'LEGIÃO AMALDIÇOADA', result: 'cursedLegion', base: 'skeleton', replace: ['skeleton'], desc: 'Esqueleto Guerreiro Nv.5 → evolução automática.' },
  { id: 'divineEye', name: 'OLHO DIVINO', result: 'divineEye', base: 'arrow', replace: ['arrow'], desc: 'Arco Nv.5 → evolução automática.' },
  { id: 'eternalBulwark', name: 'BASTIÃO ETERNO', result: 'eternalBulwark', base: 'shield', replace: ['shield'], desc: 'Escudo Giratório Nv.5 → evolução automática.' },
  { id: 'plagueGarden', name: 'JARDIM DA PRAGA', result: 'plagueGarden', base: 'thorn', replace: ['thorn'], desc: 'Espinhos Vivos Nv.5 → evolução automática.' }
];

// Fusions continuam sendo combinações especiais. As receitas usam a forma evoluída
// quando a habilidade original é substituída, evitando contar IDs removidos.
export const ARCANE_FUSIONS = [
  { id: 'thermalCollapse', name: 'THERMAL COLLAPSE', result: 'thermalCollapse', replace: ['infernalSun', 'frostNova'], requires: { weapons: { infernalSun: 1, frostNova: 5 }, passives: { elementalCore: 1 } }, desc: 'Sol Carmesim + Nova de Gelo Nv.5 + Núcleo Elemental' },
  { id: 'undeadConductor', name: 'UNDEAD CONDUCTOR', result: 'undeadConductor', replace: ['cursedLegion', 'lightning'], requires: { weapons: { cursedLegion: 1, lightning: 5 }, passives: { necroCore: 1 } }, desc: 'Legião Amaldiçoada + Raio Nv.5 + Códice Profano' },
  { id: 'flameTornado', name: 'TORNADO DE CHAMAS', result: 'flameTornado', replace: ['infernalSun', 'windBlade'], requires: { weapons: { infernalSun: 1, windBlade: 5 }, passives: { elementalCore: 1 } }, desc: 'Sol Carmesim + Vento Nv.5 + Núcleo Elemental' },
  { id: 'toxicCorpses', name: 'CADÁVERES TÓXICOS', result: 'toxicCorpses', replace: ['poison', 'deathAura'], requires: { weapons: { poison: 5, deathAura: 5 }, passives: { necroCore: 1 } }, desc: 'Veneno Nv.5 + Aura da Morte Nv.5 + Códice Profano' },
  { id: 'volcanicEruption', name: 'ERUPÇÃO VULCÂNICA', result: 'volcanicEruption', replace: ['infernalSun', 'stoneSpike'], requires: { weapons: { infernalSun: 1, stoneSpike: 5 }, passives: { elementalCore: 1 } }, desc: 'Sol Carmesim + Terra Nv.5 + Núcleo Elemental' }
];

function meets(player, recipe) {
  for (const [id, lv] of Object.entries(recipe.requires?.weapons || {})) {
    if ((player.weapons[id] || 0) < lv) return false;
  }
  for (const [id, lv] of Object.entries(recipe.requires?.passives || {})) {
    if ((player.passives[id] || 0) < lv) return false;
  }
  return true;
}

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

// Transformações disponíveis via baú são apenas Arcane Fusions.
export function availableTransformations(player) {
  const out = [];
  for (const recipe of ARCANE_FUSIONS) {
    if (!player.weapons[recipe.result] && meets(player, recipe)) out.push({ ...recipe, fusion: true });
  }
  return out;
}

export function replaceAbility(player, recipe) {
  const slotOrder = player.weaponOrder || Object.keys(player.weapons);
  const indexes = recipe.replace.map(id => slotOrder.indexOf(id)).filter(i => i >= 0);
  const targetIndex = indexes.length ? Math.min(...indexes) : slotOrder.length;

  for (const oldId of recipe.replace) {
    delete player.weapons[oldId];
    const idx = slotOrder.indexOf(oldId);
    if (idx >= 0) slotOrder.splice(idx, 1);
  }

  player.weapons[recipe.result] = 1;
  slotOrder.splice(Math.min(targetIndex, slotOrder.length), 0, recipe.result);
  player.weaponOrder = [...new Set(slotOrder.filter(id => WEAPONS[id] && player.weapons[id]))];
  return recipe.result;
}
