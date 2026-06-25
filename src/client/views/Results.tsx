import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { ToastContainer } from 'react-toastify';

import colors from 'client/styles/colors';
import Heading from 'client/components/Form/Heading';
import Modal from 'client/components/Form/Modal';
import Footer from 'client/components/misc/Footer';
import Nav from 'client/components/Form/Nav';
import Loader from 'client/components/misc/Loader';
import ErrorBoundary from 'client/components/misc/ErrorBoundary';
import DocContent from 'client/components/misc/DocContent';
import ProgressBar, {
  type LoadingJob,
  type LoadingState,
} from 'client/components/misc/ProgressBar';
import ActionButtons from 'client/components/misc/ActionButtons';
import AdditionalResources from 'client/components/misc/AdditionalResources';
import AdvisoryPanel from 'client/components/misc/AdvisoryPanel';
import NoResults from 'client/components/misc/NoResults';
import ResultsMasonryGrid from 'client/components/misc/ResultsMasonryGrid';
import ViewRaw from 'client/components/misc/ViewRaw';

import { determineAddressType, type AddressType } from 'client/utils/address-type-checker';
import { hasData } from 'client/utils/result-processor';
import keys from 'client/utils/get-keys';
import useJobs from 'client/hooks/useJobs';
import { jobs, allCards, allCardIds } from 'client/jobs/registry';
import { runAnalysis } from 'client/analysis/registry';

const ResultsOuter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem 0 3rem;
  max-width: 100vw;
  overflow-x: hidden;
`;

const NavWrapper = styled.div`
  padding: 0 1.25rem;
  display: flex;
  justify-content: center;
`;

const ResultsContent = styled.section`
  width: min(1400px, 96vw);
  margin: 0 auto;

  @keyframes cardFlash {
    0%, 30% {
      outline: 2px solid #4ce1d3;
      outline-offset: 4px;
      box-shadow: 0 0 24px rgba(76, 225, 211, 0.3);
    }
    100% {
      outline: 2px solid transparent;
      outline-offset: 4px;
      box-shadow: none;
    }
  }
  .flash > section {
    animation: cardFlash 1.5s ease-out;
    border-radius: 14px;
  }
`;

const makeSiteName = (address: string): string => {
  try {
    const withScheme = /^https?:\/\//i.test(address) ? address : `https://${address}`;
    return new URL(withScheme).hostname.replace(/^www\./, '');
  } catch {
    return address;
  }
};

const makeActionButtons = (title: string, refresh: () => void, showInfo: () => void): ReactNode => (
  <ActionButtons
    actions={[
      { label: `Info about ${title}`, onClick: showInfo, icon: 'ⓘ' },
      { label: `Re-fetch ${title} data`, onClick: refresh, icon: '↻' },
    ]}
  />
);

