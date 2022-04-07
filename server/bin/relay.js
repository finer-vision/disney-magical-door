const { Board, Relay } = require("johnny-five");

const board = new Board({ repl: false });

board.on("ready", () => {
  const relay = new Relay(10);
  setInterval(() => {
    relay.toggle();
  }, 1000);
});

board.on("data", (data) => {
  console.log(data);
});

board.on("info", (event) => {
  console.log("%s sent an 'info' message: %s", event.class, event.message);
});
