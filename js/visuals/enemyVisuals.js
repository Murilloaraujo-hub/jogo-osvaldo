function quality(game) {
  const q = Number(game.save?.data?.settings?.enemyQuality ?? 2);
  return Math.max(0, Math.min(2, Number.isFinite(q) ? q : 2));
}

function screen(game, x, y) { return game.camera.worldToScreen(x, y); }
function visible(game, x, y, r) { return game.camera.visible(x, y, r); }

function poly(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

function glow(ctx, q, color, blur) {
  if (q <= 0) return;
  ctx.shadowColor = color;
  ctx.shadowBlur = q >= 2 ? blur : blur * .55;
}

function drawEyes(ctx, x1, x2, y, color = '#fff') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x1, y, 1.7, 0, Math.PI * 2);
  ctx.arc(x2, y, 1.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawEliteDetails(ctx, game, e, s) {
  const q = quality(game);
  if (!e.elite) return;
  const t = game.time;
  const r = e.visualSize || e.size || 20;

  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.globalAlpha = .5 + Math.sin(t * 5 + e.animTime) * .12;
  ctx.lineWidth = 2;

  for (const id of e.eliteMods || []) {
    if (id === 'flaming') {
      ctx.strokeStyle = '#ff7a3d';
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + t * .7;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * .78, Math.sin(a) * r * .78);
        ctx.lineTo(Math.cos(a) * r * 1.22, Math.sin(a) * r * 1.22 - 4);
        ctx.stroke();
      }
    } else if (id === 'electric') {
      ctx.strokeStyle = '#ffe45b';
      ctx.beginPath();
      ctx.moveTo(-r, -r * .2); ctx.lineTo(-r * .55, -r * .55); ctx.lineTo(-r * .25, -r * .1);
      ctx.moveTo(r * .25, r * .1); ctx.lineTo(r * .58, -.45 * r); ctx.lineTo(r, -.2 * r);
      ctx.stroke();
    } else if (id === 'freezing') {
      ctx.strokeStyle = '#8deaff';
      for (let i = 0; i < 3; i++) {
        const a = i * Math.PI * 2 / 3 + .4;
        ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(r * .72, 0); ctx.lineTo(r * 1.18, 0); ctx.lineTo(r * 1.05, -5); ctx.moveTo(r * 1.05, 0); ctx.lineTo(r * 1.16, 5); ctx.stroke(); ctx.restore();
      }
    } else if (id === 'cursed') {
      ctx.strokeStyle = '#b07cff';
      ctx.beginPath(); ctx.arc(0, 0, r * 1.18, t, t + Math.PI * 1.35); ctx.stroke();
    } else if (id === 'vampiric') {
      ctx.strokeStyle = '#ef6b79';
      ctx.beginPath(); ctx.arc(0, 0, r * 1.05, Math.PI * .15, Math.PI * .85); ctx.stroke();
    } else if (id === 'armored') {
      ctx.strokeStyle = '#d5d5cf';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, r * .95, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    } else if (id === 'swift') {
      ctx.strokeStyle = '#9ff0dc';
      ctx.beginPath(); ctx.moveTo(-r * 1.3, -7); ctx.lineTo(-r * .85, -7); ctx.moveTo(-r * 1.45, 0); ctx.lineTo(-r * .9, 0); ctx.moveTo(-r * 1.25, 7); ctx.lineTo(-r * .8, 7); ctx.stroke();
    }
  }
  ctx.restore();

  if (q >= 1) {
    ctx.save();
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffe7a0';
    const icons = (e.eliteMods || []).map(id => ({flaming:'🔥',electric:'⚡',freezing:'❄️',cursed:'💀',vampiric:'🩸',armored:'🛡️',swift:'💨'}[id] || '')).join('');
    if (icons) ctx.fillText(icons, s.x, s.y - r - 14);
    ctx.restore();
  }
}

