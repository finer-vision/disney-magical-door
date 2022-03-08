const SerialPort = require("serialport");

const port = new SerialPort("/dev/tty", {
  baudRate: 9600,
});

port.on("open", () => {
  console.log("open");
});

port.on("data", (data) => {
  console.log("data", data);
});
