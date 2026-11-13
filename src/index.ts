import { Kernel } from "@raptor-js/kernel";

/** Raptor kernel serving the landing page. */
const kernel = new Kernel();

/** Return the styled landing page for every request. */
kernel.use(() => {
  return new Response(renderPage(), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});

/** Render the full HTML landing page. */
function renderPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Brian Writes Code</title>
    <link
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossorigin
    />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <style>
      *,
      *::before,
      *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #1e1e2e;
        color: #b4bcc8;
        font-family: "IBM Plex Mono", monospace;
      }

      h1 {
        font-size: clamp(2rem, 6vw, 5rem);
        font-weight: 700;
        color: #cdd6e0;
        letter-spacing: -0.02em;
      }
    </style>
  </head>
  <body>
    <h1>Hello, I'm Brian</h1>
  </body>
</html>`;
}

export default {
  /** Cloudflare Worker fetch handler. */
  fetch: (request: Request): Promise<Response> => {
    return kernel.respond(request);
  },
};
