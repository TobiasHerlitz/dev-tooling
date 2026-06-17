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
      ignoreDependencies: ['@tobiasherlitz/dev-tooling'],
    },
    'packages/*': {
      entry: ['eslint.config.{js,ts}'],
    },
  },
};

export default config;
