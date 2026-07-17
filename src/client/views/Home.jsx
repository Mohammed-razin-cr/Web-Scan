import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RadioTower, ScanSearch, ShieldCheck } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { determineAddressType, normalizeAddress } from 'client/utils/address-type-checker';
import Globe3D from 'client/components/misc/Globe3D';
import NavigationDrawer from 'client/components/misc/NavigationDrawer';

/* ── Premium UI kit ── */
import ShimmerText     from 'client/components/ui/ShimmerText';
import ScrambleText    from 'client/components/ui/ScrambleText';
import BorderBeam      from 'client/components/ui/BorderBeam';
import SparkleStars    from 'client/components/ui/SparkleStars';
import GlowingOrb      from 'client/components/ui/GlowingOrb';
import ShimmerButton   from 'client/components/ui/ShimmerButton';
import MagneticButton  from 'client/components/ui/MagneticButton';
import AnimatedCounter from 'client/components/ui/AnimatedCounter';
import NoiseOverlay    from 'client/components/ui/NoiseOverlay';
import TypewriterInput from 'client/components/ui/TypewriterInput';

const suggestions = ['stripe.com', 'cloudflare.com', 'github.com', 'vercel.com'];

/* ─── Stats data ─── */
const STATS = [
  {
    value: 35,
    suffix: '+',
    label: 'Checks',
    decimals: 0,
    icon: ScanSearch,
    color: '#4ce1d3',
    motion: { rotate: [-6, 5, -6], scale: [1, 1.08, 1] },
    duration: 3.4,
  },
  {
    value: 100,
    suffix: '%',
    label: 'Free',
    decimals: 0,
    icon: ShieldCheck,
    color: '#d1e8e2',
    motion: { y: [0, -3, 0], scale: [1, 1.06, 1] },
    duration: 3,
  },
  {
    value: 20,
    suffix: 'k+',
    label: 'Scans run',
    decimals: 0,
    icon: Activity,
    color: '#ffcb9a',
    motion: { scale: [1, 1.16, 1], opacity: [0.7, 1, 0.7] },
    duration: 2.2,
  },
  {
    value: 99,
    suffix: '%',
    label: 'Uptime',
    decimals: 0,
    icon: RadioTower,
    color: '#d9b08c',
    motion: { y: [0, -2, 0], rotate: [-3, 3, -3] },
    duration: 3.6,
  },
];

/* ─── Layout shells ─── */
const HomeContainer = styled.main`
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(circle at 46% 52%, rgba(17,100,102,0.42), transparent 21rem),
    radial-gradient(circle at 45% 44%, rgba(255,203,154,0.10), transparent 18rem),
    linear-gradient(110deg, #060e0d 0%, #081815 40%, #0b2422 70%, #0d1f1d 100%);
`;

const Header = styled.header`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.75rem;
  @media (max-width: 1024px) { padding: 1rem 1.5rem; }
  @media (max-width: 640px)  { padding: 0.9rem 1rem; }
`;

