export const SIGNATURE_ABILITIES = {
  mage: { base:'runeBarrage', evolution:'archmageCircle', name:'Rune Barrage', evolutionName:'Archmage Circle', style:'Arcano / controle / projéteis', icon:'✦' },
  necromancer: { base:'boneCovenant', evolution:'boneColossusSignature', name:'Bone Covenant', evolutionName:'Bone Colossus', style:'Summons / necromancia / pressão', icon:'☠️' },
  archer: { base:'huntersVolley', evolution:'thousandArrows', name:"Hunter's Volley", evolutionName:'Thousand Arrows', style:'Projéteis / crítico / alcance', icon:'🏹' },
  knight: { base:'arcaneBladeSignature', evolution:'kingsArcaneEdge', name:'Arcane Blade', evolutionName:"King's Arcane Edge", style:'Melee / defesa / ondas arcanas', icon:'⚔️' },
  druid: { base:'livingThorns', evolution:'worldRootsSignature', name:'Living Thorns', evolutionName:'World Roots', style:'Natureza / controle / perfuração', icon:'🌿' },
  assassin: { base:'shadowKnivesSignature', evolution:'nightmareBlades', name:'Shadow Knives', evolutionName:'Nightmare Blades', style:'Crítico / ricochete / sombras', icon:'🗡️' },
  warlock: { base:'abyssalSigilSignature', evolution:'gateOfAbyss', name:'Abyssal Sigil', evolutionName:'Gate of the Abyss', style:'Maldição / zona / explosões', icon:'🜏' },
  paladin: { base:'sacredWaveSignature', evolution:'divineCrusade', name:'Sacred Wave', evolutionName:'Divine Crusade', style:'Luz / defesa / área', icon:'☀️' },
  elementalist: { base:'primalCoreSignature', evolution:'elementalSingularitySignature', name:'Primal Core', evolutionName:'Elemental Singularity', style:'Elementos / adaptação / combos', icon:'🔶' },
  battlemage: { base:'arcaneGreatswordSignature', evolution:'spellbreakerSignature', name:'Arcane Greatsword', evolutionName:'Spellbreaker', style:'Cone / melee / magia', icon:'🗡️' },
  summoner: { base:'celestialLightSignature', evolution:'celestialStar', name:'Celestial Light', evolutionName:'Celestial Star', style:'Familiar orbital / rajadas', icon:'✨' },
  bloodMage: { base:'bloodLancesSignature', evolution:'crimsonCathedral', name:'Blood Lances', evolutionName:'Crimson Cathedral', style:'Lanças / área / pressão', icon:'🩸' },
  monk: { base:'kiFistsSignature', evolution:'thousandArms', name:'Ki Fists', evolutionName:'Thousand Arms', style:'Melee / ondas / velocidade', icon:'🥋' },
  technomancer: { base:'arcaneDronesSignature', evolution:'arcaneSatellite', name:'Arcane Drones', evolutionName:'Arcane Satellite', style:'Drones / lasers / precisão', icon:'⚙️' }
};

export const CLASS_ABILITY_BIASES = {
  mage: { elements:['arcane','fire','ice','electric'], types:['projectile','aura','meteor','thunderStrike'], bonus:1.65 },
  necromancer: { elements:['shadow','poison'], types:['summon','curse','aura'], bonus:1.75 },
  archer: { elements:['physical','wind','electric'], types:['projectile','lightning'], bonus:1.55 },
  knight: { elements:['physical','holy','arcane'], types:['melee','orbit','holyBlade','beam'], bonus:1.55 },
  druid: { elements:['nature','poison','earth','wind'], types:['nova','meteor','aura'], bonus:1.6 },
  assassin: { elements:['shadow','physical'], types:['projectile','melee'], bonus:1.6 },
  warlock: { elements:['shadow','poison'], types:['curse','aura','summon'], bonus:1.7 },
  paladin: { elements:['holy','physical'], types:['holyBlade','melee','orbit'], bonus:1.7 },
  elementalist: { elements:['fire','ice','electric','earth','arcane'], types:['elementalCycle','meteor','projectile','lightning'], bonus:1.75 },
  battlemage: { elements:['arcane','physical'], types:['beam','melee','orbit'], bonus:1.65 },
  summoner: { elements:['arcane','shadow','electric'], types:['summon','familiar','drone'], bonus:1.8 },
  bloodMage: { elements:['shadow','fire'], types:['bloodNova','projectile','aura'], bonus:1.6 },
  monk: { elements:['wind','physical'], types:['wave','melee','projectile'], bonus:1.65 },
  technomancer: { elements:['arcane','electric'], types:['drone','beam','lightning','projectile'], bonus:1.75 }
};

export function signatureForClass(id){ return SIGNATURE_ABILITIES[id] || null; }
export function isSignatureForClass(weapon, classId){ return !!weapon?.signature && weapon.signatureClass === classId; }
export function abilityBias(classId, weapon){
  const b=CLASS_ABILITY_BIASES[classId]; if(!b||!weapon) return 1;
  let weight=1;
  if(b.elements.includes(weapon.element)) weight*=b.bonus;
  if(b.types.includes(weapon.type)) weight*=1.28;
  return weight;
}
