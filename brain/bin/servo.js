const { Board, Servo } = require("johnny-five");
const board = new Board();

board.on("ready", () => {
  const servo = new Servo({
    pin: 10,
    startAt: 0,
    range: [0, 180],
  });

  servo.to(180);
});
