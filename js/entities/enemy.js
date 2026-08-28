let NEXT_ENEMY_ID = 1;

export class Enemy {
  constructor(type, cfg, x, y, scaling = {}) {
    Object.assign(this, {
      uid: NEXT_ENEMY_ID++,
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      facingX: 1,
      facingY: 0,
      dead: false,
      hitFlash: 0,
      attackAnim: 0,
      attackCd: 0,
      skillCd: 1 + Math.random() * 2,
      phase: 1,
      eliteMods: [],
      status: { burn: 0, burnDps: 0, freeze: 0, poison: 0, poisonDps: 0, shock: 0 },
      armor: 0,
      boss: !!cfg.boss,
      miniboss: !!cfg.miniboss,
      elite: !!cfg.elite,
      animTime: Math.random() * 10,
      fuse: 0,
      burstTimer: 0,
      dashWindup: 0,
      dashTime: 0,
      dashNx: 0,
      dashNy: 0,
      castWindup: 0,
      pendingShot: null,
      telegraph: null
    });
    Object.assign(this, cfg);

    this.visualSize = cfg.visualSize ?? cfg.size ?? 18;
    this.size = this.visualSize; // compatibilidade com culling/UI antiga
    this.hitboxRadius = cfg.hitboxRadius ?? this.visualSize * .72;
    this.hitboxOffsetX = cfg.hitboxOffsetX ?? 0;
    this.hitboxOffsetY = cfg.hitboxOffsetY ?? 0;
    this.separationRadius = cfg.separationRadius ?? this.hitboxRadius * .92;

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

  hitboxX() { return this.x + this.hitboxOffsetX; }
  hitboxY() { return this.y + this.hitboxOffsetY; }

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
    this.animTime += dt * (.8 + Math.min(1.5, this.speed / 105));
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.attackAnim = Math.max(0, this.attackAnim - dt);
    this.attackCd = Math.max(0, this.attackCd - dt);
    this.skillCd -= dt;
    this.vx = 0;
    this.vy = 0;
    this.telegraph = null;

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
    if (this.dead) return;

    const p = game.player;
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const nx = dx / d;
    const ny = dy / d;
    this.facingX = nx;
    this.facingY = ny;

    if (this.castWindup > 0) {
      this.castWindup -= dt;
      this.telegraph = 'cast';
      if (this.castWindup <= 0 && this.pendingShot) {
        const shot = this.pendingShot;
        game.spawnEnemyProjectile(this.x, this.y, shot.nx, shot.ny, shot.damage, shot.speed, shot.style);
        this.pendingShot = null;
      }
    }

    if (this.boss) {
      const ratio = this.hp / this.maxHp;
      this.phase = ratio < .33 ? 3 : ratio < .66 ? 2 : 1;
    }

    switch (this.behavior) {
      case 'skirmisher': {
        if (this.burstTimer > 0) {
          this.burstTimer -= dt;
          this.move(nx, ny, this.speed * 1.34 * slow, dt);
        } else {
          this.move(nx, ny, this.speed * .82 * slow, dt);
          if (this.skillCd <= 0 && d < 250) {
            this.burstTimer = .30;
            this.skillCd = 2.05;
            this.attackAnim = .20;
          }
        }
        break;
      }
      case 'orbitChase': {
        const weave = Math.sin(this.animTime * 2.8) * .42;
        const mx = nx * .82 - ny * weave;
        const my = ny * .82 + nx * weave;
        if (d > 74) this.moveVector(mx, my, this.speed * slow, dt);
        break;
      }
      case 'ranged':
        this.moveRanged(nx, ny, d, dt, slow, 300, 220);
        if (this.skillCd <= 0 && this.castWindup <= 0) {
          this.attackAnim = .34;
          this.castWindup = .30;
          this.pendingShot = { nx, ny, damage: this.damage, speed: 235, style: this.projectileStyle || 'shadowShard' };
          this.telegraph = 'cast';
          this.skillCd = 2.45;
        }
        break;
      case 'rangedFast':
        this.moveRanged(nx, ny, d, dt, slow, 350, 255);
        if (this.skillCd <= 0 && this.castWindup <= 0) {
          this.attackAnim = .26;
          this.castWindup = .20;
          this.pendingShot = { nx, ny, damage: this.damage, speed: 285, style: this.projectileStyle || 'boneArrow' };
          this.telegraph = 'cast';
          this.skillCd = 1.85;
        }
        break;
      case 'summoner':
        if (d > 410) this.move(nx, ny, this.speed * .72 * slow, dt);
        else if (d < 260) this.move(-nx, -ny, this.speed * .58 * slow, dt);
        if (this.skillCd <= 0) {
          this.attackAnim = .55;
          game.spawnMinionsAround(this, Math.min(4, 1 + Math.floor(game.time / 480)));
          this.skillCd = 7.0;
        }
        break;
      case 'explosive':
        if (this.fuse > 0) {
          this.telegraph = 'explode';
          this.fuse -= dt;
          if (this.fuse <= 0) {
            game.explodeEnemy(this, this.damage, 96);
            return;
          }
        } else {
          this.move(nx, ny, this.speed * .92 * slow, dt);
          if (d < 112) {
            this.fuse = .68;
            this.telegraph = 'explode';
            this.attackAnim = .68;
          }
        }
        break;
      case 'bossDash':
        this.updateDashBoss(game, dt, slow, nx, ny, d);
        break;
      case 'bossCaster':
        if (d > 370) this.move(nx, ny, this.speed * .72 * slow, dt);
        if (d < 235) this.move(-nx, -ny, this.speed * .58 * slow, dt);
        if (this.skillCd <= 0) {
          this.attackAnim = .42;
          game.radialEnemyShots(this, 10 + this.phase * 5, this.damage * .72);
          game.spawnHazardNearPlayer(this.damage);
          if (this.phase >= 2) game.spawnMinionsAround(this, this.phase);
          this.skillCd = 3.05 - this.phase * .20;
        }
        break;
      case 'bossWarden':
        this.move(nx, ny, this.speed * .58 * slow, dt);
        if (this.skillCd <= 0) {
          this.attackAnim = .46;
          game.spawnHazardRing(this, 3 + this.phase);
          game.radialEnemyShots(this, 12 + this.phase * 4, this.damage * .65);
          this.skillCd = 3.35 - this.phase * .22;
        }
        break;
      case 'bossBeast':
        if (this.dashWindup > 0 || this.dashTime > 0) {
          this.updateDashBoss(game, dt, slow, nx, ny, d, true);
        } else {
          this.move(nx, ny, this.speed * (.68 + .08 * this.phase) * slow, dt);
          if (this.skillCd <= 0) {
            if (Math.random() < .48) {
              this.dashNx = nx; this.dashNy = ny; this.dashWindup = .48; this.telegraph = 'dash';
            } else {
              this.attackAnim = .34;
              game.coneEnemyShots(this, nx, ny, 5 + this.phase * 2, this.damage * .9);
              if (this.phase >= 2) game.spawnHazardNearPlayer(this.damage * 1.15);
            }
            this.skillCd = 2.9 - this.phase * .16;
          }
        }
        break;
      case 'bossSpecial': {
        // Cada arquétipo combina padrões diferentes com telegraphs claros.
        this.move(nx, ny, this.speed * (.48 + .05 * this.phase) * slow, dt);
        if (this.skillCd <= 0) {
          this.attackAnim = .48;
          const style = this.bossStyle || 'arcane';
          if (style === 'grave') {
            game.spawnHazardRing(this, 2 + this.phase);
            game.spawnMinionsAround(this, Math.min(3, this.phase + 1));
            if (this.phase >= 2) game.coneEnemyShots(this, nx, ny, 3 + this.phase, this.damage * .72);
          } else if (style === 'arcane') {
            game.radialEnemyShots(this, 8 + this.phase * 4, this.damage * .64);
            game.spawnHazardNearPlayer(this.damage * .95);
            if (this.phase >= 2) { this.x += (Math.random()-.5)*130; this.y += (Math.random()-.5)*130; }
          } else if (style === 'plague') {
            game.spawnHazardRing(this, 3 + this.phase);
            game.spawnMinionsAround(this, Math.min(4, this.phase + 1));
            if (this.phase === 3) game.radialEnemyShots(this, 8, this.damage * .55);
          } else if (style === 'frost') {
            game.spawnHazardRing(this, 4 + this.phase);
            game.radialEnemyShots(this, 6 + this.phase * 2, this.damage * .72);
          } else if (style === 'infernal') {
            if (Math.random() < .5) {
              this.dashNx=nx; this.dashNy=ny; this.dashWindup=.5; this.telegraph='dash';
            } else {
              game.coneEnemyShots(this,nx,ny,5+this.phase*2,this.damage*.82);
              game.spawnHazardNearPlayer(this.damage*1.05);
            }
          } else if (style === 'storm') {
            game.radialEnemyShots(this, 6 + this.phase * 3, this.damage * .60);
            game.spawnHazardNearPlayer(this.damage * .95);
            if (this.phase >= 2) game.coneEnemyShots(this,nx,ny,3+this.phase,this.damage*.72);
          } else if (style === 'roots') {
            game.spawnHazardRing(this, 5 + this.phase);
            if (this.phase >= 2) game.spawnMinionsAround(this, this.phase);
          } else if (style === 'void') {
            game.coneEnemyShots(this,nx,ny,4+this.phase*2,this.damage*.78);
            if (this.phase >= 2) {
              this.x = Math.max(60, Math.min(game.world?.width-60 || this.x, this.x + (Math.random()-.5)*170));
              this.y = Math.max(60, Math.min(game.world?.height-60 || this.y, this.y + (Math.random()-.5)*170));
            }
            if (this.phase === 3) game.spawnHazardNearPlayer(this.damage*1.15);
          }
          this.skillCd = Math.max(1.45, 3.1 - this.phase * .28);
        }
        if (this.dashWindup > 0) this.updateDashBoss(game,dt,slow,nx,ny,d,true);
        break;
      }
      case 'finalBoss':
        this.move(nx, ny, this.speed * (.60 + .06 * this.phase) * slow, dt);
        if (this.skillCd <= 0) {
          this.attackAnim = .5;
          game.radialEnemyShots(this, 16 + this.phase * 6, this.damage * .72);
          game.spawnHazardRing(this, 3 + this.phase);
          if (this.phase >= 2) game.spawnMinionsAround(this, 2 + this.phase);
          if (this.phase === 3) game.spawnHazardNearPlayer(this.damage * 1.35);
          this.skillCd = 2.55 - this.phase * .18;
        }
        break;
      case 'tank':
        this.move(nx, ny, this.speed * .90 * slow, dt);
        break;
      case 'chase':
      default:
        this.move(nx, ny, this.speed * slow, dt);
        break;
    }

    if (this.eliteAura && d < 115 && this.skillCd <= .15) game.applyEliteAura(this);

    if (this.behavior !== 'explosive' || this.fuse <= 0) {
      const hx = this.hitboxX();
      const hy = this.hitboxY();
      const pdx = p.x - hx;
      const pdy = p.y - hy;
      const hd = Math.hypot(pdx, pdy) || 1;
      const playerHitbox = p.hitboxRadius ?? p.r;
      if (hd < this.hitboxRadius + playerHitbox && this.attackCd <= 0) {
        if (p.takeDamage(this.damage)) {
          game.shake = .12;
          this.attackAnim = .18;
          if (this.lifesteal) this.hp = Math.min(this.maxHp, this.hp + this.damage * this.lifesteal);
        }
        this.attackCd = .86;
      }
    }
  }

