const { Board, Relay } = require("johnny-five");

const board = new Board();

board.on("ready", () => {
  const relay = new Relay(10);
  setInterval(() => {
    relay.toggle();
  }, 1000);
});

board.on("data", (data) => {
  console.log(data);
});
