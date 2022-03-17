import * as cron from "node-cron";
import { closestTo } from "date-fns";
import sendEndOfDayReport from "./send-end-of-day-report";
import { Event } from "../../types";
import config from "../../config";

export default function scheduler() {
  const now = new Date();
  const events = [...config.testEvents, ...config.events];
  const eventDatesAscending = events
    .map((event) => {
      return [event.start, event.end];
    })
    .flat()
    .sort();

  const closestEventDate = closestTo(now, eventDatesAscending);
  const closestEvent = events.find((event) => {
    return [event.start.getTime(), event.end.getTime()].includes(
      closestEventDate.getTime()
    );
  });

  function isEventHappening(event?: Event): boolean {
    if (event === undefined) return false;
    const now = new Date();
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

  const sendEndOfDayReportDate = new Date(closestEvent.end);
  sendEndOfDayReportDate.setTime(
    sendEndOfDayReportDate.getTime() + config.endOfDayReportTimeout
  );

  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    console.log("run");
    if (now.getTime() >= sendEndOfDayReportDate.getTime()) {
      await sendEndOfDayReport();
    }
  });
}
