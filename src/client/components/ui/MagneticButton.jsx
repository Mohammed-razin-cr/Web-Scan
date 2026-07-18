/**
 * MagneticButton — pulls toward cursor when nearby. Wraps any child.
 */
import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export const MagneticButton = ({
  children,
  strength = 0.3,
  radius   = 110,
  className,
  style,
}) => {
  const ref  = useRef(null);
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, { stiffness: 220, damping: 20 });
  const y    = useSpring(rawY, { stiffness: 220, damping: 20 });

  const onMove = useCallback((e) => {
    if (!ref.current || reduceMotion || e.pointerType === 'touch') return;
    const r  = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    const d  = Math.hypot(dx, dy);
    if (d < radius) {
      const f = (1 - d / radius) * strength;
      rawX.set(dx * f);
      rawY.set(dy * f);
    }
  }, [radius, strength, rawX, rawY, reduceMotion]);

  const onLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: 'inline-flex', position: 'relative', x, y, ...style }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
