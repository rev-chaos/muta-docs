import React from 'react'
import {
  BrowserRouter as Router,
  RouteComponentProps,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import Page from '../components/Page'
import Header from '../components/Header'
import Content from '../components/Content'
import Footer from '../components/Footer'
import Aside from '../components/Aside'

import HomePage from '../pages/Home'
import NotFoundPage from '../pages/404'
import MainDiv from './style'

export default ({ config }: { config: any }) => {
  let pages: any[] = []
  let defaultPage: string = ''

  if (config && config.dicts) {
    if (config.default) {
      const path = config.default.replace(/\\/g, '/')
      defaultPage = path
    }
    pages = Object.keys(config.dicts).map((file: string) => {
      const path = file.replace(/\\/g, '/')
      const value: any = config.dicts && config.dicts[file]
      return {
        name: path,
        path,
        comp: HomePage,
        value,
      }
    })
    if (!defaultPage) {
      defaultPage = pages && pages.length > 0 && pages[0].path
    }
  }
  // console.info(defaultPage)

  const basename: any = process.env.PUBLIC_URL || ''

  return (
    <Router basename={basename}>
      <Route
        render={(props: RouteComponentProps) => {
          return (
            <Page>
              <Header routeProps={props} config={config} />
              <Content>
                <MainDiv>
                  <Aside config={config} routeProps={props} />
                  <Switch>
                    <Redirect exact from="/" to={defaultPage} />
                    {pages.map(page => {
                      return (
                        <Route
                          key={page.name}
                          path={page.path}
                          exact
                          render={routeProps => (
                            <page.comp
                              routeProps={routeProps}
                              value={page.value}
                              url={page.path}
                            />
                          )}
                        />
                      )
                    })}
                    <Route
                      path="/404"
                      exact
                      render={routeProps => (
                        <NotFoundPage routeProps={routeProps} />
                      )}
                    />
                    <Redirect from="*" to="/404" />
                  </Switch>
                </MainDiv>
              </Content>
              <Footer />
            </Page>
          )
        }}
      />
    </Router>
  )
}
