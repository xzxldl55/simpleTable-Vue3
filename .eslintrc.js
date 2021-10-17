// eslint-disable-next-line @typescript-eslint/no-var-requires

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  globals: {
    __LIB__: 'readonly',
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  rules: {
    // common
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'arrow-parens': ['error', 'as-needed'],
    // note you must disable the base rule as it can report incorrect errors
    // use '@typescript-eslint/brace-style': ['error', '1tbs']
    'brace-style': 'off',
    curly: ['error', 'all'],
    camelcase: ['error', { properties: 'never' }],
    'comma-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': 'error',
    indent: [2, 2, { SwitchCase: 1 }],
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'prefer-const': ['error', { destructuring: 'all' }],
    semi: ['error', 'never'],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],

    // ts
    '@typescript-eslint/brace-style': ['error', '1tbs'],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],

    // vue
    'vue/attribute-hyphenation': 'off',
    'vue/html-closing-bracket-spacing': 'error',
    'vue/max-attributes-per-line': 'off',
    'vue/require-default-prop': 'error',
    'vue/require-explicit-emits': 'error',

  },
  ignorePatterns: ['dist'],
}
