/**
 * GlowingCard — premium result card wrapper with:
 *  - Mouse-tracking radial glow (follows cursor inside the card)
 *  - Animated top shimmer line
 *  - Subtle 3D tilt on hover
 *  - Framer-motion entrance
 * Wraps children; all inner content sits above the glow layer.
 */
import { useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

const topSweep = keyframes`
  0%   { background-position:  150% center; }
  100% { background-position: -150% center; }
`;

const Outer = styled(motion.div)`
  position: relative;
  border-radius: ${(p) => p.radius ?? 16}px;
  background: rgba(5, 14, 13, 0.84);
  border: 1px solid rgba(76, 225, 211, ${(p) => p.borderOpacity ?? 0.11});
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(76, 225, 211, 0.05);
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform-style: preserve-3d;
  will-change: transform;
  transition:
    border-color 0.3s ease,
    box-shadow   0.3s ease,
    transform    0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* mouse-tracking spotlight */
  --gx: 50%;
  --gy: 50%;

  &::before {
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      500px circle at var(--gx) var(--gy),
      rgba(76, 225, 211, 0.09) 0%,
      transparent 65%
    );
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 1;
  }

  /* top shimmer line */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 1.25rem;
    right: 1.25rem;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(76, 225, 211, 0.55) 40%,
      rgba(255, 203, 154, 0.3) 60%,
      transparent
    );
    background-size: 200% auto;
    animation: ${topSweep} 4.5s linear infinite;
    pointer-events: none;
    z-index: 2;
  }

  &:hover {
    border-color: rgba(76, 225, 211, 0.28);
    box-shadow:
      0 14px 48px rgba(0, 0, 0, 0.45),
      0 0 0 1px rgba(76, 225, 211, 0.08) inset;
    transform: perspective(800px) translateZ(4px) translateY(-2px);

    &::before { opacity: 1; }
  }

  /* children above all overlays */
  > * {
    position: relative;
    z-index: 3;
  }
`;

const entrance = {
  hidden: { opacity: 0, y: 16, scale: 0.975 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export const GlowingCard = ({
  children,
  radius,
  borderOpacity,
  className,
  style,
  animate = true,
}) => {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - r.left}px`);
    el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  }, []);

  return (
    <Outer
      ref={ref}
      radius={radius}
      borderOpacity={borderOpacity}
      className={className}
      style={style}
      onMouseMove={onMove}
      variants={animate ? entrance : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'show' : undefined}
      layout
    >
      {children}
    </Outer>
  );
};

export default GlowingCard;
