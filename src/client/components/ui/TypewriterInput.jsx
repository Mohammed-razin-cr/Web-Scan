/**
 * TypewriterInput — premium input field for the React SPA (Home.jsx)
 * Features:
 *  - Cycling typewriter placeholders with letter-by-letter animation
 *  - Teal glow focus ring + animated bottom beam
 *  - Spinning globe icon with ping ring on focus
 *  - Custom blinking caret (caret-color transparent + overlay span)
 *  - Scan-line shimmer across the top
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDERS = [
  'stripe.com',
  'cloudflare.com',
  'github.com',
  'vercel.com',
  'openai.com',
  'netflix.com',
  'shopify.com',
];

const topSweep = keyframes`
  0%   { background-position: 120% center; }
  100% { background-position: -120% center; }
`;

const beamRipple = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const pingAnim = keyframes`
  0%   { transform: scale(0.7); opacity: 0.7; }
  100% { transform: scale(1.7); opacity: 0; }
`;

const globeSpin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const caretBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

/* ── Shell ── */
const Shell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 3.6rem;
  background: rgba(4, 14, 13, 0.82);
  border-radius: 14px;
  border: 1px solid ${(p) => p.focused ? 'rgba(76,225,211,0.55)' : 'rgba(76,225,211,0.18)'};
  box-shadow: ${(p) => p.focused
    ? '0 6px 32px rgba(0,0,0,0.4), 0 0 56px rgba(76,225,211,0.12), 0 0 0 1px rgba(76,225,211,0.10) inset'
    : '0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(76,225,211,0.04) inset'
  };
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  /* top shimmer line */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 1.5rem; right: 1.5rem;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(76,225,211,0.45) 40%,
      rgba(255,203,154,0.2) 60%,
      transparent
    );
    background-size: 200% auto;
    animation: ${topSweep} 5s linear infinite;
    opacity: 0.6;
    pointer-events: none;
  }
`;

/* ── Focus beam at bottom ── */
const FocusBeam = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 8%;
  right: 8%;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(90deg, transparent, #4ce1d3 30%, #8ef5ec 50%, #4ce1d3 70%, transparent);
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 50%, transparent);
    background-size: 200% auto;
    animation: ${beamRipple} 1.8s linear infinite;
  }
`;

/* ── Icon zone ── */
const IconZone = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  flex-shrink: 0;
  color: ${(p) => p.focused ? '#4ce1d3' : 'rgba(76,225,211,0.4)'};
  transition: color 0.3s ease;

  svg {
    transition: filter 0.3s ease;
    animation: ${(p) => p.focused ? globeSpin : 'none'} 8s linear infinite;
    filter: ${(p) => p.focused ? 'drop-shadow(0 0 6px rgba(76,225,211,0.7))' : 'none'};
  }
`;

const PingRing = styled.span`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid rgba(76, 225, 211, 0.5);
  animation: ${pingAnim} 1.8s ease-out infinite;
  pointer-events: none;
`;

/* ── Real input ── */
const Input = styled.input`
  flex: 1;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 500;
  color: #e2f7f1;
  font-family: inherit;
  letter-spacing: 0.01em;
  padding: 0 0.75rem 0 0;
  caret-color: #4ce1d3;

  &::placeholder { color: transparent; }
  &::selection {
    background: rgba(76, 225, 211, 0.25);
    color: #fff;
  }
`;

/* ── Animated placeholder ── */
const PhWrap = styled.div`
  position: absolute;
  left: 3.4rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.45rem;
  pointer-events: none;
  overflow: hidden;
  height: 1.5rem;
`;

const PhLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(209, 232, 226, 0.35);
  white-space: nowrap;
  flex-shrink: 0;
`;

const PhText = styled(motion.span)`
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(209, 232, 226, 0.42);
  white-space: nowrap;
  position: absolute;
  left: 3.8rem; /* after "Scan: " */
`;

export const TypewriterInput = ({
  value,
  onChange,
  onKeyDown,
  id,
  name,
  autoComplete = 'off',
}) => {
  const [focused,  setFocused]  = useState(false);
  const [phIdx,    setPhIdx]    = useState(0);
  const timerRef = useRef(null);

  /* cycle placeholder every 2.8 s when not focused + empty */
  useEffect(() => {
    if (focused || value) return;
    timerRef.current = setInterval(() => {
      setPhIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(timerRef.current);
  }, [focused, value]);

  const showPh = !value && !focused;
  const showFocusedPh = !value && focused;

  return (
    <Shell focused={focused}>
      {/* bottom beam on focus */}
      <AnimatePresence>
        {focused && (
          <FocusBeam
            key="beam"
            initial={{ scaleX: 0.3, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0.3, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* globe icon */}
      <IconZone focused={focused}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          <path d="M12 3c2.5 2.5 4 5.6 4 9s-1.5 6.5-4 9M12 3c-2.5 2.5-4 5.6-4 9s1.5 6.5 4 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          <path d="M3.5 9h17M3.5 15h17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
        {focused && <PingRing />}
      </IconZone>

      {/* real input */}
      <Input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="Enter a domain, IP, or full URL to scan"
        placeholder=" "
      />

      {/* animated placeholder */}
      {showPh && (
        <PhWrap aria-hidden="true">
          <PhLabel>Scan:</PhLabel>
          <AnimatePresence mode="wait">
            <PhText
              key={phIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            >
              {PLACEHOLDERS[phIdx]}
            </PhText>
          </AnimatePresence>
        </PhWrap>
      )}
      {showFocusedPh && (
        <PhWrap aria-hidden="true">
          <PhLabel style={{ opacity: 0.55 }}>domain.com, IP, or full URL…</PhLabel>
        </PhWrap>
      )}
    </Shell>
  );
};

export default TypewriterInput;
