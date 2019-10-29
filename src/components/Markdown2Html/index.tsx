import React from 'react'
import MarkdownIt from 'markdown-it'
import mdItAnchor from 'markdown-it-anchor'
import 'github-markdown-css'

const mdItTaskLists = require('markdown-it-task-lists')
const mdItHLJS = require('markdown-it-highlightjs')
const mdItTOC = require('markdown-it-table-of-contents')
const mdItEmoji = require('markdown-it-emoji')
const emojiRegex = require('emoji-regex')()

const slugify = (text: string) => {
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
const md: MarkdownIt = new MarkdownIt({
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

export default ({ markdown }: { markdown: string }) => {
  let html = md.render(markdown)
  const div = document.createElement('div')
  div.innerHTML = html
  const imgs = div.querySelectorAll('img')
  for (let i = 0; i < imgs.length; i++) {
    console.info(imgs[i].src)
    // const src = imgs[i].src
    const path = `${window.location.host}${process.env.PUBLIC_URL}/`
    imgs[i].src = imgs[i].src.replace(path, `${path}markdown/`)
  }
  html = div.innerHTML
  return (
    <div
      style={{
        padding: 40,
      }}
      className="markdown-body"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}
