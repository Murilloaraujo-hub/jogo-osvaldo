import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CHARACTERS } from '../js/config.js?v=2.9.0';
import { Player } from '../js/entities/player.js?v=2.9.0';
import { WEAPONS, getWeaponStats } from '../js/weapons/weaponData.js?v=2.9.0';
import { abilityInspection, fusionInspection, itemInspection, passiveInspection, runInspection } from '../js/systems/buildInspector.js?v=2.9.0';

const root = new URL('../', import.meta.url);
const read = rel => fs.readFileSync(new URL(rel, root), 'utf8');
const menus = read('js/ui/menus.js');
const index = read('index.html');
const css = read('css/style.css');
const gameSource = read('js/game.js');

// HUD: names live only in native tooltips / accessibility, never as permanent item text.
assert.match(menus, /d\.innerHTML=`<span>\$\{it\.icon\}<\/span>`/);
assert.doesNotMatch(menus, /d\.innerHTML=`[^`]*\$\{it\.icon\}[^`]*\$\{it\.name\}/);
assert.match(menus, /d\.innerHTML = `<span>\$\{r\.icon\}<\/span>`/);
assert.match(menus, /ESC → GRIMÓRIO/);

// ESC Build Analyzer tabs.
for (const tab of ['summary','abilities','fusions','items','relics','passive','statistics','grimoire','settings']) {
  assert.match(index, new RegExp(`data-pause-tab="${tab}"`));
}
assert.match(index, /id="pauseBuildList"/);
assert.match(index, /id="pauseBuildDetail"/);
assert.match(css, /\.pause-build-layout/);
assert.match(css, /@media\(max-width:700px\)/);
assert.match(css, /@media\(max-width:520px\)/);

// True pause: update() cannot run while paused, but rendering/UI still can.
assert.match(gameSource, /if \(!this\.paused && !this\.ended\) this\.update\(dt\)/);
assert.match(gameSource, /if \(!handled && \(!this\.paused \|\| this\.ui\.isPauseOpen\?\.\(\)\)\) this\.togglePause\(\)/);

// Runtime inspection must use current player modifiers rather than base-only numbers.
const player = new Player('mage', CHARACTERS.mage, { strength:0, vitality:0, agility:0, wisdom:0 });
player.addWeapon('fireball', 3);
player.damage = 1.5;
player.cooldown = .8;
player.attackSpeed = 1.25;
player.area = 1.3;
player.projectileSpeed = 1.2;
player.crit = .2;
player.critDamage = 2.1;
player.pierceBonus = 1;
player.items = [];
player.relics = [];

const game = {
  player,
  time: 20,
  weaponDamage: { fireball: 1200, 'classPassive:mage': 300 },
  damageHistory: { fireball: [{t:17,damage:200},{t:19,damage:300}], 'classPassive:mage':[{t:19,damage:100}] },
  sourceKills: { fireball: 12 },
  flags: {},
  summons: [],
  itemStats: {},
  relicStats: {},
  stats: { elites:2, bosses:1, healingReceived:30 },
  classPassives: {
    timer: 2.4,
    activations: 5,
    getRuntimeStats(){ return { 'Dano atual':'420', 'Largura':'90' }; }
  }
};
const fire = abilityInspection(game,'fireball');
assert.ok(fire);
const base = getWeaponStats('fireball',3);
const damageRow = fire.rows.find(x=>x.label==='Dano atual');
assert.equal(Number(damageRow.value.replace(/\./g,'').replace(',','.')), Math.round(base.damage * player.damage));
assert.equal(fire.totalDamage,1200);
assert.ok(fire.recentDps > 0);
assert.equal(fire.kills,12);
assert.ok(fire.rows.some(x=>x.label==='Crítico' && x.value==='20%'));
assert.ok(fire.rows.some(x=>x.label==='Cooldown atual'));

// Fusions report level/max/recipe from the same centralized definition.
player.addWeapon('apocalypseRain', 8);
player.weaponOrder = ['fireball','apocalypseRain'];
game.weaponDamage.apocalypseRain = 4500;
game.damageHistory.apocalypseRain = [{t:19,damage:700}];
const fusion = fusionInspection(game,'apocalypseRain');
assert.equal(fusion.level,8);
assert.equal(fusion.max,14);
assert.deepEqual(fusion.recipeNames, ['Sol Carmesim','Cataclysm']);
assert.ok(fusion.recipeItem);
assert.ok(fusion.nextUpgrade);

// Item and passive telemetry are exposed through the inspector.
player.items = ['echoCrystal'];
game.itemStats.echoCrystal = { activations: 7 };
const item = itemInspection(game,'echoCrystal');
assert.equal(item.usage.activations,7);
const passive = passiveInspection(game);
assert.equal(passive.remaining,2.4);
assert.equal(passive.activations,5);
assert.equal(passive.totalDamage,300);

const run = runInspection(game);
assert.equal(run.bosses,1);
assert.equal(run.healing,30);
assert.ok(run.totalDamage >= 6000);

console.log(JSON.stringify({
  pauseTabs:9,
  hudItemNamesPermanent:false,
  runtimeStats:true,
  fusionLevel:`${fusion.level}/${fusion.max}`,
  recentDps:true,
  truePauseGuard:true,
  responsiveBreakpoints:['700px','520px']
}, null, 2));
