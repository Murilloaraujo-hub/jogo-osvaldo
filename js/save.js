const KEY='arcaneHordeSaveV1';
const defaults={coins:0,unlocked:['mage'],meta:{strength:0,vitality:0,agility:0,wisdom:0},settings:{master:1,music:.65,sfx:.8,damageNumbers:true,particles:2,shake:true,performance:false,debug:false},records:{bestTime:0,highestLevel:1,totalKills:0,wins:0,miniboss:false},evolutions:[]};
const clone=o=>JSON.parse(JSON.stringify(o));
function merge(base,src){for(const k in base){if(src?.[k]===undefined)continue;if(base[k]&&typeof base[k]==='object'&&!Array.isArray(base[k])) merge(base[k],src[k]); else base[k]=src[k]}return base}
export const Save={
 data:clone(defaults),
 load(){try{const raw=localStorage.getItem(KEY);this.data=merge(clone(defaults),raw?JSON.parse(raw):{});if(!Array.isArray(this.data.unlocked))this.data.unlocked=['mage'];if(!this.data.unlocked.includes('mage'))this.data.unlocked.push('mage')}catch(e){console.warn('Save inválido, usando padrão.',e);this.data=clone(defaults)}this.refreshUnlocks();return this.data},
 write(){try{localStorage.setItem(KEY,JSON.stringify(this.data))}catch(e){console.warn('Falha ao salvar',e)}},
 refreshUnlocks(){const r=this.data.records,u=this.data.unlocked;if(r.bestTime>=300&&!u.includes('archer'))u.push('archer');if(r.totalKills>=1000&&!u.includes('necromancer'))u.push('necromancer');if(r.miniboss&&!u.includes('knight'))u.push('knight')},
 finishRun(run){this.data.coins+=run.coins;this.data.records.bestTime=Math.max(this.data.records.bestTime,run.time);this.data.records.highestLevel=Math.max(this.data.records.highestLevel,run.level);this.data.records.totalKills+=run.kills;if(run.miniboss)this.data.records.miniboss=true;if(run.victory)this.data.records.wins++;this.refreshUnlocks();this.write()},
 discover(id){if(!this.data.evolutions.includes(id)){this.data.evolutions.push(id);this.write()}},
 reset(){this.data=clone(defaults);this.write()}
};
