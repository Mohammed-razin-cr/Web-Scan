import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import colors from 'client/styles/colors';
import { useEffect } from 'react';






const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 14, 13, 0.65);
  backdrop-filter: blur(12px);
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
`;

const DrawerContainer = styled.aside`
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: min(420px, 100vw);
  background: rgba(8, 24, 21, 0.94);
  backdrop-filter: blur(24px);
  border-left: 1px solid rgba(209, 232, 226, 0.12);
  box-shadow: -15px 0 45px rgba(0, 0, 0, 0.65);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 2.2rem;
  box-sizing: border-box;
  @media (max-width: 600px) {
    width: 100vw;
    padding:
      max(1.25rem, env(safe-area-inset-top))
      max(1.25rem, env(safe-area-inset-right))
      max(1.25rem, env(safe-area-inset-bottom))
      max(1.25rem, env(safe-area-inset-left));
  }
`;

const CloseButton = styled.button`
  background: rgba(209, 232, 226, 0.05);
  border: 1px solid rgba(209, 232, 226, 0.12);
  color: ${colors.primary};
  width: 2.7rem;
  height: 2.7rem;
  display: grid;
  place-items: center;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-end;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  &:hover {
    background: rgba(76, 225, 211, 0.12);
    border-color: rgba(76, 225, 211, 0.35);
    color: #4ce1d3;
    transform: scale(1.05) rotate(90deg);
  }
  &:active {
    transform: scale(0.95);
  }
  svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke: currentColor;
  }
`;

const DrawerBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 1.5rem;
  margin-bottom: 3.5rem;
  color: white;
  font-weight: 850;
  font-size: 1.35rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  img {
    height: 2.2rem;
    width: auto;
    filter: drop-shadow(0 2px 8px rgba(76, 225, 211, 0.2));
  }
  @media (max-width: 600px) {
    margin-top: 1rem;
    margin-bottom: 2rem;
    font-size: 1.15rem;
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  flex-grow: 1;
  @media (max-width: 600px) { gap: 0.75rem; }
`;

const LinkLabel = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  span:first-of-type {
    font-size: 1.05rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  span:last-of-type {
    font-size: 0.72rem;
    color: ${colors.textColorSecondary};
    font-weight: 500;
    margin-top: 0.2rem;
    text-transform: none;
  }
`;

const NavLinkStyled = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  color: ${colors.textColor};
  text-decoration: none;
  padding: 0.85rem 1.1rem;
  border-radius: 8px;
  border: 1px solid transparent;
  background: rgba(209, 232, 226, 0.02);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  svg {
    width: 1.35rem;
    height: 1.35rem;
    stroke: currentColor;
    opacity: 0.8;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover {
    color: #4ce1d3;
    background: rgba(76, 225, 211, 0.07);
    border-color: rgba(76, 225, 211, 0.18);
    transform: translateX(6px);

    svg {
      transform: scale(1.1) rotate(3deg);
      color: #4ce1d3;
      opacity: 1;
    }

    span:last-of-type {
      color: #e2f7f1;
    }
  }
  @media (max-width: 600px) {
    gap: 0.9rem;
    padding: 0.8rem;
  }
`;

const ExternalNavLinkStyled = NavLinkStyled.withComponent('a');

const DrawerFooter = styled.div`
  border-top: 1px solid rgba(209, 232, 226, 0.08);
  padding-top: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: ${colors.textColorSecondary};
  font-size: 0.75rem;
  font-weight: 500;
  text-align: left;
  
  a {
    color: #4ce1d3;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover {
      color: ${colors.primaryLighter};
    }
  }
  @media (max-width: 600px) { padding-top: 1.25rem; }
`;

export default function NavigationDrawer({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      <DrawerContainer isOpen={isOpen} aria-modal="true" role="dialog" aria-label="Navigation Menu">
        <CloseButton onClick={onClose} aria-label="Close menu">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>

        <DrawerBrand>
          <img src="/logo-icon-transparent.png" alt="WebScan Logo" />
          WEBSCAN
        </DrawerBrand>

        <NavList>
          <NavLinkStyled to="/check" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <LinkLabel>
              <span>Scan Dashboard</span>
              <span>Run new website or IP scan</span>
            </LinkLabel>
          </NavLinkStyled>

          <NavLinkStyled to="/check/about" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <LinkLabel>
              <span>About WebScan</span>
              <span>How analytics & detection works</span>
            </LinkLabel>
          </NavLinkStyled>

        </NavList>

        <DrawerFooter>
          <span>Created by <a href="https://github.com/Mohammed-razin-cr/" target="_blank" rel="noreferrer">Mohammed Razin</a></span>
          <span>Released under MIT License.</span>
        </DrawerFooter>
      </DrawerContainer>
    </>
  );
}
