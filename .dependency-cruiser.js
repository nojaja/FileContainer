module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: '循環依存を禁止する',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'いずれのモジュールからも参照されていないファイルを警告する',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$',
          '\\.d\\.ts$',
          '(^|/)tsconfig\\.json$',
          '(^|/)(babel|webpack|jest)\\.config\\.(js|cjs|mjs|ts|json)$',
          '(^|/)index\\.ts$',
        ],
      },
      to: {},
    },
    {
      name: 'no-non-package-json',
      severity: 'error',
      comment: 'node_modules 内で package.json に未登録の依存を禁止する',
      from: {},
      to: {
        dependencyTypes: ['npm-no-pkg', 'npm-unknown'],
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: './tsconfig.json',
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
      archi: {
        collapsePattern:
          '^(packages|src|lib|app|bin|test(s?)|spec(s?))/[^/]+|node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
    },
  },
};
