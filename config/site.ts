import { join } from "node:path";

import type { SiteConfig } from "../app/site/site-config.ts";

/**
 * The repo root. Every script runs from it through pnpm, as the raptorjs.com website does.
 */
const ROOT_DIRECTORY = process.cwd();

export default {
  /**
   * @inheritdoc
   */
  name: "brianwritescode",

  /**
   * @inheritdoc
   */
  origin: "https://brianwritescode.com",

  /**
   * @inheritdoc
   */
  description: "Brian's scratchpad: short notes and snippets, tagged and searchable.",

  /**
   * @inheritdoc
   */
  directories: {
    pages: join(ROOT_DIRECTORY, "pages"),
    notes: join(ROOT_DIRECTORY, "pages", "notes"),
    views: join(ROOT_DIRECTORY, "resources", "views"),
    public: join(ROOT_DIRECTORY, "public"),
    output: join(ROOT_DIRECTORY, "dist"),
  },
} satisfies SiteConfig;
