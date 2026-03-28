# AGENTS.md

## Setup commands

- Install deps: `pnpm install`
- Start dev server: `pnpm run dev`
- Run tests: `pnpm run test`

## Use the Development Server, **not** `npm run build`

- **Always use `pnpm run dev`** while iterating on the application. This starts Next.js in development mode with hot-reload enabled.
- **Do _not_ run `pnpm run build` inside the agent session.** Running the production build command switches the `.next` folder to production assets which disables hot reload and can leave the development server in an inconsistent state. If a production build is required, do it outside of the interactive agent workflow.

## Coding Conventions

- Prefer TypeScript (`.tsx`/`.ts`) for new components and utilities.
- TypeScript strict mode
- Single quotes, no semicolons
- Use functional patterns
- Use default exports only for /pages components
- Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Working agreements

- Always run `pnpm run typecheck`, `pnpm prettier --write .`, `pnpm run lint` and `pnpm run test` after modifying JavaScript files.
- Prefer `pnpm` when installing dependencies.
- Ask for confirmation before adding new production dependencies.

## Testing instructions

- Run `pnpm run lint` before opening a pull request. The commit should pass all tests before you merge.
- After moving files or changing imports, run `pnpm lint --filter <project_name>` to be sure ESLint and TypeScript rules still pass.
