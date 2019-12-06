module.exports = {
  extends: ['standard', 'prettier', 'prettier/standard'],
  parser: 'babel-eslint',
  globals: {
    use: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      impliedStrict: true,
      classes: true
    }
  },
  env: {
    node: true
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'none',
        singleQuote: true,
        printWidth: 80
      }
    ]
  }
};
