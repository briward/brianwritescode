import router from "@raptor-js/router";
import errorHandler from "@raptor-js/error";

import type { Config } from "@raptor-js/kernel";

import errorConfig from "./error.ts";
import routerConfig from "./router.ts";

export default {
  /**
   * @inheritdoc
   *
   * Pages, tag pages, scripts and the search index never reach the Worker: Cloudflare serves
   * them as static assets, and only requests they do not answer come here.
   */
  middleware: [router(routerConfig)],

  /**
   * @inheritdoc
   */
  errorHandler: errorHandler(errorConfig),
} satisfies Config;
