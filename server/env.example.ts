export default {
  email: {
    preview: true,
    send: false,
    from: `hello@example.com`,
    smtp: {
      host: `smtp.sendgrid.net`,
      port: 587,
      username: `apikey`,
      password: `secret`,
    },
  },
  // Passphrases stored in 1Password under "Disney Magical Door Codes"
  passphrases: {
    codes: `secret`,
    guaranteedWins: `secret`,
    winTimes: `secret`,
  },
  testEvent: {
    start: new Date("2022-03-08 09:00:00"),
    end: new Date("2022-03-08 19:00:00"),
    maxWinners: 10,
  },
  openBrowser: true,
};
