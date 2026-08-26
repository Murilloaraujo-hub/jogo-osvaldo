import { xpRequired } from '../config.js';

export class Player {
  constructor(id, cfg, meta) {
    Object.assign(this, {
      id,
      x: 2800,
      y: 2800,
      r: 18,
      level: 1,
      xpNow: 0,
      xpNeed: xpRequired(1),
      xpCollected: 0,
      kills: 0,
      eliteKills: 0,
      bossKills: 0,
      coins: 0,
      damageDone: 0,
      highestCrit: 0,
      iframes: 0,
      alive: true,
      souls: 0,
      elementalCore: false,
      necroCore: false,
      banished: new Set(),
      rerolls: 2,
      banishes: 2,
      skips: 1,
      relics: [],
      weapons: {},
      weaponOrder: [],
      passives: {},
      passiveOrder: []
    });

    Object.assign(this, cfg.base);
    this.baseSpeed = this.speed;
    this.maxHp = this.hp;
    this.meta = meta;

    this.damage *= 1 + (meta.strength || 0) * .02;
    this.maxHp += 5 * (meta.vitality || 0);
    this.hp = this.maxHp;
    this.speed *= 1 + (meta.agility || 0) * .02;
    this.xp *= 1 + (meta.wisdom || 0) * .025;
  }

  addWeapon(id, level = 1) {
    this.weapons[id] = level;
    if (!this.weaponOrder.includes(id)) this.weaponOrder.push(id);
  }

  removeWeapon(id) {
    delete this.weapons[id];
    const i = this.weaponOrder.indexOf(id);
    if (i >= 0) this.weaponOrder.splice(i, 1);
  }

  addPassive(id) {
    if (!this.passiveOrder.includes(id)) this.passiveOrder.push(id);
    this.passives[id] = (this.passives[id] || 0) + 1;
  }

  update(input, dt, bounds, game = null) {
    const a = input.axis();
    let speed = this.speed;
    if (game?.flags.bloodHourglass && this.hp / this.maxHp < .35) speed *= 1.22;
    this.x = Math.max(30, Math.min(bounds.w - 30, this.x + a.x * speed * dt));
    this.y = Math.max(30, Math.min(bounds.h - 30, this.y + a.y * speed * dt));
    this.iframes = Math.max(0, this.iframes - dt);
  }

  gainXp(value) {
    const gained = value * this.xp;
    this.xpCollected += gained;
    this.xpNow += gained;
    let levels = 0;
    while (this.xpNow >= this.xpNeed) {
      this.xpNow -= this.xpNeed;
      this.level++;
      this.xpNeed = xpRequired(this.level);
      levels++;
    }
    return levels;
  }

  takeDamage(damage) {
    if (this.iframes > 0) return false;
    let armor = Math.max(0, this.armor);
    if (this.id === 'knight' && this.hp / this.maxHp < .45) armor += 5;
    const reduced = damage * (100 / (100 + armor * 7));
    this.hp -= reduced;
    this.iframes = .55;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
    return true;
  }
}
