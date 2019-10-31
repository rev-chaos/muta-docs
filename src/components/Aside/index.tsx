import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import styled from 'styled-components'

const AsideDiv = styled.div`
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
      > div {
        display: block;
      }
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
  pathname,
}: {
  children: any
  style: React.CSSProperties
  title: string
  pathname: string
}) => {
  const [open, setOpen] = useState(false)
  let className = 'menuFolder'
  if (pathname.split('/') && pathname.split('/').find(p => p === title)) {
    // console.error(pathname.split('/'), title)
    className += ' active'
    className += ' menuFolder--open'
  } else if (open) {
    className += ' menuFolder--open'
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

export default ({
  routeProps: props,
  config,
}: {
  routeProps: RouteComponentProps
  config: any
}) => {
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
  // console.info(JSON.stringify(rootMenu, null, 2))

  const buildMenuUI = (menu: any, level: number) => {
    return Object.keys(menu).map((d: any, index: number) => {
      if (typeof menu[d] === 'string') {
        let className = 'menu'
        if (menu[d] === props.location.pathname) {
          className += ' active'
        }
        return (
          <div
            className={className}
            tabIndex={100 + index}
            role="menu"
            onKeyPress={() => {
              //
            }}
            onClick={() => {
              props.history.push(menu[d])
              window.scrollTo(0, 0)
            }}
            style={{
              paddingLeft: level * 16,
            }}
          >
            {d}
          </div>
        )
      }
      return (
        <MenuFolder
          style={{
            paddingLeft: level * 16,
          }}
          title={d}
          pathname={props.location.pathname}
        >
          {buildMenuUI(menu[d], level + 1)}
        </MenuFolder>
      )
    })
  }
  return (
    <AsideDiv
      className="markdown-body"
      style={{
        height: window.innerHeight - 60,
      }}
    >
      {/* {config &&
        config.dicts &&
        Object.keys(config.dicts).map(
          (file: string, index: number) => {
            const path = file.replace(/\\/g, '/')
            return (
              <div
                className='menu'
                tabIndex={100 + index}
                role="menu"
                onKeyPress={() => {
                  //
                }}
                onClick={() => {
                  props.history.push(path)
                  window.scrollTo(0, 0)
                }}
              >
                {path}
              </div>
            )
          }
        )} */}
      {buildMenuUI(rootMenu, 0)}
      <hr
        style={{
          height: 60,
          border: 0,
          backgroundColor: 'transparent',
        }}
      />
    </AsideDiv>
  )
}