const Brand = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 900;
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  img {
    height: clamp(1.8rem, 4vw, 2.3rem);
    width: auto;
    filter: drop-shadow(0 2px 12px rgba(76,225,211,0.4));
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const GhostBtn = styled(motion.a)`
  color: #4ce1d3;
  border: 1px solid rgba(76,225,211,0.22);
  background: rgba(76,225,211,0.06);
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
  &:hover { background: rgba(76,225,211,0.14); border-color: rgba(76,225,211,0.5); text-decoration: none; }
  @media (max-width: 768px) { display: none; }
`;

const MenuBtn = styled(motion.button)`
  width: 2.75rem; height: 2.75rem;
  display: grid; place-items: center;
  color: #4ce1d3;
  border: 1px solid rgba(76,225,211,0.2);
  background: rgba(44,53,49,0.5);
  border-radius: 8px;
  cursor: pointer;
  svg { width: 1.2rem; height: 1.2rem; stroke: currentColor; }
`;

/* ─── Hero ─── */
const Hero = styled.section`
  min-height: calc(100vh - 5.5rem);
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
`;

const Stage = styled.div`
  position: relative;
  z-index: 3;
  min-width: 0;
  min-height: calc(100vh - 5.5rem);
  padding: clamp(2rem, 8vw, 5rem) clamp(1rem, 4vw, 5.5rem);
  max-width: 52%;
  padding-bottom: 4rem;
  @media (max-width: 1024px) { max-width: 100%; padding-top: 3rem; }
  @media (max-width: 640px)  { padding: 2.5rem 1.25rem; }
`;

/* Corner-bracket frame decoration */
const Frame = styled.div`
  position: absolute;
  left: clamp(1rem, 5vw, 5.5rem);
  right: clamp(1rem, 5vw, 5.5rem);
  top: clamp(2.5rem, 8vw, 5rem);
  bottom: 6rem;
  border: 1px solid rgba(76,225,211,0.14);
  opacity: 0.7;
  pointer-events: none;
  &:before, &:after {
    content: ''; position: absolute;
    width: 0.6rem; height: 0.6rem;
    border: 2px solid #116466;
  }
  &:before { left: -1px; top: -1px; border-right: 0; border-bottom: 0; }
  &:after  { right: -1px; bottom: -1px; border-left: 0; border-top: 0; }
  @media (max-width: 1024px) { display: none; }
`;

const Copy = styled(motion.div)`
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 48rem;
  margin-top: clamp(2rem, 10vh, 7rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const EyebrowTag = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: clamp(1.5rem, 4vw, 2.5rem);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(76,225,211,0.28);
  background: rgba(76,225,211,0.06);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4ce1d3;
  position: relative;
  overflow: hidden;

  /* subtle shimmer on the badge border */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(76,225,211,0.18) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: badge-shimmer 3s linear infinite;
    pointer-events: none;
  }

  @keyframes badge-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #4ce1d3;
    box-shadow: 0 0 6px rgba(76,225,211,0.8);
    animation: pulse-dot 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 6px rgba(76,225,211,0.8); }
    50%       { opacity: 0.6; transform: scale(0.7); box-shadow: 0 0 3px rgba(76,225,211,0.4); }
  }
`;

const TitleBlock = styled.div`
  margin: 0 0 clamp(1.5rem, 4vw, 2.5rem);
  h1 {
    margin: 0;
    color: white;
    font-size: clamp(2.2rem, 7vw, 5.5rem);
    line-height: 1.08;
    font-weight: 900;
    letter-spacing: clamp(0.02em, 1vw, 0.05em);
  }
  .accent {
    display: block;
    background: linear-gradient(90deg, #4ce1d3 0%, #8ef5ec 30%, #ffffff 50%, #8ef5ec 70%, #4ce1d3 100%);
    background-size: 250% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: title-shimmer 3.5s linear infinite;
  }
  @keyframes title-shimmer {
    0%   { background-position: 0%   center; }
    100% { background-position: 250% center; }
  }
`;

const Subtitle = styled(motion.p)`
  margin: 0 0 clamp(1.5rem, 4vw, 2.5rem);
  color: rgba(209,232,226,0.65);
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  line-height: 1.7;
  max-width: 38rem;
  font-weight: 400;
`;

/* ─── Scan form ─── */
const FormWrap = styled(motion.div)`
  position: relative;
  width: min(100%, 46rem);
  margin-bottom: 1.25rem;
`;

const FormCard = styled.div`
  position: relative;
  padding: 1.25rem 1.25rem 1.1rem;
  border-radius: 18px;
  border: 1px solid rgba(76,225,211,0.15);
  background: rgba(5,15,14,0.84);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  box-shadow:
    0 12px 48px rgba(0,0,0,0.42),
    0 0 0 1px rgba(76,225,211,0.05) inset;
  overflow: hidden;
`;

const ScanForm = styled.form`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  label { display: none; }
`;

/* Magnetic wrapper for the scan button — gives tactile pull on hover */
const ScanBtnWrap = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 640px) { width: 100%; }
`;

const ErrorMsg = styled(motion.p)`
  margin: 0.6rem 0 0;
  padding: 0.7rem 1.1rem;
  color: #ffcb9a;
  background: rgba(255,203,154,0.07);
  border: 1px dashed rgba(255,203,154,0.25);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
`;

/* ─── Suggestion chips ─── */
const Suggestions = styled(motion.div)`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
  color: rgba(209,232,226,0.45);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
`;

const Chip = styled(motion.button)`
  border: 1px solid rgba(76,225,211,0.14);
  background: rgba(76,225,211,0.04);
  color: rgba(209,232,226,0.7);
  padding: 0.38rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.03em;
  font-family: inherit;
  transition: all 0.2s ease;
  &:hover {
    color: #4ce1d3;
    background: rgba(76,225,211,0.1);
    border-color: rgba(76,225,211,0.4);
    box-shadow: 0 0 12px rgba(76,225,211,0.15);
  }
`;

/* ─── Stats strip ─── */
const StatsRow = styled(motion.div)`
  display: flex;
  gap: clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(2rem, 5vw, 3.5rem);
  padding-top: clamp(1.5rem, 4vw, 2.5rem);
  position: relative;

  /* top separator with glow */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(76,225,211,0.22) 30%,
      rgba(76,225,211,0.38) 50%,
      rgba(76,225,211,0.22) 70%,
      transparent
    );
  }

  @media (max-width: 480px) { gap: 1.5rem; flex-wrap: wrap; }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  position: relative;

  /* right separator between stats */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: calc(-1 * clamp(0.75rem, 2vw, 1.5rem));
    top: 15%;
    bottom: 15%;
    width: 1px;
    background: rgba(76,225,211,0.12);
  }

  .num {
    font-size: clamp(1.4rem, 3vw, 2.1rem);
    font-weight: 900;
    color: #4ce1d3;
    line-height: 1;
    text-shadow: 0 0 20px rgba(76,225,211,0.4), 0 0 40px rgba(76,225,211,0.15);
  }
  .label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(209,232,226,0.4);
  }
