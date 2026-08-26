function hashString(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let s = seed >>> 0;
  return () => { s += 0x6D2B79F5; let t=s; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; };
}

const PALETTES = {
  ruins:  { detail:'#2d584c', light:'#67b89c', dark:'#081916', types:['rune','rubble','crystal','crack'], obstacles:['pillar','rock'] },
  forest: { detail:'#315b39', light:'#65a86f', dark:'#08150d', types:['grass','shrub','root','mushroom'], obstacles:['tree','rock'] },
  ash:    { detail:'#6b3d2d', light:'#b85f3d', dark:'#160d0a', types:['bone','crack','drygrass','rubble'], obstacles:['rock','ruin'] },
  frost:  { detail:'#44727b', light:'#8ac8d6', dark:'#0a171a', types:['snow','icecrack','crystal','stone'], obstacles:['iceRock','frozenLake'] },
  city:   { detail:'#565d5b', light:'#8c9692', dark:'#161818', types:['rubble','mark','bone','rune'], obstacles:['ruin','pillar','rock'] },
  void:   { detail:'#5c3b76', light:'#aa6bd2', dark:'#0d0815', types:['voidcrack','rune','crystal','shard'], obstacles:['voidCrystal','rock'] }
};

function obstacleProfile(type, r) {
  if (type === 'tree') return { hitbox: r*.38, visual: r*1.25 };
  if (type === 'pillar') return { hitbox: r*.58, visual: r*1.15 };
  if (type === 'ruin') return { hitbox: r*.74, visual: r*1.25 };
  if (type === 'frozenLake') return { hitbox: r*.82, visual: r*1.05 };
  if (type === 'voidCrystal') return { hitbox: r*.50, visual: r*1.35 };
  return { hitbox: r*.68, visual: r*1.12 };
}

export class WorldMap {
  constructor(mapId, map, width, height) {
    this.mapId=mapId; this.map=map; this.width=width; this.height=height;
    this.palette=PALETTES[mapId] || PALETTES.ruins;
    this.decorations=[]; this.obstacles=[];
    this.seed=hashString(`arcane-horder:${mapId}:2.3.0`);
    this.generate();
  }

  generate() {
    const random=rng(this.seed), centerX=this.width/2, centerY=this.height/2;
    const clusters=22;
    for(let c=0;c<clusters;c++){
      const cx=180+random()*(this.width-360), cy=180+random()*(this.height-360);
      const count=6+Math.floor(random()*9);
      for(let i=0;i<count;i++){
        const a=random()*Math.PI*2, d=Math.sqrt(random())*(90+random()*170);
        const x=cx+Math.cos(a)*d, y=cy+Math.sin(a)*d;
        if(x<70||y<70||x>this.width-70||y>this.height-70) continue;
        if(Math.hypot(x-centerX,y-centerY)<260) continue;
        const type=this.palette.types[Math.floor(random()*this.palette.types.length)];
        this.decorations.push({type,x,y,size:5+random()*16,rot:random()*Math.PI*2,variant:Math.floor(random()*4)});
      }
    }
    const obstacleCount=46;
    let attempts=0;
    while(this.obstacles.length<obstacleCount && attempts<obstacleCount*15){ attempts++;
      const x=140+random()*(this.width-280), y=140+random()*(this.height-280);
      if(Math.hypot(x-centerX,y-centerY)<330) continue;
      const base=22+random()*34;
      if(this.obstacles.some(o=>Math.hypot(o.x-x,o.y-y)<o.visual+base+45)) continue;
      const type=this.palette.obstacles[Math.floor(random()*this.palette.obstacles.length)];
      const p=obstacleProfile(type,base);
      this.obstacles.push({type,x,y,hitbox:p.hitbox,visual:p.visual,rot:random()*Math.PI*2,variant:Math.floor(random()*4)});
    }
  }

  collidesCircle(x,y,r) {
    for(const o of this.obstacles){ if(Math.hypot(x-o.x,y-o.y)<r+o.hitbox) return o; }
    return null;
  }

  resolveMovement(player,nx,ny){
    const r=player.hitboxRadius ?? player.r;
    let x=nx,y=player.y;
    if(this.collidesCircle(x,y,r)) x=player.x;
    y=ny;
    if(this.collidesCircle(x,y,r)) y=player.y;
    return {x,y};
  }

  findNearestFree(x,y,r=26){
    x=Math.max(r+8,Math.min(this.width-r-8,x));
    y=Math.max(r+8,Math.min(this.height-r-8,y));
    if(!this.collidesCircle(x,y,r)) return {x,y};
    for(let ring=1;ring<=8;ring++) for(let i=0;i<12;i++){
      const a=i*Math.PI*2/12, d=ring*34;
      const nx=Math.max(r+8,Math.min(this.width-r-8,x+Math.cos(a)*d));
      const ny=Math.max(r+8,Math.min(this.height-r-8,y+Math.sin(a)*d));
      if(!this.collidesCircle(nx,ny,r)) return {x:nx,y:ny};
    }
    return {x,y};
  }

