import { ENEMIES } from '../config.js?v=2.6.0';

export const CLASS_PASSIVES = {
  mage: {
    icon: '✦', name: 'Laser Rúnico', cooldown: 5,
    desc: 'A cada 5s concentra uma runa por 0,3s e dispara um feixe arcano perfurante na direção mais útil.'
  },
  necromancer: {
    icon: '☠', name: 'Exército dos Caídos', cooldown: 30,
    desc: 'Mortes causadas por esqueletos normais são registradas. A cada 30s, parte delas retorna como aliados espectrais por 20s.'
  },
  archer: {
    icon: '⇣', name: 'Chuva do Caçador', cooldown: 7,
    desc: 'A cada 7s marca a maior concentração próxima e, após 0,5s, faz chover flechas visíveis sobre a área.'
  },
  knight: {
    icon: '⬡', name: 'Guarda Arcana', cooldown: 8,
    desc: 'A cada 8s cria uma barreira por 2s, reduz dano recebido, empurra inimigos e explode ao terminar.'
  },
  druid: {
    icon: '⌘', name: 'Ira da Natureza', cooldown: 8,
    desc: 'A cada 8s raízes rompem o solo em uma região cheia de inimigos, causando dano e controle.'
  },
  assassin: {
    icon: '✧', name: 'Passo Sombrio', cooldown: 6,
    desc: 'A cada 6s uma projeção sombria golpeia automaticamente um alvo prioritário sem mover o jogador.'
  }
  ,warlock: { icon:'🜏', name:'Pacto Sombrio', cooldown:10, desc:'A cada 10s marca até 5 inimigos; marcados explodem ao morrer e podem espalhar a marca.' },
  paladin: { icon:'☀️', name:'Julgamento Divino', cooldown:8, desc:'A cada 8s uma coluna de luz atinge uma concentração e concede uma barreira curta.' },
  elementalist: { icon:'🔷', name:'Ciclo Elemental', cooldown:6, desc:'Alterna fogo, gelo, raio e terra, lançando automaticamente um ataque do elemento atual.' },
  battlemage: { icon:'⚔️', name:'Corte Arcano', cooldown:5, desc:'A cada 5s um grande crescente arcano atravessa a frente do personagem.' },
  summoner: { icon:'🪬', name:'Familiar Ancestral', cooldown:1, desc:'Mantém um familiar permanente que acompanha e ataca automaticamente.' },
  bloodMage: { icon:'🩸', name:'Nova Sanguínea', cooldown:7, desc:'A cada 7s uma onda rubra cresce com a vida máxima sem consumir HP.' },
  monk: { icon:'🥋', name:'Explosão de Ki', cooldown:4, desc:'A cada 4s dispara uma onda curta de energia e empurra inimigos.' },
  technomancer: { icon:'⚙️', name:'Drone Arcano', cooldown:1, desc:'Mantém um drone rúnico permanente que dispara contra alvos próximos.' }

};

function pointSegmentDistance(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const apx = px - ax, apy = py - ay;
  const den = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / den));
  const x = ax + abx * t, y = ay + aby * t;
  return Math.hypot(px - x, py - y);
}

function screen(game, x, y) { return game.camera.worldToScreen(x, y); }

export class ClassPassiveSystem {
  constructor(game) {
    this.g = game;
    this.id = game.player.id;
    this.info = CLASS_PASSIVES[this.id] || { icon: '✦', name: 'Passiva', cooldown: 8, desc: '' };
    this.timer = this.info.cooldown;
    this.state = null;
    this.effects = [];
    this.necroRegistry = [];
    this.lastActivation = 0;
    this.elementIndex = 0;
    if (this.id === 'summoner') this.ensurePassiveCompanion('classFamiliar');
    if (this.id === 'technomancer') this.ensurePassiveCompanion('classDrone');
  }

  reset() {
    this.timer = this.info.cooldown;
    this.state = null;
    this.effects.length = 0;
    this.necroRegistry.length = 0;
    this.g.player.damageTakenMultiplier = 1;
  }

