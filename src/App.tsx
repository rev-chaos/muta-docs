import React from 'react'
import { useAxios } from 'use-axios-client'
import styled from 'styled-components'
import LoadingComponent from './components/Loading'
import ErrorComponent from './components/Error'
import Routes from './route'

const AppDiv = styled.div`
  width: 100vw;
  height: 100vh;
  .mask {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    top: 60px;
    left: 0;
    position: fixed;
    z-index: 999;
    &.mask--close {
      display: none;
    }
  }
  .partMask {
    z-index: 998;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  .column {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  input {
    height: 30px;
    line-height: 30px;
    padding: 5px;
    outline-color: invert;
    outline-style: none;
    outline-width: 0px;
    border: none;
    border-style: none;
    text-shadow: none;
    -webkit-appearance: none;
    -webkit-user-select: text;
    outline-color: transparent;
    box-shadow: none;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      vertical-align: middle;
      text-align: center;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
  .vhCenter {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
const App: React.FC = () => {
  const { data, error } = useAxios({
    url: `${window.location.protocol}//${window.location.host}${process.env.PUBLIC_URL}/markdown.json`,
  })
  // console.info(data, error, loading)
  if (data)
    return (
      <AppDiv>
        <Routes config={data} />
      </AppDiv>
    )
  if (error)
    return (
      <AppDiv>
        <ErrorComponent err={error} />
      </AppDiv>
    )
  return (
    <AppDiv>
      <LoadingComponent />
    </AppDiv>
  )
}
export default App
