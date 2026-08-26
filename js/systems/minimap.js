const COLORS={ player:'#ffffff', chest:'#ffd465', elite:'#ffb347', miniboss:'#ff6f91', boss:'#ff3f8e', altar:'#d8b55f', merchant:'#83e6b7', portal:'#b67aff', challenge:'#ffda78', cursed:'#d95b8a', obstacle:'#65736f' };

function marker(ctx,type,x,y,size=3){
  ctx.save();ctx.translate(x,y);ctx.fillStyle=COLORS[type]||'#fff';ctx.strokeStyle='#08100f';ctx.lineWidth=1;
  if(type==='player'){ctx.beginPath();ctx.moveTo(0,-size*1.7);ctx.lineTo(size*1.25,size);ctx.lineTo(-size*1.25,size);ctx.closePath();ctx.fill();ctx.stroke();}
  else if(type==='chest'){ctx.fillRect(-size,-size*.7,size*2,size*1.4);ctx.strokeRect(-size,-size*.7,size*2,size*1.4);ctx.fillStyle='#3b2b14';ctx.fillRect(-size*.35,-size*.9,size*.7,size*.35);}
  else if(type==='portal'){ctx.strokeStyle=COLORS.portal;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,size*1.3,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,0,size*.55,0,Math.PI*2);ctx.stroke();}
  else if(type==='altar'){ctx.beginPath();for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI/3,r=i%2?size*.65:size*1.35;const px=Math.cos(a)*r,py=Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();}
  else if(type==='merchant'){ctx.beginPath();ctx.arc(0,-size*.5,size*.6,0,Math.PI*2);ctx.fill();ctx.fillRect(-size*.8,0,size*1.6,size);}
  else if(type==='boss'||type==='miniboss'||type==='elite'){ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?size*.75:size*1.35;const px=Math.cos(a)*r,py=Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.stroke();}
  else {ctx.beginPath();ctx.arc(0,0,size,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

export class MinimapSystem{
  constructor(canvas,game){this.canvas=canvas;this.game=game;this.acc=0;this.interval=.13;}
  update(dt){this.acc-=dt;if(this.acc>0)return;this.acc=this.interval;this.render();}
  render(){
    const g=this.game, s=g.save.data.settings;if(!this.canvas)return;
    if(s.minimapEnabled===false){this.canvas.classList.add('hidden');return;}this.canvas.classList.remove('hidden');
    const size=Number(s.minimapSize??1);this.canvas.dataset.size=String(size);
    const css=[132,164,196][Math.max(0,Math.min(2,size))]||164,dpr=Math.min(2,window.devicePixelRatio||1);
    this.canvas.style.width=css+'px';this.canvas.style.height=css+'px';
    if(this.canvas.width!==Math.floor(css*dpr)||this.canvas.height!==Math.floor(css*dpr)){this.canvas.width=Math.floor(css*dpr);this.canvas.height=Math.floor(css*dpr);}
    const c=this.canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,css,css);
    c.fillStyle='#06100fd9';c.fillRect(0,0,css,css);c.strokeStyle='#7cc9b788';c.lineWidth=1.5;c.strokeRect(3,3,css-6,css-6);
    const pad=9,w=css-pad*2,h=w,sx=w/g.worldWidth,sy=h/g.worldHeight;
    c.fillStyle=g.ui.maps[g.mapId].ground;c.fillRect(pad,pad,w,h);
    c.globalAlpha=.38;c.fillStyle=COLORS.obstacle;for(const o of g.world?.obstacles||[]){c.beginPath();c.arc(pad+o.x*sx,pad+o.y*sy,Math.max(1.2,o.hitbox*sx),0,Math.PI*2);c.fill();}c.globalAlpha=1;
    for(const p of g.pickups){if(p.type==='chest')marker(c,'chest',pad+p.x*sx,pad+p.y*sy,3.4);}
    for(const ev of g.events){if(ev.used)continue;const t=ev.type==='cursed'?'cursed':ev.type;marker(c,t,pad+ev.x*sx,pad+ev.y*sy,3.2);}
    for(const e of g.enemies){if(e.dead)continue;if(e.type==='finalBoss')marker(c,'boss',pad+e.x*sx,pad+e.y*sy,5.2);else if(e.boss)marker(c,'miniboss',pad+e.x*sx,pad+e.y*sy,4.3);else if(e.elite)marker(c,'elite',pad+e.x*sx,pad+e.y*sy,2.8);}
    const p=g.player,px=pad+p.x*sx,py=pad+p.y*sy;c.save();c.translate(px,py);c.rotate(Math.atan2(p.lastMoveY||0,p.lastMoveX||1)+Math.PI/2);marker(c,'player',0,0,4.2);c.restore();
    c.fillStyle='#d9fff1';c.font='9px system-ui';c.textAlign='left';c.fillText(g.ui.maps[g.mapId].name,pad+2,css-5);
  }
}
