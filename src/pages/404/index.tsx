import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { NotFoundVHCenterDiv, ImageDiv } from './style'
import logo from '../../static/logo.png'

export default ({ routeProps }: { routeProps: RouteComponentProps }) => {
  console.info(routeProps)
  return (
    <NotFoundVHCenterDiv width={window.innerWidth} height={window.innerHeight}>
      <div>
        <ImageDiv>
          <img src={logo} alt="404" />
        </ImageDiv>
        <div className="label--404">
          Ooops, the page you are looking for was not found
        </div>
        <div className="button">
          <button
            type="button"
            onClick={() => {
              routeProps.history.goBack()
            }}
          >
            回首页
          </button>
        </div>
      </div>
    </NotFoundVHCenterDiv>
  )
}
