import { expect, test } from "vitest";

import buildCatalog from "./catalog.ts";

import type { Note } from "./note.ts";

/**
 * A note with sensible defaults, overridden per test.
 */
function makeNote(overrides: Partial<Note> = {}): Note {
  const slug = overrides.slug ?? "a-note";

  return {
    slug,
    url: `/notes/${slug}`,
    title: "A note",
    date: "2026-11-13",
    tags: ["general"],
    body: "Body.",
    ...overrides,
  };
}

test("notes are listed newest first", () => {
  const inputOlder = makeNote({ slug: "older", date: "2026-01-01" });
  const inputNewer = makeNote({ slug: "newer", date: "2026-11-13" });

  const actual = buildCatalog([inputOlder, inputNewer]);

  expect(actual.notes.map((note) => note.slug)).toEqual(["newer", "older"]);
});

test("notes from the same day are ordered by title", () => {
  const inputB = makeNote({ slug: "b", title: "Bravo" });
  const inputA = makeNote({ slug: "a", title: "Alpha" });

  const actual = buildCatalog([inputB, inputA]);

  expect(actual.notes.map((note) => note.slug)).toEqual(["a", "b"]);
});

test("each tag lists its notes newest first, and tags are alphabetical", () => {
  const inputOlder = makeNote({ slug: "older", date: "2026-01-01", tags: ["wrangler", "git"] });
  const inputNewer = makeNote({ slug: "newer", date: "2026-11-13", tags: ["wrangler"] });

  const actual = buildCatalog([inputOlder, inputNewer]);

  expect(actual.tags.map((tag) => [tag.name, tag.url, tag.notes.map((note) => note.slug)])).toEqual(
    [
      ["git", "/tags/git", ["older"]],
      ["wrangler", "/tags/wrangler", ["newer", "older"]],
    ],
  );
});

test("an empty notes directory gives an empty catalog", () => {
  const actual = buildCatalog([]);

  expect(actual).toEqual({ notes: [], tags: [] });
});