`;

const StatIcon = styled(motion.span)`
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 1.65rem;
  height: 1.65rem;
  margin-bottom: 0.15rem;
  color: var(--stat-icon-color, #4ce1d3);
  transform-origin: center;

  &::before {
    content: '';
    position: absolute;
    inset: 0.3rem;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.22;
    filter: blur(6px);
  }

  svg {
    position: relative;
    width: 1.1rem;
    height: 1.1rem;
    stroke-width: 1.8;
    filter: drop-shadow(0 0 6px currentColor);
  }
`;

/* ─── Floating bottom toolbar ─── */
const BottomBar = styled(motion.div)`
  position: absolute;
  z-index: 8;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  border-radius: 999px;
  border: 1px solid rgba(76,225,211,0.2);
  background: rgba(6,18,16,0.88);
  backdrop-filter: blur(18px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  overflow: hidden;
  button, a {
    min-width: 3rem; height: 3rem;
    display: grid; place-items: center;
    border: 0; border-right: 1px solid rgba(76,225,211,0.12);
    background: transparent;
    color: rgba(209,232,226,0.7);
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0 0.9rem;
    transition: all 0.2s ease;
    text-decoration: none; cursor: pointer;
    &:hover { color: #4ce1d3; background: rgba(76,225,211,0.1); }
    &:last-child { border-right: 0; }
  }
  svg { width: 1rem; height: 1rem; stroke: currentColor; }
  @media (max-width: 1024px) { display: none; }
`;

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

/* ─── framer variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

/* ─── Component ─── */
const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [errorMsg, setErrMsg]     = useState('');
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const urlFromQuery = query.get('url');
    if (urlFromQuery) {
      const target = normalizeAddress(urlFromQuery);
      if (target) navigate(`/check/${target}`, { replace: true });
    }
  }, [navigate, location.search]);

  const submit = () => {
    const address = normalizeAddress(userInput);
    const addressType = determineAddressType(address);
    if (addressType === 'empt') {
      setErrMsg('Enter a domain, URL, IPv4, or IPv6 address');
    } else if (addressType === 'err') {
      setErrMsg('Enter a valid domain, URL, IPv4, or IPv6 address');
    } else {
      navigate(`/check/${address}`, { state: { address, addressType } });
    }
  };

  const inputChange = (e) => {
    setUserInput(e.target.value);
    if (!['err','empt'].includes(determineAddressType(e.target.value))) setErrMsg('');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  };

  return (
    <HomeContainer>
      {/* ── Cinematic noise / film-grain overlay ── */}
      <NoiseOverlay opacity={0.028} animate zIndex={4} />

      {/* ── Enhanced sparkle field — 3 size tiers + cross type ── */}
      <SparkleStars count={28} drift={false} />

      {/* ── Ambient glow orbs ── */}
      <GlowingOrb color="rgba(76,225,211,0.20)" size={580} x="28%" y="32%" blur={100} />
      <GlowingOrb color="rgba(255,203,154,0.10)" size={420} x="72%" y="62%" blur={90} />
      <GlowingOrb color="rgba(76,225,211,0.08)" size={300} x="85%" y="20%" blur={70} />

      <NavigationDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── Header ── */}
      <Header>
        <Brand
          href="/check"
          aria-label="WebScan home"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <img src="/logo-icon-transparent.png" alt="WebScan" />
          {/* heading mode for wider sweep band on brand name */}
          <ShimmerText mode="heading" baseColor="#d1e8e2" midColor="#8ef5ec" shineColor="#ffffff" duration={4}>
            WEBSCAN
          </ShimmerText>
        </Brand>
        <HeaderActions>
          <GhostBtn
            href="https://github.com/Mohammed-razin-cr/"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            GitHub
          </GhostBtn>
          <MenuBtn
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <IconMenu />
          </MenuBtn>
        </HeaderActions>
      </Header>

      {/* ── Hero ── */}
      <Hero>
        <Globe3D />
        <Stage>
          <Frame />
          <Copy variants={stagger} initial="hidden" animate="show">

            {/* ── Eyebrow badge ── */}
            <EyebrowTag variants={fadeUp}>
              <span className="dot" />
              Scan Your Website
            </EyebrowTag>

            {/* ── Hero heading with animated shimmer on accent line ── */}
            <TitleBlock>
              <motion.h1 variants={fadeUp}>
                <ScrambleText
                  text="Analyze."
                  charDelay={55}
                  revealDelay={100}
                  style={{ display: 'block', color: 'white' }}
                />
                {/* ShimmerText mask mode rides over the CSS gradient fill */}
                <ShimmerText
                  mode="mask"
                  shineColor="rgba(255,255,255,0.55)"
                  duration={3.5}
                  style={{ display: 'block' }}
                >
                  <span className="accent">
                    <ScrambleText text="Detect. Protect." charDelay={45} revealDelay={500} />
                  </span>
                </ShimmerText>
              </motion.h1>
            </TitleBlock>

            {/* ── Subtitle ── */}
            <Subtitle variants={fadeUp}>
              Deep-scan any domain: SSL, DNS, headers, ports, threats, tech stack and more.
              <br />Professional intelligence at a glance.
            </Subtitle>

            {/* ── Scan form with dual BorderBeam ── */}
            <FormWrap variants={fadeUp}>
              <FormCard>
                {/* dual-beam on the form card */}
                <BorderBeam
                  colorStart="#4ce1d3"
                  colorEnd="#ffcb9a"
                  duration={3.5}
                  beamWidth={5}
                  borderRadius={18}
                  dual
                />
                <ScanForm onSubmit={(e) => { e.preventDefault(); submit(); }}>
                  <label htmlFor="scan-input">Website or IP</label>
                  {/* Premium TypewriterInput replaces plain ScanInput */}
                  <TypewriterInput
                    id="scan-input"
                    name="url"
                    value={userInput}
                    onChange={inputChange}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submit())}
                  />
                  {/* Magnetic + ShimmerButton for the scan CTA */}
                  <ScanBtnWrap>
                    <MagneticButton strength={0.28} radius={100} style={{ width: '100%' }}>
                      <ShimmerButton
                        type="submit"
                        style={{
                          width: '100%',
                          height: '3.5rem',
                          borderRadius: '12px',
                          fontSize: '0.97rem',
                          letterSpacing: '0.05em',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                          <circle cx="11" cy="11" r="8"/>
                          <path d="m21 21-4.35-4.35"/>
                        </svg>
                        Analyze Website
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ flexShrink: 0, opacity: 0.7 }}>
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </ShimmerButton>
                    </MagneticButton>
                  </ScanBtnWrap>
                </ScanForm>

                {/* suggestion chips inside card */}
                <Suggestions style={{ marginTop: '0.9rem' }} variants={fadeUp}>
                  <span>Try:</span>
                  {suggestions.map((s, i) => (
                    <Chip
                      key={s}
                      type="button"
                      onClick={() => setUserInput(s)}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.07, type: 'spring', stiffness: 300 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {s}
                    </Chip>
                  ))}
                </Suggestions>
              </FormCard>

              <AnimatePresence>
                {errorMsg && (
                  <ErrorMsg
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    ⚠ {errorMsg}
                  </ErrorMsg>
                )}
              </AnimatePresence>
            </FormWrap>

            {/* ── Stats strip — AnimatedCounter with IntersectionObserver ── */}
            <StatsRow variants={fadeUp}>
              {STATS.map((s, index) => {
                const Icon = s.icon;
                return (
                  <StatItem key={s.label}>
                    <StatIcon
                      aria-hidden="true"
                      style={{ '--stat-icon-color': s.color }}
                      animate={s.motion}
                      transition={{
                        duration: s.duration,
                        delay: index * 0.24,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      whileHover={{ scale: 1.2, rotate: 0 }}
                    >
                      <Icon />
                    </StatIcon>
                    <span className="num">
                      <AnimatedCounter
                        value={s.value}
                        suffix={s.suffix}
                        decimals={s.decimals}
                        duration={1600}
                        delay={300}
                        glowOnCount
                        easing="expo"
                      />
                    </span>
                    <span className="label">{s.label}</span>
                  </StatItem>
                );
              })}
            </StatsRow>

          </Copy>

          {/* ── Floating toolbar ── */}
          <BottomBar
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <a href="/check/about">More</a>
            <a href="https://github.com/Mohammed-razin-cr/" target="_blank" rel="noreferrer">Contact</a>
            <button type="button" onClick={copyLink} aria-label="Copy link">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M12 3v12m0-12 4 4m-4-4-4 4M5 14v5h14v-5" />
              </svg>
            </button>
            <a href="/check/github.com">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M5 19V9m7 10V5m7 14v-7" />
              </svg>
            </a>
            <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" />
              </svg>
            </button>
          </BottomBar>
        </Stage>
      </Hero>

      <ToastContainer position="bottom-left" theme="dark" autoClose={3000} />
    </HomeContainer>
  );
};

export default Home;
