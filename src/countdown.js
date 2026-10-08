const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function getCountdown(targetDate, now = new Date()) {
  const difference = Math.max(0, new Date(targetDate).getTime() - new Date(now).getTime());

  return {
    days: Math.floor(difference / DAY),
    hours: Math.floor((difference % DAY) / HOUR),
    minutes: Math.floor((difference % HOUR) / MINUTE),
    seconds: Math.floor((difference % MINUTE) / SECOND),
    isPast: difference === 0,
  };
}
