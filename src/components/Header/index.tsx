import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import logo from '../../static/logo.png'
import SearchBar from '../SearchBar'
import Language from './Language'
import i18n from '../../locals'

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
  display: flex;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  color: rgba(255, 255, 255);
  background-color: rgb(36, 41, 46);
  .logo img {
    margin-left: 30px;
    width: 120px;
    height: 60px;
  }

  .menu {
    cursor: pointer;
    width: 100px;
    &.active,
    &:hover {
      font-weight: bold;
      color: rgba(255, 255, 255, 0.7);
    }
    // &:last-child {
    //   cursor: unset;
    // }
  }
`

export const menus: any[] = [
  {
    name: i18n.t('header.menus.home'),
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
      <Language />
    </Header>
  )
}
