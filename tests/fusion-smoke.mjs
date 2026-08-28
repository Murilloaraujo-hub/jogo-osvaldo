import { WeaponSystem } from '../js/weapons/weapons.js?v=2.7.0';
import { WEAPONS, getWeaponStats } from '../js/weapons/weaponData.js?v=2.7.0';
import { FUSION_RECIPES } from '../js/fusions.js?v=2.7.0';

function enemy(x,y,boss=false){return {x,y,size:18,hitboxRadius:15,dead:false,boss,hp:1000,maxHp:1000,status:{freeze:0,poison:0,poisonDps:0,burn:0,burnDps:0}};}

function makeGame(){
  const enemies=[enemy(120,0),enemy(180,40),enemy(220,-70),enemy(260,90),enemy(300,0),enemy(350,-110),enemy(420,80)];
  const log={activity:0,projectiles:0,meteors:0,damage:0,effects:0,summons:0,areas:0,arcs:0};
  const g={
    time:12.3,
    player:{x:0,y:0,area:1,damage:1,projectileSpeed:1,amount:0,weaponOrder:[],weapons:{},cooldown:1,attackSpeed:1,hp:100,maxHp:100},
    grid:{query(){return enemies;}},
    flags:{}, delayedEffects:[], lightningArcs:[], orbitVisuals:[], shake:0,
    randomEnemy(){return enemies.find(e=>!e.dead)||null;},
    nearestEnemy(){return enemies.find(e=>!e.dead)||null;},
    closestEnemies(x,y,r,n){return enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y)).slice(0,n);},
    createMeteor(){log.activity++;log.meteors++;},
    areaHit(){log.activity++;log.areas++;},
    addAbilityEffect(){log.activity++;log.effects++;},
    emitElementParticles(){log.activity++;},
    ensureSummons(){log.activity++;log.summons++;},
    spawnProjectile(){log.activity++;log.projectiles++;},
    damageEnemy(e,d){log.activity++;log.damage+=d||0;e.hp-=d||0;return d||0;},
    colorFor(){return '#fff';},
    onAbilityCast(){},
  };
  const originalPush=g.lightningArcs.push.bind(g.lightningArcs);
  g.lightningArcs.push=(...args)=>{log.activity++;log.arcs+=args.length;return originalPush(...args)};
  return {g,log,enemies};
}

let cases=0;
for(const recipe of FUSION_RECIPES){
  for(let level=1;level<=14;level++){
    const {g,log}=makeGame();
    const ws=new WeaponSystem(g);
    const w=getWeaponStats(recipe.result,level);
    ws.fireFusion(recipe.result,w,level,1);
    const delayed=[...g.delayedEffects];
    g.delayedEffects.length=0;
    for(const d of delayed){ if(typeof d.fn==='function') d.fn(); }
    if(log.activity<=0) throw new Error(`${recipe.id} Lv.${level} produced no gameplay activity`);
    cases++;
  }
}
console.log(`FUSION_RUNTIME_SMOKE_OK ${cases} cases`);
