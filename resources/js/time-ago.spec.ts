import { expect, test } from "vitest";

import timeAgoOf, { localDayOf } from "./time-ago.ts";

const TODAY = "2026-11-13";

test("a note from today, or yesterday, says so in words", () => {
  expect(timeAgoOf("2026-11-13", TODAY)).toBe("today");
  expect(timeAgoOf("2026-11-12", TODAY)).toBe("yesterday");
});

test("a note from earlier this week counts days", () => {
  const actual = timeAgoOf("2026-11-10", TODAY);

  expect(actual).toBe("3 days ago");
});

test("older notes count weeks, months, then years", () => {
  expect(timeAgoOf("2026-10-30", TODAY)).toBe("2 weeks ago");
  expect(timeAgoOf("2026-08-13", TODAY)).toBe("3 months ago");
  expect(timeAgoOf("2024-11-13", TODAY)).toBe("2 years ago");
});

test("the reader's day comes from their own clock", () => {
  const input = new Date(2026, 0, 5, 23, 30);

  const actual = localDayOf(input);

  expect(actual).toBe("2026-01-05");
});
