import { Board, Relay, Led } from "johnny-five";

export default class Hardware {
  private ready: boolean = false;

  private board: Board = new Board({
    repl: false,
    debug: false,
  });

  private relay: Relay;

  private rgb: Led[];

  private relayTimeout: NodeJS.Timeout;

  private rgbTimeout: NodeJS.Timeout;

  locked: boolean = false;

  constructor() {
    this.board.on("ready", () => {
      this.relay = new Relay(10);
      this.rgb = [new Led(4), new Led(5), new Led(6)];
      this.locked = !this.relay.isOn;
      if (this.locked) {
        this.lock();
      }
      this.rgb.forEach((led) => {
        led.toggle();
      });
      this.ready = true;
    });
  }

  private toggleLight(index: number, duration = 2000) {
    if (!this.ready) {
      console.warn("WARN: Board not ready");
      return;
    }
    clearTimeout(this.rgbTimeout);
    this.rgb[index].toggle();
    this.rgbTimeout = setTimeout(() => {
      this.rgb[index].toggle();
    }, duration);
  }

  redLight(duration = 2000) {
    this.toggleLight(0, duration);
  }

  greenLight(duration = 2000) {
    this.toggleLight(1, duration);
  }

  blueLight(duration = 2000) {
    this.toggleLight(2, duration);
  }

  lock() {
    if (!this.ready) {
      console.warn("WARN: Board not ready");
      return;
    }
    this.relay.open();
    this.locked = false;
  }

  unlock(timeout = 0) {
    if (!this.ready) {
      console.warn("WARN: Board not ready");
      return;
    }
    this.relay.close();
    this.locked = true;
    clearTimeout(this.relayTimeout);
    this.relayTimeout = setTimeout(() => {
      this.lock();
    }, timeout);
  }
}
