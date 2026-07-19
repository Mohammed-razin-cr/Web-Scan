/**
 * SparkleStars — twinkling SVG star/cross sparkles with three size tiers.
 */
import { useMemo } from 'react';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';

const Canvas = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  contain: layout paint style;
`;

const STAR = 'M8 0 L9.8 6.2 L16 8 L9.8 9.8 L8 16 L6.2 9.8 L0 8 L6.2 6.2 Z';

const Star = ({ x, y, size, color, delay, duration, repeatDelay, type, reduceMotion }) => {
  const anim = {
    hidden: { opacity: 0, scale: 0 },
    show: {
      opacity: [0, 1, 0.6, 1, 0],
      scale:   [0, 1, 0.8, 1, 0],
      rotate:  [0, 90, 180, 270, 360],
      transition: { duration, delay, repeat: Infinity, repeatDelay, ease: 'easeInOut' },
    },
  };

  return (
    <motion.svg
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        overflow: 'visible',
        willChange: reduceMotion ? 'auto' : 'transform, opacity',
      }}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      variants={anim}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion ? { opacity: 0.45, scale: 1 } : 'show'}
    >
      {type === 'cross' ? (
        <>
          <line x1="8" y1="1" x2="8" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="1" y1="8" x2="15" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <path d={STAR} fill={color} />
      )}
      <circle cx="8" cy="8" r="1.5" fill={color} opacity="0.9" />
    </motion.svg>
  );
};

export const SparkleStars = ({ count = 22, className }) => {
  const reduceMotion = useReducedMotion();
  const stars = useMemo(() => Array.from({ length: count }, (_, i) => {
    const tier = i % 3;
    const size = tier === 0 ? 5 + Math.random() * 3 : tier === 1 ? 9 + Math.random() * 4 : 14 + Math.random() * 6;
    const colors = ['#4ce1d3','#d1e8e2','#ffcb9a','#8ef5ec'];
    return {
      id: i,
      x: `${Math.random() * 98}%`,
      y: `${Math.random() * 95}%`,
      size,
      color: colors[i % colors.length],
      delay: Math.random() * 5,
      duration: 2.5 + Math.random() * 3,
      repeatDelay: 1.6 + Math.random() * 2.4,
      type: Math.random() > 0.6 ? 'cross' : 'star',
    };
  }), [count]);

  return (
    <Canvas className={className} aria-hidden="true">
      {stars.map((s) => <Star key={s.id} {...s} reduceMotion={reduceMotion} />)}
    </Canvas>
  );
};

export default SparkleStars;
