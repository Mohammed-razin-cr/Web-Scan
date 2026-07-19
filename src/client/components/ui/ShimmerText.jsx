/**
 * ShimmerText — sweeping light shimmer across text.
 * mode="gradient" → background-clip shimmer (default)
 * mode="heading"  → wider sweep for large headings
 * mode="mask"     → overlay shimmer that works on gradient text
 */
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const pan = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const GradientSpan = styled.span`
  display: inline-block;
  background: linear-gradient(
    90deg,
    #d1e8e2 0%,
    #d1e8e2 28%,
    #ffffff 48%,
    #ffffff 52%,
    #d1e8e2 72%,
    #d1e8e2 100%
  );
  background-size: 250% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: ${pan} 3s linear infinite;

  @media (prefers-reduced-motion: reduce), (max-width: 768px), (max-height: 720px) {
    animation: none;
    background-position: 50% center;
  }
`;

const HeadingSpan = styled.span`
  display: inline-block;
  background: linear-gradient(
    90deg,
    #d1e8e2 0%,
    #d1e8e2 18%,
    #8ef5ec 36%,
    #ffffff 50%,
    #8ef5ec 64%,
    #d1e8e2 82%,
    #d1e8e2 100%
  );
  background-size: 300% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  letter-spacing: inherit;
  font-weight: inherit;
  font-size: inherit;
  line-height: inherit;
  animation: ${pan} 4s linear infinite;

  @media (prefers-reduced-motion: reduce), (max-width: 768px), (max-height: 720px) {
    animation: none;
    background-position: 50% center;
  }
`;

const maskPan = keyframes`
  0%   { background-position: -150% center; }
  100% { background-position:  250% center; }
`;

const MaskSpan = styled.span`
  display: inline-block;
  position: relative;

  &::after {
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0;
    background: linear-gradient(
      100deg,
      transparent 20%,
      rgba(255,255,255,0.45) 45%,
      rgba(255,255,255,0.6)  50%,
      rgba(255,255,255,0.45) 55%,
      transparent 80%
    );
    background-size: 250% 100%;
    mix-blend-mode: overlay;
    animation: ${maskPan} 3.5s linear infinite;
    border-radius: inherit;
  }

  @media (prefers-reduced-motion: reduce), (max-width: 768px), (max-height: 720px) {
    &::after {
      animation: none;
      opacity: 0.35;
    }
  }
`;

export const ShimmerText = ({
  children,
  mode      = 'gradient',
  className,
  style,
}) => {
  if (mode === 'mask')    return <MaskSpan className={className} style={style}>{children}</MaskSpan>;
  if (mode === 'heading') return <HeadingSpan className={className} style={style}>{children}</HeadingSpan>;
  return <GradientSpan className={className} style={style}>{children}</GradientSpan>;
};

export default ShimmerText;
