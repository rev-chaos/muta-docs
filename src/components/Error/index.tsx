import React from 'react'
import styled from 'styled-components'

const ErrorDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    max-width: 800px;
  }
`
export default ({ err }: { err: Error }) => {
  return (
    <ErrorDiv>
      <div>
        <p>
          <b>oh, something wrong</b>
        </p>
        <p>{err.message}</p>
      </div>
    </ErrorDiv>
  )
}
