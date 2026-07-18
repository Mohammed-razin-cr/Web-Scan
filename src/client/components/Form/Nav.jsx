/**
 * Nav — premium sticky glassmorphic navbar
 * Scan-state animations: animated SCANNING badge, domain reveal,
 * sonar ping rings, live scan-line sweep, particle sparks,
 * animated favicon ring, progress dot trail.
 */
import { motion, AnimatePresence, useAnimationFrame } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import styled, { } from '@emotion/styled';
import { keyframes } from '@emotion/react';
import BorderBeam from 'client/components/ui/BorderBeam';
import ShimmerText from 'client/components/ui/ShimmerText';

/* ── keyframes ── */
const scanSweep = keyframes`
  0%   { left: -60%; }
  100% { left: 110%; }
`;
const sonarRing = keyframes`
  0%   { transform: scale(0.5); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
`;
const dotPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.3; transform: scale(0.55); }
`;
const badgeGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 1px rgba(76,225,211,0.35), 0 0 8px rgba(76,225,211,0.2); }
  50%       { box-shadow: 0 0 0 1px rgba(76,225,211,0.7), 0 0 18px rgba(76,225,211,0.45), 0 0 32px rgba(76,225,211,0.15); }
`;
const faviconRing = keyframes`
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(1.9); opacity: 0; }
`;
const sparkFloat = keyframes`
  0%   { transform: translateY(0) scale(1);   opacity: 1; }
  100% { transform: translateY(-18px) scale(0); opacity: 0; }
`;
const textReveal = keyframes`
  0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
  100% { clip-path: inset(0 0% 0 0);   opacity: 1; }
`;
const progressPulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1; }
`;

/* ── Header ── */
const Header = styled.header`
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  width: 100%;
  max-width: min(1240px, calc(100vw - 2rem));
  position: sticky;
  top: 0.75rem;
  z-index: 50;
  background: rgba(4, 12, 11, 0.82);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid rgba(76, 225, 211, 0.12);
  border-radius: 14px;
  box-shadow:
    0 4px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(76, 225, 211, 0.06);
  overflow: hidden;

  @media (max-width: 600px) {
    padding: 0.6rem 0.85rem;
    gap: 0.5rem;
  }
`;

/* Horizontal scan-line that sweeps across the whole nav */
const NavScanLine = styled.div`
  position: absolute;
  top: 0; bottom: 0;
  width: 55%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(76,225,211,0.07) 40%,
    rgba(76,225,211,0.14) 50%,
    rgba(76,225,211,0.07) 60%,
    transparent
  );
  animation: ${scanSweep} 2.2s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
`;

const Brand = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
`;

const BrandMark = styled(motion.img)`
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  filter: drop-shadow(0 2px 12px rgba(76, 225, 211, 0.4));
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.06rem;
  strong {
    font-size: 0.95rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  small {
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(76, 225, 211, 0.55);
    @media (max-width: 600px) {
      display: none;
    }
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 1.75rem;
  background: rgba(76, 225, 211, 0.12);
  flex-shrink: 0;

  @media (max-width: 600px) {
    display: none;
  }
`;

const ChildWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;

  @media (max-width: 600px) {
    justify-content: flex-end;
  }
`;

/* ── Favicon wrapper with animated sonar rings ── */
const FaviconWrap = styled.div`
  position: relative;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
`;

const FaviconRing = styled.span`
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid rgba(76, 225, 211, 0.55);
  animation: ${faviconRing} 1.8s ease-out infinite;
  animation-delay: ${p => p.delay ?? 0}s;
`;

/* ── Domain text with animated reveal ── */
const DomainText = styled(motion.span)`
  font-size: 1rem;
  font-weight: 700;
  color: #d1e8e2;
  letter-spacing: 0.03em;
  animation: ${textReveal} 0.5s cubic-bezier(0.16,1,0.3,1) both;
  
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 600px) {
    max-width: 110px;
  }
`;

/* ── SCANNING badge ── */
const ScanBadge = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4ce1d3;
  background: rgba(76, 225, 211, 0.08);
  border: 1px solid rgba(76, 225, 211, 0.28);
  border-radius: 5px;
  padding: 0.22rem 0.6rem;
  position: relative;
  overflow: hidden;
  animation: ${badgeGlow} 2s ease-in-out infinite;

  /* shimmer streak */
  &::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, rgba(76,225,211,0.2) 50%, transparent);
    animation: ${scanSweep} 1.8s ease-in-out infinite;
  }
`;

/* three blinking dots inside the badge */
const BadgeDot = styled.span`
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #4ce1d3;
  animation: ${dotPulse} 1.2s ease-in-out infinite;
  animation-delay: ${p => p.delay ?? 0}s;
`;

