import { Op } from "sequelize";
import { endOfDay, format, startOfDay } from "date-fns";
import { uniqBy } from "lodash";
import Code from "../entities/code";
import WinTime from "../entities/win-time";
import Win from "../entities/win";
import { currentTime } from "../utils";
import config from "../config";

type Data = {
  winTimes: WinTime[];
  lastCodeScans: any[];
};

export default async function adminData(): Promise<Data> {
  const now = currentTime();
  const dateRange: [Date, Date] = [startOfDay(now), endOfDay(now)];

  let [winTimes, codes, wins] = await Promise.all([
    WinTime.findAll({
      where: { timestamp: { [Op.between]: dateRange } },
    }),
    Code.findAll({
      where: { usedAt: { [Op.between]: dateRange } },
      order: [["usedAt", "desc"]],
      limit: 5,
    }),
    Win.findAll({
      where: { usedAt: { [Op.between]: dateRange } },
      order: [["usedAt", "desc"]],
      limit: 20,
    }),
  ]);
  // @ts-ignore
  const lastCodeScans = uniqBy([...codes, ...wins], (item) => {
    return format(item.usedAt, "Y-MM-dd HH:mm:ss");
  })
    .map((item) => {
      const data = item.toJSON();
      let winner: boolean;
      if (item instanceof Win) {
        winner = true;
      } else if (item.guaranteedWin) {
        winner = true;
      } else {
        winner = wins.find((win) => win.code === item.code) !== undefined;
      }
      return {
        ...data,
        used: data.used ?? true,
        winner,
      };
    })
    .sort((a, b) => {
      return new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime();
    })
    .slice(0, 5);

  if (config.env === "development") {
    winTimes = config.testWinTimes.filter((testWinTime) => {
      const timestamp = testWinTime.timestamp.getTime();
      const startTimestamp = dateRange[0].getTime();
      const endTimestamp = dateRange[1].getTime();
      return timestamp >= startTimestamp && timestamp <= endTimestamp;
    });
  }

  return { winTimes, lastCodeScans };
}