  hudInfo() {
    let remaining = Math.max(0, this.timer);
    if (this.id === 'knight' && this.state?.kind === 'barrier') remaining = this.state.t;
    if (this.id === 'necromancer' && this.state?.kind === 'summonWave') remaining = this.state.t;
    return {
      icon: this.info.icon,
      name: this.info.name,
      remaining,
      cooldown: this.info.cooldown,
      active: !!this.state,
      extra: this.id === 'necromancer' ? `${this.necroRegistry.length} registrados` : ''
    };
  }

  update(dt) {
    for (const e of this.effects) e.t -= dt;
    this.effects = this.effects.filter(e => e.t > 0);

    if (this.state) this.updateState(dt);
    this.timer -= dt;
    if (this.timer > 0) return;

    switch (this.id) {
      case 'mage': this.prepareMage(); break;
      case 'necromancer': this.raiseFallen(); break;
      case 'archer': this.prepareArrowRain(); break;
      case 'knight': this.activateKnight(); break;
      case 'druid': this.prepareRoots(); break;
      case 'assassin': this.activateAssassin(); break;
      case 'warlock': this.activateWarlock(); break;
      case 'paladin': this.activatePaladin(); break;
      case 'elementalist': this.activateElementalist(); break;
      case 'battlemage': this.activateBattleMage(); break;
      case 'summoner': this.ensurePassiveCompanion('classFamiliar'); this.timer = 1; break;
      case 'bloodMage': this.activateBloodMage(); break;
      case 'monk': this.activateMonk(); break;
      case 'technomancer': this.ensurePassiveCompanion('classDrone'); this.timer = 1; break;
      default: this.timer = this.info.cooldown; break;
    }
  }

  updateState(dt) {
    const g = this.g, p = g.player;
    this.state.t -= dt;

    if (this.state.kind === 'mageCharge') {
      if (this.state.t <= 0) { this.fireMageLaser(this.state); this.state = null; }
      return;
    }
    if (this.state.kind === 'arrowTelegraph') {
      if (this.state.t <= 0) { this.fireArrowRain(this.state); this.state = null; }
      return;
    }
    if (this.state.kind === 'rootTelegraph') {
      if (this.state.t <= 0) { this.fireRoots(this.state); this.state = null; }
      return;
    }
    if (this.state.kind === 'barrier') {
      p.damageTakenMultiplier = .48;
      const nearby = g.closestEnemies(p.x, p.y, 105, 32);
      for (const e of nearby) {
        const dx = e.x - p.x, dy = e.y - p.y, d = Math.hypot(dx, dy) || 1;
        e.x += dx / d * 52 * dt;
        e.y += dy / d * 52 * dt;
      }
      if (this.state.t <= 0) {
        p.damageTakenMultiplier = 1;
        const radius = 138 * p.area;
        g.areaHit(p.x, p.y, radius, 58 * p.damage, 'arcane', 0, false, 'classPassive:knight');
        g.addAbilityEffect({ type: 'holyBurst', x: p.x, y: p.y, radius, life: .4, maxLife: .4 });
        g.emitElementParticles(p.x, p.y, 'arcane', 18, { minSpeed: 55, maxSpeed: 160, life: .42 });
        this.effects.push({ kind: 'knightBlast', x: p.x, y: p.y, r: radius, t: .38, max: .38 });
        this.state = null;
      }
    }
  }

  chooseCluster(radius = 820) {
    const g = this.g, p = g.player;
    const candidates = g.closestEnemies(p.x, p.y, radius, 18);
    if (!candidates.length) return null;
    let best = candidates[0], bestScore = -Infinity;
    for (const e of candidates) {
      let score = e.boss ? 10 : e.elite ? 7 : 1;
      for (const other of candidates) if (other !== e && Math.hypot(other.x - e.x, other.y - e.y) < 130) score += 1;
      if (score > bestScore) { bestScore = score; best = e; }
    }
    return best;
  }

  prepareMage() {
    const target = this.chooseCluster(1000);
    if (!target) { this.timer = .5; return; }
    const g = this.g, p = g.player;
    const angle = Math.atan2(target.y - p.y, target.x - p.x);
    this.state = { kind: 'mageCharge', t: .3, angle };
    this.timer = this.info.cooldown;
  }

