/**
 * NoiseOverlay — cinematic film-grain texture overlay via SVG feTurbulence.
 */
import styled from '@emotion/styled';

const Wrap = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: ${(p) => p.zi};
  opacity: ${(p) => p.op};
  mix-blend-mode: overlay;
  transform: translateZ(0);
  will-change: transform;
`;

const ANIM = `
  @keyframes grain {
    0%  { transform: translate(0,0); }
    10% { transform: translate(-2%,-3%); }
    20% { transform: translate(3%,1%); }
    30% { transform: translate(-1%,4%); }
    40% { transform: translate(4%,-2%); }
    50% { transform: translate(-3%,3%); }
    60% { transform: translate(2%,-4%); }
    70% { transform: translate(-4%,2%); }
    80% { transform: translate(1%,-1%); }
    90% { transform: translate(-2%,4%); }
    100%{ transform: translate(0,0); }
  }
  .grain-inner {
    position: absolute; inset: 0;
    animation: grain 0.2s steps(1) infinite;
  }
`;

export const NoiseOverlay = ({ opacity = 0.032, zIndex = 2 }) => (
  <Wrap op={opacity} zi={zIndex} aria-hidden="true">
    <style>{ANIM}</style>
    <div className="grain-inner">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="grain-f">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grain-f)" fill="white" />
      </svg>
    </div>
  </Wrap>
);

export default NoiseOverlay;
