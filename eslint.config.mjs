import globals from 'globals';
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

const commonRules = {
  '@stylistic/js/max-len': ['error', { 'code': 80 }],
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
      '@stylistic/js': stylisticJs
    },
    languageOptions: {
      sourceType: 'commonjs',
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
