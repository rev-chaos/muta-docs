import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import Page from '../../components/Page'
import Header from '../../components/Header'
import Content from '../../components/Content'

export default ({ routeProps }: { routeProps: RouteComponentProps }) => {
  return (
    <Page>
      <Header routeProps={routeProps} />
      <Content>home</Content>
    </Page>
  )
}
