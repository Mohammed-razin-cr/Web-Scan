import { Card } from 'client/components/Form/Card';
import Heading from 'client/components/Form/Heading';
import Row from 'client/components/Form/Row';
import colors from 'client/styles/colors';

const DnsServerCard = (props) => {
  const dnsSecurity = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {dnsSecurity.dns.map((dns, index) => {
        return (
          <div key={`dns-${index}`}>
            {dnsSecurity.dns.length > 1 && (
              <Heading as="h4" size="small" color={colors.primary}>
                DNS Server #{index + 1}
              </Heading>
            )}
            <Row lbl="Hostname" val={dns.hostname} key={`host-${index}`} />
            {dns.address && <Row lbl="IP Address" val={dns.address} key={`ip-${index}`} />}
          </div>
        );
      })}
    </Card>
  );
};

export default DnsServerCard;
