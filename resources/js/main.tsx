import { h, render } from "preact";

import Search from "./search/search.tsx";
import { showTimeAgo } from "./time-ago.ts";

/**
 * The browser entry: mounts the search island into the header and turns note dates into
 * "time ago" labels. Everything else on the page is static HTML.
 */
function mountSearch(): void {
  const element = document.getElementById("search");

  if (!element) {
    return;
  }

  render(h(Search, null), element);
}

mountSearch();
showTimeAgo(document, new Date());
