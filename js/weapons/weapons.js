import{WEAPONS}from'./weaponData.js';
export class WeaponSystem{
 constructor(game){this.g=game;this.timers={};this.orbitAngle=0}
 update(dt){this.orbitAngle+=dt*1.8;for(const[id,lvl]of Object.entries(this.g.player.weapons)){const w=WEAPONS[id];if(!w)continue;this.timers[id]=(this.timers[id]||0)-dt;if(w.type==='orbit'){this.orbit(id,w,lvl,dt);continue}if(this.timers[id]<=0){this.fire(id,w,lvl);this.timers[id]=w.cooldown*this.g.player.cooldown/this.g.player.attackSpeed}}
 }
 fire(id,w,lvl){const g=this.g,p=g.player,mul=p.damage*(1+.22*(lvl-1)),count=1+p.amount+(lvl>=3?1:0);if(w.type==='projectile'||w.type==='ice'||w.type==='orbitShot'){for(let i=0;i<count;i++){const t=g.nearestEnemy(p.x,p.y,900);if(!t)return;const base=Math.atan2(t.y-p.y,t.x-p.x)+(i-(count-1)/2)*.12;g.spawnProjectile({x:p.x,y:p.y,vx:Math.cos(base)*w.speed*p.projectileSpeed,vy:Math.sin(base)*w.speed*p.projectileSpeed,r:w.area||10,damage:w.damage*mul,element:w.element,pierce:(w.pierce||0)+(lvl>=5?1:0),explode:id==='fireball'||id==='infernalSun'?w.area*p.area:0,freeze:w.element==='ice',poison:w.element==='poison'})}}
 else if(w.type==='melee')g.areaHit(p.x,p.y,w.area*p.area*(1+.08*lvl),w.damage*mul,w.element,0);
 else if(w.type==='lightning'){let targets=g.closestEnemies(p.x,p.y,700,Math.min(2+lvl+p.amount,8));for(const e of targets)g.damageEnemy(e,w.damage*mul,true,w.element,true)}
 else if(w.type==='aura')g.areaHit(p.x,p.y,w.area*p.area*(1+.08*lvl),w.damage*mul,w.element,w.element==='ice'?.7:0);
 else if(w.type==='meteor'){const t=g.randomEnemy();if(t)g.createMeteor(t.x+(Math.random()-.5)*80,t.y+(Math.random()-.5)*80,w.damage*mul,w.area*p.area)}
 else if(w.type==='summon')g.ensureSummons(id,Math.min(3+lvl+p.amount,id==='cursedLegion'?12:8),w.damage*mul)}
 }
 orbit(id,w,lvl,dt){const p=this.g.player,n=Math.min(2+lvl+p.amount,8),rad=78*p.area;for(let i=0;i<n;i++){const a=this.orbitAngle+i*Math.PI*2/n,x=p.x+Math.cos(a)*rad,y=p.y+Math.sin(a)*rad;this.g.areaHit(x,y,w.area*p.area,w.damage*p.damage*dt*3,w.element,0,true);this.g.orbitVisuals.push({x,y,r:10})}}
}
export{WEAPONS};
