import React from 'react'
import 'github-markdown-css'

import styled from 'styled-components'

const { markdown2html } = require('../../utils/markdown2html.js')

const MarkdownDiv = styled.div`
  padding: 0 40px;
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

const fixEncodeCharacters = (html: string): string => {
  // return html
  return html
    .replace(/a href="#([\d\D]*?)"/g, (_$0: string, $1: string) => {
      // return `a href="#${$1.toLocaleUpperCase()}"`
      return `a href="#${decodeURI($1)}"`
    })
    .replace(/id="([\d\D]*?)"/g, (_$0: string, $1: string) => {
      // return `a href="#${$1.toLocaleUpperCase()}"`
      // console.error($1,1111111111)
      return `id="${decodeURI($1)}"`
    })
}

export default ({ value, url }: { value: any; url: string }) => {
  let html = markdown2html(value.markdown || '')
  const div = document.createElement('div')
  div.innerHTML = fixEncodeCharacters(html)

  let outlineUI: any = div.querySelector('ul')
  if (outlineUI) {
    const outlineHtml =
      outlineUI.querySelector('ul') && outlineUI.querySelector('ul').outerHTML
    div.removeChild(outlineUI)
    outlineUI = (
      <div
        dangerouslySetInnerHTML={{
          __html: outlineHtml,
        }}
      />
    )
  } else {
    outlineUI = getOutLineUI(html)
  }

  const imgs = div.querySelectorAll('img')
  for (let i = 0; i < imgs.length; i++) {
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
          minHeight: window.innerHeight - (60 + 16) * 2,
        }}
      >
        <div
          style={{
            float: 'right',
          }}
        >
          <a
            href={`https://github.com/nervosnetwork/muta-docs/tree/master/docs${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="button">Edit</div>
          </a>
        </div>
        <div
          style={{
            marginTop: -28,
          }}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
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
            height: window.innerHeight - (60 + 16) * 2,
            position: 'fixed',
            right: 0,
            top: 60 + 16,
          }}
        >
          <div
            style={{
              // paddingLeft: 20,
              // paddingRight: 20,
              marginTop: 24,
              padding: 20,
              fontSize: 13,
              borderLeft: '1px solid #d1d5da',
            }}
          >
            {outlineUI}
          </div>
          {/* <hr
            style={{
              height: 60,
              border: 0,
              backgroundColor: 'transparent',
            }}
          /> */}
        </div>
      </div>
    </MarkdownDiv>
  )
}
