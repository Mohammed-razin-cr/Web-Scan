import { Card } from 'client/components/Form/Card';
import { ExpandableRow } from 'client/components/Form/Row';

const processScore = (percentile) => {
  return `${Math.round(percentile * 100)}%`;
};










const makeValue = (audit) => {
  let score = audit.score;
  if (audit.displayValue) {
    score = audit.displayValue;
  } else if (audit.scoreDisplayMode) {
    score = audit.score === 1 ? '✅ Pass' : '❌ Fail';
  }
  return score;
};

const LighthouseCard = (props) => {
  const lighthouse = props.data;
  const categories = lighthouse?.categories || {};
  const audits = lighthouse?.audits || [];

  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {Object.keys(categories).map((title, index) => {
        const scoreIds = categories[title].auditRefs.map((ref) => ref.id);
        const scoreList = scoreIds.map((id) => {
          return {
            lbl: audits[id].title,
            val: makeValue(audits[id]),
            title: audits[id].description,
            key: id,
          };
        });
        return (
          <ExpandableRow
            key={`lighthouse-${index}`}
            lbl={title}
            val={processScore(categories[title].score)}
            rowList={scoreList}
          />
        );
      })}
    </Card>
  );
};

export default LighthouseCard;
