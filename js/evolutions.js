import { WEAPONS } from './weapons/weaponData.js';

export const EVOLUTIONS = [
  { id: 'infernalSun', name: 'SOL CARMESIM', result: 'infernalSun', replace: ['fireball'], requires: { weapons: { fireball: 5 }, passives: { might: 1 } }, desc: 'Bola de Fogo Nv.5 + Selo da Força' },
  { id: 'frozenStorm', name: 'TEMPESTADE CONGELANTE', result: 'frozenStorm', replace: ['ice'], requires: { weapons: { ice: 5, lightning: 5 }, passives: {} }, desc: 'Fragmentos de Gelo Nv.5 + Raio Nv.5' },
  { id: 'cursedLegion', name: 'LEGIÃO AMALDIÇOADA', result: 'cursedLegion', replace: ['skeleton'], requires: { weapons: { skeleton: 5, deathAura: 5 }, passives: {} }, desc: 'Esqueleto Nv.5 + Aura da Morte Nv.5' },
  { id: 'divineEye', name: 'OLHO DIVINO', result: 'divineEye', replace: ['arrow'], requires: { weapons: { arrow: 5 }, passives: { crit: 1 } }, desc: 'Arco Nv.5 + Olho Carmesim' },
  { id: 'eternalBulwark', name: 'BASTIÃO ETERNO', result: 'eternalBulwark', replace: ['shield'], requires: { weapons: { shield: 5, sword: 5 }, passives: { armor: 1 } }, desc: 'Escudo Giratório Nv.5 + Espada Rúnica Nv.5 + Armadura' },
  { id: 'plagueGarden', name: 'JARDIM DA PRAGA', result: 'plagueGarden', replace: ['thorn'], requires: { weapons: { thorn: 5, poison: 5 }, passives: {} }, desc: 'Espinhos Vivos Nv.5 + Flecha Venenosa Nv.5' }
];

export const ARCANE_FUSIONS = [
  { id: 'thermalCollapse', name: 'THERMAL COLLAPSE', result: 'thermalCollapse', replace: ['fireball', 'frostNova'], requires: { weapons: { fireball: 5, frostNova: 5 }, passives: { elementalCore: 1 } }, desc: 'Bola de Fogo Nv.5 + Nova de Gelo Nv.5 + Núcleo Elemental' },
  { id: 'undeadConductor', name: 'UNDEAD CONDUCTOR', result: 'undeadConductor', replace: ['skeleton', 'lightning'], requires: { weapons: { skeleton: 5, lightning: 5 }, passives: { necroCore: 1 } }, desc: 'Necromancia Nv.5 + Raio Nv.5 + Códice Profano' },
  { id: 'flameTornado', name: 'TORNADO DE CHAMAS', result: 'flameTornado', replace: ['fireball', 'windBlade'], requires: { weapons: { fireball: 5, windBlade: 5 }, passives: { elementalCore: 1 } }, desc: 'Fogo Nv.5 + Vento Nv.5 + Núcleo Elemental' },
  { id: 'toxicCorpses', name: 'CADÁVERES TÓXICOS', result: 'toxicCorpses', replace: ['poison', 'deathAura'], requires: { weapons: { poison: 5, deathAura: 5 }, passives: { necroCore: 1 } }, desc: 'Veneno Nv.5 + Necromancia Nv.5 + Códice Profano' },
  { id: 'volcanicEruption', name: 'ERUPÇÃO VULCÂNICA', result: 'volcanicEruption', replace: ['fireball', 'stoneSpike'], requires: { weapons: { fireball: 5, stoneSpike: 5 }, passives: { elementalCore: 1 } }, desc: 'Fogo Nv.5 + Terra Nv.5 + Núcleo Elemental' }
];

function meets(player, recipe) {
  for (const [id, lv] of Object.entries(recipe.requires.weapons || {})) {
    if ((player.weapons[id] || 0) < lv) return false;
  }
  for (const [id, lv] of Object.entries(recipe.requires.passives || {})) {
    if ((player.passives[id] || 0) < lv) return false;
  }
  return true;
}

export function availableTransformations(player) {
  const out = [];
  for (const recipe of ARCANE_FUSIONS) {
    if (!player.weapons[recipe.result] && meets(player, recipe)) out.push({ ...recipe, fusion: true });
  }
  for (const recipe of EVOLUTIONS) {
    if (!player.weapons[recipe.result] && meets(player, recipe)) out.push({ ...recipe, fusion: false });
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
