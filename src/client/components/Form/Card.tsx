import styled from '@emotion/styled';
import { type ReactNode } from 'react';
import ErrorBoundary from 'client/components/misc/ErrorBoundary';
import colors from 'client/styles/colors';

export const StyledCard = styled.section<{ styles?: string }>`
  position: relative;
  background: linear-gradient(
    145deg,
    rgba(10, 28, 25, 0.88) 0%,
    rgba(6, 18, 16, 0.95) 100%
  );
  color: ${colors.textColor};
  border: 1px solid rgba(76, 225, 211, 0.12);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(76, 225, 211, 0.06);
  border-radius: 14px;
  padding: 0;
  max-height: 54rem;
  overflow: hidden;
  backdrop-filter: blur(28px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* Top accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1.25rem;
    right: 1.25rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(76, 225, 211, 0.45), transparent);
    border-radius: 1px;
  }

  &:hover {
    border-color: rgba(76, 225, 211, 0.28);
    box-shadow:
      0 8px 36px rgba(0, 0, 0, 0.55),
      0 0 28px rgba(76, 225, 211, 0.07),
      inset 0 1px 0 rgba(76, 225, 211, 0.1);
    transform: translateY(-2px);
  }

  /* Card header strip */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1.2rem;
    border-bottom: 1px solid rgba(76, 225, 211, 0.08);
    background: rgba(76, 225, 211, 0.03);
    border-radius: 14px 14px 0 0;
    min-height: 3rem;
  }

  /* Card body */
  .card-body {
    padding: 1rem 1.2rem 1.2rem;
    overflow: auto;
    max-height: calc(54rem - 3rem);
  }

  .inner-heading {
    color: #4ce1d3 !important;
    font-size: 0.7rem !important;
    font-weight: 800 !important;
    letter-spacing: 0.14em !important;
    text-transform: uppercase !important;
    margin: 0 !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  ${(props) => props.styles}
`;

interface CardProps {
  children: ReactNode;
  heading?: string;
  styles?: string;
  actionButtons?: ReactNode | undefined;
}

export const Card = (props: CardProps): JSX.Element => {
  const { children, heading, styles, actionButtons } = props;
  return (
    <ErrorBoundary title={heading}>
      <StyledCard styles={styles}>
        {(heading || actionButtons) && (
          <div className="card-header">
            {heading && (
              <span className="inner-heading">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect width="10" height="10" rx="2" fill="#4ce1d3" opacity="0.7"/>
                </svg>
                {heading}
              </span>
            )}
            {actionButtons && <div style={{ display: 'flex', gap: '0.35rem' }}>{actionButtons}</div>}
          </div>
        )}
        <div className="card-body">
          {children}
        </div>
      </StyledCard>
    </ErrorBoundary>
  );
};

export default StyledCard;