/* ── Sonar rings around the favicon ── */
const SonarRing = styled.span`
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1px solid rgba(76, 225, 211, 0.4);
  animation: ${sonarRing} 2s ease-out infinite;
  animation-delay: ${p => p.delay ?? 0}s;
  pointer-events: none;
`;

/* ── Live progress dot trail ── */
const DotTrail = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: 0.25rem;

  @media (max-width: 600px) {
    display: none;
  }
`;

const TrailDot = styled.span`
  width: 3px; height: 3px;
  border-radius: 50%;
  background: rgba(76, 225, 211, ${p => p.opacity ?? 0.4});
  animation: ${progressPulse} 1.4s ease-in-out infinite;
  animation-delay: ${p => p.delay ?? 0}s;
`;

/* ── Floating spark particles ── */
const Spark = styled.span`
  position: absolute;
  width: ${p => p.size ?? 3}px;
  height: ${p => p.size ?? 3}px;
  border-radius: 50%;
  background: ${p => p.color ?? '#4ce1d3'};
  left: ${p => p.x};
  top: 50%;
  box-shadow: 0 0 4px ${p => p.color ?? '#4ce1d3'};
  animation: ${sparkFloat} ${p => p.dur ?? 1.2}s ease-out infinite;
  animation-delay: ${p => p.delay ?? 0}s;
  pointer-events: none;
`;

/* spark data */
const SPARKS = [
  { x: '38%', size: 3, color: '#4ce1d3', dur: 1.1, delay: 0 },
  { x: '52%', size: 2, color: '#8ef5ec', dur: 1.4, delay: 0.3 },
  { x: '44%', size: 2, color: '#ffcb9a', dur: 1.0, delay: 0.6 },
  { x: '60%', size: 3, color: '#4ce1d3', dur: 1.3, delay: 0.9 },
  { x: '32%', size: 2, color: '#8ef5ec', dur: 1.2, delay: 1.1 },
];

/* ── Scanning nav child content ── */
const ScanningContent = ({ address, addressType }) => {
  const siteName = (() => {
    try {
      const u = /^https?:\/\//i.test(address) ? address : `https://${address}`;
      return new URL(u).hostname.replace(/^www\./, '');
    } catch { return address; }
  })();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative' }}>
      {/* floating sparks */}
      {SPARKS.map((s, i) => <Spark key={i} {...s} />)}

      {/* favicon with sonar rings */}
      {addressType === 'url' && (
        <FaviconWrap>
          <SonarRing delay={0} />
          <SonarRing delay={0.7} />
          <a
            target="_blank"
            rel="noreferrer"
            href={/^https?:\/\//i.test(address) ? address : `https://${address}`}
            style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}
          >
            <motion.img
              width="22"
              height="22"
              alt=""
              src={`https://icon.horse/icon/${siteName}`}
              style={{ borderRadius: '5px', objectFit: 'contain', display: 'block' }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.1 }}
            />
          </a>
        </FaviconWrap>
      )}

      {/* domain name with text-reveal */}
      <DomainText
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
      >
        {siteName}
      </DomainText>

      {/* SCANNING badge */}
      <ScanBadge
        initial={{ opacity: 0, scale: 0.8, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 20, delay: 0.25 }}
      >
        <BadgeDot delay={0}    />
        <BadgeDot delay={0.2}  />
        <BadgeDot delay={0.4}  />
        Scanning
      </ScanBadge>

      {/* progress dot trail */}
      <DotTrail>
        {[0, 0.18, 0.36, 0.54, 0.72].map((d, i) => (
          <TrailDot key={i} delay={d} opacity={0.2 + i * 0.15} />
        ))}
      </DotTrail>
    </div>
  );
};

const Nav = (props) => (
  <Header>
    {/* Animated border beam on the nav */}
    {!props.quiet && (
      <BorderBeam
        colorStart="#4ce1d3"
        colorEnd="#ffcb9a"
        duration={5}
        beamWidth={5}
        borderRadius={14}
      />
    )}

    {/* Horizontal scan-line during active scan */}
    {props.children && !props.quiet && <NavScanLine />}

    <Brand
      href="/check"
      aria-label="WebScan home"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <BrandMark
        src="/logo-icon-transparent.png"
        alt="WebScan"
        aria-hidden="true"
        whileHover={{ rotate: 8, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      />
      <BrandText>
        <strong>
          <ShimmerText baseColor="#d1e8e2" shineColor="#ffffff" duration={5}>
            WebScan
          </ShimmerText>
        </strong>
        <small>Analyze · Detect · Protect</small>
      </BrandText>
    </Brand>

    {props.children && (
      <>
        <Divider />
        <ChildWrap>{props.children}</ChildWrap>
      </>
    )}
  </Header>
);

export { ScanningContent };
export default Nav;
