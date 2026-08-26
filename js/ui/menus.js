import { CHARACTERS, MAPS, META_UPGRADES, DIFFICULTIES, ACHIEVEMENTS } from '../config.js';
import { WEAPONS } from '../weapons/weaponData.js';
import { EVOLUTIONS, ARCANE_FUSIONS } from '../evolutions.js';
import { RELICS } from '../relics.js';

const rarityLabel = { common: 'COMUM', rare: 'RARO', epic: 'ÉPICO', legendary: 'LENDÁRIO', arcane: 'ARCANO' };

export class UI {
  constructor(save) {
    this.save = save;
    this.characters = CHARACTERS;
    this.maps = MAPS;
    this.selectedCharacter = null;
    this.selectedMap = null;
    this.selectedDifficulty = 'normal';
    this.game = null;
    this.bindBase();
    this.renderAll();
  }

  setGame(game) { this.game = game; }

  renderAll() {
    this.renderMenuStats();
    this.renderCharacters();
    this.renderMaps();
    this.renderDifficulties();
    this.renderMeta();
    this.renderGrimoire();
    this.renderAchievements();
    this.renderSettings();
  }

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id)?.classList.add('active');
  }

  showMain() {
    this.showScreen('mainMenu');
    document.getElementById('hud').classList.add('hidden');
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    this.renderAll();
  }

  showGame() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('hud').classList.remove('hidden');
    if (this.game?.player) {
      this.refreshWeaponBar(this.game.player);
      this.refreshRelics(this.game.player.relics);
    }
  }

  bindBase() {
    document.addEventListener('click', e => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (!action) return;
      if (action === 'play' || action === 'characters') {
        this.renderCharacters();
        this.showScreen('characterScreen');
      } else if (action === 'meta') {
        this.renderMeta();
        this.showScreen('metaScreen');
      } else if (action === 'grimoire') {
        this.renderGrimoire();
        this.showScreen('grimoireScreen');
      } else if (action === 'achievements') {
        this.renderAchievements();
        this.showScreen('achievementsScreen');
      } else if (action === 'settings') {
        this.renderSettings();
        this.showScreen('settingsScreen');
      } else if (action === 'back') {
        this.showMain();
      }
    });

    document.getElementById('characterContinue').onclick = () => {
      if (!this.selectedCharacter) return;
      this.renderMaps();
      this.renderDifficulties();
      this.showScreen('mapScreen');
    };

    document.getElementById('startGameButton').onclick = () => {
      if (!this.selectedCharacter || !this.selectedMap) return;
      if (!this.game) {
        const err = window.ArcaneHorder?.loadError;
        this.flashMessage(err ? `Erro ao carregar o motor: ${err.message}` : 'O motor do jogo ainda está carregando.');
        return;
      }
      this.game.start(this.selectedCharacter, this.selectedMap, this.selectedDifficulty);
    };

    document.querySelectorAll('[data-pause]').forEach(button => {
      button.onclick = () => {
        if (!this.game) return;
        const action = button.dataset.pause;
        if (action === 'resume') this.game.togglePause();
        else if (action === 'restart') { this.hidePause(); this.game.restart(); }
        else if (action === 'quit') { this.hidePause(); this.game.quit(); }
        else if (action === 'abilities') this.showRunInfo('abilities');
        else if (action === 'relics') this.showRunInfo('relics');
        else if (action === 'settings') this.showRunInfo('settings');
      };
    });

    document.getElementById('infoClose').onclick = () => document.getElementById('infoModal').classList.add('hidden');
    document.getElementById('retryButton').onclick = () => { this.hideEnd(); this.game?.restart(); };
    document.getElementById('menuButton').onclick = () => { this.hideEnd(); this.game?.quit(); };
  }

  renderMenuStats() {
    document.getElementById('menuCoins').textContent = this.save.data.coins;
    document.getElementById('menuKills').textContent = this.save.data.records.totalKills;
    document.getElementById('menuWins').textContent = this.save.data.records.wins;
  }

  renderCharacters() {
    const box = document.getElementById('characterCards');
    box.innerHTML = '';
    for (const [id, c] of Object.entries(CHARACTERS)) {
      const unlocked = this.save.data.unlocked.includes(id);
      const d = document.createElement('div');
      d.className = 'game-card' + (this.selectedCharacter === id ? ' selected' : '') + (!unlocked ? ' locked' : '');
      d.innerHTML = `
        <div class="portrait">${c.icon}</div>
        <h3>${c.name}</h3>
        <span class="tag">${WEAPONS[c.startWeapon].name}</span>
        <p>${c.description}</p>
        <p class="small"><b>Passiva:</b> ${c.passive}</p>
        <div class="statline"><span>HP</span><b>${c.base.hp}</b></div>
        <div class="statline"><span>Velocidade</span><b>${c.base.speed}</b></div>
        <div class="statline"><span>Crítico</span><b>${Math.round(c.base.crit * 100)}%</b></div>
        ${unlocked ? '' : `<p class="small">🔒 ${c.unlock}</p>`}
      `;
      if (unlocked) d.onclick = () => {
        this.selectedCharacter = id;
        this.renderCharacters();
        document.getElementById('characterContinue').disabled = false;
      };
      box.appendChild(d);
    }
    document.getElementById('characterContinue').disabled = !this.selectedCharacter;
  }

  renderMaps() {
    const box = document.getElementById('mapCards');
    box.innerHTML = '';
    for (const [id, m] of Object.entries(MAPS)) {
      const unlocked = this.save.isMapUnlocked(id);
      const d = document.createElement('div');
      d.className = 'game-card' + (this.selectedMap === id ? ' selected' : '') + (!unlocked ? ' locked' : '');
      d.innerHTML = `<div class="portrait">${m.icon}</div><h3>${m.name}</h3><p>${m.description}</p>${unlocked ? '' : `<p class="small">🔒 ${this.mapRequirement(id)}</p>`}`;
      if (unlocked) d.onclick = () => {
        this.selectedMap = id;
        this.renderMaps();
        document.getElementById('startGameButton').disabled = false;
      };
      box.appendChild(d);
    }
    document.getElementById('startGameButton').disabled = !this.selectedMap;
  }

  mapRequirement(id) {
    return {
      forest: 'Sobreviva 5 minutos',
      ash: 'Vença 1 partida',
      frost: 'Vença 2 partidas',
      city: 'Mate 5.000 inimigos',
      void: 'Vença 4 partidas'
    }[id] || 'Bloqueado';
  }

  renderDifficulties() {
    const box = document.getElementById('difficultyCards');
    box.innerHTML = '';
    for (const [id, d] of Object.entries(DIFFICULTIES)) {
      const card = document.createElement('div');
      card.className = 'difficulty-card' + (id === this.selectedDifficulty ? ' selected' : '');
      card.innerHTML = `<b>${d.name}</b><span>${d.description}</span>`;
      card.onclick = () => { this.selectedDifficulty = id; this.renderDifficulties(); };
      box.appendChild(card);
    }
  }

  renderMeta() {
    document.getElementById('metaCoins').textContent = this.save.data.coins;
    const box = document.getElementById('metaCards');
    box.innerHTML = '';
    for (const [id, m] of Object.entries(META_UPGRADES)) {
      const level = this.save.data.meta[id] || 0;
      const cost = Math.floor(m.baseCost * Math.pow(1.62, level));
      const d = document.createElement('div');
      d.className = 'upgrade-card';
      d.innerHTML = `<h3>${m.name} ${level}/${m.max}</h3><p>${m.desc}</p><button ${level >= m.max || this.save.data.coins < cost ? 'disabled' : ''}>${level >= m.max ? 'MÁXIMO' : `Comprar • ${cost} ◈`}</button>`;
      d.querySelector('button').onclick = () => {
        if (level >= m.max || this.save.data.coins < cost) return;
        this.save.data.coins -= cost;
        this.save.data.meta[id] = level + 1;
        this.save.write();
        this.renderMeta();
        this.renderMenuStats();
      };
      box.appendChild(d);
    }
  }

  renderGrimoire() {
    const box = document.getElementById('grimoireList');
    box.innerHTML = '';
    const rows = [
      ...EVOLUTIONS.map(e => ({ ...e, known: this.save.data.evolutions.includes(e.id), arcane: false })),
      ...ARCANE_FUSIONS.map(e => ({ ...e, known: this.save.data.fusions.includes(e.id), arcane: true }))
    ];
    for (const e of rows) {
      const d = document.createElement('div');
      d.className = 'grimoire-row' + (e.arcane ? ' arcane' : '');
      d.innerHTML = e.known
        ? `<span class="tag">${e.arcane ? 'ARCANE FUSION' : 'EVOLUÇÃO'}</span><h3>${e.name}</h3><div class="small">${e.desc}</div>`
        : `<span class="tag">${e.arcane ? 'ARCANE FUSION' : 'EVOLUÇÃO'}</span><h3>???</h3><div class="small">Combinação ainda não descoberta.</div>`;
      box.appendChild(d);
    }
  }

  renderAchievements() {
    const box = document.getElementById('achievementList');
    box.innerHTML = '';
    for (const [id, a] of Object.entries(ACHIEVEMENTS)) {
      const done = this.save.data.achievements.includes(id);
      const d = document.createElement('div');
      d.className = `achievement-card ${done ? 'done' : 'locked'}`;
      d.innerHTML = `<h3>${done ? '✓' : '○'} ${a.name}</h3><p>${a.desc}</p><div class="reward">${done ? 'Concluída' : `Recompensa: ${a.reward} ◈`}</div>`;
      box.appendChild(d);
    }
  }

  renderSettings() {
    const s = this.save.data.settings;
    const box = document.getElementById('settingsForm');
    box.innerHTML = '';
    const ranges = [['master', 'Volume geral'], ['music', 'Música'], ['sfx', 'Efeitos sonoros']];
    for (const [key, label] of ranges) {
      const d = document.createElement('label');
      d.className = 'setting';
      d.innerHTML = `<span>${label}</span><input type="range" min="0" max="1" step="0.05" value="${s[key]}">`;
      d.querySelector('input').oninput = e => { s[key] = +e.target.value; this.save.write(); };
      box.appendChild(d);
    }
    const toggles = [['damageNumbers', 'Números de dano'], ['shake', 'Screen shake'], ['performance', 'Modo performance'], ['debug', 'Debug / FPS']];
    for (const [key, label] of toggles) {
      const d = document.createElement('label');
      d.className = 'setting';
      d.innerHTML = `<span>${label}</span><input type="checkbox" ${s[key] ? 'checked' : ''}>`;
      d.querySelector('input').onchange = e => { s[key] = e.target.checked; this.save.write(); };
      box.appendChild(d);
    }
    const particles = document.createElement('label');
    particles.className = 'setting';
    particles.innerHTML = `<span>Partículas</span><input type="range" min="0" max="3" step="1" value="${s.particles}">`;
    particles.querySelector('input').oninput = e => { s.particles = +e.target.value; this.save.write(); };
    box.appendChild(particles);

    const quality = document.createElement('label');
    quality.className = 'setting';
    quality.innerHTML = `<span>Qualidade dos efeitos</span><select><option value="0">Baixa</option><option value="1">Média</option><option value="2">Alta</option></select>`;
    quality.querySelector('select').value = String(s.quality ?? 2);
    quality.querySelector('select').onchange = e => { s.quality = +e.target.value; this.save.write(); };
    box.appendChild(quality);
  }

  updateHUD(g) {
    const p = g.player;
    document.getElementById('hpText').textContent = `${Math.ceil(p.hp)}/${Math.ceil(p.maxHp)}`;
    document.getElementById('hpFill').style.width = `${100 * p.hp / p.maxHp}%`;
    document.getElementById('levelText').textContent = p.level;
    document.getElementById('xpFill').style.width = `${100 * p.xpNow / p.xpNeed}%`;
    document.getElementById('xpText').textContent = `${Math.floor(p.xpNow)}/${p.xpNeed}`;
    document.getElementById('killsText').textContent = p.kills;
    document.getElementById('runCoinsText').textContent = p.coins;
    document.getElementById('timer').textContent = this.fmt(g.time);

    const bosses = g.enemies.filter(e => e.boss && !e.dead);
    const boss = bosses.sort((a, b) => (a.type === 'finalBoss' ? -1 : 0) - (b.type === 'finalBoss' ? -1 : 0))[0];
    const bossHud = document.getElementById('bossHud');
    if (boss) {
      bossHud.classList.remove('hidden');
      document.getElementById('bossName').textContent = boss.name;
      document.getElementById('bossPhase').textContent = `Fase ${boss.phase || 1}`;
      document.getElementById('bossFill').style.width = `${100 * boss.hp / boss.maxHp}%`;
    } else bossHud.classList.add('hidden');

    const challenge = document.getElementById('challengeHud');
    if (g.challenge?.active) {
      challenge.classList.remove('hidden');
      challenge.textContent = `${g.challenge.cursed ? '☠ Evento Amaldiçoado' : '⚔ Desafio'} • ${Math.ceil(g.challenge.t)}s`;
    } else challenge.classList.add('hidden');

    const debug = document.getElementById('debugHud');
    if (this.save.data.settings.debug) {
      debug.classList.remove('hidden');
      debug.textContent = `Inimigos ${g.enemies.length}\nProjéteis ${g.projectiles.length}\nPartículas ${g.particles.length}\nInvocações ${g.summons.length}\nVel ${Math.round(p.speed)}/${Math.round(p.speedCap || p.speed)}\nPos ${Math.round(p.x)}, ${Math.round(p.y)}\nHP mult ${g.enemyScaling('slime').hp.toFixed(2)}x\nTempo ${g.time.toFixed(1)}s`;
    } else debug.classList.add('hidden');
  }

  refreshWeaponBar(p) {
    const box = document.getElementById('weaponBar');
    box.innerHTML = '';
    for (const id of p.weaponOrder || Object.keys(p.weapons)) {
      const level = p.weapons[id];
      const w = WEAPONS[id];
      if (!w) continue;
      const d = document.createElement('div');
      d.className = 'weapon-slot' + (w.fusion ? ' arcane' : '');
      d.title = `${w.name} — ${w.desc}`;
      d.innerHTML = `<b>${w.icon}</b><span>${w.evolved ? w.name : `Lv.${level}`}</span>`;
      box.appendChild(d);
    }
    for (let i = (p.weaponOrder?.length || Object.keys(p.weapons).length); i < 6; i++) {
      const d = document.createElement('div');
      d.className = 'weapon-slot';
      d.innerHTML = '<span>—</span>';
      box.appendChild(d);
    }
  }

  refreshRelics(ids = []) {
    const box = document.getElementById('relicBar');
    box.innerHTML = '';
    if (!ids.length) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    for (const id of ids) {
      const r = RELICS[id];
      if (!r) continue;
      const d = document.createElement('div');
      d.className = 'relic-chip';
      d.title = `${r.name}: ${r.desc}`;
      d.textContent = r.icon;
      box.appendChild(d);
    }
  }

  showLevelUp(choices, options) {
    const modal = document.getElementById('levelUpModal');
    const box = document.getElementById('levelChoices');
    box.innerHTML = '';
    for (const c of choices) {
      const d = document.createElement('div');
      d.className = `choice-card rarity-${c.rarity}`;
      d.innerHTML = `
        <span class="tag">${rarityLabel[c.rarity] || c.rarity.toUpperCase()}</span>
        <h3>${c.icon} ${c.name}</h3>
        <div class="levels">${c.currentLevel === 0 ? 'NOVA' : `Nível ${c.currentLevel} → ${c.nextLevel}`}</div>
        <p>${c.desc}</p>
        <button class="banish" ${options.banishes <= 0 ? 'disabled' : ''}>BANIR</button>
      `;
      d.onclick = e => {
        if (e.target.closest('.banish')) return;
        options.onPick(c);
      };
      d.querySelector('.banish').onclick = e => { e.stopPropagation(); options.onBanish(c); };
      box.appendChild(d);
    }
    document.getElementById('levelResources').textContent = `Rerolls: ${options.rerolls} • Banish: ${options.banishes} • Skip: ${options.skips}`;
    const reroll = document.getElementById('rerollButton');
    reroll.disabled = options.rerolls <= 0;
    reroll.onclick = options.onReroll;
    const skip = document.getElementById('skipButton');
    skip.disabled = options.skips <= 0;
    skip.onclick = options.onSkip;
    modal.classList.remove('hidden');
  }

  hideLevelUp() { document.getElementById('levelUpModal').classList.add('hidden'); }

  showPause(show) {
    document.getElementById('pauseModal').classList.toggle('hidden', !show);
  }
  hidePause() { document.getElementById('pauseModal').classList.add('hidden'); }

  showRunInfo(kind) {
    if (!this.game) return;
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('infoTitle');
    const box = document.getElementById('infoContent');
    if (kind === 'abilities') {
      title.textContent = 'Habilidades da Build';
      box.innerHTML = '<div class="info-list"></div>';
      const list = box.firstElementChild;
      for (const id of this.game.player.weaponOrder) {
        const w = WEAPONS[id];
        const lv = this.game.player.weapons[id];
        const row = document.createElement('div');
        row.className = 'info-row';
        row.innerHTML = `<span>${w.icon} ${w.name}</span><b>${w.evolved ? 'EVOLUÍDA' : `Lv.${lv}`}</b>`;
        list.appendChild(row);
      }
    } else if (kind === 'relics') {
      title.textContent = 'Relíquias';
      const ids = this.game.player.relics;
      box.innerHTML = ids.length ? ids.map(id => `<div class="info-row"><span>${RELICS[id].icon} <b>${RELICS[id].name}</b></span><span class="small">${RELICS[id].desc}</span></div>`).join('') : '<p>Nenhuma relíquia encontrada nesta partida.</p>';
    } else {
      title.textContent = 'Configurações rápidas';
      box.innerHTML = `<p>As configurações são salvas automaticamente.</p><div id="quickSettings"></div>`;
      const target = box.querySelector('#quickSettings');
      const s = this.save.data.settings;
      for (const [key, label] of [['damageNumbers','Números de dano'],['shake','Screen shake'],['performance','Modo performance']]) {
        const row = document.createElement('label');
        row.className = 'setting';
        row.innerHTML = `<span>${label}</span><input type="checkbox" ${s[key] ? 'checked' : ''}>`;
        row.querySelector('input').onchange = e => { s[key] = e.target.checked; this.save.write(); };
        target.appendChild(row);
      }
    }
    modal.classList.remove('hidden');
  }

  showChest(reward, done) {
    const modal = document.getElementById('chestModal');
    const rarity = reward?.rarity || 'common';
    document.getElementById('chestRarity').textContent = rarityLabel[rarity] || rarity.toUpperCase();
    document.getElementById('chestRarity').className = `tag rarity-${rarity}`;
    document.getElementById('chestReward').innerHTML = reward
      ? `<h3>${reward.icon || '✦'} ${reward.name}</h3><p>${reward.desc || ''}</p>`
      : '<p>Recompensa misteriosa.</p>';
    modal.classList.remove('hidden');
    document.getElementById('chestContinue').onclick = () => { modal.classList.add('hidden'); done?.(); };
  }

  showEvent(ev, callback) {
    document.getElementById('eventIcon').textContent = ev.icon;
    document.getElementById('eventName').textContent = ev.name;
    document.getElementById('eventDesc').textContent = ev.desc;
    document.getElementById('eventModal').classList.remove('hidden');
    document.getElementById('eventAccept').onclick = () => callback('accept');
    document.getElementById('eventDecline').onclick = () => callback('decline');
  }
  hideEvent() { document.getElementById('eventModal').classList.add('hidden'); }

  showEnd(g, victory, achievements = []) {
    const p = g.player;
    const modal = document.getElementById('endModal');
    document.getElementById('endTitle').textContent = victory ? 'VITÓRIA' : 'RUN SUMMARY';
    document.getElementById('endStats').innerHTML = `
      <div><span>Tempo sobrevivido</span><b>${this.fmt(g.time)}</b></div>
      <div><span>Nível alcançado</span><b>${p.level}</b></div>
      <div><span>Inimigos derrotados</span><b>${p.kills}</b></div>
      <div><span>Elites derrotadas</span><b>${g.stats.elites}</b></div>
      <div><span>Bosses derrotados</span><b>${g.stats.bosses}</b></div>
      <div><span>XP coletado</span><b>${Math.floor(p.xpCollected)}</b></div>
      <div><span>Ouro coletado</span><b>${p.coins}</b></div>
      <div><span>Maior crítico</span><b>${Math.round(p.highestCrit)}</b></div>
      <div><span>Arcane Fusions</span><b>${g.stats.fusions}</b></div>
    `;

    const breakdown = document.getElementById('damageBreakdown');
    const entries = Object.entries(g.weaponDamage).sort((a,b) => b[1]-a[1]);
    const total = entries.reduce((s, [,v]) => s + v, 0) || 1;
    breakdown.innerHTML = '<h3>DAMAGE DEALT</h3>' + (entries.length ? entries.slice(0, 8).map(([id, value]) => {
      const w = WEAPONS[id];
      const name = w?.name || id;
      const pct = Math.round(value / total * 100);
      return `<div class="damage-row"><span>${w?.icon || '✦'} ${name}</span><b>${pct}%</b><div class="mini-bar"><span style="width:${pct}%"></span></div></div>`;
    }).join('') : '<p class="small">Nenhum dano registrado.</p>');

    document.getElementById('endAchievements').innerHTML = achievements.map(a => `<div class="end-achievement">🏆 ${a.name} • +${a.reward} ◈</div>`).join('');
    modal.classList.remove('hidden');
  }
  hideEnd() { document.getElementById('endModal').classList.add('hidden'); }

  flashMessage(text) {
    const d = document.createElement('div');
    d.textContent = text;
    d.style.cssText = 'position:fixed;z-index:80;top:18%;left:50%;transform:translateX(-50%);max-width:min(760px,90vw);padding:14px 20px;background:#0b1d19ee;border:1px solid #d6ae52;border-radius:12px;font-weight:900;text-align:center;box-shadow:0 12px 36px #0008;';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 2600);
  }

  fmt(t) {
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}
