import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import colors from 'client/styles/colors';

const Header = styled.header`
  margin: 0 auto 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.5rem;
  width: 100%;
  max-width: min(1240px, calc(100vw - 2rem));
  position: sticky;
  top: 1rem;
  z-index: 20;
  background: rgba(6, 15, 14, 0.82);
  backdrop-filter: blur(28px);
  border: 1px solid rgba(76, 225, 211, 0.1);
  border-radius: 14px;
  box-shadow:
    0 4px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(76, 225, 211, 0.06);

  /* Top glow line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 2rem;
    right: 2rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(76, 225, 211, 0.5), transparent);
  }
`;

const Brand = styled.a`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-decoration: none;
  color: inherit;
`;

const BrandMark = styled.img`
  width: 2.2rem;
  height: 2.2rem;
  object-fit: contain;
  filter: drop-shadow(0 2px 12px rgba(76, 225, 211, 0.35));
`;

const BrandText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.05rem;

  strong {
    font-size: 1rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${colors.textColor};
  }

  small {
    color: ${colors.textColorSecondary};
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 2rem;
  background: rgba(76, 225, 211, 0.15);
`;

const Nav = (props: { children?: ReactNode }) => {
  return (
    <Header>
      <Brand href="/check" aria-label="WebScan home">
        <BrandMark src="/logo-icon-transparent.png" alt="WebScan Logo" aria-hidden="true" />
        <BrandText>
          <strong>WebScan</strong>
          <small>Analyze. Detect. Protect.</small>
        </BrandText>
      </Brand>
      {props.children && (
        <>
          <Divider />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {props.children}
          </div>
        </>
      )}
    </Header>
  );
};

export default Nav;
