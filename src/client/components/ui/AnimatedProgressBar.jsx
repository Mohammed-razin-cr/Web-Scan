/**
 * AnimatedProgressBar — Premium replacement for basic progress bars
 * Features:
 *  - Segmented multi-color fill with framer-motion width animation
 *  - Shimmer sweep running across the filled portion
 *  - Glow on the leading edge
 *  - Percentage label with animated counter
 *  - Milestone markers (optional)
 *  - Accessible role="progressbar"
 */
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import AnimatedCounter from './AnimatedCounter';

const shimmerSweep = keyframes`
  0%   { transform: translateX(-120%); }
  100% { transform: translateX( 220%); }
`;

/* ── track ── */
const Track = styled.div`
  position: relative;
  width: 100%;
  height: ${(p) => p.height ?? 8}px;
  background: rgba(76,225,211,0.07);
  border-radius: 999px;
  overflow: hidden;
`;

/* ── filled region ── */
const Fill = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 999px;
  background: ${(p) => p.fillColor ?? 'linear-gradient(90deg, #116466, #4ce1d3)'};
  box-shadow: 0 0 12px rgba(76,225,211,0.45), 0 0 4px rgba(76,225,211,0.8);
  overflow: hidden;

  /* shimmer streak */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 40%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.3) 50%,
      transparent
    );
    transform: translateX(-120%);
    animation: ${shimmerSweep} 2s ease-in-out infinite;
  }
`;

/* ── leading glow dot ── */
const LeadDot = styled(motion.div)`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${(p) => (p.height ?? 8) + 4}px;
  height: ${(p) => (p.height ?? 8) + 4}px;
  border-radius: 50%;
  background: #4ce1d3;
  box-shadow:
    0 0 8px  rgba(76,225,211,0.9),
    0 0 16px rgba(76,225,211,0.5),
    0 0 30px rgba(76,225,211,0.25);
  pointer-events: none;
`;

/* ── milestone tick ── */
const Tick = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: ${(p) => (p.height ?? 8) + 6}px;
  background: rgba(209,232,226,0.3);
  border-radius: 1px;
  pointer-events: none;
`;

/* ── label row ── */
const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.45rem;
`;

const Label = styled.span`
  font-size: 0.76rem;
  font-weight: 600;
  color: rgba(209,232,226,0.55);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: 'JetBrains Mono', monospace;
`;

const Pct = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: #4ce1d3;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.04em;
`;

const Wrapper = styled.div`
  width: 100%;
`;

export const AnimatedProgressBar = ({
  value        = 0,      // 0–100
  label,
  height       = 8,
  fillColor,
  milestones   = [],     // [25, 50, 75]
  showLabel    = true,
  showPct      = true,
  duration     = 0.8,
  delay        = 0,
  className,
}) => {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <Wrapper className={className}>
      {(showLabel || showPct) && (
        <LabelRow>
          {showLabel && label && <Label>{label}</Label>}
          {showPct && (
            <Pct>
              <AnimatedCounter
                value={pct}
                decimals={0}
                suffix="%"
                duration={duration * 1000}
                delay={delay * 1000}
                glowOnCount={false}
              />
            </Pct>
          )}
        </LabelRow>
      )}
      <Track height={height} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <Fill
          height={height}
          fillColor={fillColor}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* leading dot rides the fill edge */}
        <LeadDot
          height={height}
          initial={{ left: '0%' }}
          animate={{ left: `${pct}%` }}
          transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* milestone ticks */}
        {milestones.map((m) => (
          <Tick key={m} height={height} style={{ left: `${m}%` }} />
        ))}
      </Track>
    </Wrapper>
  );
};

export default AnimatedProgressBar;
