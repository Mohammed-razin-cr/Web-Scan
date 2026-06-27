import { Card } from 'client/components/Form/Card';
import Row, { } from 'client/components/Form/Row';

const cardStyles = `
  grid-row: span 2;
  .content {
    max-height: 50rem;
    overflow-y: auto;
  }
`;

const RobotsTxtCard = (props



) => {
  const { data } = props;
  const robots = data?.robots || [];

  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <div className="content">
        {robots.length === 0 && <p>No crawl rules found.</p>}
        {robots.map((row, index) => {
          return <Row key={`${row.lbl}-${index}`} lbl={row.lbl} val={row.val} />;
        })}
      </div>
    </Card>
  );
};

export default RobotsTxtCard;
