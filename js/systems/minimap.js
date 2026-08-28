import { FUSION_RECIPES } from '../fusions.js?v=2.8.0';
import { FUSION_ITEMS } from '../items/fusionItems.js?v=2.8.0';
const MAP_COLORS={
  ruins:{base:'#39594f',detail:'#6e8f82',path:'#a99c7b',water:'#476f78',wall:'#b9b19f'},
  forest:{base:'#315b3d',detail:'#557c51',path:'#877456',water:'#3f7780',wall:'#756d5c'},
  ash:{base:'#6a4132',detail:'#8f5840',path:'#b07a53',water:'#bb5535',wall:'#9b8871'},
  frost:{base:'#5d7b83',detail:'#87a8ad',path:'#c0c9c4',water:'#72b5c5',wall:'#a8b4b6'},
  city:{base:'#5b625f',detail:'#787f7c',path:'#9a9183',water:'#506d73',wall:'#b4aea5'},
  void:{base:'#49345c',detail:'#70508a',path:'#8a6d9d',water:'#623f8c',wall:'#9f7abc'}
};
const COLORS={player:'#ffffff',chest:'#ffd465',elite:'#ffb347',miniboss:'#ff7998',boss:'#ff3f8e',altar:'#ffe18a',merchant:'#83e6b7',portal:'#c78cff',challenge:'#ffda78',cursed:'#ef6c9a',poi:'#d4e5d9',fusionItem:'#ff82e9'};

function marker(ctx,type,x,y,size=3,angle=0){
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=COLORS[type]||'#fff';ctx.strokeStyle='#101616';ctx.lineWidth=1.2;
  if(type==='player'){
    ctx.beginPath();ctx.moveTo(0,-size*1.9);ctx.lineTo(size*1.25,size*1.15);ctx.lineTo(0,size*.55);ctx.lineTo(-size*1.25,size*1.15);ctx.closePath();ctx.fill();ctx.stroke();
  }else if(type==='chest'){
    ctx.fillRect(-size,-size*.55,size*2,size*1.3);ctx.strokeRect(-size,-size*.55,size*2,size*1.3);ctx.fillStyle='#5b3d18';ctx.fillRect(-size*.35,-size*.85,size*.7,size*.4);
  }else if(type==='portal'){
    ctx.strokeStyle=COLORS.portal;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,size*1.4,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,0,size*.62,0,Math.PI*2);ctx.stroke();
  }else if(type==='altar'){
    ctx.beginPath();for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4,r=i%2?size*.62:size*1.35;const px=Math.cos(a)*r,py=Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();
  }else if(type==='merchant'){
    ctx.beginPath();ctx.arc(0,-size*.55,size*.58,0,Math.PI*2);ctx.fill();ctx.fillRect(-size*.85,0,size*1.7,size*.95);
  }else if(type==='boss'||type==='miniboss'||type==='elite'){
    ctx.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?size*.72:size*1.42;const px=Math.cos(a)*r,py=Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.stroke();
  }else{ctx.beginPath();ctx.arc(0,0,size,0,Math.PI*2);ctx.fill();ctx.stroke();}
  ctx.restore();
}

function roundedRectPath(ctx,x,y,w,h,r){
  const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
}

export class MinimapSystem{
  constructor(canvas,game){this.canvas=canvas;this.game=game;this.acc=0;this.interval=.10;this.lastObjectives=[];}
  update(dt){this.acc-=dt;if(this.acc>0)return;this.acc=this.interval;this.render();}

  getSize(){const s=this.game.save.data.settings;const i=Math.max(0,Math.min(2,Number(s.minimapSize??1)));return [144,178,214][i]||178;}
  getRange(){const s=this.game.save.data.settings;const i=Math.max(0,Math.min(2,Number(s.minimapSize??1)));return [1050,1350,1700][i]||1350;}
  worldToMini(x,y,css,pad,range){
    const p=this.game.player,inner=css-pad*2;return {x:pad+inner/2+(x-p.x)/range*(inner/2),y:pad+inner/2+(y-p.y)/range*(inner/2)};
  }
  insideMini(pt,css,pad,margin=3){return pt.x>=pad+margin&&pt.y>=pad+margin&&pt.x<=css-pad-margin&&pt.y<=css-pad-margin;}

  render(){
    const g=this.game,s=g.save.data.settings;if(!this.canvas)return;
    if(s.minimapEnabled===false){this.canvas.classList.add('hidden');return;}this.canvas.classList.remove('hidden');
    const css=this.getSize(),dpr=Math.min(2,window.devicePixelRatio||1),pad=8,range=this.getRange();
    this.canvas.style.width=css+'px';this.canvas.style.height=css+'px';
    if(this.canvas.width!==Math.floor(css*dpr)||this.canvas.height!==Math.floor(css*dpr)){this.canvas.width=Math.floor(css*dpr);this.canvas.height=Math.floor(css*dpr);}
    const c=this.canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,css,css);
    const mp=MAP_COLORS[g.mapId]||MAP_COLORS.ruins;

