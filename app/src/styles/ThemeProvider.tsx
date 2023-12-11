import { PropsWithChildren } from "react";
import {
  ThemeProvider as RawThemeProvider,
  DefaultTheme,
} from "styled-components";

const ThemeProvider = ({
  theme,
  children,
}: PropsWithChildren<{ theme: DefaultTheme }>) => {
  return <RawThemeProvider theme={theme}>{children}</RawThemeProvider>;
};

export default ThemeProvider;
