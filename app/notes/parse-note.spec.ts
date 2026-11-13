import { expect, test } from "vitest";

import parseNote from "./parse-note.ts";
import InvalidNoteError from "./errors/invalid-note-error.ts";

const VALID_SOURCE = `---
title: Custom domains in wrangler
date: 2026-11-13
tags: [cloudflare-workers, wrangler]
---

Routes need to be an array.
`;

/**
 * A note file with the given front matter lines and a one-line body.
 */
function makeSource(frontMatter: string): string {
  return `---\n${frontMatter}\n---\n\nBody.\n`;
}

// Happy path.

test("parseNote reads the slug, url, title, day, tags and body", () => {
  const input = { filename: "/site/pages/notes/custom-domains.mdx", source: VALID_SOURCE };

  const actual = parseNote(input);

  expect(actual).toEqual({
    slug: "custom-domains",
    url: "/notes/custom-domains",
    title: "Custom domains in wrangler",
    date: "2026-11-13",
    tags: ["cloudflare-workers", "wrangler"],
    body: "Routes need to be an array.",
  });
});

test("parseNote accepts a quoted day", () => {
  const input = {
    filename: "quoted.mdx",
    source: makeSource('title: Quoted\ndate: "2026-01-05"\ntags: [notes]'),
  };

  const actual = parseNote(input);

  expect(actual.date).toBe("2026-01-05");
});

// File names.

test("parseNote rejects a file name that is not a URL name", () => {
  const input = { filename: "My Note.mdx", source: VALID_SOURCE };

  expect(() => parseNote(input)).toThrow(InvalidNoteError);
});

// Front matter.

test("parseNote rejects a note without a title", () => {
  const input = { filename: "untitled.mdx", source: makeSource("date: 2026-11-13\ntags: [x]") };

  expect(() => parseNote(input)).toThrow(/needs a title/);
});

test("parseNote rejects a day that is not on the calendar", () => {
  const input = {
    filename: "late.mdx",
    source: makeSource('title: Late\ndate: "2026-02-31"\ntags: [x]'),
  };

  expect(() => parseNote(input)).toThrow(/YYYY-MM-DD/);
});

test("parseNote rejects a note without tags", () => {
  const input = { filename: "bare.mdx", source: makeSource("title: Bare\ndate: 2026-11-13") };

  expect(() => parseNote(input)).toThrow(/at least one tag/);
});

test("parseNote rejects a tag with capitals or spaces", () => {
  const input = {
    filename: "shouty.mdx",
    source: makeSource("title: Shouty\ndate: 2026-11-13\ntags: [TypeScript Tips]"),
  };

  expect(() => parseNote(input)).toThrow(/lowercase words joined by hyphens/);
});

test("parseNote rejects a tag listed twice", () => {
  const input = {
    filename: "twice.mdx",
    source: makeSource("title: Twice\ndate: 2026-11-13\ntags: [git, git]"),
  };

  expect(() => parseNote(input)).toThrow(/listed twice/);
});

test("the error names the file at fault", () => {
  const input = { filename: "pages/notes/bare.mdx", source: makeSource("title: Bare") };

  const actual = (() => {
    try {
      parseNote(input);
    } catch (error) {
      return error;
    }

    return undefined;
  })();

  expect(actual).toBeInstanceOf(InvalidNoteError);
  expect((actual as InvalidNoteError).filename).toBe("pages/notes/bare.mdx");
});