    c.save();
    roundedRectPath(c,1,1,css-2,css-2,12);c.fillStyle='rgba(13,24,22,.82)';c.fill();c.strokeStyle='rgba(158,228,209,.72)';c.lineWidth=1.6;c.stroke();
    roundedRectPath(c,pad,pad,css-pad*2,css-pad*2,8);c.clip();
    c.fillStyle=mp.base;c.fillRect(pad,pad,css-pad*2,css-pad*2);

    this.drawTerrain(c,css,pad,range,mp);
    this.drawMarkers(c,css,pad,range);
    c.restore();

    c.save();c.fillStyle='#ecfff8';c.font='bold 9px system-ui';c.textAlign='left';c.fillText(g.ui.maps[g.mapId].name,10,css-6);c.restore();
  }

  drawTerrain(c,css,pad,range,mp){
    const g=this.game,w=g.world;if(!w)return;
    // subtle navigation grid gives the radar a readable terrain base instead of black.
    c.save();c.globalAlpha=.15;c.strokeStyle=mp.detail;c.lineWidth=1;
    const grid=280;const minX=g.player.x-range,maxX=g.player.x+range,minY=g.player.y-range,maxY=g.player.y+range;
    for(let x=Math.floor(minX/grid)*grid;x<=maxX;x+=grid){const a=this.worldToMini(x,minY,css,pad,range),b=this.worldToMini(x,maxY,css,pad,range);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
    for(let y=Math.floor(minY/grid)*grid;y<=maxY;y+=grid){const a=this.worldToMini(minX,y,css,pad,range),b=this.worldToMini(maxX,y,css,pad,range);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
    c.restore();

    // large biome zones
    for(const z of w.zones||[]){const p=this.worldToMini(z.x,z.y,css,pad,range);const rx=z.rx/range*((css-pad*2)/2),ry=z.ry/range*((css-pad*2)/2);if(p.x+rx<pad||p.x-rx>css-pad||p.y+ry<pad||p.y-ry>css-pad)continue;c.save();c.globalAlpha=.16;c.fillStyle=z.color||mp.detail;c.beginPath();c.ellipse(p.x,p.y,Math.max(3,rx),Math.max(3,ry),z.rot||0,0,Math.PI*2);c.fill();c.restore();}

    // paths are intentionally high contrast to make navigation GTA-like in concept.
    c.save();c.strokeStyle=mp.path;c.globalAlpha=.72;c.lineCap='round';c.lineJoin='round';c.lineWidth=Math.max(2,34/range*((css-pad*2)/2));
    for(const path of w.paths||[]){if(!path.points?.length)continue;c.beginPath();path.points.forEach((pt,i)=>{const m=this.worldToMini(pt.x,pt.y,css,pad,range);i?c.lineTo(m.x,m.y):c.moveTo(m.x,m.y);});c.stroke();}
    c.restore();

    // water/lava/arcane pools
    for(const lake of w.waterBodies||[]){const p=this.worldToMini(lake.x,lake.y,css,pad,range),rx=lake.rx/range*((css-pad*2)/2),ry=lake.ry/range*((css-pad*2)/2);if(p.x+rx<pad||p.x-rx>css-pad||p.y+ry<pad||p.y-ry>css-pad)continue;c.save();c.fillStyle=lake.miniColor||mp.water;c.globalAlpha=.88;c.beginPath();c.ellipse(p.x,p.y,Math.max(2,rx),Math.max(2,ry),lake.rot||0,0,Math.PI*2);c.fill();c.strokeStyle='rgba(225,250,244,.35)';c.lineWidth=1;c.stroke();c.restore();}

    // important obstacle masses only; not every decorative object.
    c.save();c.fillStyle=mp.wall;c.globalAlpha=.56;
    for(const o of w.obstacles||[]){const p=this.worldToMini(o.x,o.y,css,pad,range);if(!this.insideMini(p,css,pad,0))continue;const rr=Math.max(1.6,(o.hitbox||12)/range*((css-pad*2)/2));if(o.type==='ruin'||o.type==='pillar'){c.fillRect(p.x-rr,p.y-rr,rr*2,rr*2);}else{c.beginPath();c.arc(p.x,p.y,rr,0,Math.PI*2);c.fill();}}
    c.restore();

    // POIs are part of terrain navigation, even without an active event.
    c.save();c.globalAlpha=.58;for(const poi of w.pois||[]){const p=this.worldToMini(poi.x,poi.y,css,pad,range);if(this.insideMini(p,css,pad)){ctxPoi(c,p.x,p.y,poi.type);}}c.restore();

    // world border appears when close to it.
    const corners=[[0,0],[w.width,0],[w.width,w.height],[0,w.height]];
    const pts=corners.map(([x,y])=>this.worldToMini(x,y,css,pad,range));c.save();c.strokeStyle='rgba(242,255,248,.66)';c.lineWidth=1.4;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.stroke();c.restore();
  }

  collectObjectives(){
    const g=this.game,arr=[];
    for(const p of g.pickups||[]){if(p.type==='chest')arr.push({type:'chest',x:p.x,y:p.y,label:'BAÚ',priority:2});else if(p.type==='fusionItem')arr.push({type:'fusionItem',x:p.x,y:p.y,label:'FUSION ITEM',priority:6});}
    for(const ev of g.events||[]){if(ev.used)continue;arr.push({type:ev.type==='cursed'?'cursed':ev.type,x:ev.x,y:ev.y,label:(ev.name||'EVENTO').toUpperCase(),priority:ev.type==='portal'?5:4});}
    for(const e of g.enemies||[]){if(e.dead)continue;if(e.boss){const isMinor=e.miniboss&&!e.scheduledBoss;const tr=g.trackedFusionId?FUSION_RECIPES.find(r=>r.id===g.trackedFusionId):null;const tracked=!!(tr?.item&&FUSION_ITEMS[tr.item]?.source===e.type);arr.push({type:isMinor?'miniboss':'boss',x:e.x,y:e.y,label:tracked?`FUSION ITEM • ${(e.name||'BOSS').toUpperCase()}`:(isMinor?'MINIBOSS':(e.name||'BOSS').toUpperCase()),priority:tracked?14:(isMinor?8:10),tracked});}else if(e.elite)arr.push({type:'elite',x:e.x,y:e.y,label:'ELITE',priority:1});}
    return arr;
  }

  drawMarkers(c,css,pad,range){
    const g=this.game,objectives=this.collectObjectives();this.lastObjectives=objectives;
    const edge=[];
    for(const o of objectives){const p=this.worldToMini(o.x,o.y,css,pad,range);if(this.insideMini(p,css,pad,4)){marker(c,o.type,p.x,p.y,o.tracked?7.4:o.type==='boss'?5.8:o.type==='miniboss'?4.8:o.type==='elite'?2.6:3.5);}else if(o.priority>=2){edge.push(o);}}
    edge.sort((a,b)=>b.priority-a.priority);for(const o of edge.slice(0,6))this.drawEdgeIndicator(c,o,css,pad,range);
    const p=g.player,center=css/2;marker(c,'player',center,center,4.8,Math.atan2(p.lastMoveY||0,p.lastMoveX||1)+Math.PI/2);
  }

  drawEdgeIndicator(c,o,css,pad,range){
    const g=this.game,dx=o.x-g.player.x,dy=o.y-g.player.y,a=Math.atan2(dy,dx),center=css/2,border=css/2-pad-9;
    const x=center+Math.cos(a)*border,y=center+Math.sin(a)*border;
    c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.fillStyle=COLORS[o.type]||'#fff';c.strokeStyle='#111';c.lineWidth=1;c.beginPath();c.moveTo(0,-6);c.lineTo(5,4);c.lineTo(-5,4);c.closePath();c.fill();c.stroke();c.restore();
  }

  drawWorldIndicators(ctx){
    const g=this.game,s=g.save.data.settings;if(s.minimapEnabled===false||!g.player)return;
    const important=this.lastObjectives.filter(o=>o.priority>=4).sort((a,b)=>b.priority-a.priority).slice(0,3);
    const sw=innerWidth,sh=innerHeight,margin=74;
    for(const o of important){
      const sp=g.camera.worldToScreen(o.x,o.y),on=sp.x>90&&sp.x<sw-90&&sp.y>90&&sp.y<sh-90;
      if(on)continue;
      const dx=o.x-g.player.x,dy=o.y-g.player.y,dist=Math.hypot(dx,dy),a=Math.atan2(dy,dx);
      const cx=sw/2,cy=sh/2;const tx=cx+Math.cos(a)*sw,ty=cy+Math.sin(a)*sh;
      const scale=Math.min((sw/2-margin)/Math.max(1,Math.abs(tx-cx)),(sh/2-margin)/Math.max(1,Math.abs(ty-cy)));
      const x=cx+(tx-cx)*scale,y=cy+(ty-cy)*scale;
      ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/2);ctx.fillStyle=COLORS[o.type]||'#fff';ctx.strokeStyle='#07100f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(8,7);ctx.lineTo(-8,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
      ctx.save();ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.fillStyle='#f3fff9';ctx.strokeStyle='#07100f';ctx.lineWidth=3;const label=`${o.label} ${Math.round(dist/10)}`;ctx.strokeText(label,x,y+23);ctx.fillText(label,x,y+23);ctx.restore();
    }
  }
}

function ctxPoi(c,x,y,type){
  c.save();c.translate(x,y);c.strokeStyle=COLORS.poi;c.fillStyle='rgba(220,241,232,.22)';c.lineWidth=1;
  if(type?.includes('tower')){c.fillRect(-3,-5,6,10);c.strokeRect(-3,-5,6,10);}else if(type?.includes('grave')||type?.includes('cemetery')){c.beginPath();c.moveTo(0,-5);c.lineTo(0,5);c.moveTo(-3,-2);c.lineTo(3,-2);c.stroke();}else{c.beginPath();c.arc(0,0,4,0,Math.PI*2);c.fill();c.stroke();}
  c.restore();
}
