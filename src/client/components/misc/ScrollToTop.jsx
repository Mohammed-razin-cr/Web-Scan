/**
 * ScrollToTop — floating button that appears after scrolling 400px
 * Smooth scroll back to top with teal glow and entrance animation.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(76,225,211,0.35), 0 4px 20px rgba(76,225,211,0.2); }
  50%       { box-shadow: 0 0 0 6px rgba(76,225,211,0),  0 4px 28px rgba(76,225,211,0.35); }
`;

const Btn = styled(motion.button)`
  position: fixed;
  bottom: clamp(1.25rem, 4vw, 2rem);
  right: clamp(1.25rem, 4vw, 2rem);
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  border: 1px solid rgba(76, 225, 211, 0.25);
  background: rgba(8, 24, 21, 0.85);
  backdrop-filter: blur(16px);
  color: #4ce1d3;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  transition: background 0.2s, border-color 0.2s;

  svg {
    width: 1.1rem;
    height: 1.1rem;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }

  &:hover {
    background: rgba(76, 225, 211, 0.12);
    border-color: rgba(76, 225, 211, 0.5);
  }

  @media (max-width: 480px) {
    width: 2.65rem;
    height: 2.65rem;
    border-radius: 10px;
    bottom: 1rem;
    right: 1rem;
  }
`;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <Btn
          onClick={handleClick}
          aria-label="Scroll to top"
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1,   y: 0  }}
          exit={{    opacity: 0, scale: 0.7,  y: 16 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{   scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          <svg viewBox="0 0 24 24">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </Btn>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
