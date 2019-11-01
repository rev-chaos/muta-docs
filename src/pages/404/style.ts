import styled from 'styled-components'

export const NotFoundVHCenterDiv = styled.div`
  min-height: ${(props: { width: number; height: number }): number =>
    props.height - 60 - 60}px;

  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  // background-color: #2f3231;
  margin: 0 auto;
  max-width: 1200px;
  > div {
    .label--404 {
      margin-top: 39px;
      min-height: 31px;
      font-size: 21px;
      font-weight: 500;
      text-align: center;
    }
  }
`

export const ImageDiv = styled.div`
  text-align: center;
  img {
    width: 500px;
    height: 174px;
    @media only screen and (min-width: 320px) and (max-width: 750px) {
      & {
        width: 200px;
        height: auto;
      }
    }
  }
`
