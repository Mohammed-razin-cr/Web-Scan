/**
 * NotFound — premium animated 404 page
 */
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';
import Nav from 'client/components/Form/Nav';
import Footer from 'client/components/misc/Footer';

const glitch = keyframes`
  0%, 100% { text-shadow: none; transform: translate(0); }
  20% { text-shadow: -3px 0 #4ce1d3, 3px 0 #ffcb9a; transform: translate(-2px, 1px); }
  40% { text-shadow: 3px 0 #4ce1d3, -3px 0 #ffcb9a; transform: translate(2px, -1px); }
  60% { text-shadow: -2px 0 #8ef5ec; transform: translate(-1px, 0); }
  80% { text-shadow: none; transform: translate(0); }
`;

const floatY = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`;

const pulseRing = keyframes`
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 clamp(1rem, 4vw, 2rem);
  overflow-x: hidden;
`;

const Container = styled(motion.main)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 4rem 0 6rem;
  text-align: center;
`;

const Code = styled(motion.h1)`
  font-size: clamp(7rem, 20vw, 12rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #4ce1d3;
  margin: 0;
  animation: ${glitch} 6s ease-in-out infinite;
  position: relative;

  &::before {
    content: '404';
    position: absolute;
    inset: 0;
    color: rgba(76, 225, 211, 0.08);
    filter: blur(24px);
    z-index: -1;
  }
`;

const EmojiWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
`;

const Emoji = styled(motion.span)`
  font-size: 3.5rem;
  animation: ${floatY} 3s ease-in-out infinite;
  display: block;
  position: relative;
  z-index: 1;
`;

const Ring = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(76, 225, 211, 0.4);
  animation: ${pulseRing} 2.4s ease-out infinite;
  animation-delay: ${p => p.delay ?? 0}s;
`;

const Title = styled(motion.h2)`
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 800;
  color: #d1e8e2;
  margin: 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled(motion.p)`
  color: rgba(209, 232, 226, 0.55);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 28rem;
  margin: 0;
`;

const Actions = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(135deg, #116466, #4ce1d3);
  color: #040e0d;
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  border-radius: 10px;
  text-decoration: none;
  text-transform: uppercase;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(76, 225, 211, 0.3);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(76, 225, 211, 0.45);
    color: #040e0d;
  }
`;

const GhostBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border: 1px solid rgba(76, 225, 211, 0.25);
  color: #4ce1d3;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  border-radius: 10px;
  text-decoration: none;
  text-transform: uppercase;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
  &:hover {
    background: rgba(76, 225, 211, 0.08);
    border-color: rgba(76, 225, 211, 0.5);
    transform: translateY(-2px);
    color: #4ce1d3;
  }
`;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const NotFound = () => (
  <Wrapper>
    <Nav />
    <Container variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <Code>404</Code>
      </motion.div>

      <motion.div variants={item}>
        <EmojiWrap>
          <Ring delay={0} />
          <Ring delay={0.8} />
          <Emoji>🛸</Emoji>
        </EmojiWrap>
      </motion.div>

      <Title variants={item}>Page Not Found</Title>
      <Subtitle variants={item}>
        The URL you scanned doesn't exist here. It may have been moved, deleted, or you might have taken a wrong turn.
      </Subtitle>

      <Actions variants={item}>
        <PrimaryBtn to="/check">
          ← Back to Scanner
        </PrimaryBtn>
        <GhostBtn href="https://github.com/Mohammed-razin-cr/Web-Scan/issues" target="_blank" rel="noreferrer">
          Report Issue
        </GhostBtn>
      </Actions>
    </Container>
    <Footer />
  </Wrapper>
);

export default NotFound;
