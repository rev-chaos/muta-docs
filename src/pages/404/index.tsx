import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { NotFoundVHCenterDiv, ImageDiv } from './style'
import logo from '../../static/logo.png'
import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'

export default ({ routeProps }: { routeProps: RouteComponentProps }) => {
  return (
    <Page>
      <Header routeProps={routeProps} />
      <Content>
        <NotFoundVHCenterDiv
          width={window.innerWidth}
          height={window.innerHeight}
        >
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
      </Content>
    </Page>
  )
}
