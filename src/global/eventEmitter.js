export class EventEmitter {
  constructor() {
    this._events = {};
  }
  subscribe(name, fn) {
    if (!this._events[name]) {
      this._events[name] = [];
    }
    this._events[name].push(fn);
  }
  emit(name, data) {
    const event = this._events[name];
    if (event) {
      event.forEach(fn => {
        fn.call(null, data);
      });
    }
  }
  remove(name, fn) {
    this._events[name] = this._events[name].filter(fn => fn === name);
  }
}

export const searchResult = new EventEmitter();
export const searchIndicator = new EventEmitter();
export const currentLocation = new EventEmitter();
export const searchResolved = new EventEmitter();
