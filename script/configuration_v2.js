const path = require('path')

module.exports = {
  input: path.join(__dirname, '../muta-docs/docs'),
  output: path.join(__dirname, '../public/markdown'),
  dataNameTpl: path.join(__dirname, '../public/data-[language].json'),
  dataMenu: path.join(__dirname, '../muta-docs/docs/[language]/index.md'),
}
