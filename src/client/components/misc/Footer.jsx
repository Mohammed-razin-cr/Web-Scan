import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import colors from 'client/styles/colors';
import { motion } from 'framer-motion';

const FooterContainer = styled.footer`
  position: relative;
  z-index: 10;
  width: 100%;
  padding: clamp(1.75rem, 5vw, 2.75rem) 0;
  margin-top: clamp(2.5rem, 5vw, 4.5rem);
`;

const FooterInner = styled.div`
  width: min(1200px, 92vw);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: clamp(1.5rem, 4vw, 2.25rem);
  gap: 2rem;
  border-top: 1px solid ${colors.border};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    width: clamp(22px, 4vw, 28px);
    height: clamp(22px, 4vw, 28px);
  }
`;

const ProjectName = styled.span`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 700;
  color: ${colors.textColor};
  letter-spacing: -0.01em;
`;

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterText = styled.span`
  font-size: clamp(0.825rem, 2vw, 0.975rem);
  color: ${colors.textSecondary};
  font-weight: 400;
  line-height: 1.5;
`;

const StyledLink = styled.a`
  color: ${colors.textSecondary};
  font-size: clamp(0.825rem, 2vw, 0.975rem);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    color: ${colors.primary};
  }
`;

const StyledRouterLink = styled(Link)`
  color: ${colors.textSecondary};
  font-size: clamp(0.825rem, 2vw, 0.975rem);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    color: ${colors.primary};
  }
`;

const AnimatedLink = ({ children, href, to, ...props }) => {
  const Component = to ? StyledRouterLink : StyledLink;
  return (
    <motion.div
      whileHover={{ y: -1.5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Component to={to} href={href} {...props}>
        {children}
      </Component>
    </motion.div>
  );
};

const Footer = (props) => {
  const licenseUrl = 'https://github.com/Mohammed-razin-cr/Web-Scan/blob/main/LICENSE';
  const authorUrl = 'https://github.com/Mohammed-razin-cr';
  const githubUrl = 'https://github.com/Mohammed-razin-cr/Web-Scan';
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer style={props.isFixed ? { position: 'fixed', bottom: 0, marginTop: 0 } : {}}>
      <FooterInner>
        <FooterLeft>
          <LogoWrapper>
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill={colors.primary}
                opacity="0.15"
              />
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                fill={colors.primary}
              />
            </svg>
            <ProjectName>WebScan</ProjectName>
          </LogoWrapper>
        </FooterLeft>
        <FooterLinks>
          <FooterText>
            View source at
            <AnimatedLink href={githubUrl}>
              {' '}
              github.com/Mohammed-razin-cr/Web-Scan
            </AnimatedLink>
          </FooterText>
          <FooterText>•</FooterText>
          <FooterText>
            <AnimatedLink to="/about">WebScan</AnimatedLink> is licensed under
            <AnimatedLink href={licenseUrl}> MIT</AnimatedLink> -
            <AnimatedLink href={authorUrl}> © Mohammed Razin</AnimatedLink>
            <AnimatedLink> {currentYear}</AnimatedLink>
          </FooterText>
        </FooterLinks>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;