function drawTelegraph(ctx, game, e, s) {
  const q = quality(game);
  if (!e.telegraph && !(e.fuse > 0) && !(e.dashWindup > 0)) return;
  const r = e.visualSize || e.size || 20;
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.globalAlpha = .45 + .2 * Math.sin(game.time * 12);
  ctx.strokeStyle = e.type === 'bomber' ? '#ff8b5c' : '#ffd56c';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const telegraphRadius = e.type === 'bomber' && e.fuse > 0
    ? 96
    : r * (1.12 + .12 * Math.sin(game.time * 10));
  ctx.arc(0, 0, telegraphRadius, 0, Math.PI * 2);
  ctx.stroke();
  if (q >= 1 && e.dashWindup > 0) {
    const a = Math.atan2(e.dashNy || e.facingY || 0, e.dashNx || e.facingX || 1);
    ctx.rotate(a);
    ctx.strokeStyle = '#ffe59a';
    ctx.beginPath(); ctx.moveTo(r * .65, 0); ctx.lineTo(r * 2.2, 0); ctx.stroke();
  }
  ctx.restore();
}

export function drawEnemyVisual(ctx, game, e) {
  const r = e.visualSize || e.size || 18;
  if (!visible(game, e.x, e.y, r * 1.7 + 20)) return;
  const s = screen(game, e.x, e.y);
  const q = quality(game);
  const t = e.animTime || game.time;
  const facing = Math.atan2(e.facingY || 0, e.facingX || 1);
  const bob = Math.sin(t * 6) * Math.min(2.2, r * .08);
  const hurt = e.hitFlash > 0;

  drawTelegraph(ctx, game, e, s);

  // Soft ground shadow gives enemies depth without changing their real hitbox.
  ctx.save();
  ctx.globalAlpha = .22;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(s.x + 3, s.y + r * .52, r * .72, Math.max(4, r * .23), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(s.x, s.y + bob);
  if (hurt) ctx.globalAlpha = .72;

  switch (e.type) {
    case 'slime': {
      const wob = 1 + Math.sin(t * 7) * .08;
      ctx.scale(wob, 2 - wob);
      ctx.fillStyle = hurt ? '#fff' : '#67c86d';
      ctx.beginPath(); ctx.ellipse(0, 2, r, r * .72, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#b8ef97';
      ctx.beginPath(); ctx.ellipse(-r * .3, -r * .18, r * .25, r * .16, -.35, 0, Math.PI * 2); ctx.fill();
      drawEyes(ctx, -r * .25, r * .25, 0, '#15301d');
      break;
    }
    case 'goblin': {
      ctx.rotate(facing * .12);
      ctx.fillStyle = hurt ? '#fff' : '#6f9c37';
      ctx.beginPath(); ctx.ellipse(0, 3, r * .58, r * .78, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = hurt ? '#fff' : '#9ad14b';
      ctx.beginPath(); ctx.arc(0, -r * .58, r * .48, 0, Math.PI * 2); ctx.fill();
      poly(ctx, [[-r*.42,-r*.62],[-r*.95,-r*.84],[-r*.48,-r*.25]]); ctx.fill();
      poly(ctx, [[r*.42,-r*.62],[r*.95,-r*.84],[r*.48,-r*.25]]); ctx.fill();
      drawEyes(ctx, -r*.18, r*.18, -r*.62, '#f7f3b1');
      ctx.strokeStyle = '#d9d0b7'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(r*.45, 0); ctx.lineTo(r*1.05, -r*.32); ctx.stroke();
      break;
    }
    case 'skeleton': {
      ctx.strokeStyle = hurt ? '#fff' : '#ded8bf'; ctx.fillStyle = ctx.strokeStyle; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.arc(0, -r*.52, r*.35, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#2d2c29'; drawEyes(ctx, -r*.11, r*.11, -r*.55, '#2d2c29');
      ctx.strokeStyle = hurt ? '#fff' : '#ded8bf';
      ctx.beginPath(); ctx.moveTo(0,-r*.15); ctx.lineTo(0,r*.55); ctx.moveTo(-r*.42,0); ctx.lineTo(r*.42,0); ctx.moveTo(0,r*.55); ctx.lineTo(-r*.35,r*.95); ctx.moveTo(0,r*.55); ctx.lineTo(r*.35,r*.95); ctx.stroke();
      for (let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-r*.28,-r*.02+i*5);ctx.lineTo(r*.28,-r*.02+i*5);ctx.stroke();}
      break;
    }
    case 'bat': {
      const flap = Math.sin(t * 13) * .45;
      ctx.fillStyle = hurt ? '#fff' : '#8b5fc7';
      ctx.beginPath(); ctx.ellipse(0, 1, r*.42, r*.62, 0, 0, Math.PI*2); ctx.fill();
      ctx.save(); ctx.rotate(flap);
      poly(ctx, [[-r*.25,-2],[-r*1.2,-r*.7],[-r*.85,r*.2],[-r*1.3,r*.52],[-r*.22,r*.28]]); ctx.fill(); ctx.restore();
      ctx.save(); ctx.rotate(-flap);
      poly(ctx, [[r*.25,-2],[r*1.2,-r*.7],[r*.85,r*.2],[r*1.3,r*.52],[r*.22,r*.28]]); ctx.fill(); ctx.restore();
      ctx.fillStyle='#eaa4ff'; drawEyes(ctx,-3,3,-r*.18,'#eaa4ff');
      break;
    }
    case 'orc': {
      ctx.fillStyle = hurt ? '#fff' : '#587a36';
      ctx.beginPath(); ctx.ellipse(0, 2, r*.78, r*.88, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#405d2c';
      ctx.fillRect(-r*.88,-r*.35,r*.38,r*.72); ctx.fillRect(r*.50,-r*.35,r*.38,r*.72);
      ctx.fillStyle = hurt ? '#fff' : '#719744';
      ctx.beginPath(); ctx.arc(0,-r*.6,r*.48,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#eee0b4'; poly(ctx,[[-r*.25,-r*.38],[-r*.12,-r*.04],[-r*.02,-r*.4]]); ctx.fill(); poly(ctx,[[r*.25,-r*.38],[r*.12,-r*.04],[r*.02,-r*.4]]); ctx.fill();
      drawEyes(ctx,-r*.17,r*.17,-r*.66,'#f3d66d');
      break;
    }
    case 'darkMage': {
      glow(ctx,q,'#8e56cc',12);
      ctx.fillStyle = hurt ? '#fff' : '#3e2857';
      poly(ctx,[[-r*.6,r*.85],[r*.6,r*.85],[r*.38,-r*.25],[0,-r*.9],[-r*.38,-r*.25]]); ctx.fill();
      ctx.fillStyle = '#130f1a'; ctx.beginPath(); ctx.arc(0,-r*.42,r*.28,0,Math.PI*2); ctx.fill();
      drawEyes(ctx,-r*.09,r*.09,-r*.44,'#c993ff');
      ctx.strokeStyle='#7953b8'; ctx.lineWidth=3; ctx.beginPath();ctx.moveTo(r*.52,-r*.2);ctx.lineTo(r*.85,r*.78);ctx.stroke();
      ctx.strokeStyle='#b07cff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(r*.52,-r*.3,5+Math.sin(t*5)*2,0,Math.PI*2);ctx.stroke();
      break;
    }
    case 'boneArcher': {
      ctx.strokeStyle = hurt ? '#fff' : '#c9c18c'; ctx.fillStyle=ctx.strokeStyle; ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(0,-r*.5,r*.31,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(0,-r*.15);ctx.lineTo(0,r*.65);ctx.moveTo(-r*.35,0);ctx.lineTo(r*.33,0);ctx.moveTo(0,r*.65);ctx.lineTo(-r*.28,r*.95);ctx.moveTo(0,r*.65);ctx.lineTo(r*.28,r*.95);ctx.stroke();
      ctx.strokeStyle='#8b623b';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(r*.42,0,r*.56,-Math.PI/2,Math.PI/2);ctx.stroke();ctx.beginPath();ctx.moveTo(r*.42,-r*.56);ctx.lineTo(r*.42,r*.56);ctx.stroke();
      break;
    }
    case 'bomber': {
      const pulse = 1 + ((e.fuse > 0 ? .13 : .05) * Math.sin(t*12));
      ctx.scale(pulse,pulse);
      glow(ctx,q,'#ff6c48',e.fuse>0?16:7);
      ctx.fillStyle = hurt ? '#fff' : '#8d3c34';
      ctx.beginPath();ctx.ellipse(0,3,r*.78,r*.92,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#ff8b5c';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(-r*.35,-r*.6);ctx.lineTo(-r*.12,-r*.18);ctx.lineTo(-r*.32,r*.22);ctx.moveTo(r*.28,-r*.48);ctx.lineTo(r*.08,-r*.05);ctx.lineTo(r*.37,r*.4);ctx.stroke();
      ctx.fillStyle='#ffcf6a';drawEyes(ctx,-r*.18,r*.18,-r*.22,'#ffcf6a');
      break;
    }
    case 'summoner': {
      glow(ctx,q,'#b76ae3',10);
      ctx.fillStyle = hurt ? '#fff' : '#4d285f';
      poly(ctx,[[-r*.7,r],[r*.7,r],[r*.45,-r*.18],[0,-r*.82],[-r*.45,-r*.18]]);ctx.fill();
      ctx.fillStyle='#160d1e';ctx.beginPath();ctx.arc(0,-r*.4,r*.28,0,Math.PI*2);ctx.fill();
      drawEyes(ctx,-r*.1,r*.1,-r*.42,'#e7a5ff');
      if(q>=1){ctx.strokeStyle='#d797ff';ctx.lineWidth=1.3;for(let i=0;i<3;i++){const a=t*.6+i*Math.PI*2/3;ctx.beginPath();ctx.arc(Math.cos(a)*r*.72,Math.sin(a)*r*.32+4,3,0,Math.PI*2);ctx.stroke();}}
      break;
    }
    case 'stoneGolem': {
      ctx.fillStyle = hurt ? '#fff' : '#776f62';
      poly(ctx,[[-r*.72,-r*.55],[-r*.95,r*.35],[-r*.5,r*.9],[r*.5,r*.9],[r*.95,r*.35],[r*.7,-r*.58],[r*.25,-r*.82],[-r*.28,-r*.82]]);ctx.fill();
      ctx.fillStyle='#968b7b';ctx.fillRect(-r*1.02,-r*.2,r*.36,r*.72);ctx.fillRect(r*.66,-r*.2,r*.36,r*.72);
      ctx.strokeStyle='#c59a65';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.25,-r*.45);ctx.lineTo(-r*.05,-r*.1);ctx.lineTo(-r*.18,r*.28);ctx.moveTo(r*.28,-r*.38);ctx.lineTo(r*.05,-r*.02);ctx.lineTo(r*.24,r*.36);ctx.stroke();
      drawEyes(ctx,-r*.18,r*.18,-r*.32,'#e7bd72');
      break;
    }
    case 'ogreBoss': {
      ctx.fillStyle=hurt?'#fff':'#7f4931';ctx.beginPath();ctx.ellipse(0,4,r*.82,r*.92,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#9d6545';ctx.beginPath();ctx.arc(0,-r*.6,r*.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#d6b28c';poly(ctx,[[-r*.34,-r*.88],[-r*.75,-r*1.25],[-r*.15,-r*.98]]);ctx.fill();poly(ctx,[[r*.34,-r*.88],[r*.75,-r*1.25],[r*.15,-r*.98]]);ctx.fill();
      ctx.strokeStyle='#574235';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(r*.56,-r*.15);ctx.lineTo(r*1.12,r*.75);ctx.stroke();
      break;
    }
    case 'lichBoss': {
      glow(ctx,q,'#9a73d6',16);
      ctx.fillStyle=hurt?'#fff':'#2e2141';poly(ctx,[[-r*.7,r],[r*.7,r],[r*.4,-r*.15],[0,-r*.85],[-r*.4,-r*.15]]);ctx.fill();
      ctx.fillStyle='#d6d0bd';ctx.beginPath();ctx.arc(0,-r*.45,r*.32,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#201b22';drawEyes(ctx,-r*.11,r*.11,-r*.49,'#c684ff');
      ctx.strokeStyle='#d7b867';ctx.lineWidth=2;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*r*.18,-r*.72);ctx.lineTo(i*r*.22,-r*1.05);ctx.stroke();}
      ctx.strokeStyle='#8c6bc0';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(r*.55,-r*.35);ctx.lineTo(r*.85,r*.72);ctx.stroke();
      break;
    }
    case 'wardenBoss': {
      glow(ctx,q,'#70d8ff',12);
      ctx.fillStyle=hurt?'#fff':'#435a60';poly(ctx,[[-r*.55,-r*.72],[-r*.9,-r*.18],[-r*.72,r*.75],[0,r],[r*.72,r*.75],[r*.9,-r*.18],[r*.55,-r*.72],[0,-r*.95]]);ctx.fill();
      ctx.fillStyle='#62b5c9';poly(ctx,[[0,-r*.48],[r*.22,-r*.1],[0,r*.26],[-r*.22,-r*.1]]);ctx.fill();
      ctx.strokeStyle='#a9edf5';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*.82,0,Math.PI*2);ctx.stroke();
      break;
    }
    case 'beastBoss': {
      ctx.rotate(facing);
      ctx.fillStyle=hurt?'#fff':'#8e2e3c';ctx.beginPath();ctx.ellipse(0,0,r*.9,r*.58,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(r*.62,-r*.18,r*.42,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#e0b1a0';poly(ctx,[[r*.72,-r*.47],[r*1.18,-r*.88],[r*.93,-r*.34]]);ctx.fill();poly(ctx,[[r*.5,-r*.48],[r*.62,-r*.95],[r*.72,-r*.38]]);ctx.fill();
      ctx.strokeStyle='#6f2130';ctx.lineWidth=5;for(const yy of [-.35,.35]){ctx.beginPath();ctx.moveTo(-r*.4,r*yy);ctx.lineTo(-r*.72,r*(yy+.25));ctx.moveTo(r*.25,r*yy);ctx.lineTo(r*.05,r*(yy+.4));ctx.stroke();}
      break;
    }
    case 'finalBoss': {
      glow(ctx,q,'#ff72e8',18);
      ctx.fillStyle=hurt?'#fff':'#4b234f';poly(ctx,[[-r*.62,-r*.65],[-r*.9,0],[-r*.72,r*.78],[0,r],[r*.72,r*.78],[r*.9,0],[r*.62,-r*.65],[0,-r]]);ctx.fill();
      ctx.fillStyle='#7d315f';ctx.fillRect(-r*.92,-r*.15,r*.32,r*.72);ctx.fillRect(r*.60,-r*.15,r*.32,r*.72);
      ctx.fillStyle='#ff72e8';ctx.beginPath();ctx.arc(0,-r*.12,r*.2,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#ef94ff';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,-r*.12,r*.42,t*.4,t*.4+Math.PI*1.55);ctx.stroke();
      ctx.strokeStyle='#b56ed0';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-r*.35,-r*.72);ctx.lineTo(-r*.7,-r*1.18);ctx.moveTo(r*.35,-r*.72);ctx.lineTo(r*.7,-r*1.18);ctx.stroke();
      break;
    }
    default: {
      ctx.fillStyle = hurt ? '#fff' : (e.color || '#aaa');
      ctx.beginPath();ctx.ellipse(0,0,r*.7,r*.85,0,0,Math.PI*2);ctx.fill();
      drawEyes(ctx,-3,3,-4,'#fff');
    }
  }

  if (e.attackAnim > 0 && q >= 1) {
    ctx.globalAlpha = Math.min(.75, e.attackAnim * 3);
    ctx.strokeStyle = '#fff2a6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.02, 0, Math.PI * 2); ctx.stroke();
  }

  ctx.restore();
  drawEliteDetails(ctx, game, e, s);
}

export function drawEnemyProjectileVisual(ctx, game, p) {
  const visualR = p.visualR || p.r || 7;
  if (!visible(game, p.x, p.y, visualR + 12)) return;
  const s = screen(game, p.x, p.y);
  const a = Math.atan2(p.vy || 0, p.vx || 1);
  const q = quality(game);
  ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(a);

  switch (p.style) {
    case 'boneArrow':
      ctx.strokeStyle='#d8d0ae';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-11,0);ctx.lineTo(8,0);ctx.stroke();ctx.fillStyle='#e8e0c8';poly(ctx,[[13,0],[6,-4],[6,4]]);ctx.fill();
      break;
    case 'shadowShard':
      glow(ctx,q,'#b07cff',8);ctx.fillStyle='#8f62c7';poly(ctx,[[12,0],[0,-5],[-9,0],[0,5]]);ctx.fill();ctx.strokeStyle='#d2a8ff';ctx.stroke();
      break;
    case 'lichBolt':
      glow(ctx,q,'#c684ff',10);ctx.strokeStyle='#dca9ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-9,0);ctx.quadraticCurveTo(0,-6,10,0);ctx.stroke();ctx.beginPath();ctx.moveTo(-5,4);ctx.lineTo(3,-3);ctx.lineTo(8,4);ctx.stroke();
      break;
    case 'wardenShard':
      ctx.fillStyle='#7ed8e8';poly(ctx,[[13,0],[2,-5],[-10,0],[2,5]]);ctx.fill();ctx.strokeStyle='#d0fbff';ctx.stroke();
      break;
    case 'beastSpine':
      ctx.fillStyle='#d36a75';poly(ctx,[[14,0],[0,-4],[-11,-2],[-6,2],[0,4]]);ctx.fill();
      break;
    case 'titanRune':
      glow(ctx,q,'#ff72e8',11);ctx.strokeStyle='#ff9df0';ctx.lineWidth=2;poly(ctx,[[11,0],[0,-10],[-11,0],[0,10]]);ctx.stroke();ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.stroke();
      break;
    default:
      ctx.fillStyle='#e95d93';poly(ctx,[[10,0],[0,-5],[-8,0],[0,5]]);ctx.fill();
  }
  ctx.restore();
}

export function drawEnemyDeathVisual(ctx, game, d) {
  if (!visible(game, d.x, d.y, (d.visualSize || 20) * 2)) return;
  const s = screen(game, d.x, d.y);
  const life = Math.max(0, d.life / d.maxLife);
  const q = quality(game);
  const r = d.visualSize || 20;
  ctx.save();ctx.translate(s.x,s.y);ctx.globalAlpha=life;

  if (d.type === 'skeleton' || d.type === 'boneArcher' || d.type === 'lichBoss') {
    ctx.strokeStyle='#ded8bf';ctx.lineWidth=2;
    for(let i=0;i<6;i++){const a=i*Math.PI*2/6;ctx.beginPath();ctx.moveTo(Math.cos(a)*5,Math.sin(a)*5);ctx.lineTo(Math.cos(a)*r*(1.3-life*.35),Math.sin(a)*r*(1.3-life*.35));ctx.stroke();}
  } else if (d.type === 'stoneGolem' || d.type === 'wardenBoss') {
    ctx.fillStyle=d.color||'#8b8170';
    for(let i=0;i<6;i++){const a=i*Math.PI*2/6;ctx.save();ctx.translate(Math.cos(a)*r*(1-life)*1.2,Math.sin(a)*r*(1-life)*1.2);ctx.rotate(a);poly(ctx,[[-5,-4],[5,-3],[7,4],[-4,6]]);ctx.fill();ctx.restore();}
  } else if (d.type === 'bomber') {
    glow(ctx,q,'#ff7448',14);ctx.strokeStyle='#ff8b5c';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*(1.1+(1-life)*1.4),0,Math.PI*2);ctx.stroke();
  } else {
    ctx.fillStyle=d.color||'#999';
    const count=q===0?4:7;
    for(let i=0;i<count;i++){const a=i*Math.PI*2/count+.4;ctx.beginPath();ctx.arc(Math.cos(a)*r*(1-life)*1.5,Math.sin(a)*r*(1-life)*1.5,Math.max(1.5,r*.12*life),0,Math.PI*2);ctx.fill();}
  }
  ctx.restore();
}