  fireMageLaser(state, allowSecond = true) {
    const g = this.g, p = g.player;
    const tier = Math.floor((p.level - 1) / 5);
    const width = 20 * (1 + Math.min(.55, tier * .12));
    const range = 1080 + Math.min(250, tier * 55);
    const damage = (70 + tier * 10) * p.damage;
    const ax = p.x, ay = p.y;
    const bx = ax + Math.cos(state.angle) * range;
    const by = ay + Math.sin(state.angle) * range;
    for (const e of g.enemies) {
      if (e.dead) continue;
      const r = (e.hitboxRadius ?? e.size) + width * .5;
      if (pointSegmentDistance(e.x, e.y, ax, ay, bx, by) <= r) g.damageEnemy(e, damage, true, 'arcane', true, 'classPassive:mage');
    }
    if (p.level >= 16) {
      const mx = ax + Math.cos(state.angle) * range * .55, my = ay + Math.sin(state.angle) * range * .55;
      g.delayedEffects.push({ t: .25, fn: () => g.areaHit(mx, my, 105, damage * .28, 'arcane', 0, false, 'classPassive:mage') });
    }
    if (allowSecond && p.level >= 20 && Math.random() < .18) {
      const a2 = state.angle + (Math.random() < .5 ? -.32 : .32);
      g.delayedEffects.push({ t: .14, fn: () => this.fireMageLaser({ angle: a2 }, false) });
    }
    this.effects.push({ kind: 'mageLaser', ax, ay, bx, by, width, t: .18, max: .18 });
    g.shake = Math.max(g.shake, .08);
  }

  prepareArrowRain() {
    const target = this.chooseCluster(900);
    if (!target) { this.timer = .6; return; }
    this.state = { kind: 'arrowTelegraph', x: target.x, y: target.y, r: 95 + Math.min(45, this.g.player.level * 1.4), t: .5 };
    this.timer = this.info.cooldown;
  }

