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
  contain: strict;

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
    position: absolute;
    inset: -4%;
    animation: ${(p) => (p.isAnimated ? 'grain 2.4s steps(4) infinite' : 'none')};
    will-change: ${(p) => (p.isAnimated ? 'transform' : 'auto')};
  }

  @media (prefers-reduced-motion: reduce) {
    .grain-inner {
      animation: none;
      will-change: auto;
    }
  }
`;

export const NoiseOverlay = ({ opacity = 0.032, zIndex = 2, animate = false }) => (
  <Wrap op={opacity} zi={zIndex} isAnimated={animate} aria-hidden="true">
    <div className="grain-inner">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="grain-f">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grain-f)" fill="white" />
      </svg>
    </div>
  </Wrap>
);

export default NoiseOverlay;
