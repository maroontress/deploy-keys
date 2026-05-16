import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

const commonRules = {
  '@stylistic/max-len': ['error', { 'code': 80 }],
  'prefer-const': 'warn',
  'line-comment-position': ['warn', { 'position': 'above' }],
  'camelcase': 'warn',
  'no-const-assign': 'warn',
  'no-this-before-super': 'warn',
  'no-undef': 'warn',
  'no-unreachable': 'warn',
  'no-unused-vars': 'warn',
  'constructor-super': 'warn',
  'valid-typeof': 'warn',
};

export default [
  js.configs.recommended,
  {
    files: ['*.js'],
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      }
    },
    rules: commonRules,
  },
  {
    ignores: [
      '.*/**/*',
      'dist/**/*',
      'node_modules/**/*',
      '*.config.mjs']
  }
];
