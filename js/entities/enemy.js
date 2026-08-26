export class Enemy {
  constructor(type, cfg, x, y, scaling = {}) {
    Object.assign(this, {
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      dead: false,
      hitFlash: 0,
      attackCd: 0,
      skillCd: 1 + Math.random() * 2,
      phase: 1,
      eliteMods: [],
      status: { burn: 0, burnDps: 0, freeze: 0, poison: 0, poisonDps: 0, shock: 0 },
      armor: 0,
      boss: !!cfg.boss,
      miniboss: !!cfg.miniboss,
      elite: !!cfg.elite
    });
    Object.assign(this, cfg);

    const hpScale = scaling.hp ?? 1;
    const dmgScale = scaling.damage ?? 1;
    const speedScale = scaling.speed ?? 1;
    const xpScale = scaling.xp ?? 1;

    this.maxHp = cfg.hp * hpScale * (cfg.typeMult || 1);
    this.hp = this.maxHp;
    this.damage = cfg.damage * dmgScale;
    this.speed = cfg.speed * speedScale;
    this.xp = cfg.xp * xpScale;
    this.baseColor = cfg.color;
  }

  applyEliteModifier(id, mod) {
    this.elite = true;
    this.eliteMods.push(id);
    this.maxHp *= mod.hp || 1;
    this.hp = this.maxHp;
    this.damage *= mod.damage || 1;
    this.speed *= mod.speed || 1;
    this.armor += mod.armor || 0;
    if (mod.lifesteal) this.lifesteal = Math.max(this.lifesteal || 0, mod.lifesteal);
    if (mod.aura) this.eliteAura = mod.aura;
  }

  update(game, dt) {
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.attackCd = Math.max(0, this.attackCd - dt);
    this.skillCd -= dt;

    const frozen = this.status.freeze > 0;
    const slow = frozen ? .55 : 1;
    this.status.freeze = Math.max(0, this.status.freeze - dt);

    if (this.status.burn > 0) {
      this.status.burn -= dt;
      game.damageEnemy(this, this.status.burnDps * dt, false, 'fire', false, 'burn');
    }
    if (this.status.poison > 0) {
      this.status.poison -= dt;
      game.damageEnemy(this, this.status.poisonDps * dt, false, 'poison', false, 'poison');
    }

    const p = game.player;
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const nx = dx / d;
    const ny = dy / d;

    if (this.boss) {
      const ratio = this.hp / this.maxHp;
      this.phase = ratio < .33 ? 3 : ratio < .66 ? 2 : 1;
    }

    switch (this.behavior) {
      case 'ranged':
        this.moveRanged(nx, ny, d, dt, slow, 285, 210);
        if (this.skillCd <= 0) {
          game.spawnEnemyProjectile(this.x, this.y, nx, ny, this.damage);
          this.skillCd = 2.25;
        }
        break;
      case 'rangedFast':
        this.moveRanged(nx, ny, d, dt, slow, 340, 245);
        if (this.skillCd <= 0) {
          game.spawnEnemyProjectile(this.x, this.y, nx, ny, this.damage, 320);
          this.skillCd = 1.6;
        }
        break;
      case 'summoner':
        if (d > 360) this.move(nx, ny, this.speed * .8 * slow, dt);
        if (this.skillCd <= 0) {
          game.spawnMinionsAround(this, Math.min(4, 1 + Math.floor(game.time / 480)));
          this.skillCd = 6.5;
        }
        break;
      case 'explosive':
        this.move(nx, ny, this.speed * 1.08 * slow, dt);
        if (d < this.size + p.r + 22) {
          game.explodeEnemy(this, this.damage, 95);
          return;
        }
        break;
      case 'bossDash':
        this.move(nx, ny, this.speed * (1 + .12 * (this.phase - 1)) * slow, dt);
        if (this.skillCd <= 0) {
          game.radialEnemyShots(this, 8 + this.phase * 4, this.damage * .72);
          if (this.phase >= 2) game.spawnHazardNearPlayer(this.damage * .85);
          this.skillCd = 3.3 - this.phase * .28;
        }
        break;
      case 'bossCaster':
        if (d > 350) this.move(nx, ny, this.speed * slow, dt);
        if (d < 220) this.move(-nx, -ny, this.speed * .7 * slow, dt);
        if (this.skillCd <= 0) {
          game.radialEnemyShots(this, 10 + this.phase * 5, this.damage * .72);
          game.spawnHazardNearPlayer(this.damage);
          if (this.phase >= 2) game.spawnMinionsAround(this, this.phase);
          this.skillCd = 2.8 - this.phase * .25;
        }
        break;
      case 'bossWarden':
        this.move(nx, ny, this.speed * .75 * slow, dt);
        if (this.skillCd <= 0) {
          game.spawnHazardRing(this, 3 + this.phase);
          game.radialEnemyShots(this, 12 + this.phase * 4, this.damage * .65);
          this.skillCd = 3.1 - this.phase * .25;
        }
        break;
      case 'bossBeast':
        this.move(nx, ny, this.speed * (1 + .18 * this.phase) * slow, dt);
        if (this.skillCd <= 0) {
          game.coneEnemyShots(this, nx, ny, 5 + this.phase * 2, this.damage * .9);
          if (this.phase >= 2) game.spawnHazardNearPlayer(this.damage * 1.15);
          this.skillCd = 2.6 - this.phase * .2;
        }
        break;
      case 'finalBoss':
        this.move(nx, ny, this.speed * (.78 + .08 * this.phase) * slow, dt);
        if (this.skillCd <= 0) {
          game.radialEnemyShots(this, 16 + this.phase * 6, this.damage * .72);
          game.spawnHazardRing(this, 3 + this.phase);
          if (this.phase >= 2) game.spawnMinionsAround(this, 2 + this.phase);
          if (this.phase === 3) game.spawnHazardNearPlayer(this.damage * 1.35);
          this.skillCd = 2.3 - this.phase * .22;
        }
        break;
      case 'tank':
      case 'chase':
      default:
        this.move(nx, ny, this.speed * slow, dt);
        break;
    }

    if (this.eliteAura && d < 105 && this.skillCd <= .15) {
      game.applyEliteAura(this);
    }

    if (d < this.size + p.r + 3 && this.attackCd <= 0) {
      if (p.takeDamage(this.damage)) {
        game.shake = .16;
        if (this.lifesteal) this.hp = Math.min(this.maxHp, this.hp + this.damage * this.lifesteal);
      }
      this.attackCd = .8;
    }
  }

  move(nx, ny, speed, dt) {
    this.x += nx * speed * dt;
    this.y += ny * speed * dt;
  }

  moveRanged(nx, ny, d, dt, slow, preferred, retreat) {
    if (d > preferred) this.move(nx, ny, this.speed * slow, dt);
    else if (d < retreat) this.move(-nx, -ny, this.speed * .72 * slow, dt);
  }
}
