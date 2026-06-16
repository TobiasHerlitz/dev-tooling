# dev-tooling

Shared ESLint, Prettier, TypeScript, Vite, and Knip configs for the monorepo. Change once, applies everywhere. Designed for Bun workspaces — relies on Bun's dependency hoisting.

## Design decisions

**ESLint presets split by runtime** — React and Node/Bun have different globals and plugins. A single preset would need conditionals; two explicit presets are clearer.

**`@eslint-react/eslint-plugin` instead of `eslint-plugin-react`** — built for modern hooks-only React. The classic plugin carries rules for class components and patterns TypeScript already catches. `@eslint-react` starts from the other direction and only adds what TypeScript can't do. Hooks and refresh plugins stay separate — `@eslint-react` doesn't include them.

**`eslint-plugin-import-x` instead of `eslint-plugin-import`** — actively maintained fork with proper flat config support. 16 dependencies vs 117. Not using its `recommended` config because that enables rules TypeScript already covers (`named`, `default`, `no-unresolved`).

**Vite config lives here** — `build.target` and `tsconfig/react.json lib` both target ES2022. Co-locating them makes drift impossible. Consumers use `mergeConfig` to layer project-specific settings on top.

**ES2022 target** — Chrome 94+, Firefox 93+, Safari 15+ (late 2021). Safe for any greenfield project. Vite's default `modules` baseline maps roughly to ES2020 — bumped here explicitly.

## Setup

Add to your workspace's `package.json`:

```json
"devDependencies": {
  "dev-tooling": "workspace:*"
}
```

`eslint`, `prettier`, `knip`, and `bun-types` are dependencies of `dev-tooling` itself. Bun hoists them to the root `node_modules`, so their binaries and type declarations are available in every workspace without being listed as direct dependencies.

## ESLint

**React app:**

```js
// eslint.config.js
import reactConfig from 'dev-tooling/eslint/react'
export default reactConfig
```

**Bun backend:**

```js
// eslint.config.js
import nodeConfig from 'dev-tooling/eslint/node'
export default nodeConfig
```

## Prettier

Reference the config in `package.json` — Prettier resolves it via node module resolution:

```json
"prettier": "dev-tooling/prettier/prettier.js"
```

## TypeScript

**React app:**

```json
{
  "extends": "dev-tooling/tsconfig/react.json",
  "compilerOptions": {
    "paths": { "@components": ["./src/components"] }
  }
}
```

**Bun backend:**

```json
{
  "extends": "dev-tooling/tsconfig/node.json"
}
```

## Vite

The base config sets `plugins: [react()]` and `build.target: 'es2022'`. Use `mergeConfig` to add project-specific settings — plugins, aliases, server config:

```ts
// vite.config.ts
import { mergeConfig } from 'vite'
import base from 'dev-tooling/vite/react'

export default mergeConfig(base, {
  resolve: { alias: { '@components': '/src/components' } },
  server: { proxy: { '/api': 'http://localhost:3001' } },
})
```

## Knip

The Knip config lives in `knip/knip.json`. It's referenced from the root via `--config`:

```json
"knip": "knip --config packages/dev-tooling/knip/knip.json"
```

It configures `eslint.config.{js,ts}` as entry points per workspace (Knip's ESLint plugin handles root-level configs but misses workspace ones), suppresses unlisted-binary warnings for `eslint`, `prettier`, and `knip` (their binaries are hoisted from this package, not listed as direct deps in consumers), and ignores `prettier` and `bun-types` as unused dependencies of `dev-tooling` — they're consumed by consumers via tsconfig and the `"prettier"` field in `package.json`, which Knip doesn't trace.

Knip runs as part of the root `checks` script alongside eslint, prettier, and typecheck.
