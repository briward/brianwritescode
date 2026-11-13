import { expect, test } from "vitest";

import createNoteFinder from "./create-note-finder.ts";

import type { SearchDocument } from "../../../app/notes/search-document.ts";

/**
 * A search document with sensible defaults, overridden per test.
 */
function makeDocument(overrides: Partial<SearchDocument> = {}): SearchDocument {
  return {
    url: "/notes/a-note",
    title: "A note",
    date: "2026-11-13",
    tags: ["general"],
    text: "Nothing in particular.",
    ...overrides,
  };
}

const DOCUMENTS = [
  makeDocument({
    url: "/notes/wrangler-routes",
    title: "Wrangler routes must be an array",
    tags: ["wrangler", "cloudflare-workers"],
  }),
  makeDocument({
    url: "/notes/git-undo",
    title: "Undo the last commit",
    tags: ["git"],
    text: "Keep the changes staged with git reset --soft HEAD~1 and carry on.",
  }),
];

test("a word in the title finds the note", () => {
  const finder = createNoteFinder(DOCUMENTS);

  const actual = finder.find("wrangler");

  expect(actual[0]?.url).toBe("/notes/wrangler-routes");
});

test("code inside a note's text finds the note", () => {
  const finder = createNoteFinder(DOCUMENTS);

  const actual = finder.find("reset --soft");

  expect(actual.map((document) => document.url)).toContain("/notes/git-undo");
});

test("a # query lists the notes whose tags start with it", () => {
  const finder = createNoteFinder(DOCUMENTS);

  const actual = finder.find("#cloud");

  expect(actual.map((document) => document.url)).toEqual(["/notes/wrangler-routes"]);
});

test("an empty query, or a lone #, finds nothing", () => {
  const finder = createNoteFinder(DOCUMENTS);

  expect(finder.find("   ")).toEqual([]);
  expect(finder.find("#")).toEqual([]);
});
