import WinTime from "./entities/win-time";

export function currentTime(): Date {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  now.setTime(now.getTime() - timezoneOffset);
  return now;
}

export function removeTimezoneOffset(date: Date) {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  date.setTime(date.getTime() - timezoneOffset);
  return date;
}

export function mapLinear(
  x: number,
  a1: number,
  a2: number,
  b1: number,
  b2: number
): number {
  return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
}

export function rand(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type WinTimeOptions = {
  start: Date;
  end: Date;
  maxWinners: number;
};

export function generateTestWinTimes(
  options: WinTimeOptions
): WinTime["_attributes"][] {
  const interval = Math.floor(
    (options.end.getTime() - options.start.getTime()) / options.maxWinners
  );
  return Array.from(Array(options.maxWinners)).map((_, i) => {
    const start = options.start.getTime();
    const timestamp = Math.floor(
      rand(start + interval * i, start + interval * (i + 1))
    );
    return {
      used: false,
      timestamp: removeTimezoneOffset(new Date(timestamp)),
      usedAt: null,
    };
  });
}
