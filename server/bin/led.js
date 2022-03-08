const { Board, Led } = require("johnny-five");

const board = new Board();

board.on("ready", () => {
  const r = new Led({ pin: 4 });
  const g = new Led({ pin: 5 });
  const b = new Led({ pin: 6 });
  r.toggle();
  g.toggle();
  b.toggle();
  setTimeout(() => {
    r.toggle();
  }, 5000);
  setTimeout(() => {
    r.toggle();
  }, 7000);
});

board.on("data", (data) => {
  console.log(data);
});
