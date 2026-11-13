import { expect, test } from "vitest";

import excerptOf, { EXCERPT_LENGTH } from "./excerpt.ts";

import type { Note } from "./note.ts";

/**
 * A note with the given body.
 */
function makeNote(body: string): Note {
  return { slug: "a", url: "/notes/a", title: "A", date: "2026-11-13", tags: ["x"], body };
}

test("a short note's excerpt is its whole text, without markup", () => {
  const actual = excerptOf(makeNote("Use **`git reset --soft`** to undo."));

  expect(actual).toBe("Use git reset --soft to undo.");
});

test("a long note is cut at a word and ends in an ellipsis", () => {
  const input = makeNote(`${"word ".repeat(60)}end`);

  const actual = excerptOf(input);

  expect(actual.length).toBeLessThanOrEqual(EXCERPT_LENGTH + 1);
  expect(actual.endsWith("word…")).toBe(true);
});
