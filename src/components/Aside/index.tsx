import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import styled from 'styled-components'

const Aside = styled.aside`
  width: 300px;
  // border-radius: 3px 3px;
  padding: 16px;
  background-color: #fff;
  border-right: 1px solid #d1d5da;
  overflow-y: auto;
  position: fixed;
  top: 60px;
  left: 0;
  z-index: 9;
  .menuFolder {
    font-size: 16px;
    // font-weight: bold;
    .menuFolderName {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &::before {
        content: '▸';
      }
    }
    > div {
      display: none;
    }
    > .menuFolderName {
      display: block;
      &: hover {
        font-weight: bold;
      }
    }
    &.menuFolder--open {
      > div {
        display: block;
      }
      .menuFolderName {
        &::before {
          content: '▾';
        }
      }
    }
    &.active {
      // > div {
      //   display: block;
      // }
      > .menuFolderName {
        font-weight: bold;
      }
    }
  }
  .menu {
    margin-top: 5px;
    margin-bottom: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: normal;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.active,&: hover {
      // width: 100%;
      // background-color: lightgrey;
      font-weight: bold;
    }
  }
`

const buildMenu = (rootMenuObj: any, strs: string[]) => {
  const buildSubMenu = (
    parentMenuObj: any,
    title: string,
    fullPath: string
  ) => {
    if (!parentMenuObj[title]) {
      if (title.endsWith('.md')) {
        parentMenuObj[title] = fullPath // eslint-disable-line no-param-reassign
      } else {
        /* eslint-disable no-param-reassign */
        parentMenuObj[title] = {
          //
        }
        /* eslint-enable no-param-reassign */
      }
    }
  }
  let parentMenuObj = rootMenuObj
  for (let i = 1; i < strs.length; i++) {
    buildSubMenu(parentMenuObj, strs[i], strs.slice(0, i + 1).join('/'))
    parentMenuObj = parentMenuObj[strs[i]]
  }
}

const MenuFolder = ({
  children,
  style,
  title,
  containCurrentPath,
}: // pathname,
{
  children: any
  style: React.CSSProperties
  title: string
  containCurrentPath: boolean
  // pathname: string
}) => {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(false)
  let className = 'menuFolder'
  useEffect(() => {
    setActive(containCurrentPath)
    if (containCurrentPath) {
      setOpen(true)
    }
  }, [containCurrentPath])
  if (open) {
    className += ' menuFolder--open'
  }
  if (active) {
    className += ' active'
  }

  // console.info(pathname, title)
  return (
    <div style={style} className={className}>
      <div
        role="menu"
        tabIndex={-1}
        className="menuFolderName"
        onClick={() => {
          setOpen(!open)
        }}
        onKeyPress={() => {}}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

const Menu = ({
  routeProps: props,
  title,
  path,
  level,
}: {
  routeProps: RouteComponentProps
  title: string
  path: string
  level: number
}) => {
  let className = 'menu'
  const { location } = props
  if (path === location.pathname) {
    className += ' active'
  }
  return (
    <div
      className={className}
      tabIndex={-1}
      role="menu"
      onKeyPress={() => {
        //
      }}
      onClick={() => {
        props.history.push(path)
        window.scrollTo(0, 0)
      }}
      style={{
        paddingLeft: level * 16,
      }}
    >
      {title}
    </div>
  )
}

export default ({
  routeProps: props,
  config,
}: {
  routeProps: RouteComponentProps
  config: any
}) => {
  const buildUIByDicts = (menu: any, level: number): any => {
    return Object.keys(menu).map((d: any) => {
      if (typeof menu[d] === 'string') {
        return (
          <Menu
            title={menu[d]}
            level={level}
            path={menu[d]}
            routeProps={props}
          />
        )
      }
      let containCurrentPath = false
      if (
        props.location.pathname.split('/') &&
        props.location.pathname.split('/').find(p => p === d)
      ) {
        containCurrentPath = true
      }
      return (
        <MenuFolder
          style={{
            paddingLeft: level * 16,
          }}
          title={d}
          containCurrentPath={containCurrentPath}
          // pathname={props.location.pathname}
        >
          {buildUIByDicts(menu[d], level + 1)}
        </MenuFolder>
      )
    })
  }

  const buildUIByMenus = (ulElement: HTMLElement, level: number): any => {
    const UI = []
    for (let i = 0; i < ulElement.children.length; i++) {
      const li = ulElement.children[i] as HTMLElement
      const subUlElement = li.querySelector('ul') as HTMLElement
      if (subUlElement) {
        const title = (li.firstChild as ChildNode).nodeValue || ''
        const aElements: NodeListOf<
          HTMLAnchorElement
        > = subUlElement.querySelectorAll('a')
        let containCurrentPath = false
        for (let j = 0; j < aElements.length; j++) {
          if (aElements[j].href.endsWith(props.location.pathname)) {
            containCurrentPath = true
            break
          }
        }
        UI.push(
          <MenuFolder
            style={{
              paddingLeft: level * 16,
            }}
            title={title}
            containCurrentPath={containCurrentPath}
          >
            {buildUIByMenus(subUlElement, level + 1)}
          </MenuFolder>
        )
      } else {
        const aElement = li.querySelector('a') as HTMLAnchorElement
        const regex = /href="([\d\D]*?)"/
        const matches = aElement.outerHTML.match(regex)
        if (matches && matches[1]) {
          const url = `${matches[1]}`.replace('./', `/${config.language}/`)
          UI.push(
            <Menu
              key={i}
              title={li.innerText}
              path={url}
              level={level}
              routeProps={props}
            />
          )
        }
      }
    }
    return UI
  }
  const buildUI = (): any => {
    if (config) {
      if (config.menus) {
        const element = document.createElement('div')
        element.innerHTML = config.menus
        const ulElement = element.querySelector('ul') as HTMLElement
        return buildUIByMenus(ulElement, 0)
      }
      if (config.dicts) {
        const rootMenu: any = {
          //
        }
        if (config && config.dicts) {
          Object.keys(config.dicts).forEach((file: string): void => {
            if (file) {
              const path = file.replace(/\\/g, '/')
              const strs = path.split('/')
              buildMenu(rootMenu, strs)
            }
          })
        }
        return buildUIByDicts(rootMenu, 0)
      }
    }
    return null
  }

  return (
    <Aside
      className="markdown-body"
      style={{
        height: window.innerHeight - 60,
      }}
    >
      {buildUI()}
      <hr
        style={{
          height: 60,
          border: 0,
          backgroundColor: 'transparent',
        }}
      />
    </Aside>
  )
}
