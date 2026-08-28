import assert from 'node:assert/strict';
import { WEAPONS } from '../js/weapons/weaponData.js';
import { FUSION_RECIPES, meetsFusion } from '../js/fusions.js';
import { FUSION_ITEMS } from '../js/items/fusionItems.js';
import { ENEMIES } from '../js/config.js';

for (const r of FUSION_RECIPES) {
  assert.equal(WEAPONS[r.result].max, 14, `${r.result} max`);
  assert.equal(WEAPONS[r.result].fusionLevels.length, 14, `${r.result} levels`);
}
const gated = FUSION_RECIPES.find(r=>r.item);
assert.ok(gated);
const p={id:gated.classId||null,weapons:Object.fromEntries(gated.abilities.map(id=>[id,1])),fusionItems:{}};
assert.equal(meetsFusion(p,gated),false);
p.fusionItems[gated.item]=1;
assert.equal(meetsFusion(p,gated),true);

for (const id of ['graveTyrant','arcaneBehemoth','plagueMother','frostColossus','infernalWyrm','stormHerald','titanRoots','voidReaper']) {
  assert.ok(ENEMIES[id]?.boss, id);
}
assert.equal(WEAPONS.familiar.max,5);
assert.equal(WEAPONS.eidolonPrime.name,'Celestial Wisp');
assert.ok(Object.keys(FUSION_ITEMS).length>=10);
console.log(`ADVANCED_PROGRESSION_OK fusions=${FUSION_RECIPES.length} items=${Object.keys(FUSION_ITEMS).length}`);
