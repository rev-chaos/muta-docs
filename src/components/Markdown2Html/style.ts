import styled from 'styled-components'

export default styled.div`
  padding: 0 40px;
  display: flex;
  @media only screen and (max-width: 750px) {
    padding: 0;
  }
  .outlineContainer {
    @media only screen and (max-width: 1200px) {
      display: none;
    }
    .outline {
      ul {
        padding-left: 16px;
        li {
          list-style: none;
          a {
            color: #606770;
          }
          margin-top: 12px;
          margin-bottom: 8px;
        }
      }
      h2,
      h3,
      h4,
      h5,
      h6 {
        a {
          color: #606770;
        }
        font-weight: normal;
        border: 0;
        margin-top: 12px;
        margin-bottom: 8px;
        cursor: pointer;
        &: hover {
          text-decoration: underline;
        }
      }
      h2 {
        font-size: 14px;
      }
      h3 {
        font-size: 12px;
      }
      h4 {
        font-size: 10px;
      }
      h5 {
        font-size: 8px;
      }
      h6 {
        font-size: 6px;
      }
    }
  }
`
