import type { RedirectConfig } from "../app/redirect/redirect-config.ts";

export default {
  /**
   * @inheritdoc
   */
  targetOrigin: "https://brianwritescode.com",

  /**
   * @inheritdoc
   */
  status: 301,
} satisfies RedirectConfig;
