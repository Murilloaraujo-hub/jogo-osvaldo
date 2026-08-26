import { WEAPONS, getWeaponStats } from './weaponData.js?v=2.3.0';

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

    switch (w.type) {
      case 'projectile':
        this.fireProjectile(id, w, level, power, countBonus);
        break;
      case 'melee':
        g.areaHit(p.x, p.y, w.area * p.area, w.damage * power, w.element, 0, false, id);
        g.addAbilityEffect({ type: 'swordSlash', x: p.x, y: p.y, radius: w.area * p.area, angle: this.orbitAngle * 1.8, life: .22, maxLife: .22 });
        g.emitElementParticles(p.x, p.y, w.element, 5, { minSpeed: 25, maxSpeed: 75, life: .25 });
        if (level >= 4) g.areaHit(p.x, p.y, w.area * p.area * .75, w.damage * power * .45, 'arcane', 0, false, id);
        break;
      case 'lightning':
        this.fireLightning(id, w, power, level);
        break;
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
      case 'thermal':
        this.fireThermal(id, w, power);
        break;
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
    if (id === 'undeadConductor') count = Math.min(10 + p.amount, 14);
    g.ensureSummons(id, count, w.damage * power, id === 'undeadConductor');
  }

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
