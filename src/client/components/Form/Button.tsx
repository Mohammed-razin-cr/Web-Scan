import { type ReactNode, type MouseEventHandler } from 'react';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import colors from 'client/styles/colors';
import { type InputSize, applySize } from 'client/styles/dimensions';

type LoadState = 'loading' | 'success' | 'error';

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: InputSize;
  bgColor?: string;
  fgColor?: string;
  styles?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  loadState?: LoadState;
}

const StyledButton = styled.button<ButtonProps>`
  position: relative;
  cursor: pointer;
  border: 1px solid rgba(76, 225, 211, 0.28);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-sizing: border-box;
  width: -moz-available;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.7rem 1.5rem;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow:
    0 4px 20px rgba(17, 100, 102, 0.25),
    inset 0 1px 0 rgba(209, 232, 226, 0.08);
  transition:
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;

  /* Shimmer pseudo-element */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(76, 225, 211, 0.12) 50%,
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(76, 225, 211, 0.65);
    box-shadow:
      0 8px 32px rgba(17, 100, 102, 0.45),
      0 0 20px rgba(76, 225, 211, 0.15),
      inset 0 1px 0 rgba(209, 232, 226, 0.12);
  }
  &:hover::before {
    opacity: 1;
  }
  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 12px rgba(17, 100, 102, 0.2);
  }
  ${(props) => applySize(props.size)};
  ${(props) =>
    props.bgColor
      ? `background: ${props.bgColor};`
      : `background: linear-gradient(135deg, rgba(17, 100, 102, 0.7) 0%, rgba(8, 24, 21, 0.85) 100%);`}
  ${(props) => (props.fgColor ? `color: ${props.fgColor};` : `color: #c8ede7;`)}
  ${(props) => props.styles}
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const SimpleLoader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid ${colors.background};
  width: 1rem;
  height: 1rem;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Loader = (props: { loadState: LoadState }) => {
  if (props.loadState === 'loading') return <SimpleLoader />;
  if (props.loadState === 'success') return <span>✔</span>;
  if (props.loadState === 'error') return <span>✗</span>;
  return <span></span>;
};

const Button = (props: ButtonProps): JSX.Element => {
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