const Results = (props: { address?: string }): JSX.Element => {
  const address = props.address || useParams().urlToScan || '';
  const [addressType, setAddressType] = useState<AddressType>('empt');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(<></>);

  useEffect(() => {
    if (addressType === 'empt') setAddressType(determineAddressType(address));
  }, [address, addressType]);

  const { state: jobsState, retry, ipLookupError } = useJobs(address, addressType, jobs);

  // Shape useJobs state for the existing ProgressBar contract
  const loadingJobs: LoadingJob[] = useMemo(
    () =>
      allCardIds.map((id) => {
        const e = jobsState[id] || { state: 'loading' as LoadingState };
        return {
          name: id,
          state: e.state,
          error: e.error,
          timeTaken: e.timeTaken,
          retry: () => retry(id),
        };
      }),
    [jobsState, retry],
  );

  // Expose successful job results on window.webCheck for debugging,
  // resetting on new input so prior scans cannot accumulate
  useEffect(() => {
    (window as any).webCheck = {};
  }, [address]);
  useEffect(() => {
    const w = (window as any).webCheck;
    if (!w) return;
    Object.entries(jobsState).forEach(([id, entry]) => {
      if (entry?.state === 'success' && entry.raw !== undefined) {
        w[id] = entry.raw;
      }
    });
  }, [jobsState]);

  const showInfo = (id: string) => {
    setModalContent(DocContent(id));
    setModalOpen(true);
  };

  const showErrorModal = (content: ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  // Resolve each card's data, applying picker and falling back when needed
  const renderable = allCards.map(({ jobId, card }) => {
    const entry = jobsState[card.id];
    const raw = entry?.raw;
    let data = raw && card.pick ? card.pick(raw) : raw;
    if (!hasData(data) && card.fallback) data = card.fallback(jobsState);
    return { jobId, card, data, entry };
  });

  const cardsToShow = renderable.filter(({ data, entry }) => hasData(data) && !entry?.error);

  const findings = useMemo(() => runAnalysis(jobsState), [jobsState]);

  // Detect a catastrophic API outage when the bulk of settled jobs error or time out
  const apiUnreachable = useMemo(() => {
    const entries = Object.values(jobsState);
    const settled = entries.filter((e) => e?.state !== 'loading');
    const dead = settled.filter((e) => e?.state === 'error' || e?.state === 'timed-out');
    return settled.length >= entries.length / 2 && dead.length / settled.length >= 0.9;
  }, [jobsState]);

  // Pick the highest-priority error state, if any
  let errorKind: 'invalid' | 'unreachable' | 'api-down' | 'disabled' | null = null;
  if (keys.disableEverything) {
    errorKind = 'disabled';
  } else if (addressType === 'err') {
    errorKind = 'invalid';
  } else if (ipLookupError) {
    errorKind = 'unreachable';
  } else if (apiUnreachable) {
    errorKind = 'api-down';
  }

  const jumpToCard = (id: string) => {
    const el = document.getElementById(`card-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
    window.setTimeout(() => el.classList.remove('flash'), 1300);
  };

  return (
    <ResultsOuter>
      <NavWrapper>
        <Nav>
          {address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {addressType === 'url' && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={/^https?:\/\//i.test(address) ? address : `https://${address}`}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <img
                    width="22px"
                    height="22px"
                    alt=""
                    src={`https://icon.horse/icon/${makeSiteName(address)}`}
                    style={{ borderRadius: '4px', objectFit: 'contain' }}
                  />
                </a>
              )}
              <span style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#d1e8e2',
                letterSpacing: '0.03em',
              }}>
                {makeSiteName(address)}
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#4ce1d3',
                background: 'rgba(76,225,211,0.1)',
                border: '1px solid rgba(76,225,211,0.25)',
                borderRadius: '4px',
                padding: '0.2rem 0.55rem',
              }}>
                Scanning
              </span>
            </div>
          )}
        </Nav>
      </NavWrapper>
      {errorKind && <NoResults kind={errorKind} address={address} error={ipLookupError} />}
      <ProgressBar loadStatus={loadingJobs} showModal={showErrorModal} showJobDocs={showInfo} />
      <Loader show={loadingJobs.filter((j) => j.state !== 'loading').length < 5} />
      <AdvisoryPanel findings={findings} onJumpTo={jumpToCard} />
      <ResultsContent>
        <ResultsMasonryGrid minColWidth={340} gap={18}>
          {cardsToShow.map(({ card, data }) => (
            <div id={`card-${card.id}`} key={`eb-${card.id}`}>
              <ErrorBoundary title={card.title}>
                <card.Component
                  key={card.id}
                  data={data}
                  title={card.title}
                  actionButtons={makeActionButtons(
                    card.title,
                    () => retry(card.id),
                    () => showInfo(card.id),
                  )}
                />
              </ErrorBoundary>
            </div>
          ))}
        </ResultsMasonryGrid>
      </ResultsContent>
      <ViewRaw
        everything={renderable.map((r) => ({
          id: r.card.id,
          title: r.card.title,
          result: r.data,
        }))}
      />
      <AdditionalResources url={address} />

      <Modal isOpen={modalOpen} closeModal={() => setModalOpen(false)}>
        {modalContent}
      </Modal>
      <ToastContainer
        limit={3}
        draggablePercent={60}
        autoClose={2500}
        theme="dark"
        position="bottom-right"
      />
      <Footer />
    </ResultsOuter>
  );
};

export default Results;
