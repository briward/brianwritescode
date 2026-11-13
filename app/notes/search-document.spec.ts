import { expect, test } from "vitest";

import searchDocumentOf, { plainTextOf } from "./search-document.ts";

test("the search document carries the note's url, title, day and tags", () => {
  const input = {
    slug: "git-undo",
    url: "/notes/git-undo",
    title: "Undo the last commit",
    date: "2026-11-13",
    tags: ["git"],
    body: "Keep the changes staged.",
  };

  const actual = searchDocumentOf(input);

  expect(actual).toEqual({
    url: "/notes/git-undo",
    title: "Undo the last commit",
    date: "2026-11-13",
    tags: ["git"],
    text: "Keep the changes staged.",
  });
});

test("code stays searchable while fences and backticks go", () => {
  const input = "Run this:\n\n```bash\ngit reset --soft HEAD~1\n```\n\nThen `git status`.";

  const actual = plainTextOf(input);

  expect(actual).toBe("Run this: git reset --soft HEAD~1 Then git status.");
});

test("headings, emphasis, links, lists and JSX keep only their words", () => {
  const input = [
    "import Callout from './callout.tsx'",
    "",
    "## A **bold** heading",
    "",
    "- See [the docs](https://raptorjs.com/docs)",
    "",
    '<Callout kind="tip">Use _this_</Callout>',
  ].join("\n");

  const actual = plainTextOf(input);

  expect(actual).toBe("A bold heading See the docs Use this");
});

test("nested marks all go, and snake_case names in code stay whole", () => {
  const input = "Call **`parse_minutes_after_midnight`** with _care_.";

  const actual = plainTextOf(input);

  expect(actual).toBe("Call parse_minutes_after_midnight with care.");
});

test("a table keeps its cell words and loses its pipes and divider row", () => {
  const input = ["| Command | Exit code |", "| :--- | ---: |", "| `pnpm lint` | 1 |"].join("\n");

  const actual = plainTextOf(input);

  expect(actual).toBe("Command Exit code pnpm lint 1");
});

test("a pipe inside code is kept", () => {
  const input = "```bash\nps aux | grep wrangler\n```";

  const actual = plainTextOf(input);

  expect(actual).toBe("ps aux | grep wrangler");
});
