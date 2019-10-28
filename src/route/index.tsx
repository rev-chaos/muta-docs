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
import Markdown2Html from '../components/Markdown2Html'

export default ({ config }: { config: any }) => {
  let pages: any[] = []
  if (config && config.dicts) {
    pages = Object.keys(config.dicts).map((file: string) => {
      const path = file.replace(/\\/g, '/')
      // console.info(path)
      const value: any = config.dicts && config.dicts[file]
      return {
        name: path,
        path,
        comp: Markdown2Html,
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
              <Header routeProps={props} />
              <Content>
                <div
                  style={{
                    paddingLeft: 300,
                  }}
                >
                  <aside
                    style={{
                      width: 300,
                      borderRadius: '3px 3px',
                      padding: 16,
                      backgroundColor: '#fff',
                      border: '1px solid #d1d5da',
                      overflowY: 'auto',
                      // margin: 20,
                      position: 'fixed',
                      top: 60,
                      left: 0,
                      zIndex: 9,
                      height: window.innerHeight - 60,
                    }}
                  >
                    {config &&
                      config.dicts &&
                      Object.keys(config.dicts).map(
                        (file: string, index: number) => {
                          const path = file.replace(/\\/g, '/')
                          return (
                            <div
                              tabIndex={100 + index}
                              role="menu"
                              onKeyPress={() => {
                                //
                              }}
                              onClick={() => {
                                props.history.push(path)
                                window.scrollTo(0, 0)
                              }}
                            >
                              {path}
                            </div>
                          )
                        }
                      )}
                    <hr
                      style={{
                        height: 60,
                        border: 0,
                      }}
                    />
                  </aside>
                  <div
                    style={{
                      flex: 1,
                      borderRadius: '3px 3px',
                      padding: 16,
                      backgroundColor: '#fff',
                      border: '1px solid #d1d5da',
                      overflowX: 'auto',
                      margin: 20,
                    }}
                  >
                    <Switch
                      key={props.location.pathname}
                      location={props.location}
                    >
                      <Redirect
                        exact
                        from="/"
                        to={pages && pages.length > 0 && pages[1].path}
                      />
                      {pages.map(page => {
                        return (
                          <Route
                            key={page.name}
                            render={routeProps => (
                              <page.comp
                                routeProps={routeProps}
                                markdown={page.value}
                              />
                            )}
                          />
                        )
                      })}
                      <Route
                        path="/404"
                        exact
                        component={() => <div>404</div>}
                      />
                      <Redirect from="*" to="/404" />
                    </Switch>
                  </div>
                </div>
              </Content>
              {props.location.pathname !== '/partners/survey' ? (
                <Footer />
              ) : null}
            </Page>
          )
        }}
      />
    </Router>
  )
}
