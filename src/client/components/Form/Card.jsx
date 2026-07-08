/**
 * Card — premium glassmorphic result card
 * Added: SpotlightCard mouse-tracking glow, framer-motion entrance,
 * shimmer accent top line, refined header & body.
 */
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import ErrorBoundary from 'client/components/misc/ErrorBoundary';
import SpotlightCard from 'client/components/ui/SpotlightCard';
import colors from 'client/styles/colors';

export const StyledCard = styled(motion.section)`
  position: relative;
  background: rgba(6, 14, 13, 0.82);
  color: ${colors.textColor};
  border: 1px solid rgba(76, 225, 211, 0.11);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(76, 225, 211, 0.05);
  border-radius: 1rem;
  max-height: 54rem;
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1);

  /* Animated accent top line */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 1.25rem; right: 1.25rem;
    height: 1px;
    background: linear-gradient(90deg,
      transparent,
      rgba(76,225,211,0.6) 40%,
      rgba(255,203,154,0.4) 60%,
      transparent
    );
    background-size: 200% auto;
    animation: card-top-sweep 4s linear infinite;
  }
  @keyframes card-top-sweep {
    0%   { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  &:hover {
    border-color: rgba(76, 225, 211, 0.28);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(76, 225, 211, 0.08) inset;
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid rgba(76,225,211,0.08);
    background: rgba(76,225,211,0.025);
    border-radius: 1rem 1rem 0 0;
    min-height: 3.25rem;
    position: relative;
    z-index: 2;
  }

  .card-body {
    padding: 1.25rem;
    overflow: auto;
    max-height: calc(54rem - 3.25rem);
    position: relative;
    z-index: 2;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: rgba(76,225,211,0.2); border-radius: 2px; }
  }

  .inner-heading {
    color: rgba(76,225,211,0.9) !important;
    font-size: 0.72rem !important;
    font-weight: 800 !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    margin: 0 !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  ${(props) => props.styles}
`;

const cardEntrance = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show:   { opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const ActionArea = styled.div`
  display: flex;
  gap: 0.3rem;
  position: relative;
  z-index: 3;
`;

const HeadingDot = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
    <rect width="8" height="8" rx="2" fill="rgba(76,225,211,0.7)" />
  </svg>
);

export const Card = (props) => {
  const { children, heading, styles, actionButtons } = props;
  return (
    <ErrorBoundary title={heading}>
      <SpotlightCard spotColor="rgba(76,225,211,0.08)">
        <StyledCard
          styles={styles}
          variants={cardEntrance}
          initial="hidden"
          animate="show"
          layout
        >
          {(heading || actionButtons) && (
            <div className="card-header">
              {heading && (
                <span className="inner-heading">
                  <HeadingDot />
                  {heading}
                </span>
              )}
              {actionButtons && <ActionArea>{actionButtons}</ActionArea>}
            </div>
          )}
          <div className="card-body">{children}</div>
        </StyledCard>
      </SpotlightCard>
    </ErrorBoundary>
  );
};

export default StyledCard;
