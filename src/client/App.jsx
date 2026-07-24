import { useLayoutEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import Home    from 'client/views/Home.jsx';
import Results from 'client/views/Results.jsx';
import About   from 'client/views/About.jsx';
import NotFound from 'client/views/NotFound.jsx';

import ErrorBoundary from 'client/components/boundaries/PageError.jsx';
import GlobalStyles  from './styles/globals.jsx';
import PageProgress  from 'client/components/misc/PageProgress.jsx';

/* ── Page transition variants ── */
const pageVariants = {
  initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
  enter:   {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(3px)',
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
};

const reducedVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.18 } },
  exit:    { opacity: 0, transition: { duration: 0.12 } },
};

const Layout = () => {
  const location     = useLocation();
  const reduceMotion = useReducedMotion();
  const variants     = reduceMotion ? reducedVariants : pageVariants;

  useLayoutEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }, [location.pathname]);

  return (
    <>
      <GlobalStyles />
      {/* Thin top progress bar on every navigation */}
      <PageProgress />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={variants}
          initial="initial"
          animate="enter"
          exit="exit"
          style={{ minHeight: '100vh' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/check" element={<Layout />}>
          <Route index         element={<Home />} />
          <Route path="home"   element={<Home />} />
          <Route path="about"  element={<About />} />
          <Route path=":urlToScan" element={<Results />} />
          <Route path="*"      element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
