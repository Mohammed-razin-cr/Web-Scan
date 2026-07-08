/**
 * ShimmerButton — premium button with continuous shimmer sweep + glow pulse.
 */
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

const sweep = keyframes`
  0%   { transform: translateX(-180%) skewX(-18deg); }
  100% { transform: translateX(380%)  skewX(-18deg); }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 1px rgba(76,225,211,0.35), 0 4px 24px rgba(76,225,211,0.18), inset 0 1px 0 rgba(255,255,255,0.07);
  }
  50% {
    box-shadow: 0 0 0 1px rgba(76,225,211,0.6), 0 6px 36px rgba(76,225,211,0.38), 0 0 60px rgba(76,225,211,0.12), inset 0 1px 0 rgba(255,255,255,0.12);
  }
`;

/* Use data-* attrs to avoid unknown DOM prop warnings */
const Btn = styled(motion.button)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  border: none;
  outline: none;
  user-select: none;
  touch-action: manipulation;
  font-family: inherit;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  border-radius: 12px;
  padding: 0.7rem 1.75rem;
  font-size: 0.9rem;
  background: linear-gradient(135deg, #0b3532 0%, #116466 50%, #1a8f87 100%);
  color: #d1e8e2;
  animation: ${glow} 3s ease-in-out infinite;
  transition: filter 0.2s ease;

  &:hover { filter: brightness(1.12); }
  &:disabled { opacity: 0.45; cursor: not-allowed; animation: none; }

  &::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 42%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 50%, transparent);
    transform: translateX(-180%) skewX(-18deg);
    animation: ${sweep} 2.8s ease-in-out infinite;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 8%; right: 8%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent);
    pointer-events: none;
  }
`;

export const ShimmerButton = ({
  children,
  onClick,
  type      = 'button',
  className,
  disabled,
  style,
  ...rest
}) => (
  <Btn
    type={type}
    className={className}
    disabled={disabled}
    onClick={onClick}
    style={style}
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    {...rest}
  >
    {children}
  </Btn>
);

export default ShimmerButton;
