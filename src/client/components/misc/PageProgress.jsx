/**
 * PageProgress — premium NProgress-style top loading bar
 * Shows on every route change, auto-advances, then fades away.
 */
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { keyframes } from '@emotion/styled';
import { css } from '@emotion/react';

const shimmer = css`
  @keyframes pg-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 2.5px;
  z-index: 9999;
  pointer-events: none;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(
    90deg,
    #116466 0%,
    #4ce1d3 40%,
    #8ef5ec 60%,
    #4ce1d3 80%,
    #ffcb9a 100%
  );
  background-size: 200% 100%;
  animation: pg-shimmer 1.4s linear infinite;
  box-shadow:
    0 0 8px rgba(76, 225, 211, 0.7),
    0 0 20px rgba(76, 225, 211, 0.3);
  transition:
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s ease;
  width: ${p => p.progress}%;
  opacity: ${p => p.visible ? 1 : 0};

  /* glow tip */
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: -2px;
    bottom: -2px;
    width: 80px;
    background: linear-gradient(90deg, transparent, rgba(142, 245, 236, 0.9));
    border-radius: 2px;
  }
`;

const PageProgress = () => {
  const location = useLocation();
  const [progress, setProgress]   = useState(0);
  const [visible,  setVisible]    = useState(false);
  const timerRef  = useRef(null);
  const doneRef   = useRef(false);

  const clear = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const start = () => {
    clear();
    doneRef.current = false;
    setProgress(0);
    setVisible(true);

    // Quickly get to 20% then slow down
    setTimeout(() => setProgress(20), 50);
    setTimeout(() => setProgress(35), 150);

    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clear(); return p; }
        // Exponential slow-down as we approach 90%
        const step = (90 - p) * 0.06 + 0.5;
        return Math.min(p + step, 90);
      });
    }, 200);
  };

  const done = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    clear();
    setProgress(100);
    setTimeout(() => setVisible(false), 400);
    setTimeout(() => setProgress(0),    800);
  };

  useEffect(() => {
    start();
    // Complete bar shortly after route change (DOM paint)
    const t = setTimeout(done, 320);
    return () => { clear(); clearTimeout(t); };
  }, [location.pathname, location.search]);

  return <Bar progress={progress} visible={visible} />;
};

export default PageProgress;
