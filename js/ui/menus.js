import { CHARACTERS, MAPS, META_UPGRADES, DIFFICULTIES, ACHIEVEMENTS } from '../config.js?v=2.8.0';
import { WEAPONS } from '../weapons/weaponData.js?v=2.8.0';
import { EVOLUTIONS, ARCANE_FUSIONS } from '../evolutions.js?v=2.8.0';
import { RELICS } from '../relics.js?v=2.8.0';
import { CLASS_PASSIVES } from '../systems/classPassives.js?v=2.8.0';
import { drawClassPreview } from '../visuals/playerVisuals.js?v=2.8.0';
import { FUSION_ITEMS } from '../items/fusionItems.js?v=2.8.0';
import { RUN_ITEMS } from '../items/itemCatalog.js?v=2.8.0';
import { SIGNATURE_ABILITIES } from '../abilities/signatures.js?v=2.8.0';
import { FUSION_RECIPES } from '../fusions.js?v=2.8.0';
import { recipeState, runRequirement, howToUnlock, fusionSearchText, signatureRows, baseForEvolution } from '../grimoire.js?v=2.8.0';

const ENEMY_LABEL=id=>({infernalWyrm:'INFERNAL WYRM',frostColossus:'FROST COLOSSUS',stormHerald:'STORM HERALD',graveTyrant:'GRAVE TYRANT',voidReaper:'VOID REAPER',titanRoots:'TITAN OF ROOTS',arcaneBehemoth:'ARCANE BEHEMOTH',plagueMother:'PLAGUE MOTHER',beastBoss:'FERA CARMESIM'}[id]||id||'Eventos/Bosses');

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
    this.grimoireTab = 'fusions';
    this.grimoireSelected = null;
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
      this.refreshFusionItems(this.game.player.fusionItems);
      this.refreshItems(this.game.player.items);
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
        else if (action === 'fusions') this.showRunInfo('fusions');
        else if (action === 'grimoire') this.showRunInfo('grimoire');
        else if (action === 'items') this.showRunInfo('items');
        else if (action === 'relics') this.showRunInfo('relics');
        else if (action === 'settings') this.showRunInfo('settings');
      };
    });

    document.getElementById('infoClose').onclick = () => document.getElementById('infoModal').classList.add('hidden');
    document.getElementById('grimoireTabs')?.addEventListener('click',e=>{const b=e.target.closest('[data-grimoire-tab]');if(!b)return;this.grimoireTab=b.dataset.grimoireTab;this.renderGrimoire();});
    for(const id of ['grimoireSearch','grimoireFilter','grimoireClassFilter']) document.getElementById(id)?.addEventListener('input',()=>this.renderGrimoire());
    document.getElementById('recipeMode')?.addEventListener('change',e=>{this.save.data.settings.recipeMode=e.target.value;this.save.write();this.renderGrimoire();});
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
        <div class="portrait class-portrait"><canvas data-class-preview="${id}" aria-label="Prévia visual de ${c.name}"></canvas></div>
        <h3>${c.name}</h3>
        <span class="tag signature-tag">SIGNATURE • ${WEAPONS[c.startWeapon].icon} ${WEAPONS[c.startWeapon].name}</span>
        <p>${c.description}</p>
        <div class="signature-card"><span>SIGNATURE ABILITY</span><b>${WEAPONS[c.startWeapon].name}</b><small>${WEAPONS[c.startWeapon].desc}</small></div>
        <div class="class-passive-card">
          <span class="passive-kicker">PASSIVA DE CLASSE</span>
          <b>${CLASS_PASSIVES[id]?.icon || '✦'} ${CLASS_PASSIVES[id]?.name || c.passive}</b>
          <small>${CLASS_PASSIVES[id]?.desc || ''}</small>
        </div>
        <div class="statline"><span>ESTILO</span><b>${SIGNATURE_ABILITIES[id]?.style || 'Híbrido'}</b></div>
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
      drawClassPreview(d.querySelector('[data-class-preview]'), id);
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
    const box=document.getElementById('grimoireList'),detail=document.getElementById('grimoireDetail'); if(!box||!detail)return;
    document.querySelectorAll('[data-grimoire-tab]').forEach(b=>b.classList.toggle('active',b.dataset.grimoireTab===this.grimoireTab));
    const search=(document.getElementById('grimoireSearch')?.value||'').trim().toLowerCase();
    const filter=document.getElementById('grimoireFilter')?.value||'all';
    const classFilter=document.getElementById('grimoireClassFilter');
    if(classFilter&&classFilter.options.length<=1){for(const [id,c] of Object.entries(CHARACTERS)){const o=document.createElement('option');o.value=id;o.textContent=c.name;classFilter.appendChild(o);}}
    const classId=classFilter?.value||'all';
    const recipeMode=document.getElementById('recipeMode');if(recipeMode)recipeMode.value=this.save.data.settings.recipeMode||'discovery';
    box.innerHTML='';

    const addCard=(key,title,sub,html,onClick)=>{const d=document.createElement('button');d.className='grimoire-card';d.dataset.key=key;d.innerHTML=`<h3>${title}</h3><span>${sub||''}</span>${html||''}`;d.onclick=onClick;box.appendChild(d);};
    if(this.grimoireTab==='abilities'){
      for(const row of signatureRows()){if(classId!=='all'&&row.classId!==classId)continue;const q=`${row.name} ${row.evolutionName} ${CHARACTERS[row.classId]?.name}`.toLowerCase();if(search&&!q.includes(search))continue;addCard(row.base,`${row.weapon?.icon||'✦'} ${row.name}`,`SIGNATURE • ${CHARACTERS[row.classId]?.name}`,`<small>Lv.5 → ${row.evolutionName}</small>`,()=>this.showGrimoireAbility(row));}
      for(const [id,w] of Object.entries(WEAPONS)){if(w.evolved||w.fusion||w.signature)continue;const q=`${w.name} ${w.element} ${w.type}`.toLowerCase();if(search&&!q.includes(search))continue;addCard(id,`${w.icon} ${w.name}`,'GENERAL ABILITY',`<small>${w.desc}</small>`,()=>this.showGrimoireWeapon(id));}
    } else if(this.grimoireTab==='evolutions'){
      for(const e of EVOLUTIONS){if(classId!=='all'&&e.classId&&e.classId!==classId)continue;const known=this.save.data.evolutions.includes(e.id)||this.save.data.settings.recipeMode==='all';const q=`${e.name} ${WEAPONS[e.base]?.name||''}`.toLowerCase();if(search&&!q.includes(search))continue;addCard(e.id,known?`${WEAPONS[e.result]?.icon||'✦'} ${e.name}`:'???',e.signature?'SIGNATURE EVOLUTION':'EVOLUÇÃO',known?`<small>${WEAPONS[e.base]?.name} Lv.5 → ${e.name}</small>`:'<small>Descubra elevando uma habilidade ao Lv.5.</small>',()=>this.showGrimoireEvolution(e));}
    } else if(this.grimoireTab==='items'){
      for(const [id,it] of Object.entries(FUSION_ITEMS)){const known=this.save.data.fusionItemsDiscovered.includes(id)||this.save.data.settings.recipeMode==='all';const q=`${it.name} ${it.source||''}`.toLowerCase();if(search&&!q.includes(search))continue;const used=FUSION_RECIPES.filter(r=>r.item===id);addCard(id,known?`${it.icon} ${it.name}`:'???','FUSION ITEM',known?`<small>Fonte principal: ${ENEMY_LABEL(it.source)} • Usado em ${used.length} receitas</small>`:'<small>Item ainda não descoberto.</small>',()=>this.showGrimoireItem(id));}
    } else if(this.grimoireTab==='discoveries'){
      const stats=[['Habilidades',this.save.data.abilities.length],['Evoluções',this.save.data.evolutions.length],['Fusions',this.save.data.fusions.length],['Fusion Items',this.save.data.fusionItemsDiscovered.length],['Bosses',this.save.data.bossesDiscovered.length]];for(const [n,v] of stats)addCard(n,n,'DESCOBERTAS',`<strong>${v}</strong>`,()=>{});
    } else {
      for(const r of FUSION_RECIPES){const state=recipeState(this.save,r);if(classId!=='all'&&r.classId&&r.classId!==classId)continue;if(search&&!fusionSearchText(r).includes(search))continue;if(filter==='discovered'&&state!=='discovered')continue;if(filter==='unknown'&&state==='discovered')continue;if(filter==='item'&&!r.item)continue;if(filter==='noitem'&&r.item)continue;if(filter==='exclusive'&&!r.classId)continue;if(filter==='summon'&&!r.abilities.some(id=>['summon','familiar','drone'].includes(WEAPONS[id]?.type)))continue;if(filter==='arcane'&&WEAPONS[r.result]?.element!=='arcane')continue;if(filter==='elemental'&&!['fire','ice','electric','earth','wind','poison'].includes(WEAPONS[r.result]?.element))continue;
        const reveal=state==='discovered';const partial=state==='partial';const title=reveal?`${WEAPONS[r.result]?.icon||'✦'} ${WEAPONS[r.result]?.name||r.name}`:partial?'◐ RECEITA PARCIAL':'???';const req=r.abilities.map(id=>reveal||this.save.data.abilities.includes(id)||this.save.data.evolutions.includes(id)?WEAPONS[id]?.name||id:'???').join(' + ')+(r.item?` + ${reveal||this.save.data.fusionItemsDiscovered.includes(r.item)?FUSION_ITEMS[r.item]?.name:'???'}`:'');addCard(r.id,title,`${r.classId?`EXCLUSIVA • ${CHARACTERS[r.classId]?.name}`:'ARCANE FUSION'} • MAX Lv.14`,`<small>${req}</small>`,()=>this.showGrimoireFusion(r));}
    }
    if(!box.children.length) box.innerHTML='<p class="notice">Nenhum resultado encontrado.</p>';
  }

  showGrimoireFusion(r){
    const detail=document.getElementById('grimoireDetail');const state=recipeState(this.save,r),reveal=state==='discovered';const run=this.game?.player?runRequirement(this.game,r):[];const reqHtml=(run.length?run:r.abilities.map(id=>({kind:'ability',id,ready:false,label:WEAPONS[id]?.name||id})).concat(r.item?[{kind:'item',id:r.item,ready:false,label:FUSION_ITEMS[r.item]?.name||r.item,source:FUSION_ITEMS[r.item]?.source}]:[])).map(x=>`<div class="requirement ${x.ready?'ready':''}"><b>${x.ready?'✓':'✗'} ${x.label}</b>${x.baseLv?`<small>Faltam ${Math.max(0,5-x.baseLv)} níveis para evoluir.</small>`:''}${x.source?`<small>Fonte principal: ${ENEMY_LABEL(x.source)}</small>`:''}</div>`).join('');
    const how=howToUnlock(r).map(x=>`<li>${x}</li>`).join('');const levels=(WEAPONS[r.result]?.levels||[]).map((x,i)=>`<div class="fusion-level ${(i+1===5||i+1===10||i+1===14)?'milestone':''}"><b>Lv.${i+1}</b><span>${x}</span></div>`).join('');
    detail.innerHTML=`<span class="tag">${r.classId?`EXCLUSIVA • ${CHARACTERS[r.classId]?.name}`:'ARCANE FUSION'}</span><h2>${reveal?`${WEAPONS[r.result]?.icon||'✦'} ${WEAPONS[r.result]?.name||r.name}`:'?????????????'}</h2><p>${reveal?WEAPONS[r.result]?.desc:(r.hint||'Dica: experimente evoluções tematicamente compatíveis.')}</p><h3>REQUISITOS</h3>${reqHtml}<p><b>Nível máximo:</b> 14</p><button id="trackFusionButton">${this.save.data.settings.trackedFusion===r.id?'PARAR DE RASTREAR':'RASTREAR FUSION'}</button><details><summary>COMO CONSEGUIR?</summary><ol>${how}</ol></details>${reveal?`<h3>PROGRESSÃO Lv.1–14</h3><div class="fusion-levels">${levels}</div>`:''}`;
    detail.querySelector('#trackFusionButton').onclick=()=>this.toggleTrackFusion(r.id);
  }
  showGrimoireWeapon(id){const w=WEAPONS[id],e=EVOLUTIONS.find(x=>x.base===id);document.getElementById('grimoireDetail').innerHTML=`<span class="tag">${w.signature?'SIGNATURE ABILITY':'GENERAL ABILITY'}</span><h2>${w.icon} ${w.name}</h2><p>${w.desc}</p><h3>Lv.1–5</h3>${(w.levels||[]).map((x,i)=>`<div class="fusion-level"><b>Lv.${i+1}</b><span>${x}</span></div>`).join('')}<h3>EVOLUÇÃO</h3><p>Ao chegar ao Lv.5 evolui automaticamente para <b>${e?WEAPONS[e.result]?.name:'—'}</b>.</p>`;}
  showGrimoireAbility(row){this.showGrimoireWeapon(row.base);}
  showGrimoireEvolution(e){const known=this.save.data.evolutions.includes(e.id)||this.save.data.settings.recipeMode==='all';document.getElementById('grimoireDetail').innerHTML=known?`<span class="tag">EVOLUÇÃO</span><h2>${WEAPONS[e.result]?.icon||'✦'} ${WEAPONS[e.result]?.name||e.name}</h2><p>${WEAPONS[e.base]?.name} Lv.5 → ${WEAPONS[e.result]?.name}</p><p>${WEAPONS[e.result]?.desc||''}</p>`:`<h2>???</h2><p>Eleve uma habilidade ao Lv.5 para descobrir esta evolução.</p>`;}
  showGrimoireItem(id){const it=FUSION_ITEMS[id],known=this.save.data.fusionItemsDiscovered.includes(id)||this.save.data.settings.recipeMode==='all';if(!known){document.getElementById('grimoireDetail').innerHTML='<h2>???</h2><p>Obtenha este item uma vez para revelar suas informações.</p>';return;}const used=FUSION_RECIPES.filter(r=>r.item===id);document.getElementById('grimoireDetail').innerHTML=`<span class="tag">FUSION ITEM</span><h2>${it.icon} ${it.name}</h2><p>${it.desc}</p><p><b>Fonte principal:</b> ${ENEMY_LABEL(it.source)}</p><p><b>Também pode aparecer em:</b> ${(it.alternate||['Baús de alta raridade','Eventos especiais']).join(' • ')}</p><h3>USADO EM</h3>${used.map(r=>`<div class="info-row"><span>${WEAPONS[r.result]?.icon||'✦'} ${WEAPONS[r.result]?.name||r.name}</span><b>${r.classId?CHARACTERS[r.classId]?.name:'Qualquer classe'}</b></div>`).join('')}`;}
  toggleTrackFusion(id){const next=this.save.data.settings.trackedFusion===id?null:id;this.save.data.settings.trackedFusion=next;this.save.write();if(this.game)this.game.trackedFusionId=next;this.renderGrimoire();if(this.game)this.refreshFusionTracker(this.game);}

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
    const toggles = [
      ['damageNumbers', 'Números de dano'],
      ['shake', 'Screen shake'],
      ['performance', 'Modo performance'],
      ['debug', 'Debug / FPS'],
      ['hitboxes', 'Mostrar hitboxes'],
      ['minimapEnabled', 'Minimapa']
    ];
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

    const enemyQuality = document.createElement('label');
    enemyQuality.className = 'setting';
    enemyQuality.innerHTML = `<span>Qualidade dos inimigos</span><select><option value="0">Baixa</option><option value="1">Média</option><option value="2">Alta</option></select>`;
    enemyQuality.querySelector('select').value = String(s.enemyQuality ?? 2);
    enemyQuality.querySelector('select').onchange = e => { s.enemyQuality = +e.target.value; this.save.write(); };
    box.appendChild(enemyQuality);

    const minimapSize = document.createElement('label');
    minimapSize.className = 'setting';
    minimapSize.innerHTML = `<span>Tamanho do minimapa</span><select><option value="0">Pequeno</option><option value="1">Médio</option><option value="2">Grande</option></select>`;
    minimapSize.querySelector('select').value = String(s.minimapSize ?? 1);
    minimapSize.querySelector('select').onchange = e => { s.minimapSize = +e.target.value; this.save.write(); };
    box.appendChild(minimapSize);
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

    const passiveHud = document.getElementById('classPassiveHud');
    if (passiveHud && g.classPassives) {
      const info = g.classPassives.hudInfo();
      passiveHud.classList.remove('hidden');
      passiveHud.innerHTML = `<span class="passive-icon">${info.icon}</span><div><b>${info.name}</b><small>${info.active ? 'ATIVA' : `${Math.max(0, info.remaining).toFixed(1)}s`}${info.extra ? ` • ${info.extra}` : ''}</small></div>`;
      const pct = info.active ? 100 : Math.max(0, Math.min(100, 100 * (1 - info.remaining / info.cooldown)));
      passiveHud.style.setProperty('--passive-charge', `${pct}%`);
    } else if (passiveHud) passiveHud.classList.add('hidden');
    this.refreshFusionTracker(g);

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
      debug.textContent = `Inimigos ${g.enemies.length}/${g.enemyCap?.() || '—'}\nHorda ${g.hordeWaveTimer>0?'ATIVA':'normal'}\nProjéteis ${g.projectiles.length}\nPartículas ${g.particles.length}\nInvocações ${g.summons.length}\nVel ${Math.round(p.speed)}/${Math.round(p.speedCap || p.speed)}\nPos ${Math.round(p.x)}, ${Math.round(p.y)}\nHP mult ${g.enemyScaling('slime').hp.toFixed(2)}x\nTempo ${g.time.toFixed(1)}s`;
    } else debug.classList.add('hidden');
  }

  showEvolutionBanner(oldName, newName, icon = '✦') {
    const banner = document.getElementById('evolutionBanner');
    if (!banner) return;
    banner.innerHTML = `<span>HABILIDADE EVOLUÍDA</span><div>${oldName}</div><b>↓</b><h2>${icon} ${newName}</h2>`;
    banner.classList.remove('hidden');
    banner.classList.remove('show');
    requestAnimationFrame(() => banner.classList.add('show'));
    clearTimeout(this.evolutionBannerTimer);
    this.evolutionBannerTimer = setTimeout(() => { banner.classList.remove('show'); setTimeout(() => banner.classList.add('hidden'), 220); }, 1150);
  }


  showFusionBanner(oldNames, newName, icon = '✦') {
    const banner = document.getElementById('evolutionBanner');
    if (!banner) return;
    banner.innerHTML = `<span>ARCANE FUSION</span><div>${oldNames}</div><b>↓</b><h2>${icon} ${newName}</h2>`;
    banner.classList.remove('hidden');
    banner.classList.remove('show');
    requestAnimationFrame(() => banner.classList.add('show'));
    clearTimeout(this.evolutionBannerTimer);
    this.evolutionBannerTimer = setTimeout(() => {
      banner.classList.remove('show');
      setTimeout(() => banner.classList.add('hidden'), 220);
    }, 1350);
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
      d.innerHTML = `<b>${w.icon}</b><span>${w.fusion ? `Lv.${level}` : w.evolved ? 'EVOL.' : `Lv.${level}`}</span>`;
      box.appendChild(d);
    }
    for (let i = (p.weaponOrder?.length || Object.keys(p.weapons).length); i < 6; i++) {
      const d = document.createElement('div');
      d.className = 'weapon-slot';
      d.innerHTML = '<span>—</span>';
      box.appendChild(d);
    }
  }

  refreshFusionTracker(g){
    const box=document.getElementById('fusionTrackerHud');if(!box)return;const id=g?.trackedFusionId||this.save.data.settings.trackedFusion;if(!id){box.classList.add('hidden');return;}const r=FUSION_RECIPES.find(x=>x.id===id);if(!r){box.classList.add('hidden');return;}const req=runRequirement(g,r),done=req.filter(x=>x.ready).length;const near=done===req.length-1;const label=x=>x.kind==='item'?(FUSION_ITEMS[x.id]?.name||x.id):x.kind==='class'?(CHARACTERS[x.id]?.name||x.id):(WEAPONS[x.id]?.name||x.id);box.classList.remove('hidden');box.innerHTML=`<b>${near?'FUSION PRÓXIMA':'FUSION RASTREADA'} • ${WEAPONS[r.result]?.name||r.name}</b><small>${req.map(x=>`${x.ready?'✓':'✗'} ${label(x)}`).join(' • ')}</small><span>${done}/${req.length}</span>`;
  }

  refreshItems(ids=[]){const box=document.getElementById('itemBar');if(!box)return;box.innerHTML='';if(!ids.length){box.classList.add('hidden');return;}box.classList.remove('hidden');for(const id of ids){const it=RUN_ITEMS[id];if(!it)continue;const d=document.createElement('div');d.className='relic-chip';d.title=`${it.name}: ${it.desc}`;d.textContent=`${it.icon} ${it.name}`;box.appendChild(d);}}

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

  refreshFusionItems(items = {}) {
    const box = document.getElementById('fusionItemBar');
    if (!box) return;
    box.innerHTML = '';
    const entries = Object.entries(items).filter(([,count]) => count > 0);
    if (!entries.length) { box.classList.add('hidden'); return; }
    box.classList.remove('hidden');
    for (const [id, count] of entries) {
      const item = FUSION_ITEMS[id];
      if (!item) continue;
      const d = document.createElement('div');
      d.className = 'fusion-item-chip';
      d.title = `${item.name}: ${item.desc}`;
      d.innerHTML = `<b>${item.icon}</b>${count > 1 ? `<span>${count}</span>` : ''}`;
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
        <button class="banish" ${options.banishes <= 0 || c.signature ? 'disabled' : ''}>${c.signature?'SIGNATURE':'BANIR'}</button>
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
        row.innerHTML = `<span>${w.icon} ${w.name}</span><b>${w.fusion ? `FUSION Lv.${lv}/${w.max}` : w.evolved ? 'EVOLUÍDA' : `Lv.${lv}`}</b>`;
        list.appendChild(row);
      }
      const pending = ARCANE_FUSIONS.filter(r => !this.game.player.weapons[r.result] && r.abilities.some(id => this.game.player.weapons[id]));
      if (pending.length) {
        const h = document.createElement('h3'); h.textContent = 'Progresso de Arcane Fusion'; list.appendChild(h);
        for (const r of pending.slice(0,8)) {
          const req = r.abilities.map(id => `${this.game.player.weapons[id] ? '✓' : '✗'} ${WEAPONS[id]?.name || id}`);
          if (r.item) req.push(`${this.game.player.fusionItems?.[r.item] ? '✓' : '✗'} ${FUSION_ITEMS[r.item]?.icon || '✦'} ${FUSION_ITEMS[r.item]?.name || r.item}`);
          const row = document.createElement('div'); row.className='info-row';
          row.innerHTML = `<span><b>${WEAPONS[r.result]?.icon || '✦'} ${WEAPONS[r.result]?.name || r.name}</b><br><span class="small">${req.join(' • ')}</span></span><b>Lv. máx. ${WEAPONS[r.result]?.max || 14}</b>`;
          list.appendChild(row);
        }
      }
    } else if (kind === 'fusions') {
      title.textContent='Fusions da Run';const recipes=FUSION_RECIPES.filter(r=>this.game.player.weapons[r.result]||r.abilities.some(id=>this.game.player.weapons[id]));box.innerHTML=recipes.length?recipes.map(r=>{const req=runRequirement(this.game,r);return `<div class="info-row"><span><b>${WEAPONS[r.result]?.icon||'✦'} ${WEAPONS[r.result]?.name||r.name}</b><br><span class="small">${req.map(x=>`${x.ready?'✓':'✗'} ${x.label}`).join(' • ')}</span></span><b>${this.game.player.weapons[r.result]?`Lv.${this.game.player.weapons[r.result]}/14`:'PENDENTE'}</b></div>`;}).join(''):'<p>Nenhuma Fusion em progresso.</p>';
    } else if (kind === 'grimoire') {
      title.textContent='Arcane Grimoire • Run';const id=this.game.trackedFusionId||FUSION_RECIPES.find(r=>r.abilities.some(a=>this.game.player.weapons[a]))?.id;const r=FUSION_RECIPES.find(x=>x.id===id);box.innerHTML=r?`<h3>${WEAPONS[r.result]?.icon||'✦'} ${WEAPONS[r.result]?.name||r.name}</h3>${runRequirement(this.game,r).map(x=>`<div class="info-row"><span>${x.ready?'✓':'✗'} ${x.label}</span>${x.source?`<b>${ENEMY_LABEL(x.source)}</b>`:''}</div>`).join('')}<p class="small">Abra o ARCANE GRIMOIRE no menu principal para busca, filtros, árvore e progressão completa Lv.1–14.</p>`:'<p>Nenhuma receita próxima detectada.</p>';
    } else if (kind === 'items') {
      title.textContent='Itens da Run';const runItems=this.game.player.items.map(id=>RUN_ITEMS[id]).filter(Boolean);const fItems=Object.entries(this.game.player.fusionItems).filter(([,n])=>n>0);box.innerHTML=`<h3>Itens</h3>${runItems.length?runItems.map(it=>`<div class="info-row"><span>${it.icon} <b>${it.name}</b></span><span class="small">${it.desc}</span></div>`).join(''):'<p>Nenhum item comum/raridade.</p>'}<h3>Fusion Items</h3>${fItems.length?fItems.map(([id,n])=>`<div class="info-row"><span>${FUSION_ITEMS[id]?.icon} <b>${FUSION_ITEMS[id]?.name}</b></span><b>x${n}</b></div>`).join(''):'<p>Nenhum Fusion Item.</p>'}`;
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
