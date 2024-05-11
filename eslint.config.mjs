import globals from 'globals';

import path from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: pluginJs.configs.recommended,
});

export default [
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	{ languageOptions: { globals: globals.browser } },
	...compat.extends('airbnb-base'),
	eslintConfigPrettier,

	//  Override specific rules here
	{
		rules: {
			'no-console': 'off',
			'no-plusplus': 'off',
			'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
      'no-unused-vars': 'off',
      'no-shadow': 'off',
      'no-unused-expressions': 'off',
      'no-const-assign': 'off',
      'no-empty-pattern': 'off',
      'import/no-unresolved': 'off',
      'no-undef': 'off'
		},
		languageOptions: {
			ecmaVersion: 2023,
		},
	},
];
