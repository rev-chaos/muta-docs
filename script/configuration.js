const path = require('path')

module.exports = {
  version: 1,
  input: path.join(__dirname, '../muta-docs/docs'),
  output: path.join(__dirname, '../public/markdown'),
  dict: path.join(__dirname, '../public/markdown.json'),
}
