import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // 1. Глобальные исключения
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/*.tsbuildinfo',
      '**/coverage/**',
      'deploy/**',
      'workers/ocr/**',
    ],
  },

  // 2. Базовые строгие правила TypeScript для всего монорепозитория
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Базовый инвариант: Категорический запрет any
      '@typescript-eslint/no-explicit-any': 'error',

      // Строгий импорт типов (type-only imports)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      // Контроль неиспользуемых переменных
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // 3. Архитектурные границы монорепозитория (Monorepo Boundaries)
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'app-web', pattern: 'apps/web/**/*' },
        { type: 'app-api', pattern: 'apps/api/**/*' },
        { type: 'app-worker', pattern: 'apps/worker/**/*' },
        { type: 'app-maintenance', pattern: 'apps/maintenance/**/*' },
        { type: 'pkg-core', pattern: 'packages/core/**/*' },
        { type: 'pkg-infra', pattern: 'packages/infrastructure/**/*' },
        { type: 'pkg-contracts', pattern: 'packages/contracts/**/*' },
        { type: 'pkg-config', pattern: 'packages/config/**/*' },
      ],
      'boundaries/ignore': ['**/*.test.ts', '**/*.spec.ts'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'allow',
          message: 'Нарушение архитектурных границ монорепозитория: {{from.type}} не может импортировать {{target.type}}',
          policies: [
            // Чистое ядро (packages/core) может зависеть ТОЛЬКО от контрактов
            {
              from: { element: { type: 'pkg-core' } },
              allow: [{ to: { element: { type: ['pkg-core', 'pkg-contracts'] } } }],
            },
            // Фронтенд (apps/web) не имеет прямого доступа к API, воркерам и серверной инфраструктуре
            {
              from: { element: { type: 'app-web' } },
              disallow: [{ to: { element: { type: ['app-api', 'app-worker', 'app-maintenance', 'pkg-infra'] } } }],
            },
            // Серверные приложения не импортируют код фронтенда
            {
              from: { element: { type: ['app-api', 'app-worker', 'app-maintenance'] } },
              disallow: [{ to: { element: { type: 'app-web' } } }],
            },
            // Worker и Maintenance не импортируют модули API напрямую
            {
              from: { element: { type: ['app-worker', 'app-maintenance'] } },
              disallow: [{ to: { element: { type: 'app-api' } } }],
            },
          ],
        },
      ],
    },
  },

  // 4. Архитектура фронтенда Feature-Sliced Design (FSD) для apps/web/src
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'fsd-app', pattern: 'apps/web/src/_app/**/*' },
        { type: 'fsd-pages', pattern: 'apps/web/src/_pages/**/*' },
        { type: 'fsd-features', pattern: 'apps/web/src/features/**/*', capture: ['slice'] },
        { type: 'fsd-entities', pattern: 'apps/web/src/entities/**/*', capture: ['slice'] },
        { type: 'fsd-shared', pattern: 'apps/web/src/shared/**/*' },
      ],
    },
    rules: {
      // Иерархия слоев FSD: сверху вниз
      'boundaries/dependencies': [
        'error',
        {
          default: 'allow',
          message: 'Нарушение правила слоев FSD: {{from.type}} не может импортировать вышележащий {{target.type}}',
          policies: [
            {
              from: { element: { type: 'fsd-shared' } },
              disallow: [{ to: { element: { type: ['fsd-entities', 'fsd-features', 'fsd-pages', 'fsd-app'] } } }],
            },
            {
              from: { element: { type: 'fsd-entities' } },
              disallow: [{ to: { element: { type: ['fsd-features', 'fsd-pages', 'fsd-app'] } } }],
            },
            {
              from: { element: { type: 'fsd-features' } },
              disallow: [{ to: { element: { type: ['fsd-pages', 'fsd-app'] } } }],
            },
            {
              from: { element: { type: 'fsd-pages' } },
              disallow: [{ to: { element: { type: 'fsd-app' } } }],
            },
          ],
        },
      ],
    },
  },

  // 5. Правила Next.js и React Hooks для веб-приложения
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