  draw(ctx,game){
    const map=this.map, cam=game.camera;
    ctx.fillStyle=map.ground; ctx.fillRect(0,0,innerWidth,innerHeight);
    this.drawGroundTexture(ctx,game);
    this.drawDecorations(ctx,game);
    this.drawObstacles(ctx,game);
    this.drawBounds(ctx,game);
  }

  drawGroundTexture(ctx,game){
    const cam=game.camera, step=96, p=this.palette;
    const sx=Math.floor(cam.x/step)*step, sy=Math.floor(cam.y/step)*step;
    ctx.save();
    for(let x=sx;x<cam.x+cam.w+step;x+=step) for(let y=sy;y<cam.y+cam.h+step;y+=step){
      const h=Math.abs(((x*73856093)^(y*19349663)^this.seed)>>>0), px=x-cam.x, py=y-cam.y;
      ctx.globalAlpha=.10+(h%5)*.012; ctx.fillStyle=(h&1)?p.detail:p.light;
      const kind=h%4;
      if(kind===0){ctx.beginPath();ctx.ellipse(px+(h%31),py+(h%23),14+(h%17),4+(h%7),(h%314)/100,0,Math.PI*2);ctx.fill();}
      else if(kind===1){ctx.strokeStyle=p.detail;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px+8,py+18);ctx.lineTo(px+25+(h%17),py+11+(h%19));ctx.stroke();}
      else {ctx.fillRect(px+(h%37),py+(h%29),2+(h%4),2+(h%3));}
    }
    ctx.restore();
  }

  drawDecorations(ctx,game){
    const q=Number(game.save.data.settings.quality ?? 2), stride=q<=0?3:q===1?2:1;
    for(let i=0;i<this.decorations.length;i+=stride){ const d=this.decorations[i]; if(!game.camera.visible(d.x,d.y,d.size+20)) continue; this.drawDecoration(ctx,game,d); }
  }

  drawDecoration(ctx,game,d){
    const s=game.camera.worldToScreen(d.x,d.y), p=this.palette;
    ctx.save();ctx.translate(s.x,s.y);ctx.rotate(d.rot);ctx.globalAlpha=.62;
    switch(d.type){
      case 'grass': case 'drygrass':
        ctx.strokeStyle=d.type==='grass'?p.light:'#a17c51';ctx.lineWidth=1.5;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*2,3);ctx.quadraticCurveTo(i*3,-d.size*.35,i*1.2,-d.size);ctx.stroke();}break;
      case 'shrub':
        ctx.fillStyle=p.detail;for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ctx.beginPath();ctx.ellipse(Math.cos(a)*d.size*.35,Math.sin(a)*d.size*.2,d.size*.35,d.size*.22,a,0,Math.PI*2);ctx.fill();}break;
      case 'root':
        ctx.strokeStyle='#6b4d35';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(d.size*.3,-d.size*.3,d.size*(.7+i*.18),(-1+i)*4);ctx.stroke();}break;
      case 'mushroom':
        ctx.fillStyle='#c9d9b2';ctx.fillRect(-2,0,4,d.size*.55);ctx.fillStyle='#8b6bb8';ctx.beginPath();ctx.arc(0,0,d.size*.35,Math.PI,Math.PI*2);ctx.fill();break;
      case 'rune':
        ctx.strokeStyle=p.light;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,d.size*.5,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-d.size*.35,0);ctx.lineTo(d.size*.35,0);ctx.moveTo(0,-d.size*.35);ctx.lineTo(0,d.size*.35);ctx.stroke();break;
      case 'crystal': case 'shard':
        ctx.fillStyle=p.light;ctx.beginPath();ctx.moveTo(0,-d.size);ctx.lineTo(d.size*.45,d.size*.25);ctx.lineTo(0,d.size*.55);ctx.lineTo(-d.size*.4,d.size*.25);ctx.closePath();ctx.fill();break;
      case 'bone':
        ctx.strokeStyle='#d8d0b4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-d.size*.5,0);ctx.lineTo(d.size*.5,0);ctx.stroke();for(const x of[-d.size*.5,d.size*.5]){ctx.beginPath();ctx.arc(x,0,3,0,Math.PI*2);ctx.fillStyle='#d8d0b4';ctx.fill();}break;
      case 'crack': case 'icecrack': case 'voidcrack':
        ctx.strokeStyle=d.type==='icecrack'?'#92d7e8':d.type==='voidcrack'?'#b05cff':p.detail;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-d.size,0);ctx.lineTo(-d.size*.35,-3);ctx.lineTo(0,4);ctx.lineTo(d.size*.4,-5);ctx.lineTo(d.size,2);ctx.stroke();break;
      case 'rubble': case 'stone':
        ctx.fillStyle=p.detail;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-d.size*.4+i*5,4);ctx.lineTo(-d.size*.25+i*5,-5);ctx.lineTo(d.size*.1+i*4,-3);ctx.lineTo(d.size*.25+i*4,5);ctx.closePath();ctx.fill();}break;
      case 'snow':
        ctx.fillStyle='#dceff2';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc((i-2)*3,(i%2)*2,1.5,0,Math.PI*2);ctx.fill();}break;
      case 'mark':
        ctx.strokeStyle='#836e66';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-d.size*.6,-d.size*.4);ctx.lineTo(d.size*.6,d.size*.4);ctx.moveTo(d.size*.55,-d.size*.5);ctx.lineTo(-d.size*.5,d.size*.45);ctx.stroke();break;
      default: ctx.fillStyle=p.detail;ctx.fillRect(-2,-2,4,4);
    }
    ctx.restore();
  }

  drawObstacles(ctx,game){
    for(const o of this.obstacles){ if(!game.camera.visible(o.x,o.y,o.visual+30)) continue; this.drawObstacle(ctx,game,o); }
  }

  drawObstacle(ctx,game,o){
    const s=game.camera.worldToScreen(o.x,o.y), p=this.palette, r=o.visual;
    ctx.save();ctx.translate(s.x,s.y);ctx.rotate(o.rot);
    if(o.type==='tree'){
      ctx.fillStyle='#4b3628';ctx.fillRect(-r*.13,-r*.1,r*.26,r*.9);ctx.strokeStyle='#684735';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-r*.4,-r*.5);ctx.moveTo(0,-r*.2);ctx.lineTo(r*.42,-r*.62);ctx.stroke();ctx.fillStyle=p.detail;for(const [x,y,rr] of[[-.3,-.55,.5],[.28,-.58,.48],[0,-.82,.55]]){ctx.beginPath();ctx.ellipse(x*r,y*r,rr*r*.75,rr*r*.48,0,0,Math.PI*2);ctx.fill();}
    } else if(o.type==='rock'||o.type==='iceRock'){
      ctx.fillStyle=o.type==='iceRock'?'#6f9ba5':p.detail;ctx.strokeStyle=p.dark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-r*.7,r*.35);ctx.lineTo(-r*.55,-r*.25);ctx.lineTo(-r*.1,-r*.7);ctx.lineTo(r*.55,-r*.45);ctx.lineTo(r*.72,r*.18);ctx.lineTo(r*.35,r*.58);ctx.lineTo(-r*.35,r*.62);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle=p.light;ctx.beginPath();ctx.moveTo(-r*.15,-r*.55);ctx.lineTo(r*.35,-r*.34);ctx.stroke();
    } else if(o.type==='pillar'||o.type==='ruin'){
      ctx.fillStyle='#756f66';ctx.fillRect(-r*.35,-r*.8,r*.7,r*1.45);ctx.fillStyle='#938c80';ctx.fillRect(-r*.48,-r*.83,r*.96,r*.18);ctx.fillStyle='#514c46';ctx.fillRect(-r*.42,r*.5,r*.84,r*.16);if(o.type==='ruin'){ctx.fillStyle='#5f5a54';ctx.fillRect(r*.1,-r*.2,r*.75,r*.28);}
    } else if(o.type==='frozenLake'){
      ctx.fillStyle='#74b9c455';ctx.strokeStyle='#9fe1ed';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,r*1.05,r*.72,.2,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.strokeStyle='#d4f5f8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-r*.55,-5);ctx.lineTo(-r*.12,4);ctx.lineTo(r*.4,-8);ctx.stroke();
    } else if(o.type==='voidCrystal'){
      ctx.fillStyle='#8e4fba';ctx.strokeStyle='#d184ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(r*.45,r*.35);ctx.lineTo(0,r*.7);ctx.lineTo(-r*.45,r*.35);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(0,-r*.8);ctx.lineTo(r*.1,r*.45);ctx.stroke();
    }
    ctx.restore();
  }

  drawBounds(ctx,game){
    const cam=game.camera, margin=70, p=this.palette;
    ctx.save();ctx.fillStyle=p.dark;ctx.globalAlpha=.72;
    if(cam.x<margin){ctx.fillRect(-cam.x,0,margin,innerHeight);} if(cam.y<margin){ctx.fillRect(0,-cam.y,innerWidth,margin);}
    if(cam.x+cam.w>this.width-margin){ctx.fillRect(this.width-margin-cam.x,0,margin,innerHeight);} if(cam.y+cam.h>this.height-margin){ctx.fillRect(0,this.height-margin-cam.y,innerWidth,margin);}
    ctx.globalAlpha=1;ctx.strokeStyle=p.light;ctx.lineWidth=3;ctx.strokeRect(-cam.x,-cam.y,this.width,this.height);ctx.restore();
  }

  drawDebug(ctx,game){
    ctx.save();ctx.strokeStyle='#62f3ff';ctx.lineWidth=1.5;
    for(const o of this.obstacles){if(!game.camera.visible(o.x,o.y,o.hitbox+4))continue;const s=game.camera.worldToScreen(o.x,o.y);ctx.beginPath();ctx.arc(s.x,s.y,o.hitbox,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  }
}
