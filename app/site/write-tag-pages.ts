import { join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

import vento from "ventojs";

import type { TemplateMetadata } from "./template-metadata.ts";

/**
 * The template every tag page is rendered with.
 */
const TAG_TEMPLATE = "tag.vto";

/**
 * What {@link writeTagPages} needs.
 */
export interface WriteTagPagesOptions {
  /**
   * The data every template gets; its catalog decides which pages exist.
   */
  readonly metadata: TemplateMetadata;

  /**
   * The Vento templates directory.
   */
  readonly viewsDirectory: string;

  /**
   * The built site's directory. Pages land at `tags/<name>.html` inside it.
   */
  readonly outputDirectory: string;
}

/**
 * Render one page per tag. `@raptor-js/pages` builds one page per MDX file, and tags have no file
 * of their own, so their pages are rendered here with the same templates.
 *
 * @param options What to render and where.
 *
 * @returns How many pages were written.
 */
export default async function writeTagPages(options: WriteTagPagesOptions): Promise<number> {
  const environment = vento({ includes: options.viewsDirectory });
  const { tags } = options.metadata.catalog;

  for (const tag of tags) {
    const page = await environment.run(TAG_TEMPLATE, {
      pathname: tag.url,
      tag,
      metadata: options.metadata,
    });

    const filename = join(options.outputDirectory, `${tag.url.slice(1)}.html`);

    await mkdir(join(filename, ".."), { recursive: true });
    await writeFile(filename, page.content, "utf-8");
  }

  return tags.length;
}
