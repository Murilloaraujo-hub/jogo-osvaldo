import { WEAPONS, getWeaponStats } from './weaponData.js?v=2.7.0';

export class WeaponSystem {
  constructor(game) {
    this.g = game;
    this.timers = {};
    this.orbitAngle = 0;
    this.castCounter = 0;
    this.chaosGuard = false;
  }

  update(dt) {
    const g = this.g;
    const p = g.player;
    this.orbitAngle += dt * 1.9;

    for (const id of p.weaponOrder) {
      const level = p.weapons[id];
      const w = getWeaponStats(id, level);
      if (!w) continue;

      this.timers[id] = (this.timers[id] || 0) - dt;

      if (w.type === 'orbit') {
        this.orbit(id, w, level, dt);
        continue;
      }

      if (this.timers[id] <= 0) {
        this.fire(id, w, level);
        const lowHpHaste = g.flags.bloodHourglass && p.hp / p.maxHp < .35 ? .78 : 1;
        this.timers[id] = w.cooldown * p.cooldown * lowHpHaste / p.attackSpeed;
      }
    }
  }

  fire(id, w, level, fromChaos = false) {
    const g = this.g;
    const p = g.player;
    const power = p.damage;
    const countBonus = p.amount + (level >= 3 ? 1 : 0) + (level >= 5 ? 1 : 0);

    if (w.fusion) {
      this.fireFusion(id, w, level, power);
    } else switch (w.type) {
      case 'projectile':
        this.fireProjectile(id, w, level, power, countBonus);
        break;
      case 'melee':
        g.areaHit(p.x, p.y, w.area * p.area, w.damage * power, w.element, 0, false, id);
        g.addAbilityEffect({ type: 'swordSlash', x: p.x, y: p.y, radius: w.area * p.area, angle: this.orbitAngle * 1.8, life: .22, maxLife: .22 });
        g.emitElementParticles(p.x, p.y, w.element, 5, { minSpeed: 25, maxSpeed: 75, life: .25 });
        if (level >= 4) g.areaHit(p.x, p.y, w.area * p.area * .75, w.damage * power * .45, 'arcane', 0, false, id);
        break;
      case 'lightning': this.fireLightning(id, w, power, level); break;
      case 'thunderStrike': this.fireThunderStrike(id, w, power, level); break;
      case 'aura':
        g.areaHit(p.x, p.y, w.area * p.area, w.damage * power, w.element, w.element === 'ice' ? .9 : 0, true, id);
        break;
      case 'nova':
        g.areaHit(p.x, p.y, w.area * p.area, w.damage * power, w.element, w.element === 'ice' ? 1.4 : 0, false, id);
        g.addAbilityEffect({
          type: id === 'frostNova' ? 'frostNova' : id === 'thorn' ? 'thornNova' : 'physicalImpact',
          x: p.x, y: p.y, radius: w.area * p.area, life: .42, maxLife: .42
        });
        g.emitElementParticles(p.x, p.y, w.element, 18, { minSpeed: 55, maxSpeed: 155, life: .42 });
        if (id === 'thorn' && level >= 4) g.healPlayer(2.5);
        break;
      case 'meteor':
        this.fireMeteor(id, w, power, level, countBonus);
        break;
      case 'summon':
        this.fireSummon(id, w, level, power);
        break;
      case 'thermal': this.fireThermal(id, w, power); break;
      case 'curse': this.fireCurse(id, w, level, power); break;
      case 'holyBlade': this.fireHolyBlade(id, w, level, power); break;
      case 'elementalCycle': this.fireElementalCycle(id, w, level, power); break;
      case 'beam': this.fireBeam(id, w, level, power); break;
      case 'familiar': this.fireCompanion(id, w, level, power, 'familiar'); break;
      case 'bloodNova': this.fireBloodNova(id, w, level, power); break;
      case 'wave': this.fireWave(id, w, level, power); break;
      case 'drone': this.fireCompanion(id, w, level, power, 'drone'); break;
    }

    g.onAbilityCast(id);
    if (!fromChaos) this.maybeChaosCast(id);
  }

