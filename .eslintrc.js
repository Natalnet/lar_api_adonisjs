module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: ['standard', 'prettier', 'prettier/standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    use: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'space-before-function-paren': 'off'
  }
}
