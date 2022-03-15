import { Op } from "sequelize";
import { endOfDay, startOfDay } from "date-fns";
import Code from "../entities/code";
import WinTime from "../entities/win-time";
import Win from "../entities/win";

type Data = {
  winTimes: WinTime[];
  lastCodeScans: (Code | Win)[];
};

export default async function adminData(): Promise<Data> {
  const now = new Date();
  const dateRange: [Date, Date] = [startOfDay(now), endOfDay(now)];

  const [winTimes, lastCodeScans, wins] = await Promise.all([
    WinTime.findAll({
      where: { timestamp: { [Op.between]: dateRange } },
      order: [["usedAt", "desc"]],
    }),
    Code.findAll({
      where: { usedAt: { [Op.between]: dateRange } },
      order: [["usedAt", "desc"]],
      limit: 5,
    }),
    Win.findAll({
      where: { usedAt: { [Op.between]: dateRange } },
    }),
  ]);

  return { winTimes, lastCodeScans: [...lastCodeScans, ...wins] };
}
