import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import logo from '../../static/logo.png'
import SearchBar from '../SearchBar'

const Header = styled.header`
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: white;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 999;
`
const NavBar = styled.div`
  display: flex;
  height: 60px;
  line-height: 60px;
  // background-color: black;
  font-size: 14px;
  color: rgba(255, 255, 255);
  background-color: rgb(36, 41, 46);
  // padding: 16px;
  .logo img {
    width: 120px;
    height: 60px;
  }

  .menu {
    cursor: pointer;
    width: 100px;
    &.active,
    &:hover {
      // opacity: 0.8;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.7);
      // background-color:#f2f3f8;
      // font-size: 15px;
      // transform: scale(1.05,1.05)
    }
    // &:last-child {
    //   cursor: unset;
    // }
  }
`
export const menus: any[] = [
  {
    name: '首页',
    path: '/',
  },
]

export default ({
  routeProps,
  config,
}: {
  routeProps: RouteComponentProps
  config: any
}) => {
  return (
    <Header>
      <NavBar>
        <div
          role="menu"
          tabIndex={0}
          className="logo"
          onClick={() => {
            routeProps.history.push('/')
          }}
          onKeyPress={() => {}}
        >
          <img src={logo} alt="logo" />
        </div>

        <div
          style={{
            flex: 1,
          }}
        />
        {menus.map((menu: any, i: number) => (
          <div
            role="menu"
            tabIndex={i + 1}
            className={`menu${
              menu.path === routeProps.location.pathname ? ' active' : ''
            }`}
            onClick={() => routeProps.history.push(menu.path)}
            onKeyPress={() => {}}
          >
            {menu.name}
          </div>
        ))}
        <SearchBar config={config} routeProps={routeProps} />
      </NavBar>
    </Header>
  )
}
