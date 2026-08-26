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
      const r = Math.max(8, Math.min(16, p.r || 10));
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
      const len = 26;
      ctx.strokeStyle = '#e8dcc2'; ctx.lineWidth = 2.3;
      ctx.beginPath(); ctx.moveTo(-len * .65, 0); ctx.lineTo(len * .55, 0); ctx.stroke();
      ctx.fillStyle = '#d7c497';
      pathPolygon(ctx, [[len * .55, 0], [len * .24, -5], [len * .24, 5]]); ctx.fill();
      ctx.strokeStyle = '#a7d6c5'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-len * .6, 0); ctx.lineTo(-len * .88, -5); ctx.moveTo(-len * .6, 0); ctx.lineTo(-len * .88, 5); ctx.stroke();
      break;
    }
    case 'ice': {
      const len = 24, w = 7;
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
  if (!visible(game, summon.x, summon.y, 24)) return;
  const s = screen(game, summon.x, summon.y);
  const q = quality(game);
  const scale = summon.id === 'revenant' ? .8 : summon.id === 'cursedLegion' ? 1.15 : 1;
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.scale(scale, scale);
  if (summon.electric) withGlow(ctx, q, '#ffe45b', 10);
  ctx.strokeStyle = summon.electric ? '#ffe45b' : '#d8d0ae';
  ctx.fillStyle = summon.electric ? '#fff0a0' : '#d8d0ae';
  ctx.lineWidth = 2;
  // crânio
  ctx.beginPath(); ctx.arc(0, -7, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2b2922';
  ctx.beginPath(); ctx.arc(-2, -8, 1.2, 0, Math.PI * 2); ctx.arc(2, -8, 1.2, 0, Math.PI * 2); ctx.fill();
  // coluna e membros
  ctx.strokeStyle = summon.electric ? '#ffe45b' : '#d8d0ae';
  ctx.beginPath();
  ctx.moveTo(0, -1); ctx.lineTo(0, 10);
  ctx.moveTo(-7, 2); ctx.lineTo(7, 2);
  ctx.moveTo(0, 10); ctx.lineTo(-6, 17);
  ctx.moveTo(0, 10); ctx.lineTo(6, 17);
  ctx.stroke();
  if (summon.id === 'cursedLegion') {
    ctx.strokeStyle = '#b07cff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, -7, 10, Math.PI, Math.PI * 2); ctx.stroke();
  }
  if (summon.electric && q >= 1) {
    ctx.strokeStyle = '#fff7af'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-5, -4); ctx.lineTo(-2, 1); ctx.moveTo(7, 5); ctx.lineTo(10, 1); ctx.lineTo(12, 5); ctx.stroke();
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