  fireArrowRain(state) {
    const g = this.g, p = g.player;
    const count = 8 + Math.min(10, Math.floor(p.level / 3));
    const damage = 22 * p.damage * (1 + Math.min(.8, p.level * .025));
    this.effects.push({ kind: 'arrowRain', x: state.x, y: state.y, r: state.r, arrows: count, t: .55, max: .55 });
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * state.r;
      const x = state.x + Math.cos(a) * rr, y = state.y + Math.sin(a) * rr;
      g.delayedEffects.push({ t: .12 + Math.random() * .32, fn: () => g.areaHit(x, y, 24, damage, 'physical', 0, false, 'classPassive:archer') });
    }
  }

  activateKnight() {
    this.state = { kind: 'barrier', t: 2, max: 2 };
    this.g.player.damageTakenMultiplier = .48;
    this.timer = this.info.cooldown;
  }

  prepareRoots() {
    const target = this.chooseCluster(760);
    if (!target) { this.timer = .6; return; }
    this.state = { kind: 'rootTelegraph', x: target.x, y: target.y, r: 115 + Math.min(35, this.g.player.level), t: .35 };
    this.timer = this.info.cooldown;
  }

  fireRoots(state) {
    const g = this.g, p = g.player;
    const damage = 48 * p.damage * (1 + Math.min(.65, p.level * .02));
    g.areaHit(state.x, state.y, state.r, damage, 'nature', 1.05, false, 'classPassive:druid');
    this.effects.push({ kind: 'roots', x: state.x, y: state.y, r: state.r, t: .7, max: .7 });
    g.emitElementParticles(state.x, state.y, 'nature', 15, { minSpeed: 35, maxSpeed: 95, life: .45 });
    if (Math.random() < .18) {
      g.pickups.push({ type: 'heal', x: state.x, y: state.y, value: 1, life: 16, flower: true });
    }
  }

  activateAssassin() {
    const g = this.g, p = g.player;
    const alive = g.enemies.filter(e => !e.dead && Math.hypot(e.x - p.x, e.y - p.y) < 1000);
    if (!alive.length) { this.timer = .5; return; }
    alive.sort((a, b) => {
      const score = e => e.elite ? 100 : e.boss ? 90 : ['summoner', 'ranged', 'rangedFast', 'explosive'].includes(e.behavior) ? 50 : 0;
      return score(b) - score(a) || Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y);
    });
    const target = alive[0];
    const x1 = p.x, y1 = p.y, x2 = target.x, y2 = target.y;
    this.effects.push({ kind: 'shadowStep', x1, y1, x2, y2, t: .28, max: .28 });
    g.delayedEffects.push({
      t: .11,
      fn: () => {
        if (!target.dead) {
          const base = 78 * p.damage;
          const critMul = Math.random() < Math.min(.72, p.crit + .28) ? p.critDamage : 1;
          g.damageEnemy(target, base * critMul, false, 'shadow', true, 'classPassive:assassin');
          g.areaHit(target.x, target.y, 48, base * .3, 'shadow', 0, false, 'classPassive:assassin');
        }
      }
    });
    this.timer = this.info.cooldown;
  }


  ensurePassiveCompanion(id) {
    const g=this.g,p=g.player;
    if (g.summons.some(s=>s.id===id && !s.dead)) return;
    g.summons.push({ id, x:p.x+36, y:p.y-22, damage:(id==='classDrone'?24:20)*p.damage, cd:0, target:null, dead:false, electric:false, life:Infinity, ranged:true, companion:true });
  }

  activateWarlock() {
    const g=this.g,p=g.player, targets=g.closestEnemies(p.x,p.y,900,5);
    for (const e of targets) { e.darkPactTimer=8; e.darkPactMarked=true; }
    if (targets.length) this.effects.push({kind:'darkPact', x:p.x,y:p.y,r:150,t:.6,max:.6});
    this.timer=this.info.cooldown;
  }

  activatePaladin() {
    const g=this.g,p=g.player,t=this.chooseCluster(850);
    if (!t) { this.timer=.5; return; }
    const r=120*p.area; g.areaHit(t.x,t.y,r,72*p.damage,'holy',0,false,'classPassive:paladin');
    g.addAbilityEffect({type:'holyBurst',x:t.x,y:t.y,radius:r,life:.5,maxLife:.5});
    p.damageTakenMultiplier=Math.min(p.damageTakenMultiplier, .72);
    g.delayedEffects.push({t:1.4,fn:()=>{ if (p) p.damageTakenMultiplier=1; }});
    this.effects.push({kind:'divineJudgment',x:t.x,y:t.y,r,t:.55,max:.55});
    this.timer=this.info.cooldown;
  }

  activateElementalist() {
    const g=this.g,p=g.player,t=this.chooseCluster(900); if(!t){this.timer=.5;return;}
    const elements=['fire','ice','electric','earth']; const el=elements[this.elementIndex++%elements.length];
    if(el==='electric') { g.damageEnemy(t,68*p.damage,true,'electric',true,'classPassive:elementalist'); g.lightningArcs.push({x1:p.x,y1:p.y,x2:t.x,y2:t.y,life:.16,color:g.colorFor('electric')}); }
    else if(el==='earth') { g.areaHit(t.x,t.y,92,70*p.damage,'earth',0,false,'classPassive:elementalist'); g.addAbilityEffect({type:'physicalImpact',x:t.x,y:t.y,radius:92,life:.35,maxLife:.35}); }
    else { g.areaHit(t.x,t.y,92,64*p.damage,el,el==='ice'?1.3:0,false,'classPassive:elementalist'); g.addAbilityEffect({type:el==='fire'?'fireExplosion':'iceShatter',x:t.x,y:t.y,radius:92,life:.35,maxLife:.35}); }
    this.effects.push({kind:'elementCycle',x:t.x,y:t.y,r:92,element:el,t:.45,max:.45}); this.timer=this.info.cooldown;
  }

  activateBattleMage() {
    const g=this.g,p=g.player, target=this.chooseCluster(900); if(!target){this.timer=.5;return;}
    const angle=Math.atan2(target.y-p.y,target.x-p.x), range=760, width=34;
    const bx=p.x+Math.cos(angle)*range, by=p.y+Math.sin(angle)*range;
    for(const e of g.enemies){ if(e.dead)continue; if(pointSegmentDistance(e.x,e.y,p.x,p.y,bx,by)<= (e.hitboxRadius||e.size)+width*.5) g.damageEnemy(e,82*p.damage,true,'arcane',true,'classPassive:battlemage'); }
    this.effects.push({kind:'battleSlash',ax:p.x,ay:p.y,bx,by,width,t:.22,max:.22}); this.timer=this.info.cooldown;
  }

  activateBloodMage() {
    const g=this.g,p=g.player,r=145*p.area, dmg=(52+p.maxHp*.12)*p.damage;
    g.areaHit(p.x,p.y,r,dmg,'shadow',0,false,'classPassive:bloodMage');
    this.effects.push({kind:'bloodNova',x:p.x,y:p.y,r,t:.5,max:.5}); this.timer=this.info.cooldown;
  }

  activateMonk() {
    const g=this.g,p=g.player,a=Math.atan2(p.lastMoveY||-1,p.lastMoveX||0), range=360, width=75;
    const bx=p.x+Math.cos(a)*range,by=p.y+Math.sin(a)*range;
    for(const e of g.enemies){ if(e.dead)continue; if(pointSegmentDistance(e.x,e.y,p.x,p.y,bx,by)<=(e.hitboxRadius||e.size)+width*.5){ g.damageEnemy(e,58*p.damage,true,'wind',true,'classPassive:monk'); if(!e.boss){e.x+=Math.cos(a)*32;e.y+=Math.sin(a)*32;} } }
    this.effects.push({kind:'kiBurst',ax:p.x,ay:p.y,bx,by,width,t:.28,max:.28}); this.timer=this.info.cooldown;
  }

  onEnemyKilled(enemy, sourceId) {
    if (this.id === 'warlock' && enemy.darkPactMarked) {
      const g=this.g; g.areaHit(enemy.x,enemy.y,105,42*g.player.damage,'shadow',0,false,'classPassive:warlock');
      const spread=g.closestEnemies(enemy.x,enemy.y,180,2).filter(e=>!e.dead&&!e.darkPactMarked);
      for(const e of spread){e.darkPactMarked=true;e.darkPactTimer=5;}
      this.effects.push({kind:'darkPactBurst',x:enemy.x,y:enemy.y,r:105,t:.35,max:.35});
    }
    if (this.id !== 'necromancer' || sourceId !== 'skeleton') return;
    if (enemy.boss || enemy.miniboss || enemy.type === 'finalBoss') return;
    const cfg = ENEMIES[enemy.type];
    if (!cfg) return;
    this.necroRegistry.push({
      type: enemy.type,
      strength: Math.max(1, (enemy.maxHp || cfg.hp) * .02 + (enemy.damage || cfg.damage) * 2),
      elite: !!enemy.elite
    });
    this.necroRegistry.sort((a, b) => b.strength - a.strength);
    if (this.necroRegistry.length > 60) this.necroRegistry.length = 60;
  }

  raiseFallen() {
    const g = this.g, p = g.player;
    const max = Math.min(24, 8 + Math.floor(Math.max(0, p.level - 1) / 5) * 4);
    const picked = this.necroRegistry.splice(0, max);
    for (let i = 0; i < picked.length && g.summons.length < 44; i++) {
      const rec = picked[i];
      const cfg = ENEMIES[rec.type] || ENEMIES.skeleton;
      const a = Math.random() * Math.PI * 2;
      g.summons.push({
        id: 'fallenArmy', classPassiveFallen: true, enemyType: rec.type,
        x: p.x + Math.cos(a) * (70 + Math.random() * 70),
        y: p.y + Math.sin(a) * (70 + Math.random() * 70),
        damage: Math.max(18, cfg.damage * .85) * p.damage,
        cd: Math.random() * .4, target: null, dead: false, electric: false,
        life: 20, speedBonus: Math.min(80, cfg.speed * .35)
      });
    }
    if (picked.length) this.effects.push({ kind: 'necromancyBurst', x: p.x, y: p.y, r: 120, t: .7, max: .7 });
    this.timer = this.info.cooldown;
  }

  render(ctx) {
    const g = this.g, p = g.player;
    ctx.save();
    for (const e of this.effects) this.renderEffect(ctx, e);

    if (this.state?.kind === 'mageCharge') {
      const s = screen(g, p.x, p.y);
      ctx.translate(s.x, s.y);
      ctx.strokeStyle = '#d98cff'; ctx.lineWidth = 2;
      ctx.rotate(this.state.angle);
      ctx.beginPath(); ctx.arc(0, 0, 28 + Math.sin(g.time * 18) * 3, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.beginPath(); ctx.moveTo(Math.cos(a)*19, Math.sin(a)*19); ctx.lineTo(Math.cos(a)*31, Math.sin(a)*31); ctx.stroke(); }
      ctx.rotate(-this.state.angle); ctx.translate(-s.x, -s.y);
    }
    if (this.state?.kind === 'arrowTelegraph' || this.state?.kind === 'rootTelegraph') {
      const s = screen(g, this.state.x, this.state.y);
      ctx.globalAlpha = .65;
      ctx.strokeStyle = this.state.kind === 'arrowTelegraph' ? '#f4df9f' : '#67d486';
      ctx.lineWidth = 2; ctx.setLineDash([7,5]);
      ctx.beginPath(); ctx.arc(s.x, s.y, this.state.r, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    }
    if (this.state?.kind === 'barrier') {
      const s = screen(g, p.x, p.y), rr = 37 + Math.sin(g.time*8)*2;
      ctx.strokeStyle = '#89f0ff'; ctx.fillStyle = '#74d7ff18'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#e5fbff'; ctx.lineWidth = 1;
      for (let i=0;i<6;i++){ const a=g.time*.8+i*Math.PI/3; ctx.beginPath(); ctx.arc(s.x+Math.cos(a)*rr, s.y+Math.sin(a)*rr, 3, 0, Math.PI*2); ctx.stroke(); }
    }
    ctx.restore();
  }

  renderEffect(ctx, e) {
    const g = this.g;
    if (e.kind === 'mageLaser') {
      const a = screen(g,e.ax,e.ay), b=screen(g,e.bx,e.by);
      const alpha = Math.max(0, e.t/e.max);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle='#f0b8ff'; ctx.lineWidth=e.width+6; ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      ctx.strokeStyle='#ffffff'; ctx.lineWidth=Math.max(3,e.width*.28);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      ctx.globalAlpha=1;
    } else if (e.kind === 'arrowRain') {
      const s=screen(g,e.x,e.y), alpha=Math.max(0,e.t/e.max);
      ctx.globalAlpha=alpha; ctx.strokeStyle='#f1e5ca'; ctx.lineWidth=2;
      const shown=Math.min(18,e.arrows||10);
      for(let i=0;i<shown;i++){ const a=i*2.399, rr=(i%5)/(5)*e.r; const x=s.x+Math.cos(a)*rr, y=s.y+Math.sin(a)*rr; const drop=(1-alpha)*85; ctx.beginPath();ctx.moveTo(x-7,y-60+drop);ctx.lineTo(x+2,y-14+drop);ctx.stroke(); ctx.beginPath();ctx.moveTo(x+2,y-14+drop);ctx.lineTo(x-2,y-21+drop);ctx.lineTo(x+7,y-19+drop);ctx.closePath();ctx.fillStyle='#e9d39b';ctx.fill(); }
      ctx.globalAlpha=1;
    } else if (e.kind === 'roots') {
      const s=screen(g,e.x,e.y), alpha=Math.max(0,e.t/e.max);
      ctx.globalAlpha=alpha; ctx.strokeStyle='#75c96c';ctx.lineWidth=4;
      for(let i=0;i<10;i++){ const a=i*Math.PI/5+g.time*.2, r=e.r*(.35+.55*((i%3)/2)); ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.quadraticCurveTo(s.x+Math.cos(a+.5)*r*.55,s.y+Math.sin(a+.5)*r*.55,s.x+Math.cos(a)*r,s.y+Math.sin(a)*r);ctx.stroke(); }
      ctx.globalAlpha=1;
    } else if (e.kind === 'shadowStep') {
      const a=screen(g,e.x1,e.y1), b=screen(g,e.x2,e.y2), alpha=Math.max(0,e.t/e.max);
      ctx.globalAlpha=alpha;ctx.strokeStyle='#a876ff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-25,b.x,b.y);ctx.stroke();
      ctx.strokeStyle='#f0d8ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x-18,b.y+15);ctx.lineTo(b.x+20,b.y-16);ctx.stroke();ctx.globalAlpha=1;
    } else if (e.kind === 'darkPact' || e.kind === 'darkPactBurst') {
      const s=screen(g,e.x,e.y),a=Math.max(0,e.t/e.max);ctx.globalAlpha=a;ctx.strokeStyle='#b07cff';ctx.lineWidth=2.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(s.x,s.y,e.r*(1.1-a*.2),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
    } else if (e.kind === 'divineJudgment') {
      const s=screen(g,e.x,e.y),a=Math.max(0,e.t/e.max);ctx.globalAlpha=a;ctx.fillStyle='#fff0a633';ctx.fillRect(s.x-e.r*.16,s.y-e.r*1.3,e.r*.32,e.r*1.6);ctx.strokeStyle='#fff3ae';ctx.lineWidth=3;ctx.beginPath();ctx.arc(s.x,s.y,e.r*(1-a*.25),0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
    } else if (e.kind === 'elementCycle') {
      const s=screen(g,e.x,e.y),a=Math.max(0,e.t/e.max);ctx.globalAlpha=a;ctx.strokeStyle=g.colorFor(e.element);ctx.lineWidth=3;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(s.x,s.y,e.r*(.35+i*.14),i*.6,i*.6+1.7);ctx.stroke();}ctx.globalAlpha=1;
    } else if (e.kind === 'battleSlash' || e.kind === 'kiBurst') {
      const a=screen(g,e.ax,e.ay),b=screen(g,e.bx,e.by),fade=Math.max(0,e.t/e.max);ctx.globalAlpha=fade;ctx.strokeStyle=e.kind==='kiBurst'?'#b8fff0':'#f0b8ff';ctx.lineWidth=e.width;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=Math.max(2,e.width*.08);ctx.stroke();ctx.globalAlpha=1;
    } else if (e.kind === 'bloodNova') {
      const s=screen(g,e.x,e.y),a=Math.max(0,e.t/e.max),r=e.r*(1-a*.6);ctx.globalAlpha=a;ctx.strokeStyle='#ff5b72';ctx.lineWidth=5;ctx.beginPath();ctx.arc(s.x,s.y,r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#7d1e35';ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,r*.72,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
    } else if (e.kind === 'necromancyBurst' || e.kind === 'knightBlast') {
      const s=screen(g,e.x,e.y), alpha=Math.max(0,e.t/e.max), r=e.r*(1-alpha*.55);
      ctx.globalAlpha=alpha;ctx.strokeStyle=e.kind==='necromancyBurst'?'#9c72d8':'#95efff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(s.x,s.y,r,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
    }
  }
}

export function drawFallenAllyVisual(ctx, game, summon) {
  if (!game.camera.visible(summon.x, summon.y, 30)) return;
  const s = game.camera.worldToScreen(summon.x, summon.y);
  const cfg = ENEMIES[summon.enemyType] || ENEMIES.skeleton;
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.globalAlpha = .72;
  ctx.fillStyle = '#8fc9b8'; ctx.strokeStyle = '#c9fff0'; ctx.lineWidth = 2;
  const r = Math.max(9, Math.min(18, (cfg.size || 16) * .72));
  ctx.beginPath(); ctx.ellipse(0, 3, r*.72, r, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -r*.65, r*.45, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle='#eaffff'; ctx.beginPath();ctx.arc(-3,-r*.7,2,0,Math.PI*2);ctx.arc(3,-r*.7,2,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#85f0d1';ctx.beginPath();ctx.arc(0,0,r*1.35,0,Math.PI*2);ctx.stroke();
  ctx.globalAlpha=1;ctx.restore();
}
