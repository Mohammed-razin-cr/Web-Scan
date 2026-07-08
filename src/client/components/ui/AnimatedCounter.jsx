/**
 * AnimatedCounter — counts up to a value when it enters the viewport.
 */
import { useEffect, useRef, useState, useCallback } from 'react';

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export const AnimatedCounter = ({
  value,
  from       = 0,
  duration   = 1400,
  delay      = 0,
  decimals   = 0,
  suffix     = '',
  prefix     = '',
  className,
  style,
}) => {
  const [display, setDisplay] = useState(from.toFixed(decimals));
  const rafRef   = useRef(null);
  const startRef = useRef(null);
  const hasRun   = useRef(false);
  const elRef    = useRef(null);

  const run = useCallback(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const kick = () => {
      startRef.current = null;
      const step = (ts) => {
        if (!startRef.current) startRef.current = ts;
        const elapsed  = ts - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOutExpo(progress);
        const current  = from + (value - from) * eased;
        setDisplay(current.toFixed(decimals));
        if (progress < 1) rafRef.current = requestAnimationFrame(step);
        else setDisplay(value.toFixed(decimals));
      };
      rafRef.current = requestAnimationFrame(step);
    };

    if (delay > 0) setTimeout(kick, delay);
    else kick();
  }, [value, from, duration, delay, decimals]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) { run(); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) run(); },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [run]);

  return (
    <span
      ref={elRef}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
    >
      {prefix}{display}{suffix}
    </span>
  );
};

export default AnimatedCounter;
