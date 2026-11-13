import type { Config } from "@raptor-js/pages";

import site from "./site.ts";
import SyntaxHighlightingPlugin from "../app/site/syntax-highlighting-plugin.ts";

export default {
  /**
   * @inheritdoc
   */
  extensions: ["mdx"],

  /**
   * @inheritdoc
   */
  pageDirectory: site.directories.pages,

  /**
   * @inheritdoc
   */
  templateDirectory: site.directories.views,

  /**
   * @inheritdoc
   *
   * Every page is built ahead of time; Cloudflare serves the HTML as static assets.
   */
  static: {
    enabled: true,
    outputDirectory: site.directories.output,
  },

  /**
   * @inheritdoc
   */
  plugins: [new SyntaxHighlightingPlugin()],
} satisfies Config;
