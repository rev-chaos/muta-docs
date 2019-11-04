import React from 'react'
import styled from 'styled-components'
import i18n from '../../locals'

const Footer = styled.footer`
  width: 100%;
  height: 60px;
  background-color: black;
  font-size: 14px;
  font-weight: 500;
  line-height: 60px;
  text-align: center;
  color: #ffffff;
  z-index: 10;
`
export default () => {
  return <Footer>{i18n.t('footer.org')}</Footer>
}
