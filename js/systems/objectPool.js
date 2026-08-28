export class ObjectPool {
  constructor(factory, reset, max = 1000) {
    this.factory = factory;
    this.reset = reset;
    this.max = max;
    this.free = [];
  }
  acquire(data) {
    const obj = this.free.pop() || this.factory();
    this.reset(obj, data);
    return obj;
  }
  release(obj) {
    if (this.free.length < this.max) this.free.push(obj);
  }
  clear() { this.free.length = 0; }
}
