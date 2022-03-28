import * as cron from "node-cron";
import { closestTo } from "date-fns";
import sendEndOfDayReport from "./send-end-of-day-report";
import { Event } from "../../types";
import config from "../../config";
import { currentTime } from "../../utils";

export default function scheduler() {
  const now = currentTime();
  const eventDatesAscending = config.events
    .map((event) => {
      return [event.start, event.end];
    })
    .flat()
    .sort();

  const closestEventDate = closestTo(now, eventDatesAscending);
  const closestEvent = config.events.find((event) => {
    return [event.start.getTime(), event.end.getTime()].includes(
      closestEventDate.getTime()
    );
  });

  function isEventHappening(event?: Event): boolean {
    if (event === undefined) return false;
    const now = currentTime();
    const nowInMs = now.getTime();
    const hourInMs = 3600 * 1000;
    return (
      nowInMs + hourInMs >= event.start.getTime() &&
      nowInMs - hourInMs <= event.end.getTime()
    );
  }

  if (!isEventHappening(closestEvent)) {
    console.info("Not currently in an event; scheduled tasks won't run");
    return;
  }

  const sendEndOfDayReportDate = closestEvent.end;
  sendEndOfDayReportDate.setTime(
    sendEndOfDayReportDate.getTime() + config.endOfDayReportTimeout
  );

  cron.schedule("*/1 * * * *", async () => {
    const now = currentTime();
    console.log(`[${new Date().toLocaleTimeString()}] cron`);
    if (now.getTime() >= sendEndOfDayReportDate.getTime()) {
      await sendEndOfDayReport();
    }
  });
}
