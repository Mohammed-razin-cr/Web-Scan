import { Card } from 'client/components/Form/Card';
import Row, { } from 'client/components/Form/Row';

const cardStyles = '';

const parseHeader = (headerString) => {
  return headerString.split(';').map((part) => {
    const trimmedPart = part.trim();
    const equalsIndex = trimmedPart.indexOf('=');

    if (equalsIndex >= 0) {
      return {
        lbl: trimmedPart.substring(0, equalsIndex).trim(),
        val: trimmedPart.substring(equalsIndex + 1).trim(),
      };
    } else {
      return { lbl: trimmedPart, val: 'true' };
    }
  });
};

const HstsCard = (props) => {
  const hstsResults = props.data;
  const hstsHeaders = hstsResults?.hstsHeader ? parseHeader(hstsResults.hstsHeader) : [];
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {typeof hstsResults.compatible === 'boolean' && (
        <Row lbl="HSTS Enabled?" val={hstsResults.compatible ? '✅ Yes' : '❌ No'} />
      )}
      {hstsHeaders.length > 0 &&
        hstsHeaders.map((header, index) => {
          return <Row lbl={header.lbl} val={header.val} key={`hsts-${index}`} />;
        })}
      {hstsResults.message && <p>{hstsResults.message}</p>}
    </Card>
  );
};

export default HstsCard;
