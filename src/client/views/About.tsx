import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import colors from 'client/styles/colors';
import Footer from 'client/components/misc/Footer';
import Nav from 'client/components/Form/Nav';
import Button from 'client/components/Form/Button';
import docs from 'client/utils/docs';

// Styled Components
const AboutContainer = styled.div`
  width: 95vw;
  max-width: 1100px;
  margin: 2rem auto;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-sizing: border-box;
`;

const HeaderLinkContainer = styled.nav`
  display: flex;
  gap: 1rem;
  a {
    text-decoration: none;
  }
`;

const HeroCard = styled.div`
  background: linear-gradient(135deg, rgba(8, 24, 21, 0.9) 0%, rgba(17, 100, 102, 0.15) 100%);
  border: 1px solid rgba(76, 225, 211, 0.2);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  text-align: left;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(76, 225, 211, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const HeroTitle = styled.h1`
  margin: 0 0 0.75rem 0;
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.05em;
  span {
    color: #4ce1d3;
  }
`;

const HeroSubtitle = styled.p`
  margin: 0;
  font-size: 1.1rem;
  color: ${colors.textColorSecondary};
  line-height: 1.6;
`;

const CompactCard = styled.section`
  background: rgba(8, 24, 21, 0.75);
  border: 1px solid rgba(209, 232, 226, 0.1);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #4ce1d3;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border-bottom: 1px solid rgba(209, 232, 226, 0.08);
  padding-bottom: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
`;

const FeatureBadge = styled.span`
  padding: 0.45rem 0.85rem;
  background: rgba(76, 225, 211, 0.03);
  border: 1px solid rgba(76, 225, 211, 0.14);
  border-radius: 50px;
  font-size: 0.8rem;
  color: ${colors.textColor};
  font-weight: 700;
  transition: all 0.2s ease;
  cursor: default;
  
  &:hover {
    background: rgba(76, 225, 211, 0.12);
    border-color: rgba(76, 225, 211, 0.4);
    color: #4ce1d3;
    transform: translateY(-1px);
  }
`;

const BottomCard = styled(CompactCard)`
  text-align: left;
  p {
    margin: 0;
    line-height: 1.6;
  }
`;

export default function About(): JSX.Element {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div>
      <AboutContainer>
        <Nav>
          <HeaderLinkContainer>
            <a target="_blank" rel="noreferrer" href="https://github.com/Mohammed-razin-cr/Web-Scan">
              <Button>View on GitHub</Button>
            </a>
          </HeaderLinkContainer>
        </Nav>

        <HeroCard>
          <HeroTitle>
            About <span>WebScan</span>
          </HeroTitle>
          <HeroSubtitle>
            An open-source, all-in-one OSINT intelligence tool designed to gather, analyze, and map comprehensive public data about any domain or host.
          </HeroSubtitle>
        </HeroCard>

        <CompactCard>
          <CardTitle>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'currentColor' }}>
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Supported Diagnostics
          </CardTitle>
          <p style={{ margin: 0, fontSize: '0.95rem', color: colors.textColorSecondary, textAlign: 'left', lineHeight: '1.5' }}>
            WebScan runs a wide array of OSINT checks on target hostnames to compile deep profiles in real-time:
          </p>
          <BadgeList>
            {docs.map((section) => (
              <FeatureBadge key={section.title}>
                {section.title}
              </FeatureBadge>
            ))}
          </BadgeList>
        </CompactCard>

        <BottomCard>
          <CardTitle>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'currentColor' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Terms & Privacy
          </CardTitle>
          <p style={{ fontSize: '0.92rem', color: colors.textColorSecondary }}>
            <strong>Privacy Guarantee:</strong> No user data, queried hosts, or IP addresses are ever logged. Analytics (via Plausible) only count page visits, and basic error logging (via GlitchTip) keeps the app bug-free. Your searches remain entirely yours.
          </p>
          <p style={{ fontSize: '0.92rem', color: colors.textColorSecondary }}>
            <strong>License & Credits:</strong> WebScan is developed by <a target="_blank" rel="noreferrer" href="https://github.com/Mohammed-razin-cr" style={{ color: '#4ce1d3', textDecoration: 'none' }}>Mohammed Razin</a>. Released under the open-source MIT License. You are free to modify, deploy, and distribute it for private or commercial use.
          </p>
        </BottomCard>
      </AboutContainer>
      <Footer />
    </div>
  );
}
