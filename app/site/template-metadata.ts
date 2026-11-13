import type { Note } from "../notes/note.ts";
import type { Catalog } from "../notes/catalog.ts";
import type { SiteConfig } from "./site-config.ts";

/**
 * What every template can read under `metadata`: the site's facts, the whole catalog, and the
 * helpers templates need to show a note.
 */
export interface TemplateMetadata {
  /**
   * The site's name, origin and default description.
   */
  readonly site: Pick<SiteConfig, "name" | "origin" | "description">;

  /**
   * Every note and tag.
   */
  readonly catalog: Catalog;

  /**
   * Where a tag's page lives, for templates that only hold the tag's name.
   */
  readonly tagUrlOf: (name: string) => string;

  /**
   * The start of a note's text for its teaser card.
   */
  readonly excerptOf: (note: Note) => string;
}
