import { createInterface } from "node:readline";

export default class QrScanner {
  private interface = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  onScan(fn: (code: string) => void) {
    this.interface.on("line", (line) => {
      fn(line);
    });
  }
}
