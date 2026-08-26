import {
  GAME_CONFIG, ENEMIES, PASSIVES, DIFFICULTIES, ELITE_MODIFIERS,
  timeHpMultiplier
} from './config.js';
import { Player } from './entities/player.js';
import { Enemy } from './entities/enemy.js';
import { Camera } from './camera.js';
import { SpatialGrid } from './systems/spatialGrid.js';
import { ObjectPool } from './systems/objectPool.js';
import { WeaponSystem, WEAPONS } from './weapons/weapons.js';
import { getWeaponLevelDescription } from './weapons/weaponData.js';
import { availableTransformations, replaceAbility } from './evolutions.js';
import { RELICS, rollRelic } from './relics.js';
import { checkAchievements } from './achievements.js';
import {
  drawProjectileVisual, drawOrbitVisual, drawSummonVisual, drawMeteorVisual,
  drawLightningVisual, drawParticleVisual, drawPersistentAbilities, drawAbilityEffect
} from './visuals/abilityVisuals.js';

const RARITIES = ['common', 'rare', 'epic', 'legendary', 'arcane'];
const RARITY_LABEL = { common: 'Comum', rare: 'Raro', epic: 'Épico', legendary: 'Lendário', arcane: 'Arcano' };
const RARITY_POWER = { common: 1, rare: 1.05, epic: 1.10, legendary: 1.17, arcane: 1.28 };

export class Game {
  constructor(canvas, input, ui, save) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = input;
    this.ui = ui;
    this.save = save;
    this.camera = new Camera();
    this.grid = new SpatialGrid(GAME_CONFIG.gridSize);
    this.running = false;
    this.paused = false;
    this.ended = false;
    this.last = 0;
    this.loopToken = 0;

    this.projectilePool = new ObjectPool(
      () => ({}),
      (obj, data) => {
        for (const k in obj) delete obj[k];
        Object.assign(obj, data, { dead: false });
      },
      GAME_CONFIG.maxProjectiles
    );
    this.particlePool = new ObjectPool(
      () => ({}),
      (obj, data) => {
        for (const k in obj) delete obj[k];
        Object.assign(obj, data);
      },
      GAME_CONFIG.maxParticles
    );

