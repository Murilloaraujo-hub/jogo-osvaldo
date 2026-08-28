import { GAME_CONFIG } from './config.js?v=2.8.0';

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = innerWidth;
    this.h = innerHeight;
  }
  resize(w, h) { this.w = w; this.h = h; }
  snap(target) {
    this.x = Math.max(0, Math.min(GAME_CONFIG.worldWidth - this.w, target.x - this.w / 2));
    this.y = Math.max(0, Math.min(GAME_CONFIG.worldHeight - this.h, target.y - this.h / 2));
  }
  update(target, dt) {
    const tx = Math.max(0, Math.min(GAME_CONFIG.worldWidth - this.w, target.x - this.w / 2));
    const ty = Math.max(0, Math.min(GAME_CONFIG.worldHeight - this.h, target.y - this.h / 2));
    const k = 1 - Math.pow(.001, dt);
    this.x += (tx - this.x) * k;
    this.y += (ty - this.y) * k;
  }
  worldToScreen(x, y) { return { x: x - this.x, y: y - this.y }; }
  visible(x, y, r = 0) { return x + r > this.x && x - r < this.x + this.w && y + r > this.y && y - r < this.y + this.h; }
}
