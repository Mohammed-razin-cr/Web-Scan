/**
 * Loader — premium animated scanner UI
 * Replaces the plain SVG spinner with a cinematic radar/scanner
 * and staggered status lines, matching the teal dark system.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const kf = keyframes;

/* ── keyframes ── */
const spin   = kf`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const spinRev= kf`from { transform: rotate(0deg); } to { transform: rotate(-360deg); }`;
const radarSweep = kf`
  0%   { transform: rotate(0deg); opacity: 1; }
  80%  { opacity: 0.7; }
  100% { transform: rotate(360deg); opacity: 1; }
`;
const pulseRing = kf`
  0%   { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
`;
const blink = kf`
  0%,100% { opacity: 1; } 50% { opacity: 0.3; }
`;

const Wrap = styled(motion.div)`
  margin: 0 auto;
  width: 95vw;
  max-width: 900px;
  border-radius: 1.25rem;
  background: rgba(6, 15, 14, 0.82);
  border: 1px solid rgba(76, 225, 211, 0.14);
  backdrop-filter: blur(24px);
  box-shadow: 0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(76,225,211,0.07);
  overflow: hidden;
  /* accent top line */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 2rem; right: 2rem; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(76,225,211,0.5), transparent);
  }
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 2.5rem 3rem;
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 1.5rem;
  }
`;

/* ── Radar ── */
const RadarBox = styled.div`
  position: relative;
  width: 140px; height: 140px;
  flex-shrink: 0;
`;

const RadarBg = styled.div`
  position: absolute; inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(76,225,211,0.05) 0%, transparent 70%);
  border: 1px solid rgba(76,225,211,0.18);
`;

const RadarRing = styled.div`
  position: absolute; inset: ${p => p.inset}px;
  border-radius: 50%;
  border: 1px solid rgba(76,225,211,${p => p.opacity ?? 0.12});
`;

const RadarSweep = styled.div`
  position: absolute; inset: 0;
  border-radius: 50%;
  overflow: hidden;
  animation: ${radarSweep} 2.4s linear infinite;
  &::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 50%; height: 2px;
    transform-origin: 0 50%;
    background: linear-gradient(90deg, rgba(76,225,211,0.9), transparent);
    border-radius: 2px;
  }
`;

const RadarSweepCone = styled.div`
  position: absolute; inset: 0;
  border-radius: 50%;
  overflow: hidden;
  animation: ${radarSweep} 2.4s linear infinite;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 50%; right: 0; bottom: 50%;
    background: conic-gradient(from 0deg, transparent 60deg, rgba(76,225,211,0.12) 120deg, transparent 130deg);
    transform-origin: 0% 100%;
  }
`;

const PulseRing = styled.div`
  position: absolute; inset: 30%;
  border-radius: 50%;
  border: 1.5px solid rgba(76,225,211,0.6);
  animation: ${pulseRing} 2.4s ease-out infinite;
  animation-delay: ${p => p.delay ?? 0}s;
`;

const RadarDot = styled.div`
  position: absolute; top: 50%; left: 50%;
  width: 8px; height: 8px; border-radius: 50%;
  background: #4ce1d3;
  transform: translate(-50%,-50%);
  box-shadow: 0 0 12px #4ce1d3, 0 0 24px rgba(76,225,211,0.4);
  animation: ${blink} 1.8s ease-in-out infinite;
`;

const OuterRing = styled.div`
  position: absolute; inset: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(76,225,211,0.22);
  border-top-color: #4ce1d3;
  animation: ${spin} 3s linear infinite;
`;

const InnerRing = styled.div`
  position: absolute; inset: 20px;
  border-radius: 50%;
  border: 1px dashed rgba(76,225,211,0.18);
  animation: ${spinRev} 4s linear infinite;
`;

/* ── Right side: status lines ── */
const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #d1e8e2;
  letter-spacing: 0.03em;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  .badge {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #4ce1d3;
    background: rgba(76,225,211,0.1);
    border: 1px solid rgba(76,225,211,0.25);
    border-radius: 4px;
    padding: 0.15rem 0.5rem;
    animation: ${blink} 2s ease-in-out infinite;
  }
`;

const StatusLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const StatusLine = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(209,232,226,0.55);
  .icon {
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 1.5px solid ${p => p.active ? '#4ce1d3' : 'rgba(76,225,211,0.22)'};
    background: ${p => p.active ? 'rgba(76,225,211,0.15)' : 'transparent'};
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s ease;
  }
  &.active { color: rgba(209,232,226,0.85); }
`;

const BarWrap = styled.div`
  margin-top: 0.5rem;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 3px;
  background: rgba(76,225,211,0.08);
  border-radius: 2px;
  overflow: hidden;
`;

const BarFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #116466, #4ce1d3, #8ef5ec);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: bar-shimmer 2s linear infinite;
  @keyframes bar-shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
`;

const HintText = styled.p`
  margin: 0;
  font-size: 0.72rem;
  color: rgba(209,232,226,0.3);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
`;

const ROTATING_LINES = [
  'Resolving DNS records…',
  'Checking SSL certificate…',
  'Scanning open ports…',
  'Fetching HTTP headers…',
  'Detecting tech stack…',
  'Analysing security headers…',
  'Running WHOIS lookup…',
  'Checking threat lists…',
];

const Loader = ({ show }) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [barProgress, setBarProgress] = useState(0.15);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setLineIndex(i => (i + 1) % ROTATING_LINES.length);
      setBarProgress(p => Math.min(p + 0.04 + Math.random() * 0.06, 0.92));
    }, 1200);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <Wrap
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Inner>
            {/* Radar */}
            <RadarBox>
              <RadarBg />
              <RadarRing inset={18} opacity={0.2} />
              <RadarRing inset={36} opacity={0.15} />
              <RadarRing inset={54} opacity={0.1} />
              <RadarSweepCone />
              <RadarSweep />
              <PulseRing delay={0} />
              <PulseRing delay={1.2} />
              <OuterRing />
              <InnerRing />
              <RadarDot />
            </RadarBox>

            {/* Status panel */}
            <Info>
              <StatusTitle>
                Scanning target
                <span className="badge">Live</span>
              </StatusTitle>

              <StatusLines>
                {ROTATING_LINES.slice(0, 4).map((line, i) => (
                  <StatusLine
                    key={line}
                    active={i === lineIndex % 4}
                    className={i === lineIndex % 4 ? 'active' : ''}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <span className="icon">
                      {i < lineIndex % 4 && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4l1.8 1.8L6.5 2.5" stroke="#4ce1d3" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )}
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={i === lineIndex % 4 ? lineIndex : line}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {i === lineIndex % 4
                          ? ROTATING_LINES[lineIndex]
                          : i < lineIndex % 4 ? line : '—'}
                      </motion.span>
                    </AnimatePresence>
                  </StatusLine>
                ))}
              </StatusLines>

              <BarWrap>
                <BarTrack>
                  <BarFill
                    initial={{ width: '15%' }}
                    animate={{ width: `${barProgress * 100}%` }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                  />
                </BarTrack>
              </BarWrap>

              <HintText>Results appear as they complete — no need to wait</HintText>
            </Info>
          </Inner>
        </Wrap>
      )}
    </AnimatePresence>
  );
};

export default Loader;
