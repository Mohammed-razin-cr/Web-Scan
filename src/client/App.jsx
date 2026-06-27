import { Routes, Route, Outlet } from 'react-router-dom';

import Home from 'client/views/Home.jsx';
import Results from 'client/views/Results.jsx';
import About from 'client/views/About.jsx';
import NotFound from 'client/views/NotFound.jsx';

import ErrorBoundary from 'client/components/boundaries/PageError.jsx';
import GlobalStyles from './styles/globals.jsx';

const Layout = () => {
  return (
    <>
      <GlobalStyles />
      <Outlet />
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/check" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path=":urlToScan" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
