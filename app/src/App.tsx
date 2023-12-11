import { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

import routes from "~react-pages";
import ThemeProvider from "./styles/ThemeProvider";
import theme from "./styles/theme";
import GlobalStyles from "./styles/GlobalStyles";

const Content = () => {
  return useRoutes(routes);
};

export default function App() {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Content />
          </Suspense>
        </Router>
      </ThemeProvider>
    </>
  );
}
