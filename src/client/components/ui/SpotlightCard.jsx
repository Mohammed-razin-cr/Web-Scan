/**
 * SpotlightCard — inspired by Cult-UI + Skiper-UI
 * Tracks mouse position and renders a radial "spotlight" glow that follows
 * the cursor, giving cards a premium interactive depth.
 */
import { useRef } from 'react';
import styled from '@emotion/styled';

const Outer = styled.div`
  position: relative;
  border-radius: inherit;
  overflow: hidden;

  /* the spotlight layer */
  &::before {
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.35s ease;
    background: radial-gradient(
      600px circle at var(--x, 50%) var(--y, 50%),
      ${(p) => p.spotColor || 'rgba(76,225,211,0.10)'} 0%,
      transparent 65%
    );
    z-index: 1;
  }

  &:hover::before {
    opacity: 1;
  }

  /* forward all children above the spotlight */
  > * {
    position: relative;
    z-index: 2;
  }
`;

export const SpotlightCard = ({ children, spotColor, className, style }) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  return (
    <Outer
      ref={ref}
      spotColor={spotColor}
      className={className}
      style={style}
      onMouseMove={handleMove}
    >
      {children}
    </Outer>
  );
};

export default SpotlightCard;
