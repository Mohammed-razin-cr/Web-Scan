
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';













export const StyledRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.42rem 0.5rem;
  border-radius: 6px;
  gap: 0.5rem;
  transition: background 0.15s ease;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(76, 225, 211, 0.07);
  }

  &:hover {
    background: rgba(76, 225, 211, 0.04);
  }

  &li {
    border-bottom: 1px dashed rgba(76, 225, 211, 0.1) !important;
  }

  span.lbl {
    font-weight: 600;
    font-size: 0.8rem;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${colors.textColorSecondary};
    letter-spacing: 0.02em;
  }

  span.val {
    max-width: 16rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.82rem;
    font-weight: 500;
    color: ${colors.textColor};
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    background: rgba(76, 225, 211, 0.05);
    border: 1px solid rgba(76, 225, 211, 0.08);
    transition: all 0.15s ease;

    &:hover {
      background: rgba(76, 225, 211, 0.1);
      border-color: rgba(76, 225, 211, 0.25);
      color: #4ce1d3;
    }

    a {
      color: #4ce1d3;
    }
  }
`;

export const Details = styled.details`
  transition: all 0.2s ease-in-out;

  summary {
    padding-left: 1.25rem;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${colors.textColorSecondary};
    border-radius: 6px;
    padding-top: 0.35rem;
    padding-bottom: 0.35rem;
    transition: color 0.15s ease, background 0.15s ease;

    &:hover {
      background: rgba(76, 225, 211, 0.04);
      color: ${colors.textColor};
    }

    &::-webkit-details-marker { display: none; }
    &::marker { display: none; }
  }

  summary:before {
    content: '▶';
    position: absolute;
    margin-left: -1.1rem;
    color: ${colors.primary};
    font-size: 0.6rem;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  &[open] summary:before {
    transform: rotate(90deg);
  }
`;

const SubRowList = styled.ul`
  margin: 0.25rem 0 0.25rem 0.5rem;
  padding: 0.25rem 0.5rem;
  background: rgba(76, 225, 211, 0.03);
  border-left: 2px solid rgba(76, 225, 211, 0.15);
  border-radius: 0 6px 6px 0;
  list-style: none;
`;

const PlainText = styled.pre`
  background: rgba(6, 15, 14, 0.7);
  border: 1px solid rgba(76, 225, 211, 0.1);
  width: 95%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.78rem;
  color: #9eb9b2;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.6;
`;

const List = styled.ul`
  width: 95%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 4px;
  margin: 0.25rem 0;
  padding: 0.25rem 0.25rem 0.25rem 1.25rem;

  li {
    text-overflow: ellipsis;
    font-size: 0.8rem;
    padding: 0.15rem 0;
    color: ${colors.textColor};

    &:first-letter {
      text-transform: capitalize;
    }

    &::marker {
      color: ${colors.primary};
      font-size: 0.6rem;
    }
  }
`;

const isValidDate = (date) => {
  const isInRange = (date) => {
    return date >= new Date('1995-01-01') && date <= new Date('2030-12-31');
  };
  if (typeof date === 'number') {
    const timestampDate = new Date(date);
    return !isNaN(timestampDate.getTime()) && isInRange(timestampDate);
  }
  if (typeof date === 'string') {
    const dateStringDate = new Date(date);
    return !isNaN(dateStringDate.getTime()) && isInRange(dateStringDate);
  }
  if (date instanceof Date) {
    return !isNaN(date.getTime()) && isInRange(date);
  }
  return false;
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
};

const formatValue = (value) => {
  if (isValidDate(new Date(value))) return formatDate(value);
  if (typeof value === 'boolean') return value ? '✅' : '❌';
  return value;
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

const snip = (text, length = 80) => {
  if (text.length < length) return text;
  return `${text.substring(0, length)}...`;
};

export const ExpandableRow = (props) => {
  const { lbl, val, title, rowList, open } = props;
  return (
    <Details open={open}>
      <StyledRow as="summary" key={`${lbl}-${val}`}>
        <span className="lbl" title={title?.toString()}>
          {lbl}
        </span>
        <span className="val" title={val?.toString()}>
          {val.toString()}
        </span>
      </StyledRow>
      {rowList && (
        <SubRowList>
          {rowList?.map((row, index) => {
            return (
              <StyledRow as="li" key={`${row.lbl}-${index}`}>
                <span className="lbl" title={row.title?.toString()}>
                  {row.lbl}
                </span>
                <span
                  className="val"
                  title={row.val?.toString()}
                  onClick={() => copyToClipboard(row.val)}
                >
                  {formatValue(row.val)}
                </span>
                {row.plaintext && <PlainText>{row.plaintext}</PlainText>}
                {row.listResults && (
                  <List>
                    {row.listResults.map((listItem) => (
                      <li key={listItem}>{snip(listItem)}</li>
                    ))}
                  </List>
                )}
              </StyledRow>
            );
          })}
        </SubRowList>
      )}
    </Details>
  );
};

export const ListRow = (props) => {
  const { list, title } = props;
  return (
    <>
      <Heading as="h4" size="small" align="left" color={colors.primary}>
        {title}
      </Heading>
      {list.map((entry, index) => {
        return (
          <Row lbl="" val="" key={`${entry}-${title.toLocaleLowerCase()}-${index}`}>
            <span>{entry}</span>
          </Row>
        );
      })}
    </>
  );
};

const Row = (props) => {
  const { lbl, val, title, plaintext, listResults, children } = props;
  if (children) return <StyledRow key={`${lbl}-${val}`}>{children}</StyledRow>;
  return (
    <StyledRow key={`${lbl}-${val}`}>
      {lbl && (
        <span className="lbl" title={title?.toString()}>
          {lbl}
        </span>
      )}
      <span className="val" title={val?.toString()} onClick={() => copyToClipboard(val)}>
        {formatValue(val)}
      </span>
      {plaintext && <PlainText>{plaintext}</PlainText>}
      {listResults && (
        <List>
          {listResults.map((listItem, listIndex) => (
            <li key={listIndex} title={listItem}>
              {snip(listItem)}
            </li>
          ))}
        </List>
      )}
    </StyledRow>
  );
};

export default Row;
