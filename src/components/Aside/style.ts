import styled from 'styled-components'
import toggle from '../../static/toggle.svg'

export default styled.aside`
  @media only screen and (max-width: 1440px) {
    position: fixed;
    border: 0;
    top: 15px;
    left: 10px;
    width: 30px;
    height: 30px !important;
    overflow: hidden;
    background: url(${toggle}) no-repeat center center;
    background-color: rgb(36, 41, 46);
    z-index: 999;
    transition: width 100ms linear;
    &:hover {
      background: unset;
      background-color: rgb(36, 41, 46);
      width: 300px;
      top: 0;
      left: 0;
      height: 100vh !important;
      // background-color: rgb(36, 41, 46);
      color: white;
      overflow-y: auto;
    }
  }
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
    position: relative;
    font-size: 16px;
    // font-weight: bold;
    .menuFolderName {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &::before {
        content: '▸';
        position: absolute;
        left: -14px;
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
