# AGENTS.md

Start here before changing anything in this repo.

1. Read [docs/README.md](docs/README.md) for the structure, the commands and the gotchas.
2. Read [docs/notes.md](docs/notes.md) before touching notes, tags or search.
3. Decisions and their reasons are in [arch/](arch/). A new runtime dependency or a new pattern needs a new ADR.

House style (Brian's codebase conventions):

- TypeScript strict. No `any`, no TS `enum`, never `else`.
- A docblock on every declaration (specs are exempt).
- Blank lines between steps. Imports grouped external, then internal, then type-only.
- Vitest specs live beside the code as `*.spec.ts`, named as behaviour sentences.
- Domain code (`app/notes/`) never imports from `bin/`, `config/` or `resources/`.

Before finishing, all of these must pass:

```bash
pnpm typecheck && pnpm test && pnpm lint && pnpm format:check && pnpm build
```
