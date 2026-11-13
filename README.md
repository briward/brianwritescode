# brianwritescode

Brian's public scratchpad at [brianwritescode.com](https://brianwritescode.com): short notes and snippets, each filed under tags, with search in the browser.

It's a [Raptor](https://raptorjs.com) app on a Cloudflare Worker. Notes are MDX files built to static HTML by [`@raptor-js/pages`](https://github.com/raptor-js/pages).

## Run it

You need Node 26 and pnpm.

```bash
pnpm install
pnpm dev        # builds, then serves on http://localhost:8787 and rebuilds on change
```

## Write a note

Add a file to `pages/notes/`. The file name becomes the URL, so `pages/notes/git-undo.mdx` is published at `/notes/git-undo`.

````mdx
---
title: Undo the last commit
date: 2026-11-13
tags: [git]
---

Keep the changes staged:

```bash
git reset --soft HEAD~1
```
````

Each tag gets a page at `/tags/<tag>` and is searchable. The rules are in [docs/notes.md](docs/notes.md).

## Deploy

```bash
pnpm run deploy
```

This builds the site and deploys the `brianwritescode` Worker with the `brianwritescode.com` custom domain.

## More

- [docs/README.md](docs/README.md): structure, commands, gotchas
- [arch/](arch/): why it's built this way
