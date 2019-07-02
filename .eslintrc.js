module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: ['error', 'single'],
    'prettier/prettier': ['error', { 'singleQuote': true }],
    'no-unused-vars': 'warn',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
