/**
 * BorderBeam — animated beam of light that travels around a container border.
 * Uses CSS-only animation (no offset-path) for maximum browser compatibility.
 */
import styled from '@emotion/styled';

const Beam = styled.div`
  pointer-events: none;
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  z-index: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      ${(p) => p.cs} 30deg,
      ${(p) => p.ce} 60deg,
      transparent 90deg,
      transparent 360deg
    );
    animation: beam-rotate ${(p) => p.dur}s linear infinite;
    animation-delay: ${(p) => p.dl}s;
    will-change: transform;
  }

  /* mask to show only the border edge */
  &::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: inherit;
    background: transparent;
  }

  @keyframes beam-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce), (max-width: 768px), (max-height: 720px) {
    &::before {
      animation: none;
      opacity: 0.45;
    }
  }
`;

/* Thin glowing ring that sits on top */
const Ring = styled.div`
  pointer-events: none;
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  z-index: 0;
  border: 1.5px solid transparent;
  background: linear-gradient(
    135deg,
    ${(p) => p.cs}44,
    ${(p) => p.ce}22,
    transparent 60%
  ) border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
  animation: ring-pulse ${(p) => p.dur * 0.7}s ease-in-out infinite alternate;

  @keyframes ring-pulse {
    from { opacity: 0.35; }
    to   { opacity: 0.9; }
  }

  @media (prefers-reduced-motion: reduce), (max-width: 768px), (max-height: 720px) {
    animation: none;
    opacity: 0.45;
  }
`;

export const BorderBeam = ({
  colorStart   = '#4ce1d3',
  colorEnd     = '#ffcb9a',
  duration     = 4,
  delay        = 0,
  beamWidth    = 6,
  borderRadius = 16,
  dual         = true,
  glowRing     = true,
}) => (
  <>
    <Beam cs={colorStart} ce={colorEnd} dur={duration} dl={delay} aria-hidden="true" />
    {dual && (
      <Beam
        cs={colorEnd}
        ce={colorStart}
        dur={duration * 0.8}
        dl={delay + duration * 0.4}
        aria-hidden="true"
        style={{ opacity: 0.6 }}
      />
    )}
    {glowRing && (
      <Ring cs={colorStart} ce={colorEnd} dur={duration} aria-hidden="true" />
    )}
  </>
);

export default BorderBeam;
