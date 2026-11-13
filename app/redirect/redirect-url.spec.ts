import { expect, test } from "vitest";

import redirectUrlOf from "./redirect-url.ts";

const TARGET_ORIGIN = "https://brianwritescode.com";

test("the bare domain goes to the target's home page", () => {
  const actual = redirectUrlOf("https://briward.com/", TARGET_ORIGIN);

  expect(actual).toBe("https://brianwritescode.com/");
});

test("the path and query come along", () => {
  const actual = redirectUrlOf("https://www.briward.com/notes/x?ref=old#top", TARGET_ORIGIN);

  expect(actual).toBe("https://brianwritescode.com/notes/x?ref=old");
});

test("plain http is sent to the https target", () => {
  const actual = redirectUrlOf("http://briward.com/about", TARGET_ORIGIN);

  expect(actual).toBe("https://brianwritescode.com/about");
});
