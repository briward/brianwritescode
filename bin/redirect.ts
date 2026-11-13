import { Kernel } from "@raptor-js/kernel";

import config from "../config/redirect.ts";
import redirectUrlOf from "../app/redirect/redirect-url.ts";

import type { Context } from "@raptor-js/types";

/**
 * The Raptor kernel behind briward.com and www.briward.com. Its only job is to send every
 * request on to brianwritescode.com (redirect.wrangler.jsonc).
 */
const app = new Kernel({
  middleware: [
    (context: Context) =>
      Response.redirect(redirectUrlOf(context.request.url, config.targetOrigin), config.status),
  ],
});

export default {
  /**
   * Cloudflare's entry point: hand the request to Raptor.
   *
   * @param request The incoming request.
   *
   * @returns The redirect.
   */
  fetch(request: Request): Promise<Response> {
    return app.respond(request);
  },
};
