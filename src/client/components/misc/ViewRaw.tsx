import { useState } from 'react';
import styled from '@emotion/styled';
import colors from 'client/styles/colors';
import { Card } from 'client/components/Form/Card';
import Button from 'client/components/Form/Button';

const CardStyles = `
margin: 0 auto;
width: 95vw;
position: relative;
transition: all 0.2s ease-in-out;
display: flex;
flex-direction: column;
max-height: 100%;
a {
  color: ${colors.primary};
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.5rem 0;
  button {
    max-width: 300px;
    min-width: 160px;
  }
}
small {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.5;
}
`;

const StyledIframe = styled.iframe`
  width: calc(100% - 2rem);
  outline: none;
  border: none;
  border-radius: 4px;
  min-height: 50vh;
  height: 100%;
  margin: 1rem;
  background: ${colors.background};
`;

const ViewRaw = (props: { everything: { id: string; result: any }[] }) => {
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const makeResults = () => {
    const result: { [key: string]: any } = {};
    props.everything.forEach((item: { id: string; result: any }) => {
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
          bgColor="linear-gradient(135deg, rgba(180, 100, 30, 0.65) 0%, rgba(8, 24, 21, 0.9) 100%)"
          fgColor="#ffcb9a"
          styles="border-color: rgba(255, 203, 154, 0.35); &:hover { border-color: rgba(255, 203, 154, 0.75); box-shadow: 0 8px 32px rgba(180,100,30,0.35), 0 0 20px rgba(255,203,154,0.12); }"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Results
        </Button>
        <Button
          onClick={fetchResultsUrl}
          bgColor="linear-gradient(135deg, rgba(17, 100, 102, 0.8) 0%, rgba(8, 24, 21, 0.9) 100%)"
          fgColor="#4ce1d3"
          styles="border-color: rgba(76, 225, 211, 0.4); &:hover { border-color: rgba(76, 225, 211, 0.8); box-shadow: 0 8px 32px rgba(17,100,102,0.5), 0 0 24px rgba(76,225,211,0.2); }"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          {resultUrl ? 'Update Results' : 'View Results'}
        </Button>
        {resultUrl && (
          <Button
            onClick={() => setResultUrl('')}
            bgColor="linear-gradient(135deg, rgba(80, 20, 20, 0.65) 0%, rgba(8, 24, 21, 0.9) 100%)"
            fgColor="#ff9a9a"
            styles="border-color: rgba(255, 100, 100, 0.3); &:hover { border-color: rgba(255, 100, 100, 0.65); box-shadow: 0 8px 32px rgba(150,20,20,0.35); }"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
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
