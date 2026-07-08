/**
 * HomeBackground — cinematic teal/amber dot-grid + meteor shower
 * Upgraded: teal & amber meteor colors, higher density, larger grid,
 * radial vignette fade, floating grid orbs, 6 simultaneous meteors.
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

/* ── config ── */
const DOT_SPACING   = 28;
const METEOR_COUNT  = 6;
const TAIL_LENGTH   = 100;
const DIST_BASE     = 6;
const DIST_VAR      = 7;
const DUR_BASE      = 1.4;
const DUR_VAR       = 1.2;
const DELAY_BASE    = 400;
const DELAY_VAR     = 1800;
const TAIL_DUR      = 0.3;
const HEAD_EASE     = [0.8, 0.6, 1, 1];
const TAIL_EASE     = [0.5, 0.6, 0.6, 1];

/* meteor color palette — teal + amber accent */
const METEOR_COLORS = ['#4ce1d3', '#4ce1d3', '#4ce1d3', '#ffcb9a', '#8ef5ec', '#4ce1d3'];

/* ── pulse animation for grid shimmer ── */
const gridPulse = keyframes`
  0%, 100% { opacity: 0.38; }
  50%       { opacity: 0.52; }
`;

/* ── styled pieces ── */
const Container = styled.div`
  pointer-events: none;
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  top: 0;
  left: 0;
  overflow: hidden;
`;

/* dot-grid SVG */
const GridSvg = styled.svg`
  pointer-events: none;
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  animation: ${gridPulse} 8s ease-in-out infinite;
`;

/* vignette radial overlay — darkens edges, opens center */
const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 50% 45%,
      transparent 0%,
      transparent 40%,
      rgba(6,14,13,0.55) 75%,
      rgba(4,10,9,0.88) 100%
    );
  z-index: 1;
`;

/* horizontal scan line that drifts down */
const scanLine = keyframes`
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.5; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const ScanLine = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(76,225,211,0.0) 10%,
    rgba(76,225,211,0.35) 30%,
    rgba(76,225,211,0.5) 50%,
    rgba(76,225,211,0.35) 70%,
    rgba(76,225,211,0.0) 90%,
    transparent 100%
  );
  animation: ${scanLine} 10s linear infinite;
  animation-delay: ${p => p.delay}s;
  z-index: 2;
`;

/* corner bracket decorations */
const CornerBracket = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  opacity: 0.22;
  z-index: 2;

  &.tl { top: 1.5rem; left: 1.5rem; border-top: 1.5px solid #4ce1d3; border-left: 1.5px solid #4ce1d3; }
  &.tr { top: 1.5rem; right: 1.5rem; border-top: 1.5px solid #4ce1d3; border-right: 1.5px solid #4ce1d3; }
  &.bl { bottom: 1.5rem; left: 1.5rem; border-bottom: 1.5px solid #4ce1d3; border-left: 1.5px solid #4ce1d3; }
  &.br { bottom: 1.5rem; right: 1.5rem; border-bottom: 1.5px solid #4ce1d3; border-right: 1.5px solid #4ce1d3; }
`;

/* meteor head */
const MeteorHead = styled(motion.div)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${p => p.color};
  box-shadow:
    0 0 6px  ${p => p.color},
    0 0 12px ${p => p.color}88,
    0 0 24px ${p => p.color}44;
  z-index: 3;
`;

/* meteor tail */
const MeteorTail = styled(motion.div)`
  position: absolute;
  top: -${TAIL_LENGTH}px;
  left: 1px;
  width: 2px;
  height: ${TAIL_LENGTH}px;
  background: linear-gradient(to bottom, transparent, ${p => p.color}cc);
  border-radius: 1px;
