import { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

import routes from "~react-pages";

const Content = () => {
  return useRoutes(routes);
};

export default function App() {
  return (
    <Router>
      <Suspense fallback={<p>Loading...</p>}>
        <Content />
      </Suspense>
    </Router>
  );
}
