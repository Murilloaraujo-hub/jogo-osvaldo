const KEY = 'arcaneHordeSaveV1';

const defaults = {
  saveVersion: 2,
  coins: 0,
  unlocked: ['mage'],
  unlockedMaps: ['ruins'],
  unlockedRelics: [],
  unlockedWeapons: [],
  meta: { strength: 0, vitality: 0, agility: 0, wisdom: 0 },
  settings: {
    master: 1,
    music: .65,
    sfx: .8,
    damageNumbers: true,
    particles: 2,
    shake: true,
    performance: false,
    debug: false,
    hitboxes: false,
    quality: 2,
    enemyQuality: 2
  },
  records: {
    bestTime: 0,
    highestLevel: 1,
    totalKills: 0,
    totalElites: 0,
    totalBosses: 0,
    totalXp: 0,
    highestCrit: 0,
    wins: 0,
    miniboss: false
  },
  evolutions: [],
  fusions: [],
  achievements: []
};

const clone = o => JSON.parse(JSON.stringify(o));

function merge(base, src) {
  for (const k in base) {
    if (src?.[k] === undefined) continue;
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], src[k]);
    else base[k] = src[k];
  }
  return base;
}

function migrate(data) {
  const migrated = merge(clone(defaults), data || {});
  // Compatibilidade com saves 1.x: mantém moeda, recordes, desbloqueios e configurações.
  migrated.saveVersion = 2;
  if (!Array.isArray(migrated.unlocked)) migrated.unlocked = ['mage'];
  if (!migrated.unlocked.includes('mage')) migrated.unlocked.push('mage');
  if (!Array.isArray(migrated.evolutions)) migrated.evolutions = [];
  if (!Array.isArray(migrated.fusions)) migrated.fusions = [];
  if (!Array.isArray(migrated.achievements)) migrated.achievements = [];
  return migrated;
}

export const Save = {
  data: clone(defaults),

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      this.data = migrate(raw ? JSON.parse(raw) : {});
    } catch (e) {
      console.warn('Save inválido. Uma cópia padrão foi carregada sem travar o jogo.', e);
      this.data = clone(defaults);
    }
    this.refreshUnlocks();
    this.write();
    return this.data;
  },

  write() {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); }
    catch (e) { console.warn('Falha ao salvar dados locais.', e); }
  },

  refreshUnlocks() {
    const r = this.data.records;
    const u = this.data.unlocked;
    const add = id => { if (!u.includes(id)) u.push(id); };
    if (r.bestTime >= 300) add('archer');
    if (r.totalKills >= 1000) add('necromancer');
    if (r.miniboss) add('knight');
    if (r.wins >= 2) add('druid');
    if (r.highestLevel >= 20) add('assassin');
  },

  isMapUnlocked(id) {
    const r = this.data.records;
    if (id === 'ruins') return true;
    if (id === 'forest') return r.bestTime >= 300;
    if (id === 'ash') return r.wins >= 1;
    if (id === 'frost') return r.wins >= 2;
    if (id === 'city') return r.totalKills >= 5000;
    if (id === 'void') return r.wins >= 4;
    return false;
  },

  finishRun(run) {
    const r = this.data.records;
    this.data.coins += Math.max(0, Math.floor(run.coins || 0));
    r.bestTime = Math.max(r.bestTime, run.time || 0);
    r.highestLevel = Math.max(r.highestLevel, run.level || 1);
    r.totalKills += run.kills || 0;
    r.totalElites += run.elites || 0;
    r.totalBosses += run.bosses || 0;
    r.totalXp += Math.floor(run.xp || 0);
    r.highestCrit = Math.max(r.highestCrit, run.highestCrit || 0);
    if (run.miniboss) r.miniboss = true;
    if (run.victory) r.wins++;
    this.refreshUnlocks();
    this.write();
  },

  discoverEvolution(id) {
    if (!this.data.evolutions.includes(id)) {
      this.data.evolutions.push(id);
      this.write();
    }
  },

  discoverFusion(id) {
    if (!this.data.fusions.includes(id)) {
      this.data.fusions.push(id);
      this.write();
    }
  },

  reset() {
    this.data = clone(defaults);
    this.write();
  }
};
