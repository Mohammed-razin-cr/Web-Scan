/**
 * ScrambleText — inspired by ReactBits "Scramble Text"
 * Cycles through random chars before settling on the real text.
 * Triggers on mount and whenever `text` prop changes.
 */
import { useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@!$%&';

const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export const ScrambleText = ({
  text,
  speed      = 40,   // ms between each frame tick
  revealDelay= 0,    // ms before scramble starts
  charDelay  = 40,   // ms extra delay per revealed char (left→right)
  className,
  style,
  tag: Tag = 'span',
}) => {
  const [displayed, setDisplayed] = useState(() => text.replace(/./g, rand));
  const frameRef = useRef(null);
  const revealedRef = useRef(0);

  useEffect(() => {
    revealedRef.current = 0;
    setDisplayed(text.replace(/./g, rand));

    const start = Date.now() + revealDelay;

    const tick = () => {
      const now = Date.now();
      if (now < start) { frameRef.current = requestAnimationFrame(tick); return; }

      const revealed = revealedRef.current;

      // Advance reveal pointer based on char delay timing
      const newRevealed = Math.min(
        text.length,
        Math.floor((now - start) / charDelay),
      );
      revealedRef.current = newRevealed;

      setDisplayed(
        text
          .split('')
          .map((ch, i) => {
            if (i < newRevealed) return ch;
            if (ch === ' ') return ' ';
            return rand();
          })
          .join(''),
      );

      if (newRevealed < text.length) {
        frameRef.current = setTimeout(tick, speed);
      }
    };

    frameRef.current = setTimeout(tick, revealDelay);
    return () => {
      clearTimeout(frameRef.current);
      cancelAnimationFrame(frameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {displayed}
    </Tag>
  );
};

export default ScrambleText;
