/**
 * ProgressBar — premium sleek pill progress
 * Replaces the old details/summary card with a glassmorphic
 * collapsible panel: animated multi-segment bar, live job pills,
 * retry buttons and per-job docs links.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { allCardIds } from 'client/jobs/registry';

/* ── count helpers (unchanged logic) ── */
const countByState = (jobs) => {
  const c = { success: 0, loading: 0, error: 0, skipped: 0, 'timed-out': 0 };
  for (const j of jobs) c[j.state]++;
  return c;
};
const stateToPercent = (jobs) => {
  const c = countByState(jobs);
  const total = jobs.length || 1;
  return Object.fromEntries(Object.entries(c).map(([k, v]) => [k, (v / total) * 100]));
};

/* ── palette ── */
const STATE_COLOR = {
  success:    '#4ce1d3',
  loading:    '#3b82f6',
  error:      '#ef4444',
  'timed-out':'#f59e0b',
  skipped:    '#64748b',
};
const STATE_ICON = {
  success: '✓', loading: '○', error: '✕', 'timed-out': '⏸', skipped: '•',
};
const REASON_LABEL = { error:'Show error', 'timed-out':'Show reason', skipped:'Show reason' };

/* ── styled ── */
const Outer = styled.div`
  margin: 0 auto;
  width: 95vw;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Panel = styled(motion.div)`
  position: relative;
  border-radius: 1rem;
  background: rgba(6,15,14,0.82);
  border: 1px solid rgba(76,225,211,0.13);
  backdrop-filter: blur(24px);
  box-shadow: 0 12px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(76,225,211,0.06);
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 2rem; right: 2rem; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(76,225,211,0.4), transparent);
  }
`;

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  cursor: pointer;
  user-select: none;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
  }
`;

const BarTrack = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(76,225,211,0.07);
  border-radius: 999px;
  overflow: hidden;
  display: flex;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const BarSeg = styled(motion.div)`
  height: 100%;
  background: ${p => p.color};
  transition: width 0.5s ease;
  &:first-of-type { border-radius: 999px 0 0 999px; }
  &:last-of-type  { border-radius: 0 999px 999px 0; }
`;

const HeadRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;

  @media (max-width: 600px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const HeadLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(209,232,226,0.5);
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
`;

const ChevronBtn = styled(motion.button)`
  background: none; border: none; cursor: pointer;
  color: rgba(76,225,211,0.6);
  display: flex; align-items: center;
  padding: 0.15rem;
  svg { width: 14px; height: 14px; stroke: currentColor; transition: transform 0.25s ease; }
`;

const StatChips = styled.div`
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const StatChip = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: ${p => p.color};
  background: ${p => p.color}18;
  border: 1px solid ${p => p.color}33;
  border-radius: 999px;
  padding: 0.18rem 0.55rem;
`;

/* ── collapsible body ── */
const Body = styled(motion.div)`
  overflow: hidden;
  padding: 0 1.5rem;
`;

const BodyInner = styled.div`
  padding-bottom: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const JobRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s ease;
  &:hover { background: rgba(76,225,211,0.04); }
`;

const JobIcon = styled.span`
  font-size: 0.72rem;
  color: ${p => p.color};
  width: 14px;
  text-align: center;
  flex-shrink: 0;
`;

const JobName = styled.button`
  background: none; border: none; cursor: pointer;
  font-size: 0.76rem; font-weight: 600;
  color: rgba(209,232,226,0.7);
  font-family: 'JetBrains Mono', monospace;
  padding: 0; text-align: left;
  transition: color 0.15s ease;
  &:hover { color: #4ce1d3; }
`;

const JobTime = styled.span`
  font-size: 0.67rem;
  color: rgba(209,232,226,0.28);
  font-family: 'JetBrains Mono', monospace;
  margin-left: auto;
`;

const ActionBtn = styled.button`
  background: rgba(76,225,211,0.06);
  border: 1px solid rgba(76,225,211,0.18);
  color: rgba(76,225,211,0.75);
  font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover { background: rgba(76,225,211,0.14); color: #4ce1d3; border-color: rgba(76,225,211,0.4); }
`;

/* ── re-show row ── */
const ReShowRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  background: rgba(6,15,14,0.6);
  border: 1px solid rgba(76,225,211,0.1);
`;

const ReShowLabel = styled.span`
  font-size: 0.75rem;
  color: rgba(209,232,226,0.45);
  button {
    background: none; border: none; cursor: pointer;
    color: #4ce1d3; font-size: inherit;
    padding: 0; margin-left: 0.35rem;
    &:hover { text-decoration: underline; }
  }
`;

const ReShowBtn = styled(motion.button)`
  background: rgba(76,225,211,0.08);
  border: 1px solid rgba(76,225,211,0.22);
  color: #4ce1d3;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
  padding: 0.3rem 0.8rem; border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: rgba(76,225,211,0.16); }
`;

/* ── error modal content ── */
const ModalError = styled.div`
  p { margin: 0; color: #ef4444; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }
  pre { color: #f59e0b; font-size: 0.8rem; white-space: pre-wrap; }
`;

/* ── component ── */
const ProgressBar = ({ loadStatus: jobs = [], showModal, showJobDocs }) => {
  const [open, setOpen] = useState(true);
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Date.now() - startRef.current), 250);
    return () => clearInterval(t);
  }, []);

  const pct    = stateToPercent(jobs);
  const counts = countByState(jobs);
  const total  = allCardIds.length;
  const done   = total - counts.loading;
  const isDone = counts.loading === 0;
  const hasIssues = counts.error > 0 || counts['timed-out'] > 0;
  const elapsedSec = (elapsed / 1000).toFixed(1);

  const openErrorModal = useCallback((job, isSkip) => {
    showModal(
      <ModalError>
        <p>{isSkip ? 'Skipped:' : 'Error:'}</p>
        <pre className={isSkip ? 'info' : ''}>{job.error || 'No details available'}</pre>
      </ModalError>,
    );
  }, [showModal]);


  const segments = ['success', 'loading', 'timed-out', 'error', 'skipped'];

  return (
    <Outer>
      <Panel
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Header row with bar ── */}
        <PanelHead onClick={() => setOpen(o => !o)}>
          <BarTrack>
            {segments.map(s => (
              pct[s] > 0 && (
                <BarSeg
                  key={s}
                  color={STATE_COLOR[s]}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct[s]}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              )
            ))}
          </BarTrack>

          <HeadRight>
            <StatChips>
              {counts.success > 0 && (
                <StatChip color={STATE_COLOR.success}>{counts.success} done</StatChip>
              )}
              {counts.loading > 0 && (
                <StatChip color={STATE_COLOR.loading}>{counts.loading} running</StatChip>
              )}
              {(counts.error + counts['timed-out']) > 0 && (
                <StatChip color={STATE_COLOR.error}>
                  {counts.error + counts['timed-out']} failed
                </StatChip>
              )}
            </StatChips>

            <HeadLabel>
              {isDone ? `Done in ${elapsedSec}s` : `${done}/${total} · ${elapsedSec}s`}
            </HeadLabel>

            <ChevronBtn type="button" aria-label="Toggle details" whileTap={{ scale: 0.9 }}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
                style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ChevronBtn>
          </HeadRight>
        </PanelHead>

        {/* ── Collapsible job list ── */}
        <AnimatePresence initial={false}>
          {open && (
            <Body
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <BodyInner>
                {jobs.map((job) => {
                  const color = STATE_COLOR[job.state] || '#64748b';
                  const canRetry = job.retry && job.state !== 'success' && job.state !== 'loading';
                  const hasReason = job.error && REASON_LABEL[job.state];
                  return (
                    <JobRow
                      key={job.name}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <JobIcon color={color}>{STATE_ICON[job.state]}</JobIcon>
                      <JobName type="button" onClick={() => showJobDocs(job.name)}>
                        {job.name}
                      </JobName>
                      {job.timeTaken && job.state !== 'loading' && (
                        <JobTime>{job.timeTaken}ms</JobTime>
                      )}
                      {canRetry && (
                        <ActionBtn type="button" onClick={job.retry}>↻ Retry</ActionBtn>
                      )}
                      {hasReason && (
                        <ActionBtn type="button"
                          onClick={() => openErrorModal(job, job.state === 'skipped')}>
                          {REASON_LABEL[job.state]}
                        </ActionBtn>
                      )}
                    </JobRow>
                  );
                })}
              </BodyInner>
            </Body>
          )}
        </AnimatePresence>
      </Panel>

      {/* ── Collapsed re-show row ── */}
      {isDone && !open && (
        <ReShowRow
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ReShowLabel>
            {hasIssues
              ? <>{counts.error + counts['timed-out']} issues · <button type="button" onClick={() => setOpen(true)}>show details</button></>
              : <>{counts.success} checks completed in {elapsedSec}s</>
            }
          </ReShowLabel>
          <ReShowBtn type="button" onClick={() => setOpen(true)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Show report
          </ReShowBtn>
        </ReShowRow>
      )}
    </Outer>
  );
};

export default ProgressBar;
export { ProgressBar };
