const MarkdownIt = require('markdown-it')
let mdItAnchor = require('markdown-it-anchor')

if (typeof window !== 'undefined') {
  mdItAnchor = mdItAnchor.default
}
const mdItTaskLists = require('markdown-it-task-lists')
const mdItHLJS = require('markdown-it-highlightjs')
const mdItTOC = require('markdown-it-table-of-contents')
const mdItEmoji = require('markdown-it-emoji')
const emojiRegex = require('emoji-regex')()

const slugify = text => {
  return (
    text
      .toLowerCase()
      .replace(/\s/g, '-')
      // Remove punctuations other than hyphen and underscore
      .replace(
        /[`~!@#$%^&*()+=<>?,./:;"'|{}[\]\\\u2000-\u206F\u2E00-\u2E7F]/g,
        ''
      )
      // Remove emojis
      .replace(emojiRegex, '')
      // Remove CJK punctuations
      .replace(
        /[\u3000。？！，、；：“”【】（）〔〕［］﹃﹄“”‘’﹁﹂—…－～《》〈〉「」]/g,
        ''
      )
  )
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(mdItAnchor, {
    // permalink: true,
    // permalinkBefore: true,
    // permalinkSymbol: '§',
    // level: [1, 2],
  })
  .use(mdItTaskLists)
  .use(mdItHLJS)
  .use(mdItEmoji)
  .use(mdItTOC, {
    includeLevel: [1, 2, 3, 4, 5, 6],
    slugify,
  })

const fixEncodeCharacters = html => {
  // return html
  return html
    .replace(/a href="#([\d\D]*?)"/g, (_$0, $1) => {
      // return `a href="#${$1.toLocaleUpperCase()}"`
      return `a href="#${decodeURI($1)}"`
    })
    .replace(/id="([\d\D]*?)"/g, (_$0, $1) => {
      // return `a href="#${$1.toLocaleUpperCase()}"`
      // console.error($1,1111111111)
      return `id="${decodeURI($1)}"`
    })
}

module.exports = {
  markdown2html: markdown => {
    return fixEncodeCharacters(md.render(markdown))
  },
}
