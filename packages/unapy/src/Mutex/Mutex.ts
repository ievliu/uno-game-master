class Mutex {
    private locked: boolean;
    private queue: (() => void)[] = [];
  
    constructor() {
      this.locked = false;
    }
  
    acquire(): Promise<() => void> {
      const lockPromise = new Promise<() => void>((resolve) => {
        const acquireLock = () => {
          if (!this.locked) {
            this.locked = true;
            resolve(() => this.release());
          } else {
            this.queue.push(acquireLock);
          }
        };
  
        acquireLock();
      });
  
      return lockPromise;
    }
  
    release(): void {
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) {
          next();
        }
      } else {
        this.locked = false;
      }
    }
  }
  
  export default Mutex;
  