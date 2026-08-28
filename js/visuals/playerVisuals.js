function facingAngle(player) {
  return Math.atan2(player.lastMoveY || 0, player.lastMoveX || 1);
}

function drawShadow(ctx, scale = 1) {
  ctx.save();
  ctx.globalAlpha = .28;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 13 * scale, 15 * scale, 6 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function outline(ctx, width = 2) {
  ctx.strokeStyle = '#e9fff8';
  ctx.lineWidth = width;
}

function drawMage(ctx, game, player, preview = false) {
  const t = game?.time || performance.now() / 1000;
  const charge = game?.classPassives?.state?.kind === 'mageCharge';
  ctx.save();
  ctx.rotate((facingAngle(player) || 0) + Math.PI / 2);

  // robe
  ctx.fillStyle = '#3d2960'; outline(ctx, 1.7);
  ctx.beginPath();
  ctx.moveTo(-10, 13); ctx.quadraticCurveTo(-12, 0, -7, -10);
  ctx.lineTo(7, -10); ctx.quadraticCurveTo(12, 0, 10, 13);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#7b55a6'; ctx.fillRect(-6, -5, 12, 4);

  // head + crooked hat
  ctx.fillStyle = '#d8b895'; ctx.beginPath(); ctx.arc(0, -12, 6.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#29213f'; outline(ctx, 1.4);
  ctx.beginPath(); ctx.ellipse(0, -18, 13, 3.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-7, -19); ctx.quadraticCurveTo(-4, -32, 3, -38);
  ctx.quadraticCurveTo(9, -34, 5, -23); ctx.lineTo(7, -19); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#c783ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-6, -20); ctx.lineTo(6, -20); ctx.stroke();
  ctx.fillStyle = '#f6c86e'; ctx.beginPath(); ctx.arc(1.5, -24, 2.2, 0, Math.PI * 2); ctx.fill();

  // floating grimoire
  const bookX = 18, bookY = -7 + Math.sin(t * 3) * 2;
  ctx.save(); ctx.translate(bookX, bookY); ctx.rotate(-.18 + Math.sin(t * 2) * .04);
  if (charge) ctx.scale(1.18, 1.18);
  ctx.fillStyle = '#6a223f'; outline(ctx, 1.3);
  ctx.beginPath(); ctx.roundRect?.(-8, -6, 16, 12, 2); if (!ctx.roundRect) ctx.rect(-8,-6,16,12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ecdca7'; ctx.fillRect(-6, -4, 5.5, 8); ctx.fillRect(.5, -4, 5.5, 8);
  ctx.strokeStyle = '#e98dff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.stroke();
  if (charge) {
    ctx.strokeStyle = '#f0c5ff';
    for (let i=0;i<6;i++) { const a=t*2+i*Math.PI/3; ctx.beginPath(); ctx.moveTo(Math.cos(a)*9,Math.sin(a)*9); ctx.lineTo(Math.cos(a)*13,Math.sin(a)*13); ctx.stroke(); }
  }
  ctx.restore();
  ctx.restore();
}

function drawNecromancer(ctx, game, player) {
  const t = game?.time || performance.now()/1000;
  ctx.save(); ctx.rotate((facingAngle(player) || 0) + Math.PI/2);
  ctx.fillStyle = '#20182d'; outline(ctx, 1.7);
  ctx.beginPath(); ctx.moveTo(-11,14); ctx.lineTo(-8,-9); ctx.quadraticCurveTo(0,-17,8,-9); ctx.lineTo(11,14); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#120e18'; ctx.beginPath(); ctx.arc(0,-12,8,Math.PI,0); ctx.lineTo(7,-5); ctx.lineTo(-7,-5); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#c8f3d8'; ctx.beginPath(); ctx.arc(-2.4,-10,1.7,0,Math.PI*2); ctx.arc(2.4,-10,1.7,0,Math.PI*2); ctx.fill();
  // bone crown
  ctx.strokeStyle='#d9d0b5'; ctx.lineWidth=2; for (const x of[-5,0,5]) { ctx.beginPath(); ctx.moveTo(x,-18); ctx.lineTo(x+(x===0?0:Math.sign(x)*2),-24); ctx.stroke(); }
  // skull staff
  ctx.strokeStyle='#85674b'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(13,11); ctx.lineTo(16,-19); ctx.stroke();
  ctx.fillStyle='#d7d0b7'; ctx.beginPath(); ctx.arc(16,-21,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#2b2333'; ctx.beginPath(); ctx.arc(14.5,-22,1.3,0,Math.PI*2); ctx.arc(17.5,-22,1.3,0,Math.PI*2); ctx.fill();
  if (game && (game.summons?.length || 0) > 0) {
    ctx.strokeStyle='#72d5b7'; ctx.globalAlpha=.65; ctx.beginPath(); ctx.arc(0,1,17+Math.sin(t*4)*1.5,0,Math.PI*2); ctx.stroke();
  }
  ctx.restore();
}

function drawArcher(ctx, game, player) {
  const t = game?.time || performance.now()/1000;
  ctx.save(); ctx.rotate((facingAngle(player) || 0) + Math.PI/2);
  // quiver behind
  ctx.save(); ctx.rotate(-.28); ctx.fillStyle='#6b4930'; ctx.fillRect(-13,-10,5,20); ctx.strokeStyle='#ded3ad'; ctx.lineWidth=1.5;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-12+i*1.6,-12);ctx.lineTo(-12+i*1.6,-22);ctx.stroke();}
  ctx.restore();
  // body and hood
  ctx.fillStyle='#304938'; outline(ctx,1.6); ctx.beginPath();ctx.ellipse(0,3,8.5,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#20352a'; ctx.beginPath();ctx.arc(0,-12,8,Math.PI,0);ctx.lineTo(7,-5);ctx.lineTo(-7,-5);ctx.closePath();ctx.fill();
  ctx.fillStyle='#d3af87'; ctx.beginPath();ctx.arc(0,-10,4.8,0,Math.PI*2);ctx.fill();
  // bow, visibly forward
  ctx.strokeStyle='#d5a45f'; ctx.lineWidth=2.6; ctx.beginPath();ctx.arc(13,-1,11,-Math.PI/2,Math.PI/2);ctx.stroke();
  ctx.strokeStyle='#efe0b8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(13,-12);ctx.lineTo(13,10);ctx.stroke();
  ctx.strokeStyle='#e9e2ca';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(3,-1);ctx.lineTo(17,-1);ctx.stroke();
  if(game?.classPassives?.state?.kind==='arrowTelegraph'){ctx.strokeStyle='#ffeab1';ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(0,0,18+Math.sin(t*8)*2,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

function drawKnight(ctx, game, player) {
  const t = game?.time || performance.now()/1000;
  const barrier = game?.classPassives?.state?.kind === 'barrier';
  ctx.save(); ctx.rotate((facingAngle(player) || 0) + Math.PI/2);
  // armored body
  ctx.fillStyle='#697883'; outline(ctx,2); ctx.beginPath();ctx.roundRect?.(-10,-9,20,25,6); if(!ctx.roundRect)ctx.rect(-10,-9,20,25);ctx.fill();ctx.stroke();
  ctx.fillStyle='#8799a6';ctx.fillRect(-13,-6,5,10);ctx.fillRect(8,-6,5,10);
  // helmet
  ctx.fillStyle='#8a9aa5';ctx.beginPath();ctx.arc(0,-13,8.5,Math.PI,0);ctx.lineTo(8,-7);ctx.lineTo(-8,-7);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='#21313a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-6,-11);ctx.lineTo(6,-11);ctx.stroke();
  ctx.strokeStyle='#7df3ff';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(0,-7);ctx.stroke();
  // shield left
  ctx.save();ctx.translate(-15,1);ctx.fillStyle=barrier?'#79d9e8':'#4b6777';ctx.strokeStyle='#c9eaf0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(8,-6);ctx.lineTo(7,6);ctx.lineTo(0,12);ctx.lineTo(-7,6);ctx.lineTo(-8,-6);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#9cf7ff';ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,6);ctx.moveTo(-4,1);ctx.lineTo(4,1);ctx.stroke();ctx.restore();
  // sword right
  ctx.save();ctx.translate(14,1);ctx.rotate(.12);ctx.fillStyle='#d9eef3';ctx.strokeStyle='#7898a5';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(4,-3);ctx.lineTo(0,0);ctx.lineTo(-4,-3);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#d5b56d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-6,1);ctx.lineTo(6,1);ctx.moveTo(0,1);ctx.lineTo(0,9);ctx.stroke();ctx.restore();
  if(barrier){ctx.strokeStyle='#9df4ff';ctx.lineWidth=2;ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(0,0,24+Math.sin(t*8)*1.5,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

function drawDruid(ctx, game, player) {
  const t = game?.time || performance.now()/1000;
  ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);
  ctx.fillStyle='#3e5f3c';outline(ctx,1.7);ctx.beginPath();ctx.ellipse(0,3,9.5,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#6d8e4e';ctx.beginPath();ctx.arc(0,-11,6.5,0,Math.PI*2);ctx.fill();
  // branch antlers / leaf crown
  ctx.strokeStyle='#795a3c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-3,-16);ctx.lineTo(-8,-24);ctx.lineTo(-12,-27);ctx.moveTo(-8,-24);ctx.lineTo(-6,-29);ctx.moveTo(3,-16);ctx.lineTo(8,-24);ctx.lineTo(12,-27);ctx.moveTo(8,-24);ctx.lineTo(6,-29);ctx.stroke();
  ctx.fillStyle='#83c96b';for(const [x,y,a] of[[-12,-27,-.5],[12,-27,.5],[-6,-29,-.2],[6,-29,.2]]){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,0,4,2,0,0,Math.PI*2);ctx.fill();ctx.restore();}
  // wooden staff
  ctx.strokeStyle='#715239';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(14,12);ctx.quadraticCurveTo(12,-5,17,-23);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(17,-23);ctx.lineTo(12,-29);ctx.moveTo(17,-23);ctx.lineTo(22,-28);ctx.stroke();
  ctx.fillStyle='#77d989';ctx.beginPath();ctx.arc(17,-23,3+Math.sin(t*4)*.5,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawAssassin(ctx, game, player) {
  const moving=Math.abs(player.lastMoveX||0)+Math.abs(player.lastMoveY||0)>.05;
  ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);
  if(moving){ctx.globalAlpha=.18;ctx.fillStyle='#5d3d83';ctx.beginPath();ctx.ellipse(0,7,10,16,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
  ctx.fillStyle='#292631';outline(ctx,1.5);ctx.beginPath();ctx.moveTo(-8,14);ctx.lineTo(-10,-5);ctx.lineTo(-5,-14);ctx.lineTo(5,-14);ctx.lineTo(10,-5);ctx.lineTo(8,14);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#17151c';ctx.beginPath();ctx.arc(0,-12,7.5,Math.PI,0);ctx.lineTo(7,-6);ctx.lineTo(-7,-6);ctx.closePath();ctx.fill();
  ctx.fillStyle='#b88ee0';ctx.fillRect(-6,-11,12,2.5);
  // twin daggers
  for(const side of[-1,1]){ctx.save();ctx.translate(side*12,2);ctx.rotate(side*.28);ctx.fillStyle='#d7d9e4';ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(3,-2);ctx.lineTo(0,2);ctx.lineTo(-3,-2);ctx.closePath();ctx.fill();ctx.strokeStyle='#6e5d80';ctx.stroke();ctx.strokeStyle='#7f5c3f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,2);ctx.lineTo(0,8);ctx.stroke();ctx.restore();}
  ctx.restore();
}


function drawWarlock(ctx,game,player){ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);ctx.fillStyle='#2a1835';outline(ctx,1.7);ctx.beginPath();ctx.moveTo(-10,15);ctx.lineTo(-8,-8);ctx.lineTo(0,-18);ctx.lineTo(8,-8);ctx.lineTo(10,15);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#151019';ctx.beginPath();ctx.arc(0,-11,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a86ee8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-5,-17);ctx.lineTo(-10,-25);ctx.moveTo(5,-17);ctx.lineTo(10,-25);ctx.stroke();ctx.fillStyle='#60316f';ctx.fillRect(10,-8,10,14);ctx.strokeStyle='#df9cff';ctx.beginPath();ctx.arc(15,-1,4,0,Math.PI*2);ctx.stroke();ctx.restore();}
function drawPaladin(ctx,game,player){ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);ctx.fillStyle='#d7d1b6';outline(ctx,2);ctx.beginPath();ctx.roundRect?.(-10,-10,20,27,5);if(!ctx.roundRect)ctx.rect(-10,-10,20,27);ctx.fill();ctx.stroke();ctx.fillStyle='#ece8d5';ctx.beginPath();ctx.arc(0,-13,8,Math.PI,0);ctx.lineTo(7,-6);ctx.lineTo(-7,-6);ctx.closePath();ctx.fill();ctx.fillStyle='#d9b85a';ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e8cf70';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(13,-15);ctx.lineTo(13,10);ctx.moveTo(8,0);ctx.lineTo(18,0);ctx.stroke();ctx.save();ctx.translate(-15,2);ctx.fillStyle='#f2e6ab';ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(8,-5);ctx.lineTo(7,7);ctx.lineTo(0,13);ctx.lineTo(-7,7);ctx.lineTo(-8,-5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();ctx.restore();}
function drawElementalist(ctx,game,player){const t=game?.time||0;ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);ctx.fillStyle='#343d57';outline(ctx,1.7);ctx.beginPath();ctx.ellipse(0,3,9,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#d6c4a7';ctx.beginPath();ctx.arc(0,-10,5,0,Math.PI*2);ctx.fill();const cols=['#ff7043','#70d8ff','#ffe45b','#c59a65'];for(let i=0;i<4;i++){const a=t*.8+i*Math.PI/2;ctx.fillStyle=cols[i];ctx.save();ctx.rotate(-((facingAngle(player)||0)+Math.PI/2));ctx.beginPath();ctx.arc(Math.cos(a)*18,Math.sin(a)*18,3.5,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.restore();}
function drawBattleMage(ctx,game,player){ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);ctx.fillStyle='#4b5464';outline(ctx,1.8);ctx.beginPath();ctx.ellipse(0,3,10,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#2d3540';ctx.beginPath();ctx.arc(0,-11,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#d9e7ea';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(12,-17);ctx.lineTo(12,10);ctx.stroke();ctx.fillStyle='#5b255f';ctx.fillRect(-18,-7,10,14);ctx.strokeStyle='#d98cff';ctx.beginPath();ctx.arc(-13,0,4,0,Math.PI*2);ctx.stroke();ctx.restore();}
function drawSummonerClass(ctx,game,player){ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);ctx.fillStyle='#3a3145';outline(ctx,1.6);ctx.beginPath();ctx.ellipse(0,3,9,14,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#d7c38d';ctx.lineWidth=2;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*5,-18);ctx.lineTo(i*7,-25);ctx.stroke();}ctx.strokeStyle='#7acbb7';ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#9ce5cf';ctx.beginPath();ctx.arc(16,-7,4,0,Math.PI*2);ctx.fill();ctx.restore();}
function drawBloodMage(ctx,game,player){ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);ctx.fillStyle='#541d2c';outline(ctx,1.8);ctx.beginPath();ctx.moveTo(-10,15);ctx.lineTo(-8,-10);ctx.lineTo(0,-18);ctx.lineTo(8,-10);ctx.lineTo(10,15);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#d7b8aa';ctx.beginPath();ctx.arc(0,-10,5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#b82f4b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(14,12);ctx.lineTo(16,-20);ctx.stroke();ctx.fillStyle='#ff5b72';ctx.beginPath();ctx.moveTo(16,-25);ctx.lineTo(21,-18);ctx.lineTo(16,-12);ctx.lineTo(11,-18);ctx.closePath();ctx.fill();ctx.restore();}
function drawMonk(ctx,game,player){ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);ctx.fillStyle='#8a6844';outline(ctx,1.6);ctx.beginPath();ctx.ellipse(0,3,8.5,13,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#d2ad87';ctx.beginPath();ctx.arc(0,-10,5.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7ff1dd';ctx.lineWidth=3;ctx.beginPath();ctx.arc(-11,3,4,0,Math.PI*2);ctx.arc(11,3,4,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#3c3025';ctx.fillRect(-8,12,6,5);ctx.fillRect(2,12,6,5);ctx.restore();}
function drawTechnomancer(ctx,game,player){const t=game?.time||0;ctx.save();ctx.rotate((facingAngle(player)||0)+Math.PI/2);ctx.fillStyle='#344955';outline(ctx,1.7);ctx.beginPath();ctx.roundRect?.(-9,-10,18,27,5);if(!ctx.roundRect)ctx.rect(-9,-10,18,27);ctx.fill();ctx.stroke();ctx.fillStyle='#6fc7cc';ctx.beginPath();ctx.arc(0,-9,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1b282d';ctx.fillRect(-6,-11,12,3);ctx.save();ctx.rotate(-((facingAngle(player)||0)+Math.PI/2));const a=t*1.4;ctx.fillStyle='#7af4ec';ctx.beginPath();ctx.arc(Math.cos(a)*20,Math.sin(a)*10-5,4,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#bafefa';ctx.beginPath();ctx.arc(Math.cos(a)*20,Math.sin(a)*10-5,7,0,Math.PI*2);ctx.stroke();ctx.restore();ctx.restore();}

function drawBody(ctx, game, player, preview=false) {
  switch(player.id){
    case 'mage': return drawMage(ctx,game,player,preview);
    case 'necromancer': return drawNecromancer(ctx,game,player);
    case 'archer': return drawArcher(ctx,game,player);
    case 'knight': return drawKnight(ctx,game,player);
    case 'druid': return drawDruid(ctx,game,player);
    case 'assassin': return drawAssassin(ctx,game,player);
    case 'warlock': return drawWarlock(ctx,game,player);
    case 'paladin': return drawPaladin(ctx,game,player);
    case 'elementalist': return drawElementalist(ctx,game,player);
    case 'battlemage': return drawBattleMage(ctx,game,player);
    case 'summoner': return drawSummonerClass(ctx,game,player);
    case 'bloodMage': return drawBloodMage(ctx,game,player);
    case 'monk': return drawMonk(ctx,game,player);
    case 'technomancer': return drawTechnomancer(ctx,game,player);
    default: ctx.fillStyle='#67e0b6';ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();
  }
}

export function drawPlayerVisual(ctx, game, player) {
  if (!player) return;
  const s = game.camera.worldToScreen(player.x, player.y);
  const t = game.time || 0;
  const moving = Math.abs(player.lastMoveX||0)+Math.abs(player.lastMoveY||0) > .05;
  const bob = moving ? Math.sin(t*10)*1.4 : Math.sin(t*3)*.6;
  ctx.save();ctx.translate(s.x,s.y);
  drawShadow(ctx,1);
  ctx.translate(0,bob);
  if (player.iframes>0) ctx.globalAlpha=.55+.35*Math.sin(t*28);
  drawBody(ctx,game,player,false);
  ctx.globalAlpha=1;
  // consistent outline halo for contrast without changing hitbox
  ctx.strokeStyle='rgba(214,255,245,.28)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.stroke();
  ctx.restore();
}

export function drawClassPreview(canvas, id) {
  if (!canvas) return;
  const dpr=Math.min(2,window.devicePixelRatio||1),cssW=100,cssH=88;
  canvas.width=Math.floor(cssW*dpr);canvas.height=Math.floor(cssH*dpr);canvas.style.width=cssW+'px';canvas.style.height=cssH+'px';
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cssW,cssH);
  ctx.save();ctx.translate(cssW/2,cssH/2+12);ctx.scale(1.05,1.05);
  const fake={id,lastMoveX:0,lastMoveY:-1,iframes:0};
  drawShadow(ctx,.9);drawBody(ctx,null,fake,true);ctx.restore();
}
