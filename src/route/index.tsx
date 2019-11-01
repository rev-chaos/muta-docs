import React from 'react'
import {
  BrowserRouter as Router,
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

export default ({ config }: { config: any }) => {
  let pages: any[] = []
  if (config && config.dicts) {
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
  }

  const basename: any = process.env.PUBLIC_URL || '/'

  return (
    <Router basename={basename}>
      <Route
        render={(props: any) => {
          return (
            <Page>
              <Header routeProps={props} config={config} />
              <Content
                style={{
                  paddingLeft: 300,
                }}
              >
                <Aside config={config} routeProps={props} />
                <Switch>
                  <Redirect
                    exact
                    from="/"
                    to={pages && pages.length > 0 && pages[0].path}
                  />
                  {pages.map(page => {
                    return (
                      <Route
                        key={page.name}
                        path={page.path}
                        render={routeProps => (
                          <page.comp
                            key={page.name}
                            routeProps={routeProps}
                            value={page.value}
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
              </Content>
              <Footer />
            </Page>
          )
        }}
      />
    </Router>
  )
}
