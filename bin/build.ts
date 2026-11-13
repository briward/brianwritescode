import { join } from "node:path";
import { cp, rm, writeFile } from "node:fs/promises";

import { Builder } from "@raptor-js/pages";

import site from "../config/site.ts";
import excerptOf from "../app/notes/excerpt.ts";
import pagesConfig from "../config/pages.ts";
import loadNotes from "../app/notes/load-notes.ts";
import writeTagPages from "../app/site/write-tag-pages.ts";
import buildCatalog, { tagUrlOf } from "../app/notes/catalog.ts";
import searchDocumentOf from "../app/notes/search-document.ts";
import { SEARCH_INDEX_PATH } from "../app/site/search-index-path.ts";

import type { TemplateMetadata } from "../app/site/template-metadata.ts";

/**
 * Build the site into `dist/`. Notes are read and checked first, so a bad note stops the build
 * before anything is written. Vite adds the scripts and styles afterwards (`pnpm build`).
 */
async function build(): Promise<void> {
  const { directories } = site;

  const notes = await loadNotes(directories.notes);
  const catalog = buildCatalog(notes);

  const metadata: TemplateMetadata = {
    site: { name: site.name, origin: site.origin, description: site.description },
    catalog,
    tagUrlOf,
    excerptOf,
  };

  await rm(directories.output, { recursive: true, force: true });
  await cp(directories.public, directories.output, { recursive: true });

  await new Builder({ ...pagesConfig, metadata: { ...metadata } }).build();

  const tagPageCount = await writeTagPages({
    metadata,
    viewsDirectory: directories.views,
    outputDirectory: directories.output,
  });

  await writeFile(
    join(directories.output, SEARCH_INDEX_PATH),
    JSON.stringify(catalog.notes.map(searchDocumentOf)),
    "utf-8",
  );

  console.log(`[build] ${notes.length} notes, ${tagPageCount} tag pages, search index written.`);
}

try {
  await build();
} catch (error) {
  console.error("[build] failed:", error instanceof Error ? error.message : error);

  process.exitCode = 1;
}
