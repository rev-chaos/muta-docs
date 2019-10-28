import React from 'react'
import styled from 'styled-components'
import logo from '../../static/logo.png'

const LoadingDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: auto;
    max-width: 400px;
  }
`
export default () => {
  return (
    <LoadingDiv>
      <img src={logo} alt="loading" />
    </LoadingDiv>
  )
}
