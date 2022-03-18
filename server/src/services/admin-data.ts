import { Op } from "sequelize";
import { endOfDay, startOfDay } from "date-fns";
import Code from "../entities/code";
import WinTime from "../entities/win-time";
import Win from "../entities/win";
import { currentTime } from "../utils";
import config from "../config";

type Data = {
  winTimes: WinTime[];
  lastCodeScans: (Code | Win)[];
};

export default async function adminData(): Promise<Data> {
  const now = currentTime();
  const dateRange: [Date, Date] = [startOfDay(now), endOfDay(now)];

  let [winTimes, lastCodeScans] = await Promise.all([
    WinTime.findAll({
      where: { timestamp: { [Op.between]: dateRange } },
    }),
    Code.findAll({
      where: { usedAt: { [Op.between]: dateRange } },
      order: [["usedAt", "desc"]],
      limit: 5,
    }),
  ]);

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