    this.resize();
    addEventListener('resize', () => this.resize());
  }

  start(charId, mapId, difficulty = 'normal') {
    this.loopToken++;
    this.charId = charId;
    this.mapId = mapId;
    this.difficultyId = DIFFICULTIES[difficulty] ? difficulty : 'normal';
    this.difficulty = DIFFICULTIES[this.difficultyId];

    this.player = new Player(charId, this.ui.characters[charId], this.save.data.meta);
    this.player.addWeapon(this.ui.characters[charId].startWeapon, 1);

    this.time = 0;
    this.pendingLevels = 0;
    this.enemies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.pickups = [];
    this.particles = [];
    this.numbers = [];
    this.meteors = [];
    this.hazards = [];
    this.summons = [];
    this.orbitVisuals = [];
    this.lightningArcs = [];
    this.delayedEffects = [];
    this.singularities = [];
    this.abilityEffects = [];
    this.events = [];
    this.challenge = null;
    this.weaponDamage = {};
    this.spawnAcc = 0;
    this.spawnSerial = 0;
    this.eventTimer = 70;
    this.magnetTimer = 45;
    this.minibossIndex = 0;
    this.finalSpawned = false;
    this.victory = false;
    this.shake = 0;
    this.flags = {};
    this.extraEnemyHp = 1;
    this.banished = new Set();
    this.levelSession = null;
    this.castLog = {};

    this.stats = {
      elites: 0,
      bosses: 0,
      chests: 0,
      relics: 0,
      evolutions: 0,
      fusions: 0
    };

    this.weaponSystem = new WeaponSystem(this);
    this.running = true;
    this.paused = false;
    this.ended = false;
    this.last = performance.now();
    this.camera.snap?.(this.player);
    this.ui.showGame();
    this.ui.refreshWeaponBar(this.player);
    this.ui.refreshRelics(this.player.relics);
    this.ui.flashMessage(`${this.difficulty.name} • ${this.ui.maps[mapId].name}`);

    const token = this.loopToken;
    requestAnimationFrame(t => this.loop(t, token));
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.floor(innerWidth * dpr);
    this.canvas.height = Math.floor(innerHeight * dpr);
    this.canvas.style.width = innerWidth + 'px';
    this.canvas.style.height = innerHeight + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.camera.resize(innerWidth, innerHeight);
  }

  loop(t, token) {
    if (!this.running || token !== this.loopToken) return;
    const dt = Math.min(.033, Math.max(0, (t - this.last) / 1000 || 0));
    this.last = t;

    if (this.input.consume('Escape')) this.togglePause();
    if (!this.paused && !this.ended) this.update(dt);
    this.render();
    this.input.endFrame();
    requestAnimationFrame(n => this.loop(n, token));
  }

  update(dt) {
    this.time += dt;
    this.player.update(this.input, dt, { w: GAME_CONFIG.worldWidth, h: GAME_CONFIG.worldHeight }, this);
    this.camera.update(this.player, dt);

    this.updateSpawn(dt);
    this.updateBossSchedule();
    this.updateMapEvents(dt);

    this.grid.clear();
    for (const e of this.enemies) if (!e.dead) this.grid.insert(e);
    for (const e of this.enemies) if (!e.dead) e.update(this, dt);

    this.weaponSystem.update(dt);
    this.updateProjectiles(dt);
    this.updateEnemyProjectiles(dt);
    this.updatePickups(dt);
    this.updateMeteors(dt);
    this.updateHazards(dt);
    this.updateSummons(dt);
    this.updateParticles(dt);
    this.updateNumbers(dt);
    this.updateDelayed(dt);
    this.updateSingularities(dt);
    this.updateLightning(dt);
    this.updateAbilityEffects(dt);
    this.updateRelicTimers(dt);
    this.updateChallenge(dt);

    this.cleanupFarEntities();
    this.checkLevel();
    this.checkTransformations();
    this.checkAchievementsLive();

    if (!this.player.alive) this.end(false);
    this.ui.updateHUD(this);
  }

  updateSpawn(dt) {
    this.spawnAcc += dt;
    const perf = this.save.data.settings.performance;
    const baseMax = perf ? GAME_CONFIG.performanceMaxEnemies : GAME_CONFIG.maxEnemies;
    const max = Math.round(baseMax * Math.min(1.12, 1 + this.time / 4200));
    const minute = this.time / 60;
    const challengeMul = this.challenge?.active ? 1.65 : 1;
    const interval = Math.max(.08, .34 / (this.difficulty.spawn * challengeMul * (1 + minute * .035)));

    if (this.spawnAcc >= interval && this.enemies.length < max) {
      this.spawnAcc = 0;
      let count = 1 + Math.floor(minute / 4);
      if (minute >= 12) count++;
      if (minute >= 18) count++;
      count = Math.min(6, count);
      for (let i = 0; i < count && this.enemies.length < max; i++) {
        const type = this.chooseEnemy();
        const eliteChance = this.eliteChance();
        this.spawnEnemy(type, Math.random() < eliteChance);
      }
    }
  }

  chooseEnemy() {
    const m = this.time / 60;
    const r = Math.random();
    if (m < 2) return r < .64 ? 'slime' : r < .86 ? 'bat' : 'goblin';
    if (m < 5) return r < .25 ? 'slime' : r < .48 ? 'goblin' : r < .72 ? 'skeleton' : r < .88 ? 'bat' : 'boneArcher';
    if (m < 9) return r < .20 ? 'goblin' : r < .42 ? 'skeleton' : r < .60 ? 'orc' : r < .76 ? 'darkMage' : r < .90 ? 'bomber' : 'boneArcher';
    if (m < 14) return r < .22 ? 'orc' : r < .40 ? 'darkMage' : r < .55 ? 'summoner' : r < .70 ? 'bomber' : r < .84 ? 'skeleton' : 'stoneGolem';
    return r < .20 ? 'stoneGolem' : r < .38 ? 'summoner' : r < .56 ? 'darkMage' : r < .72 ? 'bomber' : r < .86 ? 'orc' : 'boneArcher';
  }

  eliteChance() {
    const m = this.time / 60;
    const mapBonus = this.ui.maps[this.mapId].danger === 'arcane' ? 1.6 : 1;
    const curseBonus = this.challenge?.cursed ? 1.7 : 1;
    return Math.min(.18, (.006 + m * .0028) * this.difficulty.elite * mapBonus * curseBonus);
  }

  enemyScaling(type) {
    const cfg = ENEMIES[type];
    const minute = this.time / 60;
    const hpTime = timeHpMultiplier(this.time);
    const lateSpeed = 1 + Math.min(.42, minute * .014);
    const map = this.ui.maps[this.mapId];
    const mapSpeed = map.danger === 'dense' ? 1.08 : map.danger === 'fire' ? 1.04 : 1;
    return {
      hp: hpTime * this.difficulty.hp * this.extraEnemyHp,
      damage: (1 + Math.min(1.05, minute * .038)) * this.difficulty.damage,
      speed: lateSpeed * this.difficulty.speed * mapSpeed,
      xp: 1 + Math.min(.75, minute * .018)
    };
  }

  spawnEnemy(type, forceElite = false, around = null) {
    const cfg = ENEMIES[type] || ENEMIES.slime;
    let x, y;
    if (around) {
      const a = Math.random() * Math.PI * 2;
      const d = 70 + Math.random() * 100;
      x = around.x + Math.cos(a) * d;
      y = around.y + Math.sin(a) * d;
    } else {
      const c = this.camera;
      const side = Math.floor(Math.random() * 4);
      const margin = GAME_CONFIG.spawnMargin;
      if (side === 0) { x = c.x - margin; y = c.y + Math.random() * c.h; }
      else if (side === 1) { x = c.x + c.w + margin; y = c.y + Math.random() * c.h; }
      else if (side === 2) { x = c.x + Math.random() * c.w; y = c.y - margin; }
      else { x = c.x + Math.random() * c.w; y = c.y + c.h + margin; }
    }

    x = Math.max(24, Math.min(GAME_CONFIG.worldWidth - 24, x));
    y = Math.max(24, Math.min(GAME_CONFIG.worldHeight - 24, y));

    const e = new Enemy(type, cfg, x, y, this.enemyScaling(type));
    if (forceElite && !e.boss) this.makeElite(e);
    this.enemies.push(e);
    return e;
  }

  makeElite(enemy) {
    enemy.elite = true;
    enemy.name = `Elite ${enemy.name}`;
    enemy.size *= 1.22;
    enemy.maxHp *= 1.8;
    enemy.hp = enemy.maxHp;
    enemy.damage *= 1.2;
    enemy.xp *= 2.3;
    enemy.coin = Math.max(enemy.coin, .5);

    const ids = Object.keys(ELITE_MODIFIERS);
    const count = Math.min(3, 1 + (Math.random() < .3 ? 1 : 0) + (this.time > 900 && Math.random() < .3 ? 1 : 0));
    const used = new Set();
    for (let i = 0; i < count; i++) {
      let id = ids[(Math.random() * ids.length) | 0];
      while (used.has(id) && used.size < ids.length) id = ids[(Math.random() * ids.length) | 0];
      used.add(id);
      enemy.applyEliteModifier(id, ELITE_MODIFIERS[id]);
    }
  }

  updateBossSchedule() {
    const schedule = [240, 480, 720, 960];
    const bosses = ['ogreBoss', 'lichBoss', 'wardenBoss', 'beastBoss'];
    if (this.minibossIndex < schedule.length && this.time >= schedule[this.minibossIndex]) {
      this.spawnBoss(bosses[this.minibossIndex]);
      this.minibossIndex++;
    }
    if (this.time >= GAME_CONFIG.finalBossTime && !this.finalSpawned) {
      this.spawnBoss('finalBoss');
      this.finalSpawned = true;
    }
  }

  spawnBoss(type) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.max(innerWidth, innerHeight) * .62;
    const x = Math.max(80, Math.min(GAME_CONFIG.worldWidth - 80, this.player.x + Math.cos(a) * d));
    const y = Math.max(80, Math.min(GAME_CONFIG.worldHeight - 80, this.player.y + Math.sin(a) * d));
    const e = new Enemy(type, ENEMIES[type], x, y, this.enemyScaling(type));
    e.maxHp *= type === 'finalBoss' ? 1.3 : 1;
    e.hp = e.maxHp;
    this.enemies.push(e);
    this.ui.flashMessage(`${e.name} surgiu!`);
  }

  spawnMinionsAround(source, count) {
    const allowed = this.time > 600 ? ['skeleton', 'goblin', 'bat'] : ['slime', 'bat'];
    for (let i = 0; i < count && this.enemies.length < GAME_CONFIG.maxEnemies; i++) {
      this.spawnEnemy(allowed[(Math.random() * allowed.length) | 0], false, source);
    }
  }

  spawnHazardNearPlayer(damage) {
    this.hazards.push({
      x: this.player.x + (Math.random() - .5) * 420,
      y: this.player.y + (Math.random() - .5) * 420,
      r: 72,
      t: 1.15,
      damage,
      hit: false,
      color: '#bf335c'
    });
  }

  spawnHazardRing(enemy, count) {
    for (let i = 0; i < count; i++) {
      const a = i * Math.PI * 2 / count;
      const d = 145 + enemy.phase * 28;
      this.hazards.push({ x: enemy.x + Math.cos(a) * d, y: enemy.y + Math.sin(a) * d, r: 58, t: 1.25, damage: enemy.damage * .9, hit: false, color: enemy.color });
    }
  }

  radialEnemyShots(enemy, n, damage) {
    for (let i = 0; i < n; i++) {
      const a = i * Math.PI * 2 / n;
      this.spawnEnemyProjectile(enemy.x, enemy.y, Math.cos(a), Math.sin(a), damage, 250 + enemy.phase * 18);
    }
  }

  coneEnemyShots(enemy, nx, ny, n, damage) {
    const base = Math.atan2(ny, nx);
    for (let i = 0; i < n; i++) {
      const a = base + (i - (n - 1) / 2) * .11;
      this.spawnEnemyProjectile(enemy.x, enemy.y, Math.cos(a), Math.sin(a), damage, 300);
    }
  }

  spawnEnemyProjectile(x, y, nx, ny, damage, speed = 250) {
    this.enemyProjectiles.push({ x, y, vx: nx * speed, vy: ny * speed, r: 7, damage, life: 5 });
  }

  explodeEnemy(enemy, damage, radius) {
    if (enemy.dead) return;
    const d = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
    if (d < radius + this.player.r) this.player.takeDamage(damage);
    this.burst(enemy.x, enemy.y, '#ff795f', 24);
    enemy.dead = true;
    this.player.kills++;
    this.spawnXp(enemy.x, enemy.y, enemy.xp);
  }

  applyEliteAura(enemy) {
    if (enemy.eliteAura === 'fire') {
      if (Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y) < 95) this.player.takeDamage(enemy.damage * .24);
    } else if (enemy.eliteAura === 'ice') {
      // Slow temporário: não destrói o atributo de velocidade permanentemente.
      if (Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y) < 130) {
        this.player.slowTimer = Math.max(this.player.slowTimer || 0, .16);
      }
    } else if (enemy.eliteAura === 'electric' && Math.random() < .015) {
      this.player.takeDamage(enemy.damage * .35);
    }
  }

  nearestEnemy(x, y, radius) {
    let best = null;
    let bestD = radius * radius;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const d = (e.x - x) ** 2 + (e.y - y) ** 2;
      if (d < bestD) { bestD = d; best = e; }
    }
    return best;
  }

  randomEnemy() {
    if (!this.enemies.length) return null;
    for (let tries = 0; tries < 8; tries++) {
      const e = this.enemies[(Math.random() * this.enemies.length) | 0];
      if (e && !e.dead) return e;
    }
    return this.enemies.find(e => !e.dead) || null;
  }

  closestEnemies(x, y, radius, n) {
    const r2 = radius * radius;
    const arr = [];
    for (const e of this.enemies) {
      if (e.dead) continue;
      const d2 = (e.x - x) ** 2 + (e.y - y) ** 2;
      if (d2 <= r2) arr.push({ e, d2 });
    }
    arr.sort((a, b) => a.d2 - b.d2);
    return arr.slice(0, n).map(v => v.e);
  }

  spawnProjectile(data) {
    if (this.projectiles.length >= GAME_CONFIG.maxProjectiles) return;
    this.projectiles.push(this.projectilePool.acquire({ ...data, life: data.life ?? 3 }));
  }

  updateProjectiles(dt) {
    const keep = [];
    for (const p of this.projectiles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.trailTimer = (p.trailTimer ?? 0) - dt;
      if (p.trailTimer <= 0) {
        this.emitProjectileTrail(p);
        const q = Number(this.save.data.settings.quality ?? 1);
        p.trailTimer = this.save.data.settings.performance ? .18 : q >= 2 ? .055 : q >= 1 ? .10 : .16;
      }

      if (p.life <= 0 || p.dead || p.x < -100 || p.y < -100 || p.x > GAME_CONFIG.worldWidth + 100 || p.y > GAME_CONFIG.worldHeight + 100) {
        this.projectilePool.release(p);
        continue;
      }

      const near = this.grid.query(p.x, p.y, p.r + 42);
      for (const e of near) {
        if (e.dead) continue;
        if (Math.hypot(e.x - p.x, e.y - p.y) < e.size + p.r) {
          this.damageEnemy(e, p.damage, true, p.element, true, p.id);
          this.spawnProjectileImpact(p);
          if (p.freeze) e.status.freeze = Math.max(e.status.freeze, 1.35);
          if (p.poison) {
            e.status.poison = Math.max(e.status.poison, 3.2);
            e.status.poisonDps = Math.min(80, e.status.poisonDps + p.damage * .08);
          }
          if (p.explode) this.areaHit(p.x, p.y, p.explode, p.damage * .5, p.element, 0, false, p.id);
          p.pierce--;
          if (p.pierce < 0) { p.dead = true; break; }
        }
      }
      if (!p.dead) keep.push(p); else this.projectilePool.release(p);
    }
    this.projectiles = keep;
  }

  updateEnemyProjectiles(dt) {
    const keep = [];
    for (const p of this.enemyProjectiles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) continue;
      if (Math.hypot(p.x - this.player.x, p.y - this.player.y) < p.r + this.player.r) {
        this.player.takeDamage(p.damage);
        continue;
      }
      keep.push(p);
    }
    this.enemyProjectiles = keep.slice(-420);
  }

  createMeteor(x, y, damage, radius, element = 'fire', sourceId = 'meteor') {
    this.meteors.push({ x, y, damage, r: radius, t: .65, hit: false, element, sourceId });
  }

  updateMeteors(dt) {
    const keep = [];
    for (const m of this.meteors) {
      m.t -= dt;
      if (m.t <= 0 && !m.hit) {
        m.hit = true;
        this.areaHit(m.x, m.y, m.r, m.damage, m.element, 0, false, m.sourceId);
        this.emitElementParticles(m.x, m.y, m.element, 22);
        this.addAbilityEffect({
          type: m.sourceId === 'stoneSpike' ? 'physicalImpact' : m.sourceId === 'volcanicEruption' ? 'volcanicBlast' : 'fireExplosion',
          x: m.x, y: m.y, radius: Math.min(150, m.r), life: .34, maxLife: .34
        });
        this.shake = .13;
      }
      if (m.t > -.28) keep.push(m);
    }
    this.meteors = keep;
  }

  updateHazards(dt) {
    const keep = [];
    for (const h of this.hazards) {
      h.t -= dt;
      if (h.t <= 0 && !h.hit) {
        h.hit = true;
        if (Math.hypot(h.x - this.player.x, h.y - this.player.y) < h.r + this.player.r) this.player.takeDamage(h.damage);
      }
      if (h.t > -.3) keep.push(h);
    }
    this.hazards = keep;
  }

  ensureSummons(id, count, damage, electric = false) {
    const existing = this.summons.filter(s => s.id === id && !s.dead);
    while (existing.length < count && this.summons.length < 20) {
      const a = Math.random() * Math.PI * 2;
      const s = {
        id,
        x: this.player.x + Math.cos(a) * 48,
        y: this.player.y + Math.sin(a) * 48,
        damage,
        cd: Math.random() * .45,
        target: null,
        dead: false,
        electric,
        life: id === 'revenant' ? 12 : Infinity
      };
      existing.push(s);
      this.summons.push(s);
    }
    for (const s of existing) {
      s.damage = Math.max(s.damage, damage);
      s.electric = s.electric || electric;
    }
  }

  spawnRevenant(x, y, damage) {
    if (this.summons.length >= 20) return;
    this.summons.push({ id: 'revenant', x, y, damage, cd: 0, target: null, dead: false, electric: false, life: 12 });
  }

  updateSummons(dt) {
    const p = this.player;
    const keep = [];
    for (const s of this.summons) {
      s.cd -= dt;
      s.life -= dt;
      if (s.life <= 0) continue;

      if (!s.target || s.target.dead || Math.hypot(s.target.x - s.x, s.target.y - s.y) > 760) {
        s.target = this.nearestEnemy(s.x, s.y, 760);
      }

      const distPlayer = Math.hypot(p.x - s.x, p.y - s.y);
      let speed = Math.max(245, p.speed * .82);
      if (distPlayer > 520) speed *= 1.75;
      if (distPlayer > 900) {
        const a = Math.random() * Math.PI * 2;
        s.x = p.x + Math.cos(a) * 80;
        s.y = p.y + Math.sin(a) * 80;
        s.target = null;
      }

      const target = s.target;
      if (target) {
        const dx = target.x - s.x;
        const dy = target.y - s.y;
        const d = Math.hypot(dx, dy) || 1;
        s.x += dx / d * speed * dt;
        s.y += dy / d * speed * dt;
        if (d < 30 + target.size && s.cd <= 0) {
          this.damageEnemy(target, s.damage, true, s.electric ? 'electric' : 'shadow', true, s.id);
          if (s.electric) {
            const chain = this.closestEnemies(target.x, target.y, 150, 3).filter(e => e !== target);
            let previous = target;
            for (const e of chain) {
              this.damageEnemy(e, s.damage * .45, false, 'electric', true, s.id);
              this.lightningArcs.push({ x1: previous.x, y1: previous.y, x2: e.x, y2: e.y, life: .12, color: this.colorFor('electric') });
              previous = e;
            }
          }
          s.cd = s.electric ? .48 : .62;
        }
      } else {
        const dx = p.x - s.x;
        const dy = p.y - s.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d > 70) {
          s.x += dx / d * speed * dt;
          s.y += dy / d * speed * dt;
        }
      }
      keep.push(s);
    }
    this.summons = keep;
  }

  areaHit(x, y, radius, damage, element, freeze = 0, continuous = false, sourceId = element) {
    const candidates = this.grid.query(x, y, radius + 48);
    for (const e of candidates) {
      if (e.dead) continue;
      if (Math.hypot(e.x - x, e.y - y) <= radius + e.size) {
        this.damageEnemy(e, damage, !continuous, element, !continuous, sourceId);
        if (freeze) e.status.freeze = Math.max(e.status.freeze, freeze);
        if (element === 'fire') {
          e.status.burn = Math.max(e.status.burn, 2.6);
          e.status.burnDps = Math.max(e.status.burnDps, damage * .07);
        }
      }
    }
  }

  damageEnemy(enemy, damage, canCrit = true, element = 'physical', number = true, sourceId = element) {
    if (!enemy || enemy.dead) return 0;
    let crit = false;
    if (canCrit && Math.random() < this.player.crit) {
      damage *= this.player.critDamage;
      crit = true;
      this.player.highestCrit = Math.max(this.player.highestCrit, damage);
    }

    const armorReduction = 100 / (100 + Math.max(0, enemy.armor || 0) * 8);
    if (this.flags.titanSigil && enemy.boss) damage *= 1.16;
    damage *= armorReduction;

    enemy.hp -= damage;
    enemy.hitFlash = .075;
    this.player.damageDone += damage;
    this.weaponDamage[sourceId] = (this.weaponDamage[sourceId] || 0) + damage;

    if (number && this.save.data.settings.damageNumbers) {
      this.numbers.push({ x: enemy.x, y: enemy.y - 10, text: crit ? `${Math.round(damage)} CRIT` : `${Math.round(damage)}`, crit, life: .68 });
    }

    if (crit && this.flags.voidEye && Math.random() < .075) {
      this.singularities.push({ x: enemy.x, y: enemy.y, r: 115, t: 1.6, damage: damage * .10, sourceId: 'voidEye' });
    }

    if (enemy.hp <= 0) this.killEnemy(enemy);
    return damage;
  }

  killEnemy(enemy) {
    if (enemy.dead) return;
    const wasFrozen = enemy.status.freeze > 0;
    enemy.dead = true;
    this.player.kills++;
    if (enemy.elite) { this.player.eliteKills++; this.stats.elites++; }
    if (enemy.boss) { this.player.bossKills++; this.stats.bosses++; }
    if (this.player.id === 'necromancer') this.player.souls = Math.min(120, this.player.souls + (enemy.elite ? 3 : 1));

    this.spawnXp(enemy.x, enemy.y, enemy.xp);
    if (Math.random() < Math.min(.6, enemy.coin || 0)) this.pickups.push({ type: 'coin', x: enemy.x + 8, y: enemy.y, value: enemy.boss ? Math.max(1, enemy.coin) : 1, life: 70 });
    if (Math.random() < .010) this.pickups.push({ type: 'heal', x: enemy.x, y: enemy.y - 8, value: 1, life: 35 });
    if (Math.random() < .0035) this.pickups.push({ type: 'magnet', x: enemy.x, y: enemy.y + 8, value: 1, life: 35 });

    if (enemy.elite && Math.random() < .24) this.spawnChest(enemy.x, enemy.y, this.rollChestTier('elite'));
    if (enemy.boss) this.spawnChest(enemy.x, enemy.y, this.rollChestTier(enemy.type === 'finalBoss' ? 'final' : 'boss'));

    if (this.flags.glacialCrown && wasFrozen) {
      this.areaHit(enemy.x, enemy.y, 105, Math.max(30, enemy.maxHp * .035), 'ice', 1.1, false, 'glacialCrown');
      this.burst(enemy.x, enemy.y, this.colorFor('ice'), 18);
    }
    if (this.flags.bookDead && Math.random() < .12) this.spawnRevenant(enemy.x, enemy.y, 30 * this.player.damage);
    if ((this.player.weapons.toxicCorpses || this.player.weapons.plagueGarden) && Math.random() < .32) {
      this.areaHit(enemy.x, enemy.y, 92, 28 * this.player.damage, 'poison', 0, false, 'toxicCorpses');
    }

    if (enemy.type === 'finalBoss') {
      this.victory = true;
      this.end(true);
    }
    this.burst(enemy.x, enemy.y, enemy.color, enemy.boss ? 24 : enemy.elite ? 14 : 8);
  }

  spawnXp(x, y, value) {
    this.pickups.push({ type: 'xp', x, y, value, life: GAME_CONFIG.pickupLife });
  }

  updatePickups(dt) {
    const keep = [];
    for (const p of this.pickups) {
      p.life -= dt;
      if (p.life <= 0) continue;
      const d = Math.hypot(this.player.x - p.x, this.player.y - p.y);
      if (d < this.player.pickup) {
        const s = Math.min(1, dt * 9);
        p.x += (this.player.x - p.x) * s;
        p.y += (this.player.y - p.y) * s;
      }
      if (d < 25) {
        this.collectPickup(p);
        continue;
      }
      keep.push(p);
    }
    this.pickups = keep.slice(-1100);
  }

  collectPickup(p) {
    if (p.type === 'xp') this.pendingLevels += this.player.gainXp(p.value);
    else if (p.type === 'coin') this.player.coins += Math.max(1, Math.floor(p.value * this.difficulty.coin));
    else if (p.type === 'heal') this.healPlayer(28);
    else if (p.type === 'magnet') this.magnetAllXp();
    else if (p.type === 'chest') this.openChest(p.tier);
  }

  healPlayer(amount) {
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + amount);
  }

  magnetAllXp() {
    for (const q of this.pickups) if (q.type === 'xp') {
      q.x = this.player.x + (Math.random() - .5) * 35;
      q.y = this.player.y + (Math.random() - .5) * 35;
    }
  }

  rollChestTier(source = 'normal') {
    const r = Math.random();
    if (source === 'final') return r < .4 ? 'arcane' : 'legendary';
    if (source === 'boss') return r < .08 ? 'arcane' : r < .42 ? 'legendary' : 'epic';
    if (source === 'elite') return r < .04 ? 'legendary' : r < .28 ? 'epic' : 'rare';
    return r < .02 ? 'epic' : r < .20 ? 'rare' : 'common';
  }

  spawnChest(x, y, tier = 'common') {
    this.pickups.push({ type: 'chest', x, y, value: 1, life: 80, tier });
  }

  openChest(tier = 'common') {
    if (this.paused) return;
    this.paused = true;
    this.stats.chests++;

    const transformation = availableTransformations(this.player)[0];
    const tierRank = RARITIES.indexOf(tier);
    let reward;

    if (transformation && tierRank >= 2 && Math.random() < .60) {
      reward = { type: 'transform', id: transformation.id, icon: WEAPONS[transformation.result].icon, name: transformation.name, desc: transformation.desc, rarity: transformation.fusion ? 'arcane' : 'legendary', recipe: transformation };
    } else if (Math.random() < .48) {
      const relic = rollRelic(this.player.relics, tier);
      if (relic) {
        reward = { type: 'relic', id: relic[0], icon: relic[1].icon, name: relic[1].name, desc: relic[1].desc, rarity: relic[1].rarity };
      }
    }

    if (!reward) {
      const roll = Math.random();
      if (roll < .45) {
        const choices = this.getChoices(1);
        const c = choices[0];
        reward = c ? { ...c, type: 'upgrade' } : { type: 'coins', icon: '◈', name: 'Tesouro', desc: '+30 moedas', rarity: tier };
      } else if (roll < .75) reward = { type: 'coins', icon: '◈', name: 'Tesouro', desc: `+${20 + tierRank * 12} moedas`, amount: 20 + tierRank * 12, rarity: tier };
      else reward = { type: 'heal', icon: '❤️', name: 'Essência Vital', desc: 'Recupera 40% da vida máxima.', rarity: tier };
    }

    this.ui.showChest(reward, () => {
      this.applyChestReward(reward);
      this.paused = false;
    });
  }

  applyChestReward(reward) {
    if (!reward) return;
    if (reward.type === 'relic') this.addRelic(reward.id);
    else if (reward.type === 'transform') this.applyTransformation(reward.recipe);
    else if (reward.type === 'upgrade') this.applyChoice(reward);
    else if (reward.type === 'coins') this.player.coins += reward.amount || 30;
    else if (reward.type === 'heal') this.healPlayer(this.player.maxHp * .4);
  }

  addRelic(id) {
    if (!RELICS[id] || this.player.relics.includes(id)) return;
    this.player.relics.push(id);
    RELICS[id].apply(this);
    this.stats.relics++;
    this.ui.refreshRelics(this.player.relics);
    this.ui.flashMessage(`Relíquia: ${RELICS[id].name}`);
  }

  checkLevel() {
    if (this.pendingLevels > 0 && !this.paused) {
      this.pendingLevels--;
      this.paused = true;
      this.levelSession = { choices: this.getChoices(4) };
      this.showLevelSession();
    }
  }

  showLevelSession() {
    const session = this.levelSession;
    this.ui.showLevelUp(session.choices, {
      rerolls: this.player.rerolls,
      banishes: this.player.banishes,
      skips: this.player.skips,
      onPick: choice => {
        this.applyChoice(choice);
        this.finishLevelSelection();
      },
      onReroll: () => {
        if (this.player.rerolls <= 0) return;
        this.player.rerolls--;
        session.choices = this.getChoices(4);
        this.showLevelSession();
      },
      onBanish: choice => {
        if (this.player.banishes <= 0) return;
        this.player.banishes--;
        this.banished.add(choice.id);
        session.choices = session.choices.filter(c => c.id !== choice.id);
        while (session.choices.length < 3) {
          const extra = this.getChoices(4).find(c => !session.choices.some(x => x.id === c.id));
          if (!extra) break;
          session.choices.push(extra);
        }
        this.showLevelSession();
      },
      onSkip: () => {
        if (this.player.skips <= 0) return;
        this.player.skips--;
        this.finishLevelSelection();
      }
    });
  }

  finishLevelSelection() {
    this.levelSession = null;
    this.ui.hideLevelUp();
    this.paused = false;
  }

  getChoices(count = 4) {
    const options = [];
    const p = this.player;

    for (const [id, w] of Object.entries(WEAPONS)) {
      if (w.evolved || this.banished.has(id)) continue;
      const level = p.weapons[id] || 0;
      if (level > 0 && level < w.max) {
        options.push({
          kind: 'weapon', id, name: w.name, icon: w.icon,
          currentLevel: level, nextLevel: level + 1,
          desc: getWeaponLevelDescription(id, level),
          rarity: this.rollRarity()
        });
      } else if (level === 0 && p.weaponOrder.length < 6) {
        options.push({
          kind: 'weapon', id, name: w.name, icon: w.icon,
          currentLevel: 0, nextLevel: 1,
          desc: `NOVA HABILIDADE • ${w.desc}`,
          rarity: this.rollRarity()
        });
      }
    }

    for (const [id, passive] of Object.entries(PASSIVES)) {
      if (this.banished.has(id)) continue;
      const level = p.passives[id] || 0;
      if (level < passive.max && (level > 0 || p.passiveOrder.length < 6)) {
        options.push({
          kind: 'passive', id, name: passive.name, icon: passive.icon,
          currentLevel: level, nextLevel: level + 1, desc: passive.desc,
          rarity: this.rollRarity()
        });
      }
    }

    this.shuffle(options);
    return options.slice(0, count);
  }

  rollRarity() {
    const r = Math.random();
    if (r < .003) return 'arcane';
    if (r < .025) return 'legendary';
    if (r < .11) return 'epic';
    if (r < .32) return 'rare';
    return 'common';
  }

  applyChoice(choice) {
    if (!choice) return;
    const p = this.player;
    const rarityPower = RARITY_POWER[choice.rarity] || 1;

    if (choice.kind === 'weapon') {
      if (!p.weapons[choice.id]) p.addWeapon(choice.id, 1);
      else p.weapons[choice.id] = Math.min(WEAPONS[choice.id].max, p.weapons[choice.id] + 1);
      if (rarityPower > 1) p.damage *= 1 + (rarityPower - 1) * .045;
    } else if (choice.kind === 'passive') {
      p.addPassive(choice.id);
      PASSIVES[choice.id].apply(p);
      if (rarityPower > 1) p.maxHp += Math.round((rarityPower - 1) * 14);
    }

    this.ui.refreshWeaponBar(p);
    this.checkTransformations();
  }

  checkTransformations() {
    const available = availableTransformations(this.player);
    if (!available.length) return;
    // Transformações entram via baús. Apenas sinaliza quando ficam prontas.
    for (const recipe of available) {
      const key = `ready:${recipe.id}`;
      if (!this.flags[key]) {
        this.flags[key] = true;
        this.ui.flashMessage(`${recipe.fusion ? 'ARCANE FUSION' : 'EVOLUÇÃO'} pronta: ${recipe.name}`);
      }
    }
  }

  applyTransformation(recipe) {
    if (!recipe) return;
    const resultId = replaceAbility(this.player, recipe);
    if (recipe.fusion) {
      this.save.discoverFusion(recipe.id);
      this.stats.fusions++;
      this.ui.flashMessage(`ARCANE FUSION: ${recipe.name}`);
    } else {
      this.save.discoverEvolution(recipe.id);
      this.stats.evolutions++;
      this.ui.flashMessage(`EVOLUÇÃO: ${recipe.name}`);
    }
    this.weaponSystem.timers[resultId] = 0;
    this.ui.refreshWeaponBar(this.player);
  }

  isArcaneWeapon(id) {
    return !!WEAPONS[id]?.fusion || WEAPONS[id]?.rarity === 'arcane';
  }

  updateMapEvents(dt) {
    this.eventTimer -= dt;
    if (this.eventTimer <= 0 && this.events.length === 0 && !this.challenge?.active) {
      this.spawnMapEvent();
      this.eventTimer = GAME_CONFIG.eventInterval + Math.random() * 70;
    }

    for (const ev of this.events) {
      if (ev.used) continue;
      if (Math.hypot(ev.x - this.player.x, ev.y - this.player.y) < 34 + this.player.r) {
        ev.used = true;
        this.paused = true;
        this.ui.showEvent(ev, action => this.resolveEvent(ev, action));
        break;
      }
    }
    this.events = this.events.filter(e => !e.used);
  }

  spawnMapEvent() {
    const types = ['altar', 'merchant', 'challenge', 'portal', 'cursed'];
    const type = types[(Math.random() * types.length) | 0];
    const a = Math.random() * Math.PI * 2;
    const d = 280 + Math.random() * 340;
    const ev = {
      type,
      x: Math.max(70, Math.min(GAME_CONFIG.worldWidth - 70, this.player.x + Math.cos(a) * d)),
      y: Math.max(70, Math.min(GAME_CONFIG.worldHeight - 70, this.player.y + Math.sin(a) * d)),
      used: false
    };
    Object.assign(ev, {
      altar: { icon: '⛩️', name: 'Altar Arcano', desc: 'Sacrifique 18% da vida atual para receber +12% dano nesta partida.' },
      merchant: { icon: '🧙‍♂️', name: 'Mercador Errante', desc: 'Compre uma relíquia aleatória por 25 moedas da partida.' },
      challenge: { icon: '⚔️', name: 'Desafio da Horda', desc: 'Sobreviva 60 segundos com spawn aumentado para ganhar um Baú Épico.' },
      portal: { icon: '🌀', name: 'Portal Instável', desc: 'Teleporta para outra área segura, cura e atrai XP.' },
      cursed: { icon: '☠️', name: 'Pacto Amaldiçoado', desc: '90 segundos de hordas mais perigosas em troca de um Baú Lendário.' }
    }[type]);
    this.events.push(ev);
    this.ui.flashMessage(`${ev.name} apareceu no mapa.`);
  }

  resolveEvent(ev, action) {
    if (action === 'decline') {
      this.paused = false;
      this.ui.hideEvent();
      return;
    }
    if (ev.type === 'altar') {
      this.player.hp = Math.max(1, this.player.hp * .82);
      this.player.damage *= 1.12;
    } else if (ev.type === 'merchant') {
      if (this.player.coins >= 25) {
        this.player.coins -= 25;
        const relic = rollRelic(this.player.relics, 'epic');
        if (relic) this.addRelic(relic[0]);
      } else this.ui.flashMessage('Moedas insuficientes.');
    } else if (ev.type === 'challenge') {
      this.challenge = { active: true, t: 60, cursed: false, reward: 'epic' };
    } else if (ev.type === 'portal') {
      this.player.x = 500 + Math.random() * (GAME_CONFIG.worldWidth - 1000);
      this.player.y = 500 + Math.random() * (GAME_CONFIG.worldHeight - 1000);
      this.camera.snap?.(this.player);
      this.healPlayer(this.player.maxHp * .2);
      this.magnetAllXp();
    } else if (ev.type === 'cursed') {
      this.challenge = { active: true, t: 90, cursed: true, reward: 'legendary' };
    }
    this.ui.hideEvent();
    this.paused = false;
  }

  updateChallenge(dt) {
    if (!this.challenge?.active) return;
    this.challenge.t -= dt;
    if (this.challenge.t <= 0) {
      const tier = this.challenge.reward;
      this.challenge.active = false;
      this.spawnChest(this.player.x + 45, this.player.y, tier);
      this.ui.flashMessage(`Desafio concluído! Baú ${RARITY_LABEL[tier] || tier}.`);
    }
  }

  updateRelicTimers(dt) {
    if (this.flags.arcaneMagnet) {
      this.magnetTimer -= dt;
      if (this.magnetTimer <= 0) {
        this.magnetTimer = 45;
        this.magnetAllXp();
        this.ui.flashMessage('Magnetar Arcano ativado.');
      }
    }
  }

  onAbilityCast(id) {
    this.castLog[id] = (this.castLog[id] || 0) + 1;
  }

  updateDelayed(dt) {
    const keep = [];
    for (const e of this.delayedEffects) {
      e.t -= dt;
      if (e.t <= 0) {
        try { e.fn(); } catch (err) { console.error('Erro em efeito atrasado:', err); }
      } else keep.push(e);
    }
    this.delayedEffects = keep;
  }

  updateSingularities(dt) {
    const keep = [];
    for (const s of this.singularities) {
      s.t -= dt;
      const targets = this.grid.query(s.x, s.y, s.r);
      for (const e of targets) {
        if (e.dead) continue;
        const dx = s.x - e.x;
        const dy = s.y - e.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d < s.r) {
          e.x += dx / d * 42 * dt;
          e.y += dy / d * 42 * dt;
          this.damageEnemy(e, s.damage * dt, false, 'arcane', false, s.sourceId);
        }
      }
      if (s.t > 0) keep.push(s);
    }
    this.singularities = keep.slice(-8);
  }

  updateLightning(dt) {
    for (const a of this.lightningArcs) a.life -= dt;
    this.lightningArcs = this.lightningArcs.filter(a => a.life > 0).slice(-80);
  }

  updateAbilityEffects(dt) {
    const keep = [];
    for (const e of this.abilityEffects) {
      e.life -= dt;
      if (e.life > 0) keep.push(e);
    }
    this.abilityEffects = keep.slice(-48);
  }

  addAbilityEffect(effect) {
    if (!effect) return;
    const maxLife = effect.maxLife ?? effect.life ?? .3;
    this.abilityEffects.push({ ...effect, life: effect.life ?? maxLife, maxLife });
    if (this.abilityEffects.length > 48) this.abilityEffects.splice(0, this.abilityEffects.length - 48);
  }

  effectsScale() {
    const q = Math.max(0, Math.min(2, Number(this.save.data.settings.quality ?? 1)));
    const particleSetting = Math.max(0, Math.min(3, Number(this.save.data.settings.particles ?? 2)));
    if (particleSetting <= 0) return 0;
    let scale = [0.34, 0.68, 1][q] * (particleSetting / 2);
    if (this.save.data.settings.performance) scale *= .55;
    return Math.max(.18, Math.min(1.35, scale));
  }

  particleKind(element) {
    if (element === 'fire') return 'fire';
    if (element === 'ice') return 'ice';
    if (element === 'electric') return 'electric';
    if (element === 'poison' || element === 'nature') return 'poison';
    if (element === 'shadow') return 'shadow';
    if (element === 'arcane' || element === 'holy') return 'arcane';
    if (element === 'wind') return 'wind';
    if (element === 'earth') return 'earth';
    return 'physical';
  }

  emitElementParticles(x, y, element, requested = 6, options = {}) {
    const scale = this.effectsScale();
    if (scale <= 0) return;
    const count = Math.max(1, Math.min(28, Math.round(requested * scale)));
    const kind = options.kind || this.particleKind(element);
    const color = options.color || this.colorFor(element);
    for (let i = 0; i < count && this.particles.length < GAME_CONFIG.maxParticles; i++) {
      const a = options.angle ?? Math.random() * Math.PI * 2;
      const spread = options.spread ?? Math.PI * 2;
      const aa = options.angle == null ? a : a + (Math.random() - .5) * spread;
      const speed = (options.minSpeed ?? 28) + Math.random() * ((options.maxSpeed ?? 105) - (options.minSpeed ?? 28));
      const life = (options.life ?? .42) * (.72 + Math.random() * .58);
      this.particles.push(this.particlePool.acquire({
        x: x + (Math.random() - .5) * (options.jitter ?? 5),
        y: y + (Math.random() - .5) * (options.jitter ?? 5),
        vx: (options.baseVx ?? 0) + Math.cos(aa) * speed,
        vy: (options.baseVy ?? 0) + Math.sin(aa) * speed,
        life,
        maxLife: life,
        color,
        r: (options.r ?? 2.4) * (.72 + Math.random() * .55),
        kind,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - .5) * 8
      }));
    }
  }

  emitProjectileTrail(p) {
    if (this.effectsScale() <= 0) return;
    const angle = Math.atan2(p.vy || 0, p.vx || 1) + Math.PI;
    const base = p.id === 'infernalSun' ? 3 : p.id === 'fireball' ? 2 : 1;
    const trailElement = p.id === 'divineEye' ? 'holy' : p.element;
    this.emitElementParticles(p.x, p.y, trailElement, base, {
      angle,
      spread: .55,
      minSpeed: 16,
      maxSpeed: 58,
      life: p.id === 'infernalSun' ? .42 : .28,
      r: p.id === 'infernalSun' ? 3.2 : 2,
      baseVx: -(p.vx || 0) * .045,
      baseVy: -(p.vy || 0) * .045,
      jitter: 2
    });
  }

  spawnProjectileImpact(p) {
    const radius = Math.max(18, Math.min(145, p.explode || (p.r || 10) * 2.4));
    let type = 'physicalImpact';
    if (p.id === 'fireball' || p.id === 'infernalSun') type = 'fireExplosion';
    else if (p.id === 'ice') type = 'iceShatter';
    else if (p.id === 'poison') type = 'poisonSplash';
    else if (p.id === 'windBlade') type = 'windImpact';
    else if (p.id === 'holySpear' || p.id === 'divineEye') type = 'holyBurst';
    else if (p.id === 'shadowDagger') type = 'shadowBurst';
    this.addAbilityEffect({ type, x: p.x, y: p.y, radius, life: .22, maxLife: .22 });
    this.emitElementParticles(p.x, p.y, p.element, p.explode ? 12 : 5, { minSpeed: 35, maxSpeed: 125, life: .33 });
  }

  updateParticles(dt) {
    const keep = [];
    for (const p of this.particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation = (p.rotation || 0) + (p.spin || 0) * dt;
      p.vx *= Math.max(0, 1 - dt * .7);
      p.vy *= Math.max(0, 1 - dt * .7);
      if (p.life > 0) keep.push(p); else this.particlePool.release(p);
    }
    this.particles = keep;
  }

  updateNumbers(dt) {
    for (const n of this.numbers) { n.life -= dt; n.y -= 30 * dt; }
    this.numbers = this.numbers.filter(n => n.life > 0).slice(-180);
  }

  burst(x, y, color, n) {
    const scale = this.effectsScale();
    if (scale <= 0) return;
    const count = Math.min(36, Math.round(n * scale));
    for (let i = 0; i < count && this.particles.length < GAME_CONFIG.maxParticles; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 45 + Math.random() * 130;
      const life = .25 + Math.random() * .45;
      this.particles.push(this.particlePool.acquire({
        x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        life, maxLife: life, color, r: 2 + Math.random() * 2,
        kind: 'physical', rotation: Math.random() * Math.PI * 2, spin: (Math.random() - .5) * 5
      }));
    }
  }

  cleanupFarEntities() {
    const px = this.player.x, py = this.player.y;
    const maxD = 2050;
    this.enemies = this.enemies.filter(e => !e.dead && (e.boss || (Math.abs(e.x - px) < maxD && Math.abs(e.y - py) < maxD)));
    this.enemyProjectiles = this.enemyProjectiles.filter(p => Math.abs(p.x - px) < 1700 && Math.abs(p.y - py) < 1700);
  }

  checkAchievementsLive() {
    const newly = checkAchievements(this.save, this);
    for (const a of newly) this.ui.flashMessage(`Conquista: ${a.name} (+${a.reward} ◈)`);
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  colorFor(element) {
    return GAME_CONFIG.colors[element] || '#fff';
  }

  togglePause() {
    if (this.ended || !this.running) return;
    this.paused = !this.paused;
    this.ui.showPause(this.paused, this);
  }

  restart() {
    this.start(this.charId, this.mapId, this.difficultyId);
  }

  quit() {
    this.running = false;
    this.paused = false;
    this.loopToken++;
    this.ui.showMain();
  }

  end(victory) {
    if (this.ended) return;
    this.ended = true;
    this.paused = true;
    const run = {
      time: this.time,
      level: this.player.level,
      kills: this.player.kills,
      elites: this.stats.elites,
      bosses: this.stats.bosses,
      xp: this.player.xpCollected,
      coins: this.player.coins,
      highestCrit: this.player.highestCrit,
      miniboss: this.minibossIndex > 0,
      victory
    };
    this.save.finishRun(run);
    const achievements = checkAchievements(this.save, this);
    this.ui.showEnd(this, victory, achievements);
  }

  render() {
    const c = this.ctx;
    c.save();
    c.clearRect(0, 0, innerWidth, innerHeight);
    let sx = 0, sy = 0;
    if (this.shake > 0 && this.save.data.settings.shake) {
      sx = (Math.random() - .5) * 7;
      sy = (Math.random() - .5) * 7;
      this.shake = Math.max(0, this.shake - .018);
    }
    c.translate(sx, sy);

    this.drawWorld(c);
    // Auras e fusions persistentes são desenhadas por silhueta/forma, não por cor apenas.
    drawPersistentAbilities(c, this);
    for (const ev of this.events) this.drawMapEvent(c, ev);
    for (const p of this.pickups) this.drawPickup(c, p);
    for (const h of this.hazards) this.drawHazard(c, h);
    for (const s of this.singularities) this.drawSingularity(c, s);
    for (const m of this.meteors) this.drawMeteor(c, m);
    for (const e of this.enemies) this.drawEnemy(c, e);
    for (const p of this.projectiles) this.drawProjectile(c, p);
    for (const p of this.enemyProjectiles) this.drawEnemyProjectile(c, p);
    for (const s of this.summons) this.drawSummon(c, s);
    for (const o of this.orbitVisuals) drawOrbitVisual(c, this, o);
    this.orbitVisuals = [];
    for (const a of this.lightningArcs) this.drawLightning(c, a);
    for (const e of this.abilityEffects) drawAbilityEffect(c, this, e);
    for (const p of this.particles) drawParticleVisual(c, this, p);
    this.drawPlayer(c);
    for (const n of this.numbers) this.drawNumber(c, n);
    c.restore();
  }

  drawWorld(c) {
    const map = this.ui.maps[this.mapId];
    c.fillStyle = map.ground;
    c.fillRect(0, 0, innerWidth, innerHeight);
    const step = 140;
    const startX = Math.floor(this.camera.x / step) * step;
    const startY = Math.floor(this.camera.y / step) * step;
    c.fillStyle = map.accent;
    for (let x = startX; x < this.camera.x + innerWidth + step; x += step) {
      for (let y = startY; y < this.camera.y + innerHeight + step; y += step) {
        const screenX = x - this.camera.x;
        const screenY = y - this.camera.y;
        const seed = Math.abs((x * 13 + y * 7) % 97);
        c.globalAlpha = .18 + (seed % 3) * .035;
        c.beginPath();
        c.arc(screenX + (seed % 30), screenY + (seed % 23), 3 + (seed % 8), 0, Math.PI * 2);
        c.fill();
      }
    }
    c.globalAlpha = 1;
  }

  drawCircleWorld(c, x, y, r, color) {
    if (!this.camera.visible(x, y, r)) return;
    const s = this.camera.worldToScreen(x, y);
    c.fillStyle = color;
    c.beginPath();
    c.arc(s.x, s.y, r, 0, Math.PI * 2);
    c.fill();
  }

  drawPlayer(c) {
    const s = this.camera.worldToScreen(this.player.x, this.player.y);
    c.save();
    c.translate(s.x, s.y);
    c.fillStyle = this.player.iframes > 0 ? '#ffffff' : '#67e0b6';
    c.beginPath();
    c.arc(0, 0, this.player.r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#d9fff1';
    c.lineWidth = 3;
    c.stroke();
    c.fillStyle = '#08221b';
    c.fillRect(-5, -4, 3, 3);
    c.fillRect(4, -4, 3, 3);
    c.restore();
  }

  drawEnemy(c, e) {
    if (!this.camera.visible(e.x, e.y, e.size + 8)) return;
    const s = this.camera.worldToScreen(e.x, e.y);
    c.save();
    c.fillStyle = e.hitFlash > 0 ? '#fff' : e.color;
    c.beginPath();
    c.arc(s.x, s.y, e.size, 0, Math.PI * 2);
    c.fill();
    if (e.elite) {
      c.strokeStyle = '#f2c861';
      c.lineWidth = 2.5;
      c.stroke();
      c.font = '11px system-ui';
      c.textAlign = 'center';
      c.fillStyle = '#ffe7a0';
      const icons = e.eliteMods.map(id => ELITE_MODIFIERS[id]?.icon || '').join('');
      c.fillText(icons, s.x, s.y - e.size - 16);
    }
    if (e.boss) {
      c.strokeStyle = '#f7d67c';
      c.lineWidth = 3;
      c.stroke();
      const w = e.size * 2;
      c.fillStyle = '#1b0d12';
      c.fillRect(s.x - e.size, s.y - e.size - 12, w, 5);
      c.fillStyle = '#e44f75';
      c.fillRect(s.x - e.size, s.y - e.size - 12, w * Math.max(0, e.hp / e.maxHp), 5);
    }
    c.restore();
  }

  drawProjectile(c, p) { drawProjectileVisual(c, this, p); }
  drawEnemyProjectile(c, p) { this.drawCircleWorld(c, p.x, p.y, p.r, '#e95d93'); }

  drawPickup(c, p) {
    const colors = { xp: '#56d7ff', coin: '#ffd45c', heal: '#75ef91', magnet: '#d773ff', chest: '#d6ae52' };
    const size = p.type === 'chest' ? 12 : 6;
    this.drawCircleWorld(c, p.x, p.y, size, colors[p.type] || '#fff');
    if (p.type === 'chest' && this.camera.visible(p.x, p.y, 20)) {
      const s = this.camera.worldToScreen(p.x, p.y);
      c.font = '14px system-ui';
      c.textAlign = 'center';
      c.fillText('🧰', s.x, s.y + 5);
    }
  }

  drawSummon(c, s) {
    drawSummonVisual(c, this, s);
  }

  drawMeteor(c, m) {
    drawMeteorVisual(c, this, m);
  }

  drawHazard(c, h) {
    if (!this.camera.visible(h.x, h.y, h.r)) return;
    const s = this.camera.worldToScreen(h.x, h.y);
    c.fillStyle = h.hit ? '#8f274133' : `${h.color || '#bf335c'}44`;
    c.beginPath();
    c.arc(s.x, s.y, h.r, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = h.color || '#d84b6e';
    c.stroke();
  }

  drawSingularity(c, s) {
    if (!this.camera.visible(s.x, s.y, s.r)) return;
    const p = this.camera.worldToScreen(s.x, s.y);
    c.save();
    c.globalAlpha = Math.min(.8, s.t / 1.6);
    c.strokeStyle = '#c06cff';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(p.x, p.y, 25 + Math.sin(s.t * 9) * 7, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  drawLightning(c, a) {
    drawLightningVisual(c, this, a);
  }

  drawMapEvent(c, ev) {
    const s = this.camera.worldToScreen(ev.x, ev.y);
    if (!this.camera.visible(ev.x, ev.y, 40)) return;
    c.save();
    c.fillStyle = '#d6ae5233';
    c.strokeStyle = '#d6ae52';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(s.x, s.y, 25 + Math.sin(this.time * 3) * 3, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.font = '22px system-ui';
    c.textAlign = 'center';
    c.fillStyle = '#fff';
    c.fillText(ev.icon, s.x, s.y + 8);
    c.restore();
  }

  drawNumber(c, n) {
    const s = this.camera.worldToScreen(n.x, n.y);
    c.globalAlpha = Math.max(0, n.life / .68);
    c.font = n.crit ? 'bold 17px system-ui' : 'bold 13px system-ui';
    c.fillStyle = n.crit ? '#ffe26f' : '#fff';
    c.textAlign = 'center';
    c.fillText(n.text, s.x, s.y);
    c.globalAlpha = 1;
  }
}
