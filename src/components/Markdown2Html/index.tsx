import React from 'react'
import MarkdownIt from 'markdown-it'
import mdItAnchor from 'markdown-it-anchor'
import 'github-markdown-css'

import styled from 'styled-components'

const MarkdownDiv = styled.div`
  padding: 40px;
  display: flex;
  .outline {
    ul {
      padding-left: 16px;
      li {
        list-style: none;
        a {
          color: #606770;
        }
        margin-top: 12px;
        margin-bottom: 8px;
      }
    }
    h2,
    h3,
    h4,
    h5,
    h6 {
      a {
        color: #606770;
      }
      font-weight: normal;
      border: 0;
      margin-top: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      &: hover {
        text-decoration: underline;
      }
    }
    h2 {
      font-size: 14px;
    }
    h3 {
      font-size: 12px;
    }
    h4 {
      font-size: 10px;
    }
    h5 {
      font-size: 8px;
    }
    h6 {
      font-size: 6px;
    }
  }
`

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

const getOutLineUI = (html: string): any => {
  const outlineUI = []
  const div = document.createElement('div')
  div.innerHTML = html
  const subTitles: NodeListOf<HTMLElement> = div.querySelectorAll(
    'h1,h2,h3,h4,h5,h6'
  )
  let start = false
  for (let i = 0; i < subTitles.length; i++) {
    const sub = subTitles[i]
    /* eslint-disable no-continue */
    if (sub.tagName.toLocaleLowerCase() === 'h1') {
      start = true
      continue
    }
    if (!start) continue
    /* eslint-enable no-continue */
    if (sub.tagName.toLocaleLowerCase() === 'h2') {
      outlineUI.push(
        <h2
          style={{
            paddingLeft: 0 * 16,
          }}
        >
          <a href={`#${sub.id}`}>{sub.innerHTML}</a>
        </h2>
      )
    } else if (sub.tagName.toLocaleLowerCase() === 'h3') {
      outlineUI.push(
        <h3
          style={{
            paddingLeft: 1 * 16,
          }}
        >
          <a href={`#${sub.id}`}>{sub.innerHTML}</a>
        </h3>
      )
    } else if (sub.tagName.toLocaleLowerCase() === 'h4') {
      outlineUI.push(
        <h4
          style={{
            paddingLeft: 2 * 16,
          }}
        >
          <a href={`#${sub.id}`}>{sub.innerHTML}</a>
        </h4>
      )
    }
  }
  return outlineUI
}

export default ({ markdown }: { markdown: string }) => {
  let html = md.render(markdown)
  const div = document.createElement('div')
  div.innerHTML = html

  let outlineUI: any = div.querySelector('ul')
  console.info(outlineUI)
  if (outlineUI) {
    const outlineHtml =
      outlineUI.querySelector('ul') && outlineUI.querySelector('ul').outerHTML
    div.removeChild(outlineUI)
    outlineUI = (
      <div
        dangerouslySetInnerHTML={{
          __html: outlineHtml.replace(
            /a href="#([\d\D]*?)"/g,
            (_$0: string, $1: string) => {
              return `a href="#${$1.toLocaleUpperCase()}"`
            }
          ),
        }}
      />
    )
  } else {
    outlineUI = getOutLineUI(html)
  }

  const imgs = div.querySelectorAll('img')
  for (let i = 0; i < imgs.length; i++) {
    // console.info(imgs[i].src)
    // const src = imgs[i].src
    const path = `${window.location.host}${process.env.PUBLIC_URL}/`
    imgs[i].src = imgs[i].src.replace(path, `${path}markdown/`)
  }
  html = div.innerHTML

  return (
    <MarkdownDiv className="markdown-body">
      <div
        style={{
          flex: 3,
          overflowX: 'auto',
          minHeight: window.innerHeight - (60 + 20 + 16 + 40) - 60,
        }}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
      <div
        style={{
          flex: 1,
        }}
      >
        <div
          className="outline"
          style={{
            width: 300,
            overflow: 'auto',
            height: window.innerHeight - (60 + 20 + 16 + 40) - 60,
            position: 'fixed',
            right: 0,
            top: 60 + 20 + 16 + 40,
          }}
        >
          <div
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              borderLeft: '1px solid #d1d5da',
            }}
          >
            {outlineUI}
            <hr
              style={{
                height: 60,
                border: 0,
                backgroundColor: 'transparent',
              }}
            />
          </div>
        </div>
      </div>
    </MarkdownDiv>
  )
}
