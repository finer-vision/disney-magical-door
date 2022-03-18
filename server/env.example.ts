import { startOfDay } from "date-fns";
import { currentTime, generateTestWinTimes } from "./src/utils";

// 10:00:00
const testEventStart = currentTime();
testEventStart.setTime(startOfDay(testEventStart).getTime() + 10 * 3600 * 1000);

// 15:00:00
const testEventEnd = currentTime();
testEventEnd.setTime(startOfDay(testEventEnd).getTime() + 15 * 3600 * 1000);

export default {
  testWinTimes: generateTestWinTimes({
    start: testEventStart,
    end: testEventEnd,
    maxWinners: 7,
  }),
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
  openBrowser: true,
};
