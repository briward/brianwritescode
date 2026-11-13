/**
 * One note in the scratchpad: a short MDX file under `pages/notes/`, filed under one or more tags.
 */
export interface Note {
  /**
   * The note's file name without its extension. Lowercase words joined by hyphens.
   */
  readonly slug: string;

  /**
   * Where the note is published, `/notes/<slug>`.
   */
  readonly url: string;

  /**
   * The note's title, from its front matter.
   */
  readonly title: string;

  /**
   * The day the note was written, as `YYYY-MM-DD`.
   */
  readonly date: string;

  /**
   * The tags the note is filed under, in the order the front matter lists them.
   */
  readonly tags: readonly string[];

  /**
   * The note's MDX source without its front matter.
   */
  readonly body: string;
}
