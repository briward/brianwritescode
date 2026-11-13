/**
 * The length of a day in milliseconds.
 */
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The steps a "time ago" label moves through, smallest first, each with how many days it spans.
 * A note's date has no time of day, so days are the smallest step.
 */
const STEPS = [
  { unit: "day", days: 1, below: 7 },
  { unit: "week", days: 7, below: 30 },
  { unit: "month", days: 30, below: 365 },
  { unit: "year", days: 365, below: Number.POSITIVE_INFINITY },
] as const;

/**
 * Words like "today", "3 days ago" or "last month".
 */
const FORMAT = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

/**
 * Set on a date once it reads "time ago". The stylesheet keeps dates hidden until then, so the
 * plain date never flashes on load.
 */
export const TIME_AGO_READY_ATTRIBUTE = "data-time-ago-ready";

/**
 * How long ago a note's day was, in words.
 *
 * @param day The note's day, as `YYYY-MM-DD`.
 * @param today The reader's day, as `YYYY-MM-DD`.
 *
 * @returns The label, such as "yesterday" or "2 weeks ago".
 */
export default function timeAgoOf(day: string, today: string): string {
  // Both days are read at UTC midnight so the gap is a whole number of days everywhere.
  const daysAgo = Math.round((Date.parse(today) - Date.parse(day)) / DAY_MS);
  const step = STEPS.find((candidate) => Math.abs(daysAgo) < candidate.below) ?? STEPS[3];

  return FORMAT.format(-Math.round(daysAgo / step.days), step.unit);
}

/**
 * The reader's own day, as `YYYY-MM-DD` in their time zone.
 *
 * @param now The current moment.
 *
 * @returns The day.
 */
export function localDayOf(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${date}`;
}

/**
 * Rewrite every `<time data-time-ago>` as a "time ago" label. The built HTML keeps the plain
 * date, so the label is never stale and the page still reads without scripts.
 *
 * @param root Where to look for dates.
 * @param now The current moment.
 */
export function showTimeAgo(root: ParentNode, now: Date): void {
  const today = localDayOf(now);

  for (const element of root.querySelectorAll<HTMLTimeElement>("time[data-time-ago]")) {
    element.textContent = timeAgoOf(element.dateTime, today);
    element.setAttribute(TIME_AGO_READY_ATTRIBUTE, "");
  }
}
