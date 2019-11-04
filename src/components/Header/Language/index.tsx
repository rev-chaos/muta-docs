import React, { useState } from 'react'
import styled from 'styled-components'
import i18n, { languages } from '../../../locals'

const LanguageDiv = styled.div`
  width: 120px;
  height: 100%;
  // border-bottom: 1px solid black;
  position: relative;
  .trigger {
    &::after {
      content: '▾';
    }
    &.trigger--open::after {
      content: '▴';
    }
  }

  .languagePanel {
    background-color: rgb(36, 41, 46);
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    line-height: 40px;
    cursor: pointer;
    &:hover {
      font-weight: bold;
    }
  }
`
export default () => {
  const [open, setOpen] = useState(false)

  return (
    <LanguageDiv>
      <div
        tabIndex={-1}
        role="button"
        style={{
          cursor: 'pointer',
        }}
        className={open ? 'trigger trigger--open' : 'trigger'}
        onClick={(): void => setOpen(!open)}
        onKeyPress={() => {}}
      >
        {i18n.t(`app.languages.${i18n.language}`)}
      </div>
      <div
        tabIndex={-1}
        role="button"
        className={open ? 'mask' : 'mask mask--close'}
        onKeyPress={() => {}}
        onClick={() => setOpen(false)}
      >
        <div
          tabIndex={-1}
          role="button"
          className="languagePanel"
          onClick={e => e.stopPropagation()}
          onKeyPress={() => {}}
        >
          {languages.map((language: string) => {
            if (i18n.language === language) return null

            return (
              <div
                tabIndex={-1}
                role="button"
                onKeyPress={() => {}}
                onClick={() => {
                  i18n.changeLanguage(language)
                  window.location.href = `${window.location.protocol}//${window.location.host}${process.env.PUBLIC_URL}/`
                }}
              >
                {i18n.t(`app.languages.${language}`)}
              </div>
            )
          })}
        </div>
      </div>
    </LanguageDiv>
  )
}
