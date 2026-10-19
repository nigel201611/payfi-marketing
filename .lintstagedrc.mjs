import path from 'node:path';

const toPosix = (p) => p.replace(/\\/g, '/');
const toRepoRelative = (f) => toPosix(path.relative(process.cwd(), path.resolve(f)));
const inScope = (f) => {
  const p = toRepoRelative(f);
  return p.startsWith('src/') || p.startsWith('__tests__/') || p.startsWith('e2e/');
};
const isVendored = (f) => toRepoRelative(f).startsWith('src/components/react-bits/');
const scopeFilter = (filenames) => filenames.filter((f) => inScope(f) && !isVendored(f));
const shellQuote = (f) => JSON.stringify(f);

const lintStagedConfig = {
  '*.{js,jsx,ts,tsx,mjs,cjs}': (filenames) => {
    const scoped = scopeFilter(filenames);
    if (scoped.length === 0) return [];
    return [
      `prettier --write ${scoped.map(shellQuote).join(' ')}`,
      `eslint --fix --max-warnings=0 ${scoped.map(shellQuote).join(' ')}`,
    ];
  },
  '*.{json,css,md}': (filenames) => {
    const scoped = scopeFilter(filenames);
    if (scoped.length === 0) return [];
    return `prettier --write ${scoped.map(shellQuote).join(' ')}`;
  },
};

export default lintStagedConfig;
