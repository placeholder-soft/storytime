/// <reference types="vite-plugin-svgr/client" />
import styled from "styled-components";
import {FC} from "react";
import LogonIcon from './_/logo.svg?react'

export const StyledHeader = styled.div`
  //display: flex;
  width: 100vw;
  background: #A9F868;;
  position: fixed;
  top: 0;
  padding: 29px 34px;
`

export const Header: FC = () => {
  return (
    <StyledHeader>
      <LogonIcon/>
    </StyledHeader>
  )
}


export const PageContainer = styled.div`
  background: #A9F868;
  width: 100vw;
  min-height: 100vh;
`

