import { Op } from "sequelize";
import { endOfDay, format, startOfDay } from "date-fns";
import { stringify } from "csv-stringify";
import Report from "../../entities/report";
import Code from "../../entities/code";
import email from "../email";

export default async function sendEndOfDayReport() {
  try {
    const now = new Date();
    const dateRange: [Date, Date] = [startOfDay(now), endOfDay(now)];
    const report = await Report.findOne({
      where: { createdAt: { [Op.between]: dateRange } },
    });
    // Exit early if report has already been sent today
    if (report !== null) return;
    console.info("Sending end of day report...");
    await Report.create({});

    const winners = await Code.findAll({
      where: { usedAt: { [Op.between]: dateRange }, winner: true },
      order: [["usedAt", "desc"]],
    });

    if (winners.length === 0) {
      console.info("No winners for today's event");
      return;
    }

    const csv = stringify([
      ["code", "usedAt"],
      ...winners.map((winner) => {
        return [winner.code, winner.usedAt.toISOString()];
      }),
    ]);

    const date = format(now, "Y-MM-dd");

    await email.send({
      message: {
        subject: `${date} Winners`,
        attachments: [
          {
            filename: `${date}-winners.csv`,
            content: csv,
          },
        ],
      },
    });

    console.info("End of day report sent");
  } catch (err) {
    console.error(err);
  }
}

