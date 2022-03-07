import { Board, Relay } from "johnny-five";

export default class Lock {
  private pin = 10;

  private ready: boolean = false;

  private board: Board = new Board({
    repl: false,
    debug: false,
  });

  private relay: Relay;

  locked: boolean = false;

  constructor() {
    this.board.on("ready", () => {
      this.relay = new Relay(this.pin);
      this.locked = !this.relay.isOn;
      if (this.locked) {
        this.lock();
      }
      this.ready = true;
    });
  }

  lock() {
    if (!this.ready) {
      console.warn("WARN: Board not ready");
      return;
    }
    this.relay.open();
    this.locked = false;
  }

  unlock(timeout?: number) {
    if (!this.ready) {
      console.warn("WARN: Board not ready");
      return;
    }
    this.relay.close();
    this.locked = true;
    if (timeout !== undefined) {
      setTimeout(() => this.lock(), timeout);
    }
  }
}
