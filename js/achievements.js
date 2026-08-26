import { ACHIEVEMENTS } from './config.js?v=2.1.1';

export function checkAchievements(save, game = null) {
  const unlocked = save.data.achievements || (save.data.achievements = []);
  const pending = [];
  const r = save.data.records;
  const unlock = id => {
    if (unlocked.includes(id)) return;
    unlocked.push(id);
    const a = ACHIEVEMENTS[id];
    save.data.coins += a.reward || 0;
    pending.push({ id, ...a });
  };

  if (r.totalKills >= 100) unlock('firstBlood');
  if (r.totalKills >= 10000) unlock('exterminator');
  if (r.bestTime >= 1200) unlock('survivor');
  if (r.wins >= 1) unlock('bossHunter');
  if (game) {
    if (game.summons.length >= 10) unlock('armyDead');
    if (game.player.weaponOrder?.some(id => game.isArcaneWeapon(id))) unlock('demigod');
  }
  if (pending.length) save.write();
  return pending;
}
