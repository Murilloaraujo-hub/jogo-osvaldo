import { WeaponSystem } from '../js/weapons/weapons.js?v=2.7.0';
import { getWeaponStats } from '../js/weapons/weaponData.js?v=2.7.0';

function enemy(x,y){return {x,y,size:18,hitboxRadius:15,dead:false,boss:false,hp:1000,maxHp:1000,status:{freeze:0,poison:1,poisonDps:0,burn:0,burnDps:0}};}
function harness(){
  const enemies=[enemy(100,0),enemy(135,20),enemy(170,-15),enemy(205,30),enemy(240,-20),enemy(275,10)];
  const log={projectiles:[],areas:0,effects:[],arcs:0};
  const g={
    time:10, player:{x:0,y:0,area:1,damage:1,projectileSpeed:1,amount:0}, flags:{},
    grid:{query(){return enemies;}}, delayedEffects:[], lightningArcs:[], orbitVisuals:[],
    randomEnemy(){return enemies[0];}, nearestEnemy(){return enemies[0];},
    closestEnemies(x,y,r,n){return enemies.slice(0,n);},
    createMeteor(){}, ensureSummons(){}, emitElementParticles(){}, colorFor(){return '#fff';},
    areaHit(){log.areas++;},
    damageEnemy(e,d){e.hp-=d||0;return d||0;},
    addAbilityEffect(e){log.effects.push(e);},
    spawnProjectile(p){log.projectiles.push(p);},
  };
  const origPush=g.lightningArcs.push.bind(g.lightningArcs);
  g.lightningArcs.push=(...x)=>{log.arcs+=x.length;return origPush(...x)};
  return {g,log,enemies};
}
function fire(id,lv){const h=harness();const ws=new WeaponSystem(h.g);ws.fireFusion(id,getWeaponStats(id,lv),lv,1);return {...h,ws};}

// Frozen Spires Lv.4 introduces real knockback timing.
let h=fire('frozenSpires',4);
if(!h.g.delayedEffects.length) throw new Error('Frozen Spires Lv.4 push not scheduled');

// Magnetic Field Lv.5 introduces a second pulse.
h=fire('magneticField',5);
if(!h.g.delayedEffects.length) throw new Error('Magnetic Field Lv.5 pulse missing');

// Aegis Blade Lv.4 shields become damaging orbitals.
h=fire('aegisBlade',4);
if(h.g.orbitVisuals.length<4) throw new Error('Aegis Blade shield hits missing');

// Phantom Blades Lv.5 executes extra shadow cuts.
h=fire('phantomBlades',5);
if(!h.log.effects.some(e=>e.type==='shadowBurst')) throw new Error('Phantom Blades execution missing');

// Arcane Storm Lv.4 must create extra chain arcs.
h=fire('arcaneStorm',4);
if(h.log.arcs<=6) throw new Error('Arcane Storm extra chains missing');

// Toxic Combustion Lv.4 chain chance is mechanically connected.
const oldRandom=Math.random; Math.random=()=>0;
try { h=fire('toxicCombustion',4); } finally { Math.random=oldRandom; }
if(h.log.areas<=6) throw new Error('Toxic Combustion chain reaction missing');

// Infernal Volley Lv.5 projectile carries stronger burn.
h=fire('infernalVolley',5);
if(!h.log.projectiles.length || !h.log.projectiles.every(p=>p.burnBonus)) throw new Error('Infernal Volley burn bonus missing');

// Storm Cleaver explosion is the final-level mechanic, not always-on.
let h4=fire('stormCleaver',4), h5=fire('stormCleaver',5);
if(h4.log.projectiles.some(p=>p.explode>0)) throw new Error('Storm Cleaver impact blast active too early');
if(!h5.log.projectiles.some(p=>p.explode>0)) throw new Error('Storm Cleaver Lv.5 impact blast missing');

// Celestial Array Lv.5 projectiles gain rune explosions.
h=fire('celestialArray',5);
if(!h.log.projectiles.some(p=>p.explode>0)) throw new Error('Celestial Array rune blast missing');

// Thunder Ring Lv.5 adds an electric contact burst.
h=fire('thunderRing',5);
if(!h.log.effects.some(e=>e.type==='electricBurst')) throw new Error('Thunder Ring contact burst missing');

console.log('FUSION_UPGRADE_MECHANICS_OK');
