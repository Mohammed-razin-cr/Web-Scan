import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';


const HeadersCard = (props



) => {
  const headers = props.data;
  return (
    <Card heading={props.title} styles="grid-row: span 2;" actionButtons={props.actionButtons}>
      {Object.keys(headers).map((header, index) => {
        return <Row key={`header-${index}`} lbl={header} val={headers[header]} />;
      })}
    </Card>
  );
};

export default HeadersCard;