  fireProjectile(id, w, level, power, countBonus) {
    const g = this.g;
    const p = g.player;
    const count = Math.max(1, 1 + countBonus);
    const target = g.nearestEnemy(p.x, p.y, 980);
    if (!target) return;

    const aim = Math.atan2(target.y - p.y, target.x - p.x);
    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * .12;
      const a = aim + spread;
      const projectile = {
        id,
        x: p.x,
        y: p.y,
        vx: Math.cos(a) * w.speed * p.projectileSpeed,
        vy: Math.sin(a) * w.speed * p.projectileSpeed,
        r: Math.max(6, Math.min(20, (w.area || 10) * p.area * .55)),
        damage: w.damage * power,
        element: w.element,
        pierce: w.pierce || 0,
        explode: (id === 'fireball' || id === 'infernalSun') ? (w.area || 0) * p.area : 0,
        freeze: w.element === 'ice',
        poison: w.element === 'poison',
        life: id === 'infernalSun' ? 5 : 3.2
      };
      g.spawnProjectile(projectile);

      if (g.flags.mirrorRune && Math.random() < .14) {
        const ma = a + (Math.random() - .5) * .5;
        g.spawnProjectile({
          ...projectile,
          vx: Math.cos(ma) * w.speed * p.projectileSpeed,
          vy: Math.sin(ma) * w.speed * p.projectileSpeed,
          damage: projectile.damage * .48,
          life: 2.6
        });
      }
    }
  }


  fireThunderStrike(id,w,power,level){
    const g=this.g,p=g.player, targets=g.closestEnemies(p.x,p.y,900,id==='thunderLord'?Math.min(4,1+Math.floor(level/2)+p.amount):Math.min(3,1+Math.floor(level/3)));
    for(let i=0;i<targets.length;i++){
      const t=targets[i],x=t.x,y=t.y,delay=.24+i*.08,r=(w.area||72)*p.area;
      g.addAbilityEffect({type:'thunderTelegraph',x,y,radius:r,life:delay,maxLife:delay});
      g.delayedEffects.push({t:delay,fn:()=>{g.areaHit(x,y,r,w.damage*power*(1-i*.08),'electric',0,false,id);g.addAbilityEffect({type:'thunderStrike',x,y,radius:r,life:.24,maxLife:.24});g.emitElementParticles(x,y,'electric',12,{minSpeed:55,maxSpeed:160,life:.3});g.shake=Math.max(g.shake,.09);}});
    }
  }

  fireLightning(id, w, power, level) {
    const g = this.g;
    const p = g.player;
    const maxTargets = Math.min(10, (w.chains || 2) + p.amount + Math.floor(level / 2));
    const targets = g.closestEnemies(p.x, p.y, 760, maxTargets);
    let previous = { x: p.x, y: p.y };
    for (let i = 0; i < targets.length; i++) {
      const e = targets[i];
      const falloff = Math.max(.62, 1 - i * .055);
      g.damageEnemy(e, w.damage * power * falloff, true, w.element, true, id);
      g.lightningArcs.push({ x1: previous.x, y1: previous.y, x2: e.x, y2: e.y, life: .12, color: g.colorFor(w.element) });
      previous = e;
      if ((id === 'storm' && level >= 5) || id === 'undeadConductor') {
        g.areaHit(e.x, e.y, 48, w.damage * power * .22, 'electric', 0, false, id);
      }
    }
  }

  fireMeteor(id, w, power, level, countBonus) {
    const g = this.g;
    let count = 1 + Math.min(3, Math.floor(level / 2));
    if (id === 'volcanicEruption') count = 5;
    count += Math.min(2, Math.floor(countBonus / 2));
    for (let i = 0; i < count; i++) {
      const t = g.randomEnemy();
      if (!t) break;
      g.createMeteor(
        t.x + (Math.random() - .5) * 100,
        t.y + (Math.random() - .5) * 100,
        w.damage * power,
        w.area * g.player.area,
        w.element,
        id
      );
    }
  }

  fireSummon(id, w, level, power) {
    const g = this.g;
    const p = g.player;
    let count = Math.min(4 + level + p.amount, 10);
    if (id === 'cursedLegion') count = Math.min(12 + p.amount, 16);
    if (id === 'skeletonColossus') { g.ensureSummons(id, 1, w.damage * power, false, 'colossus', { heavy:true }); return; }
    if (id === 'undeadConductor') count = Math.min(10 + p.amount, 14);
    g.ensureSummons(id, count, w.damage * power, id === 'undeadConductor');
  }


  fireCurse(id,w,level,power){
    const g=this.g,p=g.player, targets=g.closestEnemies(p.x,p.y,850,Math.min(7,2+level));
    for(const t of targets){ const x=t.x,y=t.y; g.addAbilityEffect({type:'shadowBurst',x,y,radius:w.area*p.area*.55,life:.45,maxLife:.45}); g.delayedEffects.push({t:.45,fn:()=>g.areaHit(x,y,w.area*p.area*.55,w.damage*power,'shadow',0,false,id)}); }
  }

  fireHolyBlade(id,w,level,power){
    const g=this.g,p=g.player,r=w.area*p.area; g.areaHit(p.x,p.y,r,w.damage*power,'holy',0,false,id); g.addAbilityEffect({type:'holyBurst',x:p.x,y:p.y,radius:r,life:.35,maxLife:.35});
    p.damageTakenMultiplier=Math.min(p.damageTakenMultiplier,.82); g.delayedEffects.push({t:.55,fn:()=>{ if(p.damageTakenMultiplier<1)p.damageTakenMultiplier=1; }}); if(id==='solarEdict'||level>=5) g.delayedEffects.push({t:.18,fn:()=>g.areaHit(p.x,p.y,r*.9,w.damage*power*.65,'holy',0,false,id)});
  }

  fireElementalCycle(id,w,level,power){
    const g=this.g,p=g.player,target=g.nearestEnemy(p.x,p.y,980); if(!target)return; this.elementCycle=(this.elementCycle||0)+1; const els=['fire','ice','electric','earth']; const howMany=id==='primalConvergence'?2:(level>=5?2:1);
    for(let j=0;j<howMany;j++){ const el=els[(this.elementCycle+j)%els.length]; const a=Math.atan2(target.y-p.y,target.x-p.x)+(j-(howMany-1)/2)*.1; this.spawnFusionProjectile(id,w,a,w.damage*power,{speed:w.speed||480,element:el,pierce:w.pierce||1,explode:el==='fire'?34:0,freeze:el==='ice',chainOnHit:el==='electric'?2:0}); }
  }

  fireBeam(id,w,level,power){
    const g=this.g,p=g.player,target=g.nearestEnemy(p.x,p.y,1050); if(!target)return; const a=Math.atan2(target.y-p.y,target.x-p.x),range=id==='spellbreakerCrescent'?980:760,width=(w.area||24)*p.area,bx=p.x+Math.cos(a)*range,by=p.y+Math.sin(a)*range;
    for(const e of (g.enemies||[])){if(e.dead)continue; const d=Math.abs((by-p.y)*e.x-(bx-p.x)*e.y+bx*p.y-by*p.x)/(Math.hypot(by-p.y,bx-p.x)||1); const along=((e.x-p.x)*(bx-p.x)+(e.y-p.y)*(by-p.y))/(range*range); if(along>=0&&along<=1&&d<(e.hitboxRadius||e.size)+width*.5)g.damageEnemy(e,w.damage*power,true,'arcane',true,id);} g.addAbilityEffect({type:'arcaneBeam',x:p.x,y:p.y,radius:width,angle:a,range,life:.26,maxLife:.26}); if(id==='spellbreakerCrescent'||level>=5)g.delayedEffects.push({t:.16,fn:()=>{for(const e of (g.enemies||[])){if(!e.dead&&Math.hypot(e.x-(p.x+Math.cos(a)*range*.6),e.y-(p.y+Math.sin(a)*range*.6))<120)g.damageEnemy(e,w.damage*power*.45,true,'arcane',true,id);}}});
  }


  fireCompanion(id,w,level,power,kind){
    const g=this.g;
    const baseFamiliar = id === 'familiar';
    const celestial = id === 'eidolonPrime';
    const projectileCount = baseFamiliar ? Math.max(1, Math.min(5, level)) : celestial ? 5 : Math.max(2, Math.min(7, level + 1));
    g.ensureSummons(id, 1, w.damage*power, false, kind, {
      ranged:true, companion:true, orbitalLight:true,
      projectileCount,
      orbitRadius: celestial ? 78 : 64,
      doubleRing: celestial
    });
  }

  fireBloodNova(id,w,level,power){ const g=this.g,p=g.player,r=w.area*p.area,dmg=(w.damage+p.maxHp*.1)*power;g.areaHit(p.x,p.y,r,dmg,'shadow',0,false,id);g.addAbilityEffect({type:'bloodNova',x:p.x,y:p.y,radius:r,life:.42,maxLife:.42});if(id==='sanguineEclipse'||level>=5)g.delayedEffects.push({t:.28,fn:()=>g.areaHit(p.x,p.y,r*.8,dmg*.62,'shadow',0,false,id)}); }

  fireWave(id,w,level,power){ const g=this.g,p=g.player,target=g.nearestEnemy(p.x,p.y,800); const a=target?Math.atan2(target.y-p.y,target.x-p.x):Math.atan2(p.lastMoveY||-1,p.lastMoveX||0),range=420,width=w.area*p.area; const bx=p.x+Math.cos(a)*range,by=p.y+Math.sin(a)*range; for(const e of (g.enemies||[])){if(e.dead)continue;const vx=e.x-p.x,vy=e.y-p.y,along=vx*Math.cos(a)+vy*Math.sin(a),side=Math.abs(vx*Math.sin(a)-vy*Math.cos(a));if(along>=0&&along<=range&&side<width*.5+(e.hitboxRadius||e.size)){g.damageEnemy(e,w.damage*power,true,'wind',true,id);if(!e.boss){e.x+=Math.cos(a)*(id==='dragonPulse'?50:28);e.y+=Math.sin(a)*(id==='dragonPulse'?50:28);}}}g.addAbilityEffect({type:'windImpact',x:p.x+Math.cos(a)*range*.55,y:p.y+Math.sin(a)*range*.55,radius:width,life:.32,maxLife:.32});if(id==='dragonPulse'||level>=5)g.delayedEffects.push({t:.18,fn:()=>g.areaHit(p.x+Math.cos(a)*range*.55,p.y+Math.sin(a)*range*.55,width*.55,w.damage*power*.55,'wind',0,false,id)}); }

  fireThermal(id, w, power) {
    const g = this.g;
    const p = g.player;
    const radius = w.area * p.area;
    g.areaHit(p.x, p.y, radius, w.damage * power * .38, 'ice', 2.1, false, id);
    g.addAbilityEffect({ type: 'thermalFreeze', x: p.x, y: p.y, radius, life: .62, maxLife: .62 });
    g.emitElementParticles(p.x, p.y, 'ice', 26, { minSpeed: 55, maxSpeed: 170, life: .5 });
    g.delayedEffects.push({
      t: .65,
      fn: () => {
        g.areaHit(p.x, p.y, radius * 1.08, w.damage * power, 'fire', 0, false, id);
        g.addAbilityEffect({ type: 'thermalBlast', x: p.x, y: p.y, radius: radius * 1.08, life: .42, maxLife: .42 });
        g.emitElementParticles(p.x, p.y, 'fire', 34, { minSpeed: 70, maxSpeed: 210, life: .55 });
        g.shake = .24;
      }
    });
  }

  orbit(id, w, level, dt) {
    const g = this.g;
    const p = g.player;
    const n = Math.min(3 + Math.floor(level / 2) + p.amount, id === 'eternalBulwark' ? 10 : 8);
    const radius = (id === 'eternalBulwark' ? 92 : 78) * p.area;
    for (let i = 0; i < n; i++) {
      const a = this.orbitAngle + i * Math.PI * 2 / n;
      const x = p.x + Math.cos(a) * radius;
      const y = p.y + Math.sin(a) * radius;
      g.areaHit(x, y, (w.area || 24) * p.area, w.damage * p.damage * dt * 3.1, w.element, 0, true, id);
      g.orbitVisuals.push({ id, x, y, r: 10 + Math.min(6, level), color: g.colorFor(w.element), angle: a });
    }
  }


  spawnFusionProjectile(id, w, angle, damage, options = {}) {
    const g = this.g, p = g.player;
    const speed = options.speed || 520;
    g.spawnProjectile({
      id,
      x: options.x ?? p.x,
      y: options.y ?? p.y,
      vx: Math.cos(angle) * speed * p.projectileSpeed,
      vy: Math.sin(angle) * speed * p.projectileSpeed,
      r: options.r || Math.max(7, Math.min(18, (w.area || 20) * .16)),
      damage,
      element: options.element || w.element,
      pierce: options.pierce ?? 1,
      explode: options.explode || 0,
      freeze: !!options.freeze,
      poison: !!options.poison,
      chainOnHit: options.chainOnHit || 0,
      chainRange: options.chainRange || 160,
      secondaryElement: options.secondaryElement || null,
      burnBonus: !!options.burnBonus,
      life: options.life || 3.2
    });
  }

  pullEnemies(x, y, radius, strength) {
    const g = this.g;
    for (const e of g.grid.query(x, y, radius + 40)) {
      if (e.dead || e.boss) continue;
      const dx = x - e.x, dy = y - e.y, d = Math.hypot(dx, dy) || 1;
      if (d > radius) continue;
      const force = Math.min(strength, Math.max(0, radius - d) * .35);
      e.x += dx / d * force;
      e.y += dy / d * force;
    }
  }

  pushEnemiesAway(x, y, radius, strength) {
    const g = this.g;
    for (const e of g.grid.query(x, y, radius + 48)) {
      if (e.dead || e.boss) continue;
      const dx = e.x - x, dy = e.y - y, d = Math.hypot(dx, dy) || 1;
      if (d > radius) continue;
      const force = Math.min(strength, Math.max(0, radius - d) * .38);
      e.x += dx / d * force;
      e.y += dy / d * force;
    }
  }

  chainFusionBurst(origin, radius, damage, sourceId, element = 'fire', chance = 0, maxJumps = 2) {
    const g = this.g;
    if (chance <= 0 || Math.random() >= chance) return;
    const targets = g.closestEnemies(origin.x, origin.y, radius, maxJumps + 1).filter(e => e && !e.dead && e !== origin);
    let previous = origin;
    let jumps = 0;
    for (const e of targets) {
      if (jumps++ >= maxJumps) break;
      g.areaHit(e.x, e.y, Math.max(38, radius * .28), damage * .52, element, 0, false, sourceId);
      g.addAbilityEffect({
        type: element === 'poison' ? 'poisonSplash' : element === 'electric' ? 'electricBurst' : 'toxicCombustion',
        x: e.x, y: e.y, radius: Math.max(38, radius * .28), life: .26, maxLife: .26
      });
      if (element === 'electric') {
        g.lightningArcs.push({ x1: previous.x, y1: previous.y, x2: e.x, y2: e.y, life: .12, color: '#ffe45b' });
      }
      previous = e;
    }
  }

  fireFusion(id, w, level, power) {
    const g = this.g, p = g.player;
    if (id === 'solarJudgment') { const t=g.randomEnemy(); if(t){g.areaHit(t.x,t.y,w.area*p.area,w.damage*power,'holy',0,false,id);g.addAbilityEffect({type:'holyBurst',x:t.x,y:t.y,radius:w.area*p.area,life:.5,maxLife:.5});} return; }
    if (id === 'pestilentHex') { this.fireCurse(id,{...w,area:w.area||175},level,power); return; }
    if (id === 'elementalSingularity') { g.areaHit(p.x,p.y,w.area*p.area,w.damage*power,'arcane',0,true,id); if(w.pull)this.pullEnemies(p.x,p.y,w.area*p.area,12); for(const el of ['fire','ice','electric','earth']) if(w.all||Math.random()<.35) g.emitElementParticles(p.x,p.y,el,5,{minSpeed:45,maxSpeed:120,life:.35}); return; }
    if (id === 'arcaneVanguard') { this.fireBeam(id,{...w,type:'beam',area:(w.area||165)*.26},level,power); return; }
    if (id === 'thunderFamiliar') { g.ensureSummons(id,1,w.damage*power,true,'familiar',{ranged:true,companion:true,orbitalLight:true,projectileCount:Math.min(9,2+Math.floor(level/2)),orbitRadius:82,doubleRing:true,chains:w.chains||1,chainRange:w.range||160}); return; }
    if (id === 'solarFamiliar') { g.ensureSummons(id,1,w.damage*power,false,'fire',{ranged:true,companion:true,orbitalLight:true,projectileCount:Math.min(9,w.projectiles||3),orbitRadius:84,doubleRing:true,projectileExplode:w.explode?46:0}); return; }
    if (id === 'bloodRequiem') { this.fireBloodNova(id,{...w,type:'bloodNova'},level,power); if(w.heal)g.healPlayer?.(3); return; }
    if (id === 'dragonGale') { this.fireWave(id,{...w,type:'wave'},level,power); return; }
    if (id === 'stormDroneSwarm') { g.ensureSummons(id,w.count||2,w.damage*power,true,'drone',{ranged:true,companion:true,chains:w.chains||1,chainRange:190}); return; }
    const area = (w.area || 100) * p.area;
    const damage = (w.damage || 40) * power;

    // Progressão avançada Lv.1–14: marcos 5/10/14 recebem efeitos extras reais.
    if (w.apex && level >= 5 && Math.random() < .26) {
      const t = g.randomEnemy();
      if (t) g.delayedEffects.push({ t:.12, fn:()=>g.areaHit(t.x,t.y,Math.max(48,area*.34),damage*.34,w.element,0,false,id) });
    }
    if (w.overdrive && level >= 10 && Math.random() < .22) {
      const t = g.randomEnemy();
      if (t) {
        g.addAbilityEffect({type:w.element==='fire'?'fireExplosion':w.element==='ice'?'iceShatter':'arcaneBurst',x:t.x,y:t.y,radius:Math.max(58,area*.38),life:.28,maxLife:.28});
        g.delayedEffects.push({t:.18,fn:()=>g.areaHit(t.x,t.y,Math.max(58,area*.38),damage*.46,w.element,0,false,id)});
      }
    }
    if (w.ultimate && level >= 14) {
      const t = g.randomEnemy();
      if (t) g.delayedEffects.push({t:.28,fn:()=>g.areaHit(t.x,t.y,Math.max(80,area*.55),damage*.72,w.element,0,false,id)});
    }

    switch (w.fusionPattern) {
      case 'apocalypseRain': {
        const count = Math.min(7, w.meteorCount || 3);
        for (let i = 0; i < count; i++) {
          const t = g.randomEnemy();
          if (!t) break;
          g.createMeteor(t.x + (Math.random()-.5)*150, t.y + (Math.random()-.5)*150, damage, area, 'fire', id, {
            secondaryCount: w.secondaryCount || 2,
            secondaryType: 'fire',
            groundFire: !!w.groundFire
          });
        }
        break;
      }
      case 'flameTornado':
      case 'toxicCyclone': {
        const n = Math.min(2, w.vortices || 1);
        const poisonous = w.fusionPattern === 'toxicCyclone';
        for (let i = 0; i < n; i++) {
          const a = g.time * (poisonous ? 1.05 : 1.35) + i * Math.PI * 2 / n;
          const dist = area * .48;
          const x = p.x + Math.cos(a) * dist, y = p.y + Math.sin(a) * dist;
          g.areaHit(x, y, area * .48, damage, poisonous ? 'poison' : 'fire', 0, true, id);
          this.pullEnemies(x, y, area * .58, w.pull || 18);
          g.addAbilityEffect({ type: poisonous ? 'toxicVortex' : 'flameVortex', x, y, radius: area * .5, life: .48, maxLife: .48 });
          if (w.trail) g.delayedEffects.push({ t: .22, fn: () => g.areaHit(x, y, area*.42, damage*.38, poisonous ? 'poison' : 'fire', 0, false, id) });
        }
        break;
      }
      case 'plasmaOrb': {
        const t = g.nearestEnemy(p.x,p.y,1050); if (!t) break;
        const aim = Math.atan2(t.y-p.y,t.x-p.x);
        const n = Math.min(2, w.projectiles || 1);
        for (let i=0;i<n;i++) this.spawnFusionProjectile(id,w,aim+(i-(n-1)/2)*.16,damage,{
          speed:430,r:14,explode:area*.55,pierce:1,chainOnHit:w.chains||2,chainRange:180,element:'electric'
        });
        break;
      }
      case 'cryostorm': {
        const targets = g.closestEnemies(p.x,p.y,Math.max(650,area*3.2),Math.min(9,w.bolts||4));
        let previous={x:p.x,y:p.y};
        for (const e of targets) {
          g.damageEnemy(e,damage,true,'electric',true,id);
          e.status.freeze=Math.max(e.status.freeze,(1.1+(level*.12))*(e.boss?.35:1));
          g.lightningArcs.push({x1:previous.x,y1:previous.y,x2:e.x,y2:e.y,life:.16,color:'#9cecff'});
          previous=e;
          if (w.chains>1) {
            const extras=g.closestEnemies(e.x,e.y,170,w.chains-1).filter(x=>x!==e);
            for (const q of extras) {
              g.damageEnemy(q,damage*.42,false,'ice',true,id);
              q.status.freeze=Math.max(q.status.freeze,.8*(q.boss?.35:1));
              g.lightningArcs.push({x1:e.x,y1:e.y,x2:q.x,y2:q.y,life:.13,color:'#b7f4ff'});
            }
          }
          if (w.shatter && e.status.freeze>0) g.areaHit(e.x,e.y,54,damage*.28,'ice',.6,false,id);
        }
        g.addAbilityEffect({type:'cryoStorm',x:p.x,y:p.y,radius:area,life:.5,maxLife:.5});
        break;
      }
      case 'blizzard': {
        g.areaHit(p.x,p.y,area,damage,'ice',w.freeze||1.0,true,id);
        const shards=Math.min(6,w.shards||2);
        for(let i=0;i<shards;i++) this.spawnFusionProjectile(id,w,i*Math.PI*2/shards+g.time*.4,damage*.48,{
          speed:390,r:8,pierce:2,freeze:true,element:'ice'
        });
        g.addAbilityEffect({type:'blizzard',x:p.x,y:p.y,radius:area,life:.45,maxLife:.45});
        break;
      }
      case 'glacialComet': {
        const count=Math.min(5,w.meteorCount||2);
        for(let i=0;i<count;i++){const t=g.randomEnemy();if(!t)break;g.createMeteor(t.x+(Math.random()-.5)*110,t.y+(Math.random()-.5)*110,damage,area,'ice',id,{
          secondaryCount:w.fragments||2,secondaryType:'ice',frostGround:!!w.frostGround
        });}
        break;
      }
      case 'undeadConductor':
      case 'burningLegion':
      case 'plagueLegion': {
        const n=Math.min(16,w.summons||9);
        const variant=w.fusionPattern==='undeadConductor'?'electric':w.fusionPattern==='burningLegion'?'fire':'poison';
        g.ensureSummons(id,n,damage,variant==='electric',variant,{
          chains:w.chains||1,chainRange:w.range||150,aura:!!w.aura,cloud:!!w.cloud,puddles:!!w.puddles
        });
        break;
      }
      case 'toxicCombustion': {
        const targets=g.closestEnemies(p.x,p.y,780,6);
        for(const e of targets){
          e.status.poison=Math.max(e.status.poison,2.8);
          e.status.poisonDps=Math.max(e.status.poisonDps,damage*.08);
          g.areaHit(e.x,e.y,area*.52,damage,'fire',0,false,id);
          g.addAbilityEffect({type:'toxicCombustion',x:e.x,y:e.y,radius:area*.5,life:.35,maxLife:.35});
          if(w.chainChance) this.chainFusionBurst(e, Math.max(120, area*.92), damage, id, 'fire', w.chainChance, level >= 5 ? 3 : 2);
          if(w.poisonAfter) {
            g.areaHit(e.x,e.y,area*.38,damage*.28,'poison',0,false,id);
            g.delayedEffects.push({t:.18,fn:()=>g.areaHit(e.x,e.y,area*.46,damage*.18,'poison',0,false,id)});
          }
        }
        break;
      }
      case 'volcanicEruption': {
        const count=Math.min(7,w.meteorCount||4);
        for(let i=0;i<count;i++){const t=g.randomEnemy();if(!t)break;g.createMeteor(t.x+(Math.random()-.5)*130,t.y+(Math.random()-.5)*130,damage,area,'fire',id,{
          secondaryCount:w.fragments||0,secondaryType:'earth',groundFire:!!w.groundFire
        });}
        break;
      }
      case 'frozenSpires': {
        const count=Math.min(7,w.spires||3);
        const targets=g.closestEnemies(p.x,p.y,850,count);
        for(const e of targets){
          const sx=e.x, sy=e.y;
          g.createMeteor(sx,sy,damage,area,'ice',id,{secondaryCount:w.shatter?3:0,secondaryType:'ice'});
          e.status.freeze=Math.max(e.status.freeze,1.4*(e.boss?.35:1));
          if(w.push) g.delayedEffects.push({t:.66,fn:()=>this.pushEnemiesAway(sx,sy,area*.9,46)});
        }
        break;
      }
      case 'magneticField': {
        this.pullEnemies(p.x,p.y,area,w.pull||22);
        g.areaHit(p.x,p.y,area,damage,'electric',0,true,id);
        const targets=g.closestEnemies(p.x,p.y,area,Math.min(6,w.bolts||1));
        for(const e of targets) {
          g.lightningArcs.push({x1:p.x,y1:p.y,x2:e.x,y2:e.y,life:.12,color:'#ffe45b'});
          if(level >= 4) g.damageEnemy(e,damage*.20,false,'electric',true,id);
        }
        if(w.pulse) {
          g.delayedEffects.push({t:.16,fn:()=>{
            this.pullEnemies(p.x,p.y,area*1.08,(w.pull||22)*.65);
            g.areaHit(p.x,p.y,area*1.08,damage*.46,'electric',0,false,id);
            g.addAbilityEffect({type:'electricBurst',x:p.x,y:p.y,radius:area*1.08,life:.28,maxLife:.28});
          }});
        }
        g.addAbilityEffect({type:'magneticField',x:p.x,y:p.y,radius:area,life:.35,maxLife:.35});
        break;
      }
      case 'infernalVolley':
      case 'thunderVolley':
      case 'stormCleaver': {
        const t=g.nearestEnemy(p.x,p.y,1100); if(!t) break;
        const aim=Math.atan2(t.y-p.y,t.x-p.x), n=Math.min(8,w.projectiles||4);
        for(let i=0;i<n;i++){
          const a=aim+(i-(n-1)/2)*.105;
          this.spawnFusionProjectile(id,w,a,damage,{
            speed:w.fusionPattern==='stormCleaver'?410:620,
            r:w.fusionPattern==='stormCleaver'?15:8,
            pierce:w.pierce||2,
            explode:w.fusionPattern==='infernalVolley'?area*.25:(w.fusionPattern==='stormCleaver'&&w.impactBlast)?area*.32:0,
            chainOnHit:w.fusionPattern==='thunderVolley'||w.fusionPattern==='stormCleaver'?(w.chains||1):0,
            element:w.fusionPattern==='infernalVolley'?'fire':'electric',
            burnBonus:w.fusionPattern==='infernalVolley'&&!!w.burnBonus
          });
        }
        break;
      }
      case 'phantomBlades':
      case 'thunderRing': {
        const n=Math.min(7,w.blades||3), radius=area*.62;
        const isThunder=w.fusionPattern==='thunderRing';
        for(let i=0;i<n;i++){
          const a=this.orbitAngle+i*Math.PI*2/n;
          const x=p.x+Math.cos(a)*radius,y=p.y+Math.sin(a)*radius;
          g.areaHit(x,y,28*p.area,damage,isThunder?'electric':'shadow',0,true,id);
          g.orbitVisuals.push({id,x,y,r:12,color:g.colorFor(w.element),angle:a});
          if(isThunder && (w.chains||0)>0){
            const first=g.nearestEnemy(x,y,125);
            if(first){
              g.damageEnemy(first,damage*.22,false,'electric',true,id);
              g.lightningArcs.push({x1:x,y1:y,x2:first.x,y2:first.y,life:.10,color:'#ffe45b'});
              let prev=first;
              const extra=g.closestEnemies(first.x,first.y,145,Math.max(0,(w.chains||1)-1)+1).filter(e=>e!==first);
              for(const e of extra.slice(0,Math.max(0,(w.chains||1)-1))){
                g.damageEnemy(e,damage*.16,false,'electric',true,id);
                g.lightningArcs.push({x1:prev.x,y1:prev.y,x2:e.x,y2:e.y,life:.10,color:'#ffe45b'});
                prev=e;
              }
            }
          }
        }
        if(!isThunder && w.execution){
          const victims=g.closestEnemies(p.x,p.y,area*1.05,2);
          for(const e of victims){
            g.damageEnemy(e,damage*.55,true,'shadow',true,id);
            g.addAbilityEffect({type:'shadowBurst',x:e.x,y:e.y,radius:46,life:.24,maxLife:.24});
          }
        }
        if(isThunder && w.contactBurst){
          g.areaHit(p.x,p.y,area*.92,damage*.24,'electric',0,false,id);
          g.addAbilityEffect({type:'electricBurst',x:p.x,y:p.y,radius:area*.92,life:.24,maxLife:.24});
        }
        break;
      }
      case 'arcaneStorm': {
        const targets=g.closestEnemies(p.x,p.y,Math.max(760,area*3.5),Math.min(9,w.bolts||4));
        for(const e of targets){
          g.damageEnemy(e,damage,true,'arcane',true,id);
          g.lightningArcs.push({x1:p.x,y1:p.y,x2:e.x,y2:e.y,life:.15,color:'#ff72e8'});
          if((w.chains||1)>1){
            const extras=g.closestEnemies(e.x,e.y,175,Math.min(4,w.chains)).filter(q=>q!==e);
            let prev=e;
            for(const q of extras.slice(0,(w.chains||1)-1)){
              g.damageEnemy(q,damage*.42,false,'arcane',true,id);
              g.lightningArcs.push({x1:prev.x,y1:prev.y,x2:q.x,y2:q.y,life:.12,color:'#d78cff'});
              prev=q;
            }
          }
          if(w.pulse) g.areaHit(e.x,e.y,48,damage*.25,'arcane',0,false,id);
        }
        g.addAbilityEffect({type:'arcaneStorm',x:p.x,y:p.y,radius:area,life:.42,maxLife:.42});
        break;
      }
      case 'arcaneSun': {
        g.areaHit(p.x,p.y,area,damage,'arcane',0,true,id);
        const n=Math.min(4,w.projectiles||0);
        for(let i=0;i<n;i++) this.spawnFusionProjectile(id,w,i*Math.PI*2/n+g.time*.7,damage*.48,{speed:430,r:10,explode:34,element:'fire'});
        g.addAbilityEffect({type:'arcaneSun',x:p.x,y:p.y,radius:area,life:.38,maxLife:.38});
        if(w.pulse) g.areaHit(p.x,p.y,area*1.18,damage*.55,'fire',0,false,id);
        break;
      }
      case 'aegisBlade': {
        g.areaHit(p.x,p.y,area,damage,'holy',0,false,id);
        g.addAbilityEffect({type:'aegisBlade',x:p.x,y:p.y,radius:area,angle:this.orbitAngle,life:.3,maxLife:.3});
        for(let i=0;i<(w.echoes||0);i++) g.delayedEffects.push({t:.16*(i+1),fn:()=>g.areaHit(p.x,p.y,area*.86,damage*.46,'arcane',0,false,id)});
        if(w.shieldHit){
          const shields=4;
          for(let i=0;i<shields;i++){
            const a=this.orbitAngle+i*Math.PI*2/shields;
            const sx=p.x+Math.cos(a)*area*.56, sy=p.y+Math.sin(a)*area*.56;
            g.areaHit(sx,sy,34*p.area,damage*.24,'holy',0,true,id);
            g.orbitVisuals.push({id:'eternalBulwark',x:sx,y:sy,r:13,color:'#fff0a6',angle:a});
          }
        }
        if(w.blast) {
          g.areaHit(p.x,p.y,area*1.22,damage*.35,'holy',0,false,id);
          g.addAbilityEffect({type:'holyBurst',x:p.x,y:p.y,radius:area*1.22,life:.3,maxLife:.3});
        }
        break;
      }
      case 'celestialArray': {
        const n=Math.min(8,w.projectiles||4), waves=Math.min(2,w.waves||1);
        for(let wave=0;wave<waves;wave++){
          const fireWave=()=>{
            for(let i=0;i<n;i++){
              const a=i*Math.PI*2/n+g.time*.18;
              this.spawnFusionProjectile(id,w,a,damage*(wave?0.72:1),{
                speed:650,r:9,pierce:5,element:'holy',
                explode:w.runeBlast?42:0,
                secondaryElement:w.runeBlast?'arcane':null
              });
            }
          };
          if(wave===0) fireWave(); else g.delayedEffects.push({t:.18,fn:fireWave});
        }
        g.addAbilityEffect({type:'celestialArray',x:p.x,y:p.y,radius:area,life:.38,maxLife:.38});
        break;
      }
      case 'thermalCollapse': {
        this.fireThermal(id, w, power);
        if (w.secondWave) g.delayedEffects.push({t:1.05,fn:()=>g.areaHit(p.x,p.y,area*.92,damage*.45,'arcane',1.0,false,id)});
        if (w.residual) g.delayedEffects.push({t:1.35,fn:()=>g.areaHit(p.x,p.y,area*.82,damage*.28,'fire',0,false,id)});
        break;
      }
      case 'toxicCorpses': {
        g.areaHit(p.x,p.y,area,damage,'poison',0,true,id);
        g.addAbilityEffect({type:'toxicVortex',x:p.x,y:p.y,radius:area*.8,life:.4,maxLife:.4});
        if (w.persistent) g.delayedEffects.push({t:.22,fn:()=>g.areaHit(p.x,p.y,area*.86,damage*.32,'poison',0,false,id)});
        break;
      }
      case 'briarTempest': {
        const waves=Math.min(4,w.waves||1);
        g.areaHit(p.x,p.y,area,damage,'nature',0,false,id);
        this.pullEnemies(p.x,p.y,area,w.pull||12);
        if(w.poison) g.areaHit(p.x,p.y,area*.9,damage*.35,'poison',0,false,id);
        for(let i=1;i<waves;i++) g.delayedEffects.push({t:.10*i,fn:()=>g.areaHit(p.x,p.y,area*(.75+i*.05),damage*.36,'nature',0,false,id)});
        g.addAbilityEffect({type:'briarTempest',x:p.x,y:p.y,radius:area,life:.42,maxLife:.42});
        break;
      }
    }
  }

  maybeChaosCast(originalId) {
    const g = this.g;
    if (!g.flags.chaosHeart || this.chaosGuard) return;
    this.castCounter++;
    if (this.castCounter % 3 !== 0) return;

    const candidates = g.player.weaponOrder.filter(id => id !== originalId && WEAPONS[id] && WEAPONS[id].type !== 'orbit');
    if (!candidates.length) return;
    const id = candidates[(Math.random() * candidates.length) | 0];
    const w = getWeaponStats(id, g.player.weapons[id]);
    if (!w) return;
    this.chaosGuard = true;
    this.fire(id, { ...w, damage: w.damage * .65 }, g.player.weapons[id], true);
    this.chaosGuard = false;
  }
}

export { WEAPONS };
