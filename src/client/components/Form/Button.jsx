
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import colors from 'client/styles/colors';
import { applySize } from 'client/styles/dimensions';

const StyledButton = styled.button`
  position: relative;
  cursor: pointer;
  border: 1px solid ${colors.border};
  border-radius: 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.75rem 1.5rem;
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;

  /* Shimmer pseudo-element */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(99, 102, 241, 0.15) 50%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${colors.primary};
    box-shadow: 0 10px 28px rgba(99, 102, 241, 0.3);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.35), 0 10px 28px rgba(99,102,241,0.3);
  }
  
  ${(props) => applySize(props.size)};
  ${(props) => props.bgColor ? `background: ${props.bgColor};` : `background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);`}
  ${(props) => (props.fgColor ? `color: ${props.fgColor};` : `color: #ffffff;`)}
  ${(props) => props.styles}
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SimpleLoader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ffffff;
  width: 1rem;
  height: 1rem;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Loader = (props) => {
  if (props.loadState === 'loading') return <SimpleLoader />;
  if (props.loadState === 'success') return <span>✔</span>;
  if (props.loadState === 'error') return <span>✗</span>;
  return <span></span>;
};

const Button = (props) => {
  const { children, size, bgColor, fgColor, onClick, styles, title, loadState, type } = props;
  return (
    <StyledButton
      onClick={onClick || (() => null)}
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      styles={styles}
      title={title?.toString()}
      type={type || 'button'}
    >
      {loadState && <Loader loadState={loadState} />}
      {children}
    </StyledButton>
  );
};

export default Button;
