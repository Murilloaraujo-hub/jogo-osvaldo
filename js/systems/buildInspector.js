import { PASSIVES } from '../config.js?v=2.9.0';
import { WEAPONS, getWeaponStats, getWeaponLevelDescription } from '../weapons/weaponData.js?v=2.9.0';
import { FUSION_RECIPES } from '../fusions.js?v=2.9.0';
import { FUSION_ITEMS } from '../items/fusionItems.js?v=2.9.0';
import { RUN_ITEMS } from '../items/itemCatalog.js?v=2.9.0';
import { RELICS } from '../relics.js?v=2.9.0';
import { CLASS_PASSIVES } from './classPassives.js?v=2.9.0';

const TYPE_LABELS = {
  projectile:'Projétil', melee:'Corpo a corpo', lightning:'Corrente', thunderStrike:'Raio vertical',
  aura:'Aura', nova:'Explosão circular', meteor:'Impacto do céu', summon:'Invocação', thermal:'Zona elemental',
  curse:'Maldição', holyBlade:'Lâmina sagrada', elementalCycle:'Ciclo elemental', beam:'Feixe', familiar:'Familiar',
  bloodNova:'Nova', wave:'Onda', drone:'Drone', signature:'Signature Ability', fusion:'Arcane Fusion', orbit:'Orbital'
};
const ELEMENT_LABELS = {
  fire:'Fogo', ice:'Gelo', electric:'Raio', earth:'Terra', wind:'Vento', poison:'Veneno', shadow:'Sombra',
  arcane:'Arcano', holy:'Luz', nature:'Natureza', physical:'Físico'
};

