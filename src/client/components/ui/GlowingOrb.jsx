/**
 * GlowingOrb — inspired by Skiper-UI radial glow accents
 * Renders an absolutely-positioned soft radial glow orb.
 * Use as a background accent inside position:relative containers.
 */
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';

const Orb = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  will-change: transform, opacity;
  background: radial-gradient(
    circle at center,
    ${(p) => p.color} 0%,
    ${(p) => p.color}66 30%,
    transparent 70%
  );
  width:  ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  left:   ${(p) => p.x};
  top:    ${(p) => p.y};
  transform: translate(-50%, -50%);
  opacity: ${(p) => p.opacity ?? 0.45};
  filter: blur(${(p) => p.blur ?? 60}px);
  z-index: 0;
`;

export const GlowingOrb = ({
  color = 'rgba(76, 225, 211, 0.35)',
  size = 400,
  x = '50%',
  y = '50%',
  opacity = 0.45,
  blur = 60,
  animate = true,
}) => {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animate && !reduceMotion;

  return (
    <Orb
      color={color}
      size={size}
      x={x}
      y={y}
      opacity={opacity}
      blur={blur}
      aria-hidden="true"
      {...(shouldAnimate
        ? {
            animate: {
              scale: [1, 1.08, 1],
              opacity: [opacity, opacity * 1.3, opacity],
            },
            transition: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }
        : {})}
    />
  );
};

export default GlowingOrb;
