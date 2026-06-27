import styled from '@emotion/styled';

import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) {
    border-bottom: 1px solid ${colors.primaryTransparent};
  }
  span:first-child {
    font-weight: bold;
  }
`;

const HostListSection = (props) => {
  const { list, title } = props;
  return (
    <>
      <Heading as="h4" size="small" align="left" color={colors.primary}>
        {title}
      </Heading>
      {list.map((entry, index) => {
        return (
          <Row key={`${title.toLocaleLowerCase()}-${index}`}>
            <span>{entry}</span>
          </Row>
        );
      })}
    </>
  );
};

const cardStyles = `
  max-height: 50rem;
  overflow: auto;
`;

const HostNamesCard = (props



) => {
  const hosts = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {hosts.domains.length > 0 && <HostListSection list={hosts.domains} title="Domains" />}
      {hosts.hostnames.length > 0 && <HostListSection list={hosts.hostnames} title="Hosts" />}
    </Card>
  );
};

export default HostNamesCard;
