import styled from '@emotion/styled';

import ErrorBoundary from 'client/components/misc/ErrorBoundary';
import colors from 'client/styles/colors';

export const StyledCard = styled.section`
  position: relative;
  background: rgba(15,23,42,0.8);
  color: ${colors.textColor};
  border: 1px solid ${colors.glassBorder};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  padding: 0;
  max-height: 54rem;
  overflow: hidden;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* Top accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1.25rem;
    right: 1.25rem;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${colors.primary}, transparent);
    border-radius: 1px;
  }

  &:hover {
    border-color: ${colors.primary};
    box-shadow: 0 16px 48px rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
  }

  /* Card header strip */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid ${colors.border};
    background: rgba(99, 102, 241, 0.05);
    border-radius: 1rem 1rem 0 0;
    min-height: 3.5rem;
  }

  /* Card body */
  .card-body {
    padding: 1.5rem;
    overflow: auto;
    max-height: calc(54rem - 3.5rem);
  }

  .inner-heading {
    color: ${colors.primaryLighter} !important;
    font-size: 0.75rem !important;
    font-weight: 800 !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    margin: 0 !important;
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  ${(props) => props.styles}
`;

export const Card = (props) => {
  const { children, heading, styles, actionButtons } = props;
  return (
    <ErrorBoundary title={heading}>
      <StyledCard styles={styles}>
        {(heading || actionButtons) && (
          <div className="card-header">
            {heading && (
              <span className="inner-heading">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect width="10" height="10" rx="2" fill={colors.primary} opacity="0.7"/>
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
