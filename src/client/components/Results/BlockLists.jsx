import { Card } from 'client/components/Form/Card';
import Row from 'client/components/Form/Row';

const BlockListsCard = (props) => {
  const blockLists = props.data.blocklists;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {blockLists.map((blocklist, blockIndex) => (
        <Row
          title={blocklist.serverIp}
          lbl={blocklist.server}
          val={blocklist.isBlocked ? '❌ Blocked' : '✅ Not Blocked'}
          key={`blocklist-${blockIndex}-${blocklist.serverIp}`}
        />
      ))}
    </Card>
  );
};

export default BlockListsCard;