`;

/* ── helpers ── */
const makeMeteor = (id, gx, gy, colors) => {
  const col   = Math.floor(Math.random() * gx);
  const start = Math.floor(Math.random() * Math.max(1, gy - 14));
  const dist  = DIST_BASE + Math.floor(Math.random() * DIST_VAR);
  const dur   = DUR_BASE  + Math.random() * DUR_VAR;

  return {
    id,
    col,
    startRow: start,
    endRow:   start + dist,
    dur,
    color:    colors[id % colors.length],
    tailVis:  true,
    stage:    'traveling',
    opacity:  1,
  };
};

const initMeteors = (gx, gy) => {
  const seen = new Set();
  return Array.from({ length: METEOR_COUNT }, (_, i) =>
    makeMeteor(i, gx, gy, METEOR_COLORS),
  ).filter(m => !seen.has(m.col) && seen.add(m.col));
};

/* ── component ── */
const HomeBackground = () => {
  const [gx, setGx] = useState(() => Math.floor(window.innerWidth  / DOT_SPACING));
  const [gy, setGy] = useState(() => Math.floor(window.innerHeight / DOT_SPACING));
  const [meteors, setMeteors] = useState(() => initMeteors(
    Math.floor(window.innerWidth  / DOT_SPACING),
    Math.floor(window.innerHeight / DOT_SPACING),
  ));

  const gxRef = useRef(gx);
  const gyRef = useRef(gy);
  gxRef.current = gx;
  gyRef.current = gy;

  const onAnimComplete = (id) => {
    setMeteors(prev => prev.map(m => {
      if (m.id !== id) return m;
      if (m.stage === 'traveling')       return { ...m, tailVis: false, stage: 'retractingTail' };
      if (m.stage === 'retractingTail')  return { ...m, stage: 'resetting', opacity: 0 };
      if (m.stage === 'resetting') {
        setTimeout(() => {
          setMeteors(cur => cur.map(x =>
            x.id === id ? makeMeteor(id, gxRef.current, gyRef.current, METEOR_COLORS) : x,
          ));
        }, DELAY_BASE + Math.random() * DELAY_VAR);
      }
      return m;
    }));
  };

  useEffect(() => {
    const onResize = () => {
      setGx(Math.floor(window.innerWidth  / DOT_SPACING));
      setGy(Math.floor(window.innerHeight / DOT_SPACING));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <Container aria-hidden="true">
      {/* dot grid */}
      <GridSvg>
        <defs>
          <pattern id="dot-bg" width={DOT_SPACING} height={DOT_SPACING} patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.5" fill="rgba(76,225,211,0.28)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-bg)" />
      </GridSvg>

      {/* vignette so grid recedes at edges */}
      <Vignette />

      {/* drifting scan lines */}
      <ScanLine delay={0} />
      <ScanLine delay={5} />

      {/* corner brackets */}
      <CornerBracket className="tl" />
      <CornerBracket className="tr" />
      <CornerBracket className="bl" />
      <CornerBracket className="br" />

      {/* meteors */}
      {meteors.map(({ id, col, startRow, endRow, dur, color, tailVis, stage }) => (
        <MeteorHead
          key={id}
          color={color}
          initial={{ x: col * DOT_SPACING, y: startRow * DOT_SPACING, opacity: 1 }}
          animate={{
            opacity: tailVis ? 1 : 0,
            y: stage === 'resetting' ? startRow * DOT_SPACING : endRow * DOT_SPACING,
          }}
          transition={{ duration: stage === 'resetting' ? 0 : dur, ease: HEAD_EASE }}
          onAnimationComplete={() => onAnimComplete(id)}
        >
          <MeteorTail
            color={color}
            initial={{ top: `-${TAIL_LENGTH}px`, height: `${TAIL_LENGTH}px` }}
            animate={{
              top:    tailVis ? `-${TAIL_LENGTH}px` : '0px',
              height: tailVis ? `${TAIL_LENGTH}px`  : '0px',
            }}
            transition={{ duration: TAIL_DUR, ease: TAIL_EASE }}
          />
        </MeteorHead>
      ))}
    </Container>
  );
};

export default HomeBackground;
