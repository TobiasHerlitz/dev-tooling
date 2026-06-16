import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreBinaries: ['eslint', 'prettier', 'knip'],
  compilers: {
    toml: (text) => {
      const match = text.match(/scanner\s*=\s*"([^"]+)"/)
      return match ? `import "${match[1]}"` : ''
    },
  },
  workspaces: {
    '.': {
      entry: ['bunfig.toml'],
    },
    'packages/*': {
      entry: ['eslint.config.{js,ts}'],
    },
    'packages/dev-tooling': {
      ignoreDependencies: ['prettier', 'bun-types'],
    },
  },
};

export default config;
