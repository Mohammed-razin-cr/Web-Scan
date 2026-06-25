import styled from '@emotion/styled';
import colors from 'client/styles/colors';

const ActionButtonContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  width: 1.75rem;
  height: 1.75rem;
  display: grid;
  place-items: center;
  font-size: 0.9rem;
  background: rgba(76, 225, 211, 0.05);
  border: 1px solid rgba(76, 225, 211, 0.12);
  border-radius: 6px;
  color: ${colors.textColorSecondary};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
  line-height: 1;

  &:hover {
    color: #4ce1d3;
    background: rgba(76, 225, 211, 0.12);
    border-color: rgba(76, 225, 211, 0.35);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 225, 211, 0.15);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }
`;

interface Action {
  label: string;
  icon: string;
  onClick: () => void;
}

const ActionButtons = (props: { actions: any }): JSX.Element => {
  const actions = props.actions;
  if (!actions) return <></>;
  return (
    <ActionButtonContainer>
      {actions.map((action: Action, index: number) => (
        <ActionBtn
          key={`action-${index}`}
          onClick={action.onClick}
          title={action.label}
          type="button"
          aria-label={action.label}
        >
          {action.icon}
        </ActionBtn>
      ))}
    </ActionButtonContainer>
  );
};

export default ActionButtons;
