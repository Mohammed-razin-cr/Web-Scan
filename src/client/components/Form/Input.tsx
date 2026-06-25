import { type InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { type InputSize, applySize } from 'client/styles/dimensions';

type Orientation = 'horizontal' | 'vertical';

interface Props {
  id: string;
  value: string;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: InputSize;
  orientation?: Orientation;
  handleChange: (nweVal: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown?: (keyEvent: React.KeyboardEvent<HTMLInputElement>) => void;
}

type SupportedElements = HTMLInputElement | HTMLLabelElement | HTMLDivElement;
interface StyledInputTypes extends InputHTMLAttributes<SupportedElements> {
  inputSize?: InputSize;
  orientation?: Orientation;
}

const InputContainer = styled.div<StyledInputTypes>`
  display: flex;
  ${(props) => (props.orientation === 'vertical' ? 'flex-direction: column;' : '')};
  gap: 0.5rem;
`;

const StyledInput = styled.input<StyledInputTypes>`
  background: rgba(8, 24, 21, 0.76);
  color: ${colors.textColor};
  border: 1px solid rgba(209, 232, 226, 0.2);
  border-radius: 0.2rem;
  font-family: inherit;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
  &::placeholder {
    color: rgba(209, 232, 226, 0.48);
  }
  &:focus {
    outline: none;
    border-color: rgba(255, 203, 154, 0.72);
    background: rgba(8, 24, 21, 0.9);
    box-shadow: 0 0 0 4px rgba(255, 203, 154, 0.1);
  }

  ${(props) => applySize(props.inputSize)};
`;

const StyledLabel = styled.label<StyledInputTypes>`
  color: ${colors.textColorSecondary};
  ${(props) => applySize(props.inputSize)};
  padding: 0;
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Input = (inputProps: Props): JSX.Element => {
  const {
    id,
    value,
    label,
    placeholder,
    name,
    disabled,
    size,
    orientation,
    handleChange,
    handleKeyDown,
  } = inputProps;

  return (
    <InputContainer orientation={orientation}>
      {label && (
        <StyledLabel htmlFor={id} inputSize={size}>
          {label}
        </StyledLabel>
      )}
      <StyledInput
        id={id}
        value={value}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        onChange={handleChange}
        inputSize={size}
        onKeyDown={handleKeyDown || (() => {})}
      />
    </InputContainer>
  );
};

export default Input;
