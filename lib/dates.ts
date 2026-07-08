import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfWeek,
  subDays,
} from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export function getTodayInTimezone(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
}

export function getDateStrip(timezone: string, days = 7): string[] {
  const today = getTodayInTimezone(timezone);
  const todayDate = parseISO(today);
  return Array.from({ length: days }, (_, i) =>
    format(subDays(todayDate, days - 1 - i), "yyyy-MM-dd"),
  );
}

export function formatLogDate(date: string): string {
  return format(parseISO(date), "EEE MMM d");
}

export function getWeekStart(date: string): string {
  return format(startOfWeek(parseISO(date), { weekStartsOn: 0 }), "yyyy-MM-dd");
}

export function daysAgo(date: string, timezone: string): number {
  const today = getTodayInTimezone(timezone);
  return differenceInCalendarDays(parseISO(today), parseISO(date));
}

export function isWithinBackEditWindow(
  date: string,
  timezone: string,
  windowDays = 7,
): boolean {
  const diff = daysAgo(date, timezone);
  return diff >= 0 && diff < windowDays;
}

export function getRangeDates(
  endDate: string,
  rangeDays: number,
): { start: string; end: string } {
  const end = parseISO(endDate);
  const start = subDays(end, rangeDays - 1);
  return {
    start: format(start, "yyyy-MM-dd"),
    end: endDate,
  };
}

export function isSundayInTimezone(timezone: string): boolean {
  const zoned = toZonedTime(new Date(), timezone);
  return zoned.getDay() === 0;
}

export function isEveningReminderWindow(timezone: string): boolean {
  // The single daily cron fires at 00:30 UTC, which lands at 19:30 or 20:30
  // US Eastern depending on DST. Accept 19:00+ so the reminder survives
  // the winter offset shift.
  const hour = Number(formatInTimeZone(new Date(), timezone, "H"));
  return hour >= 19;
}

export function addDaysToDate(date: string, count: number): string {
  return format(addDays(parseISO(date), count), "yyyy-MM-dd");
}
