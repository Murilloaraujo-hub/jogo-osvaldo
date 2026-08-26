export class Player{
 constructor(cfg,meta){Object.assign(this,{x:2600,y:2600,r:18,level:1,xpNow:0,xpNeed:12,kills:0,coins:0,damageDone:0,iframes:0,alive:true,souls:0});Object.assign(this,cfg.base);this.maxHp=this.hp;this.meta=meta;this.damage*=1+(meta.strength||0)*.02;this.maxHp+=5*(meta.vitality||0);this.hp=this.maxHp;this.speed*=1+(meta.agility||0)*.02;this.xp*=1+(meta.wisdom||0)*.03;this.weapons={};this.passives={};}
 update(input,dt,bounds){const a=input.axis();this.x=Math.max(30,Math.min(bounds.w-30,this.x+a.x*this.speed*dt));this.y=Math.max(30,Math.min(bounds.h-30,this.y+a.y*this.speed*dt));this.iframes=Math.max(0,this.iframes-dt)}
 gainXp(v){this.xpNow+=v*this.xp;let n=0;while(this.xpNow>=this.xpNeed){this.xpNow-=this.xpNeed;this.level++;this.xpNeed=Math.floor(12*Math.pow(1.19,this.level-1));n++}return n}
 takeDamage(d){if(this.iframes>0)return false;const reduced=d*(100/(100+Math.max(0,this.armor)*7));this.hp-=reduced;this.iframes=.55;if(this.hp<=0){this.hp=0;this.alive=false}return true}
}
