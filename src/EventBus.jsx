// EventBus.js
class EventBus {
    constructor() {
      this.listeners = {};
    }
  
    on(eventName, callback) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(callback);
    }
  
    dispatch(eventName, data) {
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach((callback) => callback(data));
      }
    }
  
    remove(eventName, callback) {
      if (this.listeners[eventName]) {
        const index = this.listeners[eventName].indexOf(callback);
        if (index!== -1) {
          this.listeners[eventName].splice(index, 1);
        }
      }
    }
  }
  
  export default EventBus;