import { xpRequired } from '../config.js?v=2.9.0';

export class Player {
  constructor(id, cfg, meta) {
    Object.assign(this, {
      id,
      x: 2800,
      y: 2800,
      r: 18,
      visualRadius: 18,
      hitboxRadius: 15,
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
      items: [],
      fusionItems: {},
      pierceBonus: 0,
      weapons: {},
      weaponOrder: [],
      passives: {},
      passiveOrder: [],
      slowTimer: 0,
      lastMoveX: 0,
      lastMoveY: -1,
      damageTakenMultiplier: 1
    });

    Object.assign(this, cfg.base);

    // A velocidade base já vem balanceada por classe. Upgrades podem valorizá-la,
    // mas existe um teto para impedir builds que eliminem a importância do posicionamento.
    this.baseSpeed = this.speed;
    this.speedCap = this.baseSpeed * 1.42;
    this.maxHp = this.hp;
    this.meta = meta;

    this.damage *= 1 + (meta.strength || 0) * .02;
    this.maxHp += 5 * (meta.vitality || 0);
    this.hp = this.maxHp;
    this.setMoveSpeed(this.speed * (1 + (meta.agility || 0) * .02));
    this.xp *= 1 + (meta.wisdom || 0) * .025;
  }

  setMoveSpeed(value) {
    this.speed = Math.max(this.baseSpeed * .72, Math.min(this.speedCap, value));
    return this.speed;
  }


  addFusionItem(id, amount = 1) {
    this.fusionItems[id] = (this.fusionItems[id] || 0) + Math.max(1, amount | 0);
    return this.fusionItems[id];
  }

  hasFusionItem(id) {
    return !id || (this.fusionItems[id] || 0) > 0;
  }

  consumeFusionItem(id) {
    if (!id) return true;
    if (!this.hasFusionItem(id)) return false;
    this.fusionItems[id]--;
    if (this.fusionItems[id] <= 0) delete this.fusionItems[id];
    return true;
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
    let moveSpeed = this.speed;

    // Slow é temporário; não altera permanentemente o atributo speed.
    if (this.slowTimer > 0) moveSpeed *= .78;
    this.slowTimer = Math.max(0, this.slowTimer - dt);

    if (game?.flags.bloodHourglass && this.hp / this.maxHp < .35) {
      moveSpeed = Math.min(moveSpeed * 1.22, this.speedCap * 1.08);
    }

    if (Math.abs(a.x) + Math.abs(a.y) > .01) {
      this.lastMoveX = a.x;
      this.lastMoveY = a.y;
    }
    const nx = Math.max(30, Math.min(bounds.w - 30, this.x + a.x * moveSpeed * dt));
    const ny = Math.max(30, Math.min(bounds.h - 30, this.y + a.y * moveSpeed * dt));
    if (game?.world) {
      const resolved = game.world.resolveMovement(this, nx, ny);
      this.x = resolved.x;
      this.y = resolved.y;
    } else {
      this.x = nx;
      this.y = ny;
    }
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
    const reduced = damage * (100 / (100 + armor * 7)) * Math.max(0, this.damageTakenMultiplier ?? 1);
    this.hp -= reduced;
    this.iframes = .55;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
    return true;
  }
}
