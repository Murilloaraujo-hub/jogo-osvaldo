function quality(game) {
  const q = Number(game?.save?.data?.settings?.quality ?? 1);
  return Math.max(0, Math.min(2, q));
}

function screen(game, x, y) {
  return game.camera.worldToScreen(x, y);
}

function visible(game, x, y, r = 30) {
  return game.camera.visible(x, y, r);
}

function rotatePoint(x, y, angle) {
  const c = Math.cos(angle), s = Math.sin(angle);
  return { x: x * c - y * s, y: x * s + y * c };
}

function pathPolygon(ctx, pts) {
  if (!pts.length) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

function runeDiamond(ctx, x, y, r, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r * .72, 0);
  ctx.lineTo(0, r);
  ctx.lineTo(-r * .72, 0);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function withGlow(ctx, q, color, amount = 10) {
  if (q >= 1) {
    ctx.shadowColor = color;
    ctx.shadowBlur = q === 2 ? amount : amount * .55;
  }
}

export function drawProjectileVisual(ctx, game, p) {
  if (!visible(game, p.x, p.y, Math.max(30, p.r || 10))) return;
  const s = screen(game, p.x, p.y);
  const angle = Math.atan2(p.vy || 0, p.vx || 1);
  const q = quality(game);
  const t = game.time || 0;
  const color = game.colorFor(p.element);

  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(angle);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (p.id) {
    case 'fireball': {
      withGlow(ctx, q, '#ff6b38', 13);
      const r = Math.max(10, Math.min(19, (p.r || 10) * 1.15));
      ctx.fillStyle = '#ff8c42';
      ctx.beginPath();
      ctx.moveTo(r * .9, 0);
      ctx.quadraticCurveTo(r * .25, -r * .9, -r * .45, -r * .55);
      ctx.lineTo(-r * 1.65, -r * .15);
      ctx.lineTo(-r * .7, 0);
      ctx.lineTo(-r * 1.8, r * .35);
      ctx.quadraticCurveTo(r * .15, r * .95, r * .9, 0);
      ctx.fill();
      ctx.fillStyle = '#ffd56a';
      ctx.beginPath(); ctx.ellipse(r * .1, 0, r * .62, r * .48, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff0aa';
      ctx.beginPath(); ctx.ellipse(r * .24, -r * .08, r * .25, r * .18, 0, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'infernalSun': {
      const r = Math.max(15, Math.min(26, p.r || 18));
      withGlow(ctx, q, '#ff4e2f', 18);
      ctx.strokeStyle = '#ffb54a';
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4 + t * 1.8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05);
        ctx.lineTo(Math.cos(a) * r * 1.55, Math.sin(a) * r * 1.55);
        ctx.stroke();
      }
      ctx.fillStyle = '#ff5d30';
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd45b';
      ctx.beginPath(); ctx.arc(0, 0, r * .65, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff0a5';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.45, r * .52, t * 2.3, 0, Math.PI * 2); ctx.stroke();
      break;
    }
    case 'arrow': {
      const len = 32;
      ctx.strokeStyle = '#e8dcc2'; ctx.lineWidth = 2.3;
      ctx.beginPath(); ctx.moveTo(-len * .65, 0); ctx.lineTo(len * .55, 0); ctx.stroke();
      ctx.fillStyle = '#d7c497';
      pathPolygon(ctx, [[len * .55, 0], [len * .24, -5], [len * .24, 5]]); ctx.fill();
      ctx.strokeStyle = '#a7d6c5'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-len * .6, 0); ctx.lineTo(-len * .88, -5); ctx.moveTo(-len * .6, 0); ctx.lineTo(-len * .88, 5); ctx.stroke();
      break;
    }
    case 'ice': {
      const len = 31, w = 8;
      withGlow(ctx, q, '#8be9ff', 10);
      ctx.fillStyle = '#8fe9ff';
      pathPolygon(ctx, [[len * .7, 0], [-len * .15, -w], [-len * .65, 0], [-len * .15, w]]); ctx.fill();
      ctx.strokeStyle = '#e8fbff'; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.strokeStyle = '#d9faff';
      ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(10, -2); ctx.moveTo(-2, 3); ctx.lineTo(8, 1); ctx.stroke();
      break;
    }
    case 'axe': {
      ctx.rotate(t * 8.5);
      ctx.strokeStyle = '#8c5a36'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(13, 0); ctx.stroke();
      ctx.fillStyle = '#d8d5cb';
      pathPolygon(ctx, [[6, -2], [15, -11], [21, -8], [16, 0], [21, 8], [15, 11], [6, 2]]); ctx.fill();
      ctx.strokeStyle = '#f5ead2'; ctx.lineWidth = 1; ctx.stroke();
      break;
    }
    case 'boomerang': {
      ctx.rotate(t * 7);
      ctx.strokeStyle = '#f0dfbd'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-12, -9); ctx.quadraticCurveTo(2, -1, 13, -10); ctx.moveTo(-12, -9); ctx.quadraticCurveTo(-3, 3, -9, 13); ctx.stroke();
      ctx.strokeStyle = '#8fcfbb'; ctx.lineWidth = 1.4; ctx.stroke();
      break;
    }
    case 'poison': {
      withGlow(ctx, q, '#7bd95d', 8);
      ctx.fillStyle = '#79cf55';
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.bezierCurveTo(3, -9, -10, -7, -13, 0);
      ctx.bezierCurveTo(-9, 9, 5, 10, 12, 0);
      ctx.fill();
      ctx.fillStyle = '#c6f78a';
      ctx.beginPath(); ctx.arc(-2, -3, 2.2, 0, Math.PI * 2); ctx.arc(-6, 3, 1.5, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'holySpear': {
      withGlow(ctx, q, '#fff0a6', 10);
      ctx.strokeStyle = '#f4e5aa'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(15, 0); ctx.stroke();
      ctx.fillStyle = '#fff7cb'; pathPolygon(ctx, [[22, 0], [12, -6], [14, 0], [12, 6]]); ctx.fill();
      ctx.strokeStyle = '#e1b95f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-12, -5); ctx.lineTo(-12, 5); ctx.stroke();
      break;
    }
    case 'windBlade': {
      ctx.strokeStyle = '#b8fff0'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, 17, -1.05, 1.05); ctx.stroke();
      ctx.strokeStyle = '#6fd8c4'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(-3, 0, 12, -1.0, .9); ctx.stroke();
      break;
    }
    case 'shadowDagger': {
      withGlow(ctx, q, '#9f72e0', 7);
      ctx.fillStyle = '#d7c8f1';
      pathPolygon(ctx, [[18, 0], [2, -4], [-8, 0], [2, 4]]); ctx.fill();
      ctx.fillStyle = '#594177'; ctx.fillRect(-12, -3, 7, 6);
      ctx.strokeStyle = '#b28bdf'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-5, -6); ctx.lineTo(-5, 6); ctx.stroke();
      break;
    }
    case 'divineEye': {
      withGlow(ctx, q, '#fff3a4', 13);
      ctx.fillStyle = '#fff7d2';
      pathPolygon(ctx, [[20, 0], [2, -5], [-10, 0], [2, 5]]); ctx.fill();
      ctx.strokeStyle = '#f1c85c'; ctx.lineWidth = 1.7;
      ctx.beginPath(); ctx.ellipse(-1, 0, 10, 6, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#f7d661'; ctx.beginPath(); ctx.arc(-1, 0, 2.5, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case 'plasmaOrb': {
      withGlow(ctx, q, '#c56cff', 16);
      ctx.fillStyle = '#7ee8ff';
      ctx.beginPath(); ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#ffe45b'; ctx.lineWidth = 1.7;
      ctx.beginPath(); ctx.ellipse(0, 0, 19, 8, t * 4, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-18,-7); ctx.lineTo(-11,-2); ctx.lineTo(-18,4); ctx.stroke();
      break;
    }
    case 'infernalVolley': {
      withGlow(ctx, q, '#ff6b37', 9);
      ctx.strokeStyle='#5d3927';ctx.lineWidth=2.3;ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(13,0);ctx.stroke();
      ctx.fillStyle='#ffba55';pathPolygon(ctx,[[19,0],[10,-5],[10,5]]);ctx.fill();
      ctx.strokeStyle='#ff6b37';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-17,0);ctx.lineTo(-28,-4);ctx.stroke();
      break;
    }
    case 'thunderVolley': {
      ctx.strokeStyle='#e8dcc2';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(13,0);ctx.stroke();
      ctx.fillStyle='#fff09a';pathPolygon(ctx,[[19,0],[10,-5],[10,5]]);ctx.fill();
      ctx.strokeStyle='#ffe45b';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-14,-6);ctx.lineTo(-8,-2);ctx.lineTo(-14,3);ctx.lineTo(-7,7);ctx.stroke();
      break;
    }
    case 'stormCleaver': {
      ctx.rotate(t*7.5); withGlow(ctx,q,'#ffe45b',10);
      ctx.strokeStyle='#6c4b39';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-13,0);ctx.lineTo(12,0);ctx.stroke();
      ctx.fillStyle='#dfe8e5';pathPolygon(ctx,[[5,-3],[15,-12],[22,-7],[16,0],[22,7],[15,12],[5,3]]);ctx.fill();
      ctx.strokeStyle='#ffe45b';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-8,-7);ctx.lineTo(-2,-2);ctx.lineTo(-7,3);ctx.stroke();
      break;
    }
    case 'celestialArray': {
      withGlow(ctx,q,'#fff0a6',11);
      ctx.strokeStyle='#fff0a6';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-20,0);ctx.lineTo(14,0);ctx.stroke();
      ctx.fillStyle='#fff8d8';pathPolygon(ctx,[[22,0],[11,-6],[13,0],[11,6]]);ctx.fill();
      ctx.strokeStyle='#ff72e8';ctx.lineWidth=1.2;runeDiamond(ctx,-6,0,5,t*2); break;
    }
    case 'arcaneSun': {
      withGlow(ctx,q,'#ff72e8',12);
      ctx.fillStyle='#ffd45b';pathPolygon(ctx,[[14,0],[5,-5],[0,-13],[-5,-5],[-14,0],[-5,5],[0,13],[5,5]]);ctx.fill();
      ctx.strokeStyle='#ff72e8';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.stroke(); break;
    }
    case 'blizzard':
    case 'glacialComet': {
      withGlow(ctx,q,'#8fe9ff',9);
      ctx.fillStyle='#a9f0ff';pathPolygon(ctx,[[18,0],[2,-7],[-14,0],[2,7]]);ctx.fill();
      ctx.strokeStyle='#effcff';ctx.lineWidth=1.2;ctx.stroke(); break;
    }

    case 'elementalBolt':
    case 'primalConvergence': { withGlow(ctx,q,color,11);ctx.fillStyle=color;pathPolygon(ctx,[[17,0],[3,-8],[-12,0],[3,8]]);ctx.fill();ctx.strokeStyle='#ffffffcc';ctx.lineWidth=1.2;ctx.stroke();ctx.strokeStyle='#ff72e8';ctx.beginPath();ctx.arc(0,0,10,t*2,t*2+Math.PI*1.4);ctx.stroke();break; }
    case 'familiar':
    case 'eidolonPrime':
    case 'arcaneDrone':
    case 'runicOverseer': { withGlow(ctx,q,'#9ff5ff',9);ctx.fillStyle='#8fe9ff';pathPolygon(ctx,[[12,0],[2,-6],[-8,0],[2,6]]);ctx.fill();ctx.strokeStyle='#ff72e8';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.stroke();break; }
    default: {
      // Fragmento arcano: fallback intencionalmente não circular.
      withGlow(ctx, q, color, 8);
      ctx.fillStyle = color;
      pathPolygon(ctx, [[15, 0], [0, -7], [-11, 0], [0, 7]]); ctx.fill();
      ctx.strokeStyle = '#ffffffaa'; ctx.lineWidth = 1; ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

export function drawOrbitVisual(ctx, game, o) {
  if (!visible(game, o.x, o.y, (o.r || 10) + 16)) return;
  const s = screen(game, o.x, o.y);
  const q = quality(game);
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate((o.angle || 0) + Math.PI / 2);
  if (o.id === 'phantomBlades') {
    withGlow(ctx,q,'#b07cff',9); ctx.fillStyle='#d7c8f1';
    pathPolygon(ctx,[[14,0],[1,-4],[-10,0],[1,4]]);ctx.fill();ctx.strokeStyle='#7651a8';ctx.stroke();ctx.restore();return;
  }
  if (o.id === 'thunderRing') {
    withGlow(ctx,q,'#ffe45b',10);ctx.strokeStyle='#ffe45b';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(0,0,11,-2.4,-.25);ctx.arc(0,0,11,.75,2.8);ctx.stroke();ctx.restore();return;
  }
  const evolved = o.id === 'eternalBulwark';
  withGlow(ctx, q, evolved ? '#fff0a6' : '#d8e3de', evolved ? 12 : 6);
  ctx.fillStyle = evolved ? '#d7bd65' : '#bac9c4';
  pathPolygon(ctx, [[0, -13], [10, -7], [9, 6], [0, 14], [-9, 6], [-10, -7]]); ctx.fill();
  ctx.strokeStyle = evolved ? '#fff3b5' : '#f1f6f3'; ctx.lineWidth = 1.6; ctx.stroke();
  ctx.strokeStyle = evolved ? '#fff0a6' : '#718c83';
  ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 8); ctx.moveTo(-5, -2); ctx.lineTo(5, -2); ctx.stroke();
  if (evolved && q >= 1) {
    ctx.strokeStyle = '#fff0a688';
    ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

export function drawSummonVisual(ctx, game, summon) {
  if (!visible(game, summon.x, summon.y, summon.id === 'skeletonColossus' ? 55 : 24)) return;
  const s = screen(game, summon.x, summon.y);
  const q = quality(game);
  const scale = summon.id === 'revenant' ? .8 : summon.id === 'skeletonColossus' ? 2.25 : ['cursedLegion','undeadConductor','burningLegion','plagueLegion'].includes(summon.id) ? 1.15 : summon.companion ? .9 : 1;
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.scale(scale, scale);
  const summonColor = summon.variant === 'fire' ? '#ff8b46' : summon.variant === 'poison' ? '#91dc61' : summon.electric ? '#ffe45b' : '#d8d0ae';
  if (summon.electric || summon.variant) withGlow(ctx, q, summonColor, 10);
  ctx.strokeStyle = summonColor;
  ctx.fillStyle = summonColor;
  ctx.lineWidth = 2;
  // crânio
  ctx.beginPath(); ctx.arc(0, -7, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2b2922';
  ctx.beginPath(); ctx.arc(-2, -8, 1.2, 0, Math.PI * 2); ctx.arc(2, -8, 1.2, 0, Math.PI * 2); ctx.fill();
  // coluna e membros
  ctx.strokeStyle = summonColor;
  ctx.beginPath();
  ctx.moveTo(0, -1); ctx.lineTo(0, 10);
  ctx.moveTo(-7, 2); ctx.lineTo(7, 2);
  ctx.moveTo(0, 10); ctx.lineTo(-6, 17);
  ctx.moveTo(0, 10); ctx.lineTo(6, 17);
  ctx.stroke();
  if (summon.id === 'skeletonColossus') { ctx.strokeStyle='#b07cff';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,-7,12,Math.PI,Math.PI*2);ctx.stroke();ctx.strokeStyle='#8b6e50';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(18,18);ctx.stroke(); }
  if (summon.companion && summon.id !== 'skeletonColossus') { ctx.fillStyle=summon.id.includes('Drone')||summon.id.includes('drone')?'#7cf5ee':'#d6c6ff';ctx.beginPath();ctx.arc(0,2,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffffffaa';ctx.beginPath();ctx.arc(0,2,9,0,Math.PI*2);ctx.stroke(); }
  if (summon.id === 'cursedLegion') {
    ctx.strokeStyle = '#b07cff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, -7, 10, Math.PI, Math.PI * 2); ctx.stroke();
  }
  if (summon.electric && q >= 1) {
    ctx.strokeStyle = '#fff7af'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-5, -4); ctx.lineTo(-2, 1); ctx.moveTo(7, 5); ctx.lineTo(10, 1); ctx.lineTo(12, 5); ctx.stroke();
  }
  if (summon.variant === 'fire') {
    ctx.fillStyle='#ff5b2e88';ctx.beginPath();ctx.moveTo(-7,16);ctx.lineTo(-2,8);ctx.lineTo(1,16);ctx.lineTo(6,8);ctx.lineTo(8,17);ctx.fill();
  } else if (summon.variant === 'poison') {
    ctx.fillStyle='#7bd95d88';ctx.beginPath();ctx.arc(-8,8,3,0,Math.PI*2);ctx.arc(8,5,2.5,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

export function drawMeteorVisual(ctx, game, m) {
  if (!visible(game, m.x, m.y, (m.r || 60) + 100)) return;
  const s = screen(game, m.x, m.y);
  const q = quality(game);
  const warning = Math.max(0, Math.min(1, m.t / .65));
  ctx.save();
  ctx.translate(s.x, s.y);

  if (m.sourceId === 'stoneSpike') {
    ctx.strokeStyle = '#c59a65'; ctx.lineWidth = 2;
    ctx.globalAlpha = .35 + (1 - warning) * .5;
    ctx.beginPath(); ctx.arc(0, 0, m.r * .58, 0, Math.PI * 2); ctx.stroke();
    if (m.t <= 0) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#8c755c';
      for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        ctx.save(); ctx.rotate(a);
        pathPolygon(ctx, [[0, -4], [7, -24], [12, 0], [0, 4]]); ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
    return;
  }

  if (m.sourceId === 'glacialComet' || m.sourceId === 'frozenSpires') {
    ctx.strokeStyle='#9beeff';ctx.lineWidth=2.4;ctx.globalAlpha=.45+(1-warning)*.45;
    ctx.beginPath();ctx.arc(0,0,m.r*.64,0,Math.PI*2);ctx.stroke();
    if(m.t>0){
      const fall=warning*100;ctx.translate(-fall*.28,-fall);withGlow(ctx,q,'#9beeff',12);
      ctx.fillStyle='#bdf5ff';pathPolygon(ctx,[[0,-17],[12,5],[3,14],[-11,7],[-13,-4]]);ctx.fill();
      ctx.strokeStyle='#effcff';ctx.lineWidth=1.2;ctx.stroke();
    }
    ctx.restore();return;
  }

  if (m.sourceId === 'apocalypseRain') {
    ctx.strokeStyle='#ffb04f';ctx.lineWidth=3;ctx.globalAlpha=.5+(1-warning)*.4;
    ctx.beginPath();ctx.arc(0,0,m.r*.68,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<4;i++){const a=i*Math.PI/2;ctx.beginPath();ctx.moveTo(Math.cos(a)*m.r*.25,Math.sin(a)*m.r*.25);ctx.lineTo(Math.cos(a)*m.r*.58,Math.sin(a)*m.r*.58);ctx.stroke();}
    if(m.t>0){const fall=warning*105;ctx.translate(-fall*.35,-fall);withGlow(ctx,q,'#ff5b2e',15);ctx.fillStyle='#6d4030';ctx.beginPath();ctx.arc(0,0,12,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff6b37';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-8,-7);ctx.lineTo(-30,-30);ctx.stroke();}
    ctx.restore();return;
  }

  if (m.sourceId === 'volcanicEruption') {
    ctx.strokeStyle = '#ff6b37'; ctx.lineWidth = 2.5;
    ctx.globalAlpha = .45 + (1 - warning) * .45;
    ctx.beginPath(); ctx.arc(0, 0, m.r * .72, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = i * Math.PI * 2 / 7;
      ctx.moveTo(Math.cos(a) * 12, Math.sin(a) * 12);
      ctx.lineTo(Math.cos(a + .16) * m.r * .62, Math.sin(a + .16) * m.r * .62);
    }
    ctx.stroke();
    if (m.t <= 0) {
      withGlow(ctx, q, '#ff5b2e', 16);
      ctx.fillStyle = '#ff7138';
      ctx.beginPath(); ctx.moveTo(-18, 8); ctx.lineTo(-8, -34); ctx.lineTo(0, -8); ctx.lineTo(10, -42); ctx.lineTo(18, 8); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    return;
  }

  // Meteoro clássico: indicador no solo + rocha em chamas vindo de cima.
  ctx.strokeStyle = '#ff8a4a'; ctx.lineWidth = 2.5;
  ctx.globalAlpha = .35 + (1 - warning) * .55;
  ctx.beginPath(); ctx.arc(0, 0, m.r * .62, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-m.r * .45, 0); ctx.lineTo(m.r * .45, 0); ctx.moveTo(0, -m.r * .45); ctx.lineTo(0, m.r * .45); ctx.stroke();

  if (m.t > 0) {
    const fall = warning * 95;
    ctx.translate(-fall * .38, -fall);
    withGlow(ctx, q, '#ff6b37', 12);
    ctx.fillStyle = '#6f4d39';
    ctx.beginPath();
    ctx.moveTo(-9, -7); ctx.lineTo(4, -12); ctx.lineTo(12, -3); ctx.lineTo(8, 9); ctx.lineTo(-6, 11); ctx.lineTo(-12, 1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ff7a3b'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-9, -5); ctx.lineTo(-25, -22); ctx.stroke();
    if (q >= 1) {
      ctx.strokeStyle = '#ffd06a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-7, -1); ctx.lineTo(-30, -17); ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawLightningVisual(ctx, game, arc) {
  const p1 = screen(game, arc.x1, arc.y1);
  const p2 = screen(game, arc.x2, arc.y2);
  const q = quality(game);
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const d = Math.hypot(dx, dy) || 1;
  const nx = -dy / d, ny = dx / d;
  const segments = q === 2 ? 8 : q === 1 ? 6 : 4;
  ctx.save();
  ctx.globalAlpha = Math.min(1, arc.life / .12);
  withGlow(ctx, q, arc.color || '#ffe45b', 10);
  ctx.strokeStyle = arc.color || '#ffe45b';
  ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(p1.x, p1.y);
  for (let i = 1; i < segments; i++) {
    const u = i / segments;
    const jitter = (Math.random() - .5) * (q === 0 ? 8 : 14);
    ctx.lineTo(p1.x + dx * u + nx * jitter, p1.y + dy * u + ny * jitter);
  }
  ctx.lineTo(p2.x, p2.y); ctx.stroke();

  if (q >= 1) {
    ctx.lineWidth = 1;
    for (let i = 2; i < segments - 1; i += 2) {
      const u = i / segments;
      const bx = p1.x + dx * u, by = p1.y + dy * u;
      const side = i % 4 ? 1 : -1;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + nx * side * 12 + dx / d * 6, by + ny * side * 12 + dy / d * 6); ctx.stroke();
    }
  }
  ctx.restore();
}

export function drawParticleVisual(ctx, game, p) {
  if (!visible(game, p.x, p.y, 12)) return;
  const s = screen(game, p.x, p.y);
  const alpha = Math.max(0, Math.min(1, p.life / (p.maxLife || .6)));
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(p.rotation || 0);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = p.color || '#fff';
  ctx.fillStyle = p.color || '#fff';
  const r = p.r || 3;
  switch (p.kind) {
    case 'fire':
      ctx.fillRect(-r * .5, -r * 1.7, r, r * 2.4);
      break;
    case 'ice':
      pathPolygon(ctx, [[0, -r * 1.7], [r, 0], [0, r * 1.7], [-r, 0]]); ctx.fill();
      break;
    case 'electric':
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-r, -r); ctx.lineTo(0, 0); ctx.lineTo(-1, r); ctx.lineTo(r, r * .2); ctx.stroke();
      break;
    case 'poison':
      ctx.beginPath(); ctx.ellipse(0, 0, r * .8, r * 1.2, 0, 0, Math.PI * 2); ctx.fill();
      break;
    case 'shadow':
      ctx.globalAlpha *= .72; ctx.beginPath(); ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha *= .55; ctx.beginPath(); ctx.arc(r * .7, -r * .8, r * .7, 0, Math.PI * 2); ctx.fill();
      break;
    case 'arcane':
      ctx.lineWidth = 1.4; runeDiamond(ctx, 0, 0, r * 1.5, p.rotation || 0);
      break;
    case 'wind':
      ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-r * 2, 0); ctx.quadraticCurveTo(0, -r, r * 2, 0); ctx.stroke();
      break;
    case 'earth':
      pathPolygon(ctx, [[-r, r], [0, -r * 1.8], [r, r]]); ctx.fill();
      break;
    case 'physical':
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-r * 1.8, 0); ctx.lineTo(r * 1.8, 0); ctx.stroke();
      break;
    default:
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function drawPersistentAbilities(ctx, game) {
  const p = game.player;
  if (!p) return;
  const s = screen(game, p.x, p.y);
  const q = quality(game);
  const t = game.time || 0;
  const has = id => !!p.weapons[id];
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.lineCap = 'round';

  if (has('aura')) {
    const r = 102 * p.area;
    ctx.strokeStyle = '#bd79ff88'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r * (.86 + Math.sin(t * 3) * .025), 0, Math.PI * 2); ctx.stroke();
    if (q >= 1) {
      for (let i = 0; i < 6; i++) {
        const a = t * .8 + i * Math.PI / 3;
        ctx.save(); ctx.translate(Math.cos(a) * r * .72, Math.sin(a) * r * .72); ctx.rotate(a); runeDiamond(ctx, 0, 0, 5, a); ctx.restore();
      }
    }
  }

  if (has('deathAura')) {
    const r = 118 * p.area;
    ctx.strokeStyle = '#8f67c566'; ctx.lineWidth = 3;
    ctx.setLineDash([7, 9]); ctx.beginPath(); ctx.arc(0, 0, r * .9, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    const wisps = q === 2 ? 5 : 3;
    for (let i = 0; i < wisps; i++) {
      const a = -t * .55 + i * Math.PI * 2 / wisps;
      const rr = r * (.48 + .12 * Math.sin(t * 2 + i));
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      ctx.fillStyle = '#b995e055'; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d132a'; ctx.beginPath(); ctx.arc(x - 1.6, y - 1, 1, 0, Math.PI * 2); ctx.arc(x + 1.6, y - 1, 1, 0, Math.PI * 2); ctx.fill();
    }
  }

  if (has('frozenStorm')) {
    const r = 180 * p.area;
    ctx.strokeStyle = '#8fe9ff88'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, Math.PI * 2); ctx.stroke();
    const spikes = q === 0 ? 10 : q === 1 ? 14 : 18;
    for (let i = 0; i < spikes; i++) {
      const a = i * Math.PI * 2 / spikes + t * .12;
      const r1 = r * .68, r2 = r * (.76 + .025 * Math.sin(i * 2 + t * 4));
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); ctx.stroke();
    }
  }

  if (has('plagueGarden')) {
    const r = 175 * p.area;
    ctx.strokeStyle = '#6fcf5b66'; ctx.lineWidth = 2;
    const vines = q === 0 ? 3 : 5;
    for (let i = 0; i < vines; i++) {
      const a = i * Math.PI * 2 / vines + t * .08;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(Math.cos(a + .8) * r * .35, Math.sin(a + .8) * r * .35, Math.cos(a) * r * .78, Math.sin(a) * r * .78); ctx.stroke();
      ctx.fillStyle = '#80d96766'; ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * .55, Math.sin(a) * r * .55, 7, 3, a, 0, Math.PI * 2); ctx.fill();
    }
  }

  if (has('flameTornado')) {
    const r = 205 * p.area;
    withGlow(ctx, q, '#ff6b37', 12);
    ctx.strokeStyle = '#ff7d3d99'; ctx.lineWidth = 3;
    const arms = q === 2 ? 4 : 3;
    for (let arm = 0; arm < arms; arm++) {
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const u = i / 24;
        const a = t * 3.2 + arm * Math.PI * 2 / arms + u * Math.PI * 3.6;
        const rr = 15 + u * r * .72;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr * .45;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  if (has('toxicCorpses')) {
    const r = 188 * p.area;
    ctx.strokeStyle = '#89db5b55'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, Math.PI * 2); ctx.stroke();
    const count = q === 2 ? 6 : 4;
    for (let i = 0; i < count; i++) {
      const a = t * .35 + i * Math.PI * 2 / count;
      const rr = r * (.35 + .2 * ((i % 2) ? 1 : .7));
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      ctx.fillStyle = '#87d35b55'; ctx.beginPath(); ctx.arc(x, y, 8 + Math.sin(t * 4 + i) * 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#191d12'; ctx.beginPath(); ctx.arc(x - 2, y - 1, 1.2, 0, Math.PI * 2); ctx.arc(x + 2, y - 1, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  }

  ctx.restore();
}

export function drawAbilityEffect(ctx, game, e) {
  if (!visible(game, e.x, e.y, (e.radius || 80) + 30)) return;
  const s = screen(game, e.x, e.y);
  const life = Math.max(0, e.life || 0);
  const maxLife = Math.max(.001, e.maxLife || 1);
  const progress = 1 - life / maxLife;
  const fade = Math.max(0, life / maxLife);
  const q = quality(game);
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.globalAlpha = Math.min(1, fade * 1.35);

  switch (e.type) {

    case 'arcaneBeam': {
      const len=e.range||700;ctx.rotate(e.angle||0);withGlow(ctx,q,'#d98cff',12);ctx.strokeStyle='#d98cff';ctx.lineWidth=Math.max(4,e.radius||20);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(len,0);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();break;
    }
    case 'bloodNova': {
      const r=e.radius*(.35+progress*.65);ctx.strokeStyle='#ff5d76';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#7f2336';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.7,0,Math.PI*2);ctx.stroke();break;
    }
    case 'swordSlash': {
      ctx.rotate(e.angle || 0);
      ctx.strokeStyle = '#f0e4c6'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, e.radius * (.7 + progress * .3), -.9, .9); ctx.stroke();
      ctx.strokeStyle = '#72e1bd'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, e.radius * (.62 + progress * .3), -.8, .8); ctx.stroke();
      break;
    }
    case 'frostNova': {
      const r = e.radius * (.25 + progress * .75);
      ctx.strokeStyle = '#9befff'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      const spikes = q === 0 ? 10 : 16;
      for (let i = 0; i < spikes; i++) {
        const a = i * Math.PI * 2 / spikes;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .88, Math.sin(a) * r * .88); ctx.lineTo(Math.cos(a) * r * 1.08, Math.sin(a) * r * 1.08); ctx.stroke();
      }
      break;
    }
    case 'thornNova': {
      const r = e.radius * (.35 + progress * .65);
      ctx.fillStyle = '#7bd36f';
      const count = q === 0 ? 8 : 14;
      for (let i = 0; i < count; i++) {
        const a = i * Math.PI * 2 / count;
        ctx.save(); ctx.rotate(a); ctx.translate(r, 0);
        pathPolygon(ctx, [[10, 0], [-4, -4], [-4, 4]]); ctx.fill();
        ctx.restore();
      }
      break;
    }
    case 'fireExplosion':
    case 'thermalBlast':
    case 'volcanicBlast': {
      const r = e.radius * (.2 + progress * .8);
      withGlow(ctx, q, '#ff6b37', 16);
      ctx.strokeStyle = e.type === 'thermalBlast' ? '#ffb14d' : '#ff6b37'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      if (q >= 1) {
        ctx.strokeStyle = '#ffd36a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, r * .7, 0, Math.PI * 2); ctx.stroke();
      }
      break;
    }
    case 'iceShatter':
    case 'thermalFreeze': {
      const r = e.radius * (.3 + progress * .7);
      ctx.strokeStyle = '#9beeff'; ctx.lineWidth = 3;
      const spikes = q === 2 ? 14 : 9;
      for (let i = 0; i < spikes; i++) {
        const a = i * Math.PI * 2 / spikes;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * .35, Math.sin(a) * r * .35); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke();
      }
      break;
    }

    case 'thunderTelegraph': {
      const r=e.radius*(.75+.08*Math.sin(progress*20));ctx.strokeStyle='#ffe45b';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);break;
    }
    case 'thunderStrike': {
      const r=e.radius;withGlow(ctx,q,'#ffe45b',16);ctx.strokeStyle='#fff7b0';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-10,-260);ctx.lineTo(4,-180);ctx.lineTo(-5,-110);ctx.lineTo(5,-45);ctx.lineTo(0,0);ctx.stroke();ctx.strokeStyle='#ffe45b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*(.35+progress*.65),0,Math.PI*2);ctx.stroke();break;
    }
    case 'electricBurst': {
      const r=e.radius*(.25+progress*.65);withGlow(ctx,q,'#ffe45b',10);ctx.strokeStyle='#ffe45b';ctx.lineWidth=2.5;
      for(let i=0;i<7;i++){const a=i*Math.PI*2/7;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.2,Math.sin(a)*r*.2);ctx.lineTo(Math.cos(a+.16)*r,Math.sin(a+.16)*r);ctx.stroke();}break;
    }
    case 'poisonSplash': {
      const r = e.radius * (.35 + progress * .55);
      ctx.strokeStyle = '#88dc5b'; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        ctx.beginPath(); ctx.ellipse(Math.cos(a) * r, Math.sin(a) * r, 5 + i % 2 * 2, 8, a, 0, Math.PI * 2); ctx.stroke();
      }
      break;
    }
    case 'windImpact': {
      const r = e.radius * (.4 + progress * .6);
      ctx.strokeStyle = '#baffef'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, r, -1.2, 1.2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, r * .7, 1.9, 4.4); ctx.stroke();
      break;
    }
    case 'holyBurst': {
      const r = e.radius * (.35 + progress * .55);
      ctx.strokeStyle = '#fff0a6'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(0, 0, r * .65, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
      break;
    }
    case 'shadowBurst': {
      const r = e.radius * (.25 + progress * .7);
      ctx.strokeStyle = '#b07cff'; ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      break;
    }
    case 'flameVortex':
    case 'toxicVortex': {
      const r=e.radius*(.45+progress*.45);ctx.strokeStyle=e.type==='flameVortex'?'#ff7a3b':'#8bd95d';ctx.lineWidth=3;
      const arms=q===0?2:3;for(let k=0;k<arms;k++){ctx.beginPath();for(let i=0;i<18;i++){const u=i/17,a=progress*8+k*Math.PI*2/arms+u*Math.PI*3,rr=8+u*r;const x=Math.cos(a)*rr,y=Math.sin(a)*rr*.48;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}break;
    }
    case 'cryoStorm':
    case 'arcaneStorm': {
      const r=e.radius*(.55+progress*.35);ctx.strokeStyle=e.type==='cryoStorm'?'#9beeff':'#ff72e8';ctx.lineWidth=2;
      for(let i=0;i<8;i++){const a=i*Math.PI/4+progress;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.25,Math.sin(a)*r*.25);ctx.lineTo(Math.cos(a+.18)*r,Math.sin(a+.18)*r);ctx.stroke();}break;
    }
    case 'blizzard': {
      const r=e.radius*(.5+progress*.35);ctx.strokeStyle='#d7f8ff';ctx.lineWidth=2;
      for(let i=0;i<10;i++){const a=i*Math.PI/5+progress*2;const rr=r*(.35+.55*((i%3)/2));ctx.beginPath();ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);ctx.lineTo(Math.cos(a+.25)*(rr+15),Math.sin(a+.25)*(rr+15));ctx.stroke();}break;
    }
    case 'magneticField': {
      const r=e.radius*(.72+Math.sin(progress*10)*.05);ctx.strokeStyle='#ffe45b';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#72d9ff';ctx.beginPath();ctx.arc(0,0,r*.62,0,Math.PI*2);ctx.stroke();break;
    }
    case 'arcaneSun': {
      const r=e.radius*.32;withGlow(ctx,q,'#ff72e8',14);ctx.fillStyle='#ffd45b';ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#ff72e8';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,r*1.8,r*.58,progress*5,0,Math.PI*2);ctx.stroke();break;
    }
    case 'aegisBlade': {
      const r=e.radius*(.65+progress*.25);ctx.rotate(e.angle||0);ctx.strokeStyle='#fff0a6';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,r,-1.1,1.1);ctx.stroke();
      ctx.strokeStyle='#72e1bd';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.78,Math.PI*.1,Math.PI*1.9);ctx.stroke();break;
    }
    case 'celestialArray': {
      const r=e.radius*.75;ctx.strokeStyle='#fff0a6';ctx.lineWidth=2;for(let i=0;i<6;i++){const a=i*Math.PI/3+progress;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.25,Math.sin(a)*r*.25);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);ctx.stroke();}runeDiamond(ctx,0,0,r*.24,progress*3);break;
    }
    case 'briarTempest': {
      const r=e.radius*(.45+progress*.4);ctx.strokeStyle='#79d267';ctx.lineWidth=3;for(let i=0;i<6;i++){const a=i*Math.PI/3+progress*.7;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(a+.7)*r*.55,Math.sin(a+.7)*r*.55,Math.cos(a)*r,Math.sin(a)*r);ctx.stroke();}break;
    }
    case 'toxicCombustion': {
      const r=e.radius*(.25+progress*.65);ctx.strokeStyle='#ff9a42';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='#8bd95d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.62,0,Math.PI*2);ctx.stroke();break;
    }
    case 'fireGround':
    case 'frostGround': {
      const r=e.radius*(.7+progress*.2);ctx.globalAlpha*=.7;ctx.strokeStyle=e.type==='fireGround'?'#ff6b37':'#9beeff';ctx.lineWidth=3;ctx.setLineDash([6,7]);ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);break;
    }
    case 'physicalImpact': {
      ctx.strokeStyle = '#f0e4c6'; ctx.lineWidth = 2;
      const r = e.radius * (.5 + progress * .5);
      ctx.beginPath(); ctx.moveTo(-r, -r * .2); ctx.lineTo(r, r * .2); ctx.moveTo(-r * .4, r); ctx.lineTo(r * .3, -r); ctx.stroke();
      break;
    }
    default: {
      ctx.strokeStyle = e.color || '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, (e.radius || 30) * progress, 0, Math.PI * 2); ctx.stroke();
    }
  }
  ctx.restore();
}


export function drawSpellLighting(ctx, game) {
  if (quality(game) <= 0) return;
  const lights=[];
  for(const p of game.projectiles||[]){ if(['fire','electric','arcane','holy'].includes(p.element) && lights.length<10) lights.push({x:p.x,y:p.y,r:p.element==='fire'?55:42,c:game.colorFor(p.element)}); }
  for(const m of game.meteors||[]){ if(lights.length<12) lights.push({x:m.x,y:m.y,r:90,c:m.element==='ice'?'#70d8ff':'#ff7043'}); }
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.16;
  for(const l of lights){ if(!game.camera.visible(l.x,l.y,l.r))continue;const s=game.camera.worldToScreen(l.x,l.y),g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,l.r);g.addColorStop(0,l.c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(s.x,s.y,l.r,0,Math.PI*2);ctx.fill(); }
  ctx.restore();
}
