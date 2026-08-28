export class Input{
 constructor(){this.keys=new Set();this.just=new Set();window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(!this.keys.has(e.code))this.just.add(e.code);this.keys.add(e.code)});window.addEventListener('keyup',e=>this.keys.delete(e.code));}
 axis(){let x=0,y=0;if(this.keys.has('KeyA')||this.keys.has('ArrowLeft'))x--;if(this.keys.has('KeyD')||this.keys.has('ArrowRight'))x++;if(this.keys.has('KeyW')||this.keys.has('ArrowUp'))y--;if(this.keys.has('KeyS')||this.keys.has('ArrowDown'))y++;if(x&&y){const n=Math.SQRT1_2;x*=n;y*=n}return{x,y}}
 consume(code){if(this.just.has(code)){this.just.delete(code);return true}return false}
 endFrame(){this.just.clear()}
}