export function fmtNumber(value, digits = 0) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('pt-BR', { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export function fmtTime(seconds = 0) {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
}


function canonicalSourceId(id) {
  const key = String(id || 'Outro');
  if (key.startsWith('classPassive:') || key.startsWith('item:')) return key;
  if (WEAPONS[key]) return key;
  // Efeitos secundários usam o ID da habilidade como prefixo. Agrupar evita
  // poluir o damage breakdown com nomes técnicos como "apocalypseRainBlast".
  const weaponIds = Object.keys(WEAPONS).sort((a,b)=>b.length-a.length);
  const found = weaponIds.find(w => key.startsWith(w));
  if (found) return found;
  return key;
}

function sourceDamage(game, id) {
  if (!game?.weaponDamage) return 0;
  let total = 0;
  for (const [key, value] of Object.entries(game.weaponDamage)) {
    if (key === id || key.startsWith(`${id}:`) || key.startsWith(`${id}Shock`) || key.startsWith(`${id}Blast`) || key.startsWith(`${id}Puddle`) || key.startsWith(`${id}Cloud`)) total += value || 0;
  }
  return total;
}

function sourceKills(game, id) {
  if (!game?.sourceKills) return 0;
  let total = 0;
  for (const [key, value] of Object.entries(game.sourceKills)) {
    if (key === id || key.startsWith(`${id}:`) || key.startsWith(`${id}Shock`) || key.startsWith(`${id}Blast`) || key.startsWith(`${id}Puddle`) || key.startsWith(`${id}Cloud`)) total += value || 0;
  }
  return total;
}

function recentDps(game, id, window = 5) {
  if (!game?.damageHistory) return 0;
  const cutoff = (game.time || 0) - window;
  let total = 0;
  for (const [key, list] of Object.entries(game.damageHistory)) {
    if (!(key === id || key.startsWith(`${id}:`) || key.startsWith(`${id}Shock`) || key.startsWith(`${id}Blast`) || key.startsWith(`${id}Puddle`) || key.startsWith(`${id}Cloud`))) continue;
    for (const entry of list || []) if ((entry.t || 0) >= cutoff) total += entry.damage || 0;
  }
  return total / Math.max(.001, window);
}

function addStat(rows, label, value, suffix = '') {
  if (value === undefined || value === null || value === '' || Number.isNaN(value)) return;
  rows.push({ label, value: `${value}${suffix}` });
}

function projectileEstimate(raw, stats, level, p) {
  if (raw.signature) {
    switch (raw.signaturePattern) {
      case 'runeBarrage': {
        const evo = !!raw.evolved;
        const runes = evo ? 7 : 2 + (level >= 2 ? 1 : 0) + (level >= 4 ? 1 : 0);
        const per = evo ? 3 : 1 + (level >= 3 ? 1 : 0);
        return runes * per;
      }
      case 'hunterVolley': return raw.evolved ? 12 : 3 + (level >= 2 ? 1 : 0) + (level >= 4 ? 2 : 0);
      case 'shadowKnives': return raw.evolved ? 8 : 2 + (level >= 2 ? 1 : 0) + (level >= 4 ? 2 : 0);
      case 'bloodLances': return raw.evolved ? 8 : 2 + (level >= 2 ? 1 : 0) + (level >= 4 ? 2 : 0);
      case 'celestialLight': return raw.evolved ? 7 : Math.max(1, level);
      case 'kiFists': return raw.evolved ? 8 : 2 + (level >= 2 ? 1 : 0) + (level >= 4 ? 2 : 0);
      case 'arcaneDrones': return raw.evolved ? 3 : 1;
      default: break;
    }
  }
  if (typeof stats.projectiles === 'number') return stats.projectiles;
  if (raw.type === 'projectile') return Math.max(1, 1 + (p.amount || 0) + (level >= 3 ? 1 : 0) + (level >= 5 ? 1 : 0));
  return null;
}

function fusionRecipeForResult(id) { return FUSION_RECIPES.find(r => r.result === id) || null; }

export function abilityInspection(game, id) {
  const p = game?.player;
  const level = p?.weapons?.[id] || 0;
  const raw = WEAPONS[id];
  if (!p || !raw || !level) return null;
  const stats = getWeaponStats(id, level) || raw;
  const lowHpHaste = game.flags?.bloodHourglass && p.hp / p.maxHp < .35 ? .78 : 1;
  const actualCooldown = (stats.cooldown || 0) * (p.cooldown || 1) * lowHpHaste / Math.max(.01, p.attackSpeed || 1);
  const damage = (stats.damage || 0) * (p.damage || 1);
  const area = (stats.area || 0) * (p.area || 1);
  const speed = (stats.speed || 0) * (p.projectileSpeed || 1);
  const pierce = (stats.pierce || 0) + (p.pierceBonus || 0);
  const totalDamage = sourceDamage(game, id);
  const totalAll = Math.max(1, Object.values(game.weaponDamage || {}).reduce((a,b)=>a+(b||0),0));
  const rows = [];
  if ((stats.damage || 0) > 0) {
    addStat(rows, 'Dano atual', fmtNumber(damage));
    addStat(rows, 'Crítico', `${Math.round((p.crit || 0) * 100)}%`);
    if ((p.critDamage || 0) > 1) addStat(rows, 'Dano crítico', `${Math.round((p.critDamage || 1) * 100)}%`);
  }
  if (actualCooldown > 0) addStat(rows, 'Cooldown atual', actualCooldown.toFixed(2), 's');
  if (area > 0) addStat(rows, ['beam','wave'].includes(raw.type) ? 'Largura / área' : 'Área', fmtNumber(area));
  if (speed > 0) addStat(rows, 'Velocidade do projétil', fmtNumber(speed));
  const projectiles = projectileEstimate(raw, stats, level, p);
  if (projectiles !== null) addStat(rows, 'Projéteis / ataques', projectiles);
  if (pierce > 0) addStat(rows, 'Perfuração', pierce);
  if ((stats.chains || 0) > 0) addStat(rows, 'Saltos', stats.chains);
  if ((stats.range || 0) > 0) addStat(rows, 'Alcance', fmtNumber(stats.range));
  if ((stats.duration || 0) > 0) addStat(rows, 'Duração', stats.duration.toFixed(1), 's');
  if ((stats.meteorCount || 0) > 0) addStat(rows, 'Meteoros', stats.meteorCount);
  if ((stats.secondaryCount || 0) > 0) addStat(rows, 'Ataques secundários', stats.secondaryCount);
  if ((stats.bolts || 0) > 0) addStat(rows, 'Raios', stats.bolts);
  if ((stats.marks || 0) > 0) addStat(rows, 'Marcas', stats.marks);
  if ((stats.shields || 0) > 0) addStat(rows, 'Escudos', stats.shields);
  if ((stats.waves || 0) > 0) addStat(rows, 'Ondas', stats.waves);
  if ((stats.souls || 0) > 0) addStat(rows, 'Almas', stats.souls);
  if ((stats.count || 0) > 0 && raw.fusion) addStat(rows, 'Entidades / ataques', stats.count);

  const summonList = (game.summons || []).filter(s => !s.dead && (s.id === id || (id === 'boneColossus' && s.id === 'boneColossus')));
  if (raw.type === 'summon' || raw.type === 'familiar' || raw.type === 'drone' || raw.signaturePattern === 'celestialLight' || raw.signaturePattern === 'arcaneDrones') {
    addStat(rows, 'Invocações ativas', summonList.length);
    const s = summonList[0];
    if (s) {
      addStat(rows, 'Dano por ataque do summon', fmtNumber(s.damage || damage));
      if (s.projectileCount > 1) addStat(rows, 'Projéteis do summon', s.projectileCount);
      if (s.chainCount > 1) addStat(rows, 'Saltos do summon', s.chainCount);
      addStat(rows, 'Velocidade de ataque aprox.', (1 / (s.electric ? .50 : s.doubleRing ? .54 : s.id === 'skeletonColossus' ? .85 : .68)).toFixed(2), '/s');
    }
  }

  if (raw.element === 'poison') addStat(rows, 'Status', 'Veneno');
  if (raw.element === 'ice') addStat(rows, 'Status', 'Lentidão / congelamento');
  if (raw.element === 'electric') addStat(rows, 'Status', 'Descarga elétrica');

  const modifiers = [];
  for (const passiveId of p.passiveOrder || []) {
    const passive = PASSIVES[passiveId];
    if (passive) modifiers.push(`${passive.icon || '✦'} ${passive.name} Lv.${p.passives[passiveId]} — ${passive.desc}`);
  }
  for (const itemId of p.items || []) {
    const item = RUN_ITEMS[itemId];
    if (item) modifiers.push(`${item.icon} ${item.name} — ${item.desc}`);
  }
  for (const relicId of p.relics || []) {
    const relic = RELICS[relicId];
    if (relic) modifiers.push(`${relic.icon} ${relic.name} — ${relic.desc}`);
  }

  const recipe = raw.fusion ? fusionRecipeForResult(id) : null;
  return {
    id, name: raw.name, icon: raw.icon, level, max: raw.max || 1,
    type: raw.fusion ? 'Arcane Fusion' : raw.evolved ? 'Evolved Ability' : raw.signature ? 'Signature Ability' : TYPE_LABELS[raw.type] || raw.type,
    element: ELEMENT_LABELS[raw.element] || raw.element || '—',
    description: raw.desc || '', rows,
    totalDamage, recentDps: recentDps(game,id), kills: sourceKills(game,id), contribution: totalDamage / totalAll * 100,
    nextUpgrade: level >= (raw.max || 1) ? null : getWeaponLevelDescription(id, level),
    recipe,
    modifiers
  };
}

export function fusionInspection(game, id) {
  const out = abilityInspection(game,id);
  if (!out) return null;
  const recipe = fusionRecipeForResult(id);
  if (recipe) {
    out.recipeNames = recipe.abilities.map(x => WEAPONS[x]?.name || x);
    out.recipeItem = recipe.item ? FUSION_ITEMS[recipe.item] : null;
    out.classId = recipe.classId || null;
  }
  return out;
}

export function itemInspection(game, id, fusionItem = false) {
  if (fusionItem) {
    const it = FUSION_ITEMS[id];
    if (!it) return null;
    const uses = FUSION_RECIPES.filter(r => r.item === id).map(r => WEAPONS[r.result]?.name || r.name);
    return { id, icon:it.icon, name:it.name, rarity:it.rarity || 'fusion', type:'Fusion Item', description:it.desc || '', stacks:game.player.fusionItems?.[id] || 0, source:it.source || '', uses };
  }
  const it = RUN_ITEMS[id];
  if (!it) return null;
  const usage = game.itemStats?.[id] || {};
  return { id, icon:it.icon, name:it.name, rarity:it.rarity, type:'Item', description:it.desc || '', stacks:1, usage };
}

export function relicInspection(game,id) {
  const r=RELICS[id]; if(!r) return null;
  return {id,icon:r.icon,name:r.name,rarity:r.rarity,type:'Relíquia',description:r.desc||'',usage:game.relicStats?.[id]||{}};
}

export function passiveInspection(game) {
  const sys=game.classPassives, p=game.player, info=CLASS_PASSIVES[p.id]; if(!sys||!info)return null;
  const runtime=sys.getRuntimeStats?.() || {};
  const source=`classPassive:${p.id}`;
  return { id:p.id, icon:info.icon, name:info.name, description:info.desc, cooldown:info.cooldown, remaining:Math.max(0,sys.timer||0), activations:sys.activations||0, totalDamage:sourceDamage(game,source), recentDps:recentDps(game,source), runtime };
}

export function runInspection(game) {
  const p=game.player;
  const grouped = {};
  for (const [id,value] of Object.entries(game.weaponDamage||{})) {
    const canonical = canonicalSourceId(id);
    grouped[canonical] = (grouped[canonical] || 0) + (value || 0);
  }
  const entries=Object.entries(grouped).sort((a,b)=>b[1]-a[1]);
  const total=entries.reduce((s,[,v])=>s+(v||0),0);
  return {
    time:fmtTime(game.time), level:p.level, hp:`${Math.ceil(p.hp)} / ${Math.ceil(p.maxHp)}`, xp:`${Math.floor(p.xpNow)} / ${Math.floor(p.xpNeed)}`,
    kills:p.kills, elites:game.stats.elites||0, bosses:game.stats.bosses||0, totalDamage:total, highestCrit:p.highestCrit||0,
    healing:game.stats.healingReceived||0, coins:p.coins||0, entries, total
  };
}
