import { WEAPONS } from './weapons/weaponData.js?v=2.7.0';

export const FUSION_RECIPES = [
  { id: 'apocalypseRain', name: 'CHUVA DO APOCALIPSE', result: 'apocalypseRain', abilities: ['infernalSun', 'cataclysm'], replace: ['infernalSun', 'cataclysm'], fusion: true, item: 'heartVolcano' },
  { id: 'flameTornado', name: 'TORNADO DE CHAMAS', result: 'flameTornado', abilities: ['infernalSun', 'galeReaper'], replace: ['infernalSun', 'galeReaper'], fusion: true },
  { id: 'plasmaOrb', name: 'ORBE DE PLASMA', result: 'plasmaOrb', abilities: ['infernalSun', 'thunderLord'], replace: ['infernalSun', 'thunderLord'], fusion: true },
  { id: 'cryostorm', name: 'CRYOSTORM', result: 'cryostorm', abilities: ['frozenStorm', 'thunderLord'], replace: ['frozenStorm', 'thunderLord'], fusion: true },
  { id: 'blizzard', name: 'BLIZZARD', result: 'blizzard', abilities: ['absoluteZero', 'galeReaper'], replace: ['absoluteZero', 'galeReaper'], fusion: true },
  { id: 'glacialComet', name: 'COMETA GLACIAL', result: 'glacialComet', abilities: ['absoluteZero', 'cataclysm'], replace: ['absoluteZero', 'cataclysm'], fusion: true, item: 'frozenCore' },
  { id: 'undeadConductor', name: 'UNDEAD CONDUCTOR', result: 'undeadConductor', abilities: ['skeletonColossus', 'thunderLord'], replace: ['skeletonColossus', 'thunderLord'], fusion: true, item: 'necromancerCrown' },
  { id: 'burningLegion', name: 'LEGIÃO ARDENTE', result: 'burningLegion', abilities: ['skeletonColossus', 'infernalSun'], replace: ['skeletonColossus', 'infernalSun'], fusion: true },
  { id: 'plagueLegion', name: 'LEGIÃO DA PESTE', result: 'plagueLegion', abilities: ['skeletonColossus', 'plagueArrow'], replace: ['skeletonColossus', 'plagueArrow'], fusion: true },
  { id: 'toxicCombustion', name: 'COMBUSTÃO TÓXICA', result: 'toxicCombustion', abilities: ['plagueArrow', 'infernalSun'], replace: ['plagueArrow', 'infernalSun'], fusion: true },
  { id: 'toxicCyclone', name: 'CICLONE TÓXICO', result: 'toxicCyclone', abilities: ['plagueArrow', 'galeReaper'], replace: ['plagueArrow', 'galeReaper'], fusion: true },
  { id: 'volcanicEruption', name: 'ERUPÇÃO VULCÂNICA', result: 'volcanicEruption', abilities: ['earthshatter', 'infernalSun'], replace: ['earthshatter', 'infernalSun'], fusion: true },
  { id: 'frozenSpires', name: 'PINÁCULOS CONGELADOS', result: 'frozenSpires', abilities: ['earthshatter', 'absoluteZero'], replace: ['earthshatter', 'absoluteZero'], fusion: true },
  { id: 'magneticField', name: 'CAMPO MAGNÉTICO', result: 'magneticField', abilities: ['earthshatter', 'thunderLord'], replace: ['earthshatter', 'thunderLord'], fusion: true },
  { id: 'infernalVolley', name: 'RAJADA INFERNAL', result: 'infernalVolley', abilities: ['divineEye', 'infernalSun'], replace: ['divineEye', 'infernalSun'], fusion: true },
  { id: 'thunderVolley', name: 'RAJADA DO TROVÃO', result: 'thunderVolley', abilities: ['divineEye', 'thunderLord'], replace: ['divineEye', 'thunderLord'], fusion: true },
  { id: 'phantomBlades', name: 'LÂMINAS FANTASMAS', result: 'phantomBlades', abilities: ['voidFang', 'soulRequiem'], replace: ['voidFang', 'soulRequiem'], fusion: true, item: 'voidFragment' },
  { id: 'arcaneStorm', name: 'TEMPESTADE ARCANA', result: 'arcaneStorm', abilities: ['arcaneHalo', 'thunderLord'], replace: ['arcaneHalo', 'thunderLord'], fusion: true },
  { id: 'arcaneSun', name: 'SOL ARCANO', result: 'arcaneSun', abilities: ['arcaneHalo', 'infernalSun'], replace: ['arcaneHalo', 'infernalSun'], fusion: true, item: 'celestialFeather' },
  { id: 'aegisBlade', name: 'LÂMINA DA ÉGIDE', result: 'aegisBlade', abilities: ['eternalBulwark', 'runicExecutioner'], replace: ['eternalBulwark', 'runicExecutioner'], fusion: true },
  { id: 'stormCleaver', name: 'MACHADO DA TEMPESTADE', result: 'stormCleaver', abilities: ['worldSplitter', 'tempestCrown'], replace: ['worldSplitter', 'tempestCrown'], fusion: true },
  { id: 'thunderRing', name: 'ANEL DO TROVÃO', result: 'thunderRing', abilities: ['recallBlade', 'thunderLord'], replace: ['recallBlade', 'thunderLord'], fusion: true },
  { id: 'celestialArray', name: 'FORMAÇÃO CELESTIAL', result: 'celestialArray', abilities: ['seraphLance', 'arcaneHalo'], replace: ['seraphLance', 'arcaneHalo'], fusion: true },
  { id: 'briarTempest', name: 'TEMPESTADE DE ESPINHOS', result: 'briarTempest', abilities: ['plagueGarden', 'galeReaper'], replace: ['plagueGarden', 'galeReaper'], fusion: true, item: 'ancientRoot' },
  { id: 'thermalCollapse', name: 'THERMAL COLLAPSE', result: 'thermalCollapse', abilities: ['infernalSun', 'absoluteZero'], replace: ['infernalSun', 'absoluteZero'], fusion: true },
  { id: 'toxicCorpses', name: 'CADÁVERES TÓXICOS', result: 'toxicCorpses', abilities: ['soulRequiem', 'plagueArrow'], replace: ['soulRequiem', 'plagueArrow'], fusion: true },
  { id: 'solarJudgment', name: 'JULGAMENTO SOLAR', result: 'solarJudgment', abilities: ['solarEdict', 'infernalSun'], replace: ['solarEdict', 'infernalSun'], fusion: true },
  { id: 'pestilentHex', name: 'HEX PESTILENTO', result: 'pestilentHex', abilities: ['abyssalHex', 'plagueArrow'], replace: ['abyssalHex', 'plagueArrow'], fusion: true },
  { id: 'elementalSingularity', name: 'SINGULARIDADE ELEMENTAL', result: 'elementalSingularity', abilities: ['primalConvergence', 'arcaneHalo'], replace: ['primalConvergence', 'arcaneHalo'], fusion: true, item: 'titanCore' },
  { id: 'arcaneVanguard', name: 'VANGUARDA ARCANA', result: 'arcaneVanguard', abilities: ['spellbreakerCrescent', 'eternalBulwark'], replace: ['spellbreakerCrescent', 'eternalBulwark'], fusion: true },
  { id: 'thunderFamiliar', name: 'FAMILIAR TROVEJANTE', result: 'thunderFamiliar', abilities: ['eidolonPrime', 'thunderLord'], replace: ['eidolonPrime', 'thunderLord'], fusion: true, item: 'soulLantern' },
  { id: 'solarFamiliar', name: 'FAMILIAR SOLAR', result: 'solarFamiliar', abilities: ['eidolonPrime', 'infernalSun'], replace: ['eidolonPrime', 'infernalSun'], fusion: true },
  { id: 'bloodRequiem', name: 'RÉQUIEM RUBRO', result: 'bloodRequiem', abilities: ['sanguineEclipse', 'soulRequiem'], replace: ['sanguineEclipse', 'soulRequiem'], fusion: true, item: 'bloodMoonShard' },
  { id: 'dragonGale', name: 'VENDAVAL DO DRAGÃO', result: 'dragonGale', abilities: ['dragonPulse', 'galeReaper'], replace: ['dragonPulse', 'galeReaper'], fusion: true },
  { id: 'stormDroneSwarm', name: 'ENXAME RÚNICO', result: 'stormDroneSwarm', abilities: ['runicOverseer', 'thunderLord'], replace: ['runicOverseer', 'thunderLord'], fusion: true, item: 'stormCrystal' },
];

export function meetsFusion(player, recipe) {
  const abilitiesReady = recipe.abilities.every(id => (player.weapons[id] || 0) >= 1);
  const itemReady = !recipe.item || (player.fusionItems?.[recipe.item] || 0) > 0;
  return abilitiesReady && itemReady;
}

export function fusionProgress(player, recipe) {
  return {
    abilities: recipe.abilities.map(id => ({ id, ready: (player.weapons[id] || 0) >= 1 })),
    item: recipe.item ? { id: recipe.item, ready: (player.fusionItems?.[recipe.item] || 0) > 0 } : null
  };
}

export function availableFusions(player) {
  return FUSION_RECIPES.filter(recipe => !player.weapons[recipe.result] && meetsFusion(player, recipe));
}

export function fusionHint(recipe) {
  const a = WEAPONS[recipe.abilities[0]];
  const b = WEAPONS[recipe.abilities[1]];
  return `${a?.name || recipe.abilities[0]} + ${b?.name || recipe.abilities[1]} → ${WEAPONS[recipe.result]?.name || recipe.name}`;
}
