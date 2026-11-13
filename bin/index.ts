import { Kernel } from "@raptor-js/kernel";

import config from "../raptor.config.ts";

/**
 * The Raptor kernel answering every request the static assets do not.
 */
const app = new Kernel(config.kernel);

export default {
  /**
   * Cloudflare's entry point: hand the request to Raptor.
   *
   * @param request The incoming request.
   *
   * @returns Raptor's response.
   */
  fetch(request: Request): Promise<Response> {
    return app.respond(request);
  },
};