  updateDashBoss(game, dt, slow, nx, ny, d, beast = false) {
    if (this.dashTime > 0) {
      this.telegraph = 'dash';
      this.dashTime -= dt;
      this.move(this.dashNx, this.dashNy, this.speed * (beast ? 2.25 : 2.05) * slow, dt);
      if (this.dashTime <= 0) {
        this.attackAnim = .3;
        if (!beast) game.radialEnemyShots(this, 7 + this.phase * 3, this.damage * .68);
      }
      return;
    }
    if (this.dashWindup > 0) {
      this.telegraph = 'dash';
      this.dashWindup -= dt;
      if (this.dashWindup <= 0) this.dashTime = beast ? .26 : .30;
      return;
    }

    this.move(nx, ny, this.speed * (beast ? .62 : .52) * slow, dt);
    if (this.skillCd <= 0 && d < 620) {
      this.dashNx = nx;
      this.dashNy = ny;
      this.dashWindup = beast ? .48 : .58;
      this.telegraph = 'dash';
      this.attackAnim = this.dashWindup;
      this.skillCd = (beast ? 3.0 : 3.5) - this.phase * .18;
    }
  }

  move(nx, ny, speed, dt) {
    this.vx += nx * speed;
    this.vy += ny * speed;
    this.x += nx * speed * dt;
    this.y += ny * speed * dt;
  }

  moveVector(x, y, speed, dt) {
    const d = Math.hypot(x, y) || 1;
    this.move(x / d, y / d, speed, dt);
  }

  moveRanged(nx, ny, d, dt, slow, preferred, retreat) {
    if (d > preferred) this.move(nx, ny, this.speed * .68 * slow, dt);
    else if (d < retreat) this.move(-nx, -ny, this.speed * .58 * slow, dt);
  }
}
