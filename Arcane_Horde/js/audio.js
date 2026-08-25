export class AudioManager{
 constructor(settings){this.settings=settings;this.ctx=null;this.buffers=new Map();this.musicNode=null}
 ensure(){if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume()}
 beep(freq=440,duration=.06,type='sine',gain=.035){if(this.settings.master<=0||this.settings.sfx<=0)return;try{this.ensure();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=gain*this.settings.master*this.settings.sfx;o.connect(g);g.connect(this.ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,this.ctx.currentTime+duration);o.stop(this.ctx.currentTime+duration)}catch{} }
 async load(name,url){try{const r=await fetch(url);if(!r.ok)return false;const b=await this.ctx.decodeAudioData(await r.arrayBuffer());this.buffers.set(name,b);return true}catch{return false}}
 play(name){const b=this.buffers.get(name);if(!b)return false;try{this.ensure();const s=this.ctx.createBufferSource(),g=this.ctx.createGain();s.buffer=b;g.gain.value=this.settings.master*this.settings.sfx;s.connect(g);g.connect(this.ctx.destination);s.start();return true}catch{return false}}
}
