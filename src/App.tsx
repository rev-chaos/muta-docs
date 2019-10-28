// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

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
  button {
    width: 100px;
    height: 30px;
    margin: 0 auto;
    // background-color: #182d4d;
    color: white;
    border: 0;
    outline: none;
    display: block;
  }
  select,
  input {
    height: 30px;
    line-height: 30px;
    padding: 5px;
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
  const { data, error, loading } = useAxios({
    url: `${window.location.protocol}//${window.location.host}${process.env
      .PUBLIC_URL || '/'}markdown.json`,
  })
  console.info(data, error, loading)
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
