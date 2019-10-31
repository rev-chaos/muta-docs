import React from 'react'
// import { RouteComponentProps } from 'react-router-dom'
import Markdown2Html from '../../components/Markdown2Html'

export default ({ markdown }: { markdown: string }) => {
  // const { hash } = routeProps.location
  // useEffect(() => {
  //   // window.location.hash =  hash;
  //   if (hash) {
  //     console.info(hash)
  //     try {
  //       // const element = document.querySelector(
  //       //   encodeURI(hash.replace(hash.substr(1, 1), hash.substr(1, 1).toLocaleLowerCase()))
  //       // ) as HTMLElement
  //       const element = document.getElementById(decodeURI(hash.substr(1))) as HTMLElement
  //       if (element) {
  //         console.info(decodeURI(hash.substr(1)))
  //         const rect: ClientRectList | DOMRectList = element.getClientRects()
  //         if (rect && rect[0]) {
  //           const style: CSSStyleDeclaration = window.getComputedStyle(element)
  //           let height: number = element.clientHeight
  //           if (style) {
  //             height =
  //               parseInt(style.marginTop || '0', 10) +
  //               parseInt(style.marginBottom || '0', 10) +
  //               parseInt(style.paddingTop || '0', 10) +
  //               parseInt(style.paddingBottom || '0', 10) +
  //               parseInt(style.height || '0', 10)
  //           }
  //           console.info(rect[0].top)
  //           console.info(window.scrollY)
  //           console.info(height)
  //           const top = rect[0].top + window.scrollY - height
  //           console.error(top)
  //           // alert(top)
  //           // setTimeout(() => {
  //             window.scrollTo(0, top)
  //           // }, 1000)
  //         }
  //       }
  //     } catch (err) {
  //       console.error(err)
  //     }
  //   }
  // }, [hash])
  return (
    <div
      style={{
        flex: 1,
        // borderRadius: '3px 3px',
        padding: 16,
        backgroundColor: '#fff',
        // border: '1px solid #d1d5da',
        overflowX: 'auto',
        margin: '0 20px',
      }}
    >
      <Markdown2Html markdown={markdown} />
    </div>
  )
}
