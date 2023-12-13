import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import routes from "~react-pages";
import ThemeProvider from "./styles/ThemeProvider";
import theme from "./styles/theme";
import GlobalStyles from "./styles/GlobalStyles";
import store from "./modules";
import { Suspense } from "react";

const Content = () => {
  return useRoutes(routes);
};

export default function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <Suspense fallback={null}>
          <Router>
            <Content />
          </Router>
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
}
