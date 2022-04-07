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
