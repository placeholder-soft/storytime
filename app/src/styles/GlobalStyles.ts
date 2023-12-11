import { createGlobalStyle, css } from "styled-components";
import { normalize } from "styled-normalize";

const styles = css`
  ${normalize}
`;

const GlobalStyles = createGlobalStyle`
    ${styles}
`;

export default GlobalStyles;
