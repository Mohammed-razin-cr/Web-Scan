import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import colors from 'client/styles/colors';
import { applySize } from 'client/styles/dimensions';
import { motion } from 'framer-motion';

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

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
  gap: 0.75rem;
  padding: 0.9rem 1.75rem;
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
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255, 255, 255, 0.15) 45%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.15) 55%,
      transparent 60%
    );
    transform: translateX(-100%);
    opacity: 0;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: ${colors.primary};
    box-shadow: 0 15px 35px ${colors.primary}33;
    
    &::before {
      opacity: 1;
      animation: ${shimmer} 0.9s ease-out;
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.97);
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary}55, 0 10px 28px ${colors.primary}44;
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

export const AnimatedGitHubIcon = ({ size = 22 }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.137 20.197 22 16.442 22 12.017 22 6.484 17.522 2 12 2z"
      />
    </motion.svg>
  );
};

const Button = (props) => {
  const { children, size, bgColor, fgColor, onClick, styles, title, loadState, type, icon } = props;
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
      {icon}
      {children}
    </StyledButton>
  );
};

export default Button;
