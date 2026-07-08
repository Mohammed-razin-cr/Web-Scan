/**
 * Nav — premium sticky glassmorphic navbar
 * Added: BorderBeam animated light sweep, animated brand hover,
 * shimmer on brand text, glow underline on active scan.
 */
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import BorderBeam from 'client/components/ui/BorderBeam';
import ShimmerText from 'client/components/ui/ShimmerText';

const Header = styled.header`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
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
  overflow: hidden; /* needed for BorderBeam offset-path */
`;

const Brand = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  z-index: 2;
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
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 1.75rem;
  background: rgba(76, 225, 211, 0.12);
  flex-shrink: 0;
`;

const ChildWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
`;

const Nav = (props) => (
  <Header>
    {/* Animated border beam on the nav */}
    <BorderBeam
      colorStart="#4ce1d3"
      colorEnd="#ffcb9a"
      duration={5}
      beamWidth={5}
      borderRadius={14}
    />

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

export default Nav;
