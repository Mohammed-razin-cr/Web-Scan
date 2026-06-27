import { useState } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Button from 'client/components/Form/Button';
import AnimatedIcon from 'client/components/misc/AnimatedIcon';
import { Download, Eye, X } from 'lucide-react';

const CardStyles = `
margin: 0 auto;
width: min(1200px, 92vw);
position: relative;
transition: all 0.3s ease;
display: flex;
flex-direction: column;
max-height: 100%;
background: rgba(15, 23, 42, 0.6);
backdrop-filter: blur(18px);
border: 1px solid rgba(148,163,184,0.18);
border-radius: 1rem;
padding: 1.5rem;
a {
  color: ${colors.primary};
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.5rem 0 1.5rem 0;
  button {
    max-width: 300px;
    min-width: 160px;
  }
}
small {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: ${colors.textColorSecondary};
  line-height: 1.6;
}
`;

const StyledIframe = styled.iframe`
  width: 100%;
  outline: none;
  border: 1px solid ${colors.border};
  border-radius: 0.75rem;
  min-height: 50vh;
  height: 100%;
  background: ${colors.backgroundSecondary};
`;

const ViewRaw = (props) => {
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const makeResults = () => {
    const result = {};
    props.everything.forEach((item) => {
      result[item.id] = item.result;
    });
    return result;
  };

  const fetchResultsUrl = async () => {
    const resultContent = makeResults();
    const response = await fetch('https://jsonhero.io/api/create.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'web-check results',
        content: resultContent,
        readOnly: true,
        ttl: 3600,
      }),
    });
    if (!response.ok) {
      setError(`HTTP error! status: ${response.status}`);
    } else {
      setError(null);
    }
    await response.json().then((data) => setResultUrl(data.location));
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(makeResults(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'web-check-results.json';
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Card heading="View / Download Raw Data" styles={CardStyles}>
      <div className="controls">
        <Button
          onClick={handleDownload}
          bgColor="linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})"
          fgColor="#ffffff"
          styles="border: 1px solid rgba(99,102,241,0.3); &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }"
        >
          <AnimatedIcon icon={Download} hoverEffect="bounce" />
          Download Results
        </Button>
        <Button
          onClick={fetchResultsUrl}
          bgColor="linear-gradient(135deg, rgba(15,23,42), rgba(30,41,59))"
          fgColor={colors.primaryLighter}
          styles="border: 1px solid ${colors.border}; &:hover { border-color: ${colors.primary}; background: linear-gradient(135deg, rgba(30,41,59), rgba(15,23,42)); transform: translateY(-2px); }"
        >
          <AnimatedIcon icon={Eye} hoverEffect="pulse" />
          {resultUrl ? 'Update Results' : 'View Results'}
        </Button>
        {resultUrl && (
          <Button
            onClick={() => setResultUrl('')}
            bgColor="linear-gradient(135deg, rgba(239,68,68), rgba(185,28,28))"
            fgColor="#ffffff"
            styles="border: 1px solid rgba(239,68,68,0.3); &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(239,68,68,0.3); }"
          >
            <AnimatedIcon icon={X} hoverEffect="rotate" />
            Hide Results
          </Button>
        )}
      </div>
      {resultUrl && !error && (
        <>
          <StyledIframe title="Results, via JSON Hero" src={resultUrl} />
          <small>
            Your results are available to view <a href={resultUrl}>here</a>.
          </small>
        </>
      )}
      {error && <p className="error">{error}</p>}
      <small>
        These are the raw results generated from your URL, and in JSON format. You can import these
        into your own program, for further analysis.
      </small>
    </Card>
  );
};

export default ViewRaw;
