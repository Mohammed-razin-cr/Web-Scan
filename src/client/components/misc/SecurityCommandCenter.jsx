import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  History,
  Radar,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { getMonitoringConfig, saveMonitoringConfig } from 'client/utils/monitoring';
import { getRemediationAdvice } from 'client/utils/remediation';

const severityRank = { critical: 0, issue: 1, warning: 2, info: 3, pass: 4 };
const severityMeta = {
  critical: { label: 'Critical', color: '#ff7b72' },
  issue: { label: 'High', color: '#ffcb9a' },
  warning: { label: 'Medium', color: '#f0d060' },
  info: { label: 'Info', color: '#72c7ff' },
  pass: { label: 'Pass', color: '#6ee7b7' },
};

const Shell = styled.section`
  width: min(1400px, 96vw);
  margin: 0 auto;
  border: 1px solid rgba(76, 225, 211, 0.14);
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(10, 28, 25, 0.94), rgba(5, 15, 14, 0.97));
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.32), inset 0 1px rgba(209, 232, 226, 0.05);
`;

const Overview = styled.div`
  display: grid;
  grid-template-columns: minmax(270px, 1.35fr) repeat(3, minmax(120px, 0.55fr));
  min-height: 132px;
  border-bottom: 1px solid rgba(76, 225, 211, 0.1);

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const ScoreBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 1.25rem 1.4rem;
  border-right: 1px solid rgba(76, 225, 211, 0.1);

  @media (max-width: 900px) {
    grid-column: 1 / -1;
    border-right: 0;
    border-bottom: 1px solid rgba(76, 225, 211, 0.1);
  }

  @media (max-width: 560px) {
    padding: 1rem;
  }
`;

const Gauge = styled.div`
  --score: ${(props) => props.score};
  --score-color: ${(props) => props.color};
  width: 78px;
  height: 78px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: conic-gradient(var(--score-color) calc(var(--score) * 1%), rgba(209, 232, 226, 0.08) 0);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 7px;
    border-radius: inherit;
    background: #081b18;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.35);
  }

  strong {
    position: relative;
    font-size: 1.55rem;
    line-height: 1;
    color: #f6fffc;
    letter-spacing: 0;
  }
`;

const ScoreCopy = styled.div`
  min-width: 0;

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 0.35rem;
    color: #4ce1d3;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  h2 {
    margin: 0;
    color: #f3fffc;
    font-size: clamp(1.05rem, 2vw, 1.35rem);
    letter-spacing: 0;
  }

  p {
    margin: 0.35rem 0 0;
    color: #7fa39d;
    font-size: 0.78rem;
    line-height: 1.45;
  }
`;

const Delta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.45rem;
  color: ${(props) => (props.positive ? '#6ee7b7' : '#ff9a8f')};
  font-size: 0.72rem;
  font-weight: 700;
  vertical-align: middle;

  svg { width: 12px; height: 12px; }
`;

const Metric = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem 1.15rem;
  border-right: 1px solid rgba(76, 225, 211, 0.08);

  &:last-child { border-right: 0; }

  strong {
    color: ${(props) => props.color};
    font-size: 1.45rem;
    line-height: 1;
  }

  span {
    margin-top: 0.4rem;
    color: #72958f;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @media (max-width: 560px) {
    padding: 0.9rem 0.65rem;
    text-align: center;

    strong { font-size: 1.25rem; }
    span { font-size: 0.58rem; }
  }
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1.2rem;
  border-bottom: 1px solid rgba(76, 225, 211, 0.08);
  background: rgba(76, 225, 211, 0.018);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  @media (max-width: 560px) { padding: 0 0.55rem; }
`;

const Tab = styled.button`
  min-height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.48rem;
  position: relative;
  padding: 0 1rem;
  border: 0;
  background: transparent;
  color: ${(props) => (props.active ? '#d9fff7' : '#6f928c')};
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: color 180ms ease, background 180ms ease;

  &::after {
    content: '';
    position: absolute;
    left: 0.8rem;
    right: 0.8rem;
    bottom: 0;
    height: 2px;
    background: #4ce1d3;
    transform: scaleX(${(props) => (props.active ? 1 : 0)});
    transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover { color: #b9e8df; background: rgba(76, 225, 211, 0.025); }
  svg { width: 15px; height: 15px; }

  @media (max-width: 420px) {
    flex: 1;
    padding: 0 0.65rem;
    font-size: 0.7rem;
  }
`;

const TabCount = styled.span`
  min-width: 20px;
  height: 20px;
  padding: 0 0.35rem;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(76, 225, 211, 0.1);
  color: #4ce1d3;
  font-size: 0.62rem;
`;

const Pane = styled.div`
  padding: 0.75rem 1.2rem 1.2rem;

  @media (max-width: 560px) { padding: 0.55rem 0.75rem 0.9rem; }
`;

const EmptyState = styled.div`
  min-height: 150px;
  display: grid;
  place-items: center;
  text-align: center;
  color: #789b95;

  svg { color: #6ee7b7; margin-bottom: 0.6rem; }
  strong { display: block; color: #d4eee8; font-size: 0.9rem; }
  p { margin: 0.35rem 0 0; font-size: 0.75rem; color: #6c8f89; }
`;

const FindingRow = styled.details`
  border-bottom: 1px solid rgba(209, 232, 226, 0.065);

  &:last-child { border-bottom: 0; }

  &[open] { background: rgba(76, 225, 211, 0.022); }
`;

const FindingSummary = styled.summary`
  list-style: none;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto;
  align-items: center;
  gap: 0.75rem;
  min-height: 60px;
  padding: 0.55rem 0.6rem;
  cursor: pointer;

  &::-webkit-details-marker { display: none; }
  &::marker { display: none; }

  .severity-line {
    width: 3px;
    height: 30px;
    border-radius: 3px;
    background: ${(props) => props.color};
    box-shadow: 0 0 12px ${(props) => props.color}44;
  }

  .finding-copy { min-width: 0; }
  .finding-title {
    display: block;
    overflow: hidden;
    color: #d7eee9;
    font-size: 0.81rem;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .finding-detail {
    display: block;
    overflow: hidden;
    margin-top: 0.2rem;
    color: #678a84;
    font-size: 0.7rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chevron { color: #5a817a; transition: transform 180ms ease; }
  details[open] & .chevron { transform: rotate(90deg); }

  @media (max-width: 600px) {
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    gap: 0.55rem;
    .effort { display: none; }
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.23rem 0.5rem;
  border: 1px solid ${(props) => props.color}44;
  border-radius: 999px;
  background: ${(props) => props.color}10;
  color: ${(props) => props.color};
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const FixBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(260px, 1.2fr) auto;
  gap: 1.25rem;
  padding: 0.3rem 2.1rem 1rem;

  .label {
    display: block;
    margin-bottom: 0.32rem;
    color: #4ce1d3;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }
  p { margin: 0; color: #8caaa5; font-size: 0.73rem; line-height: 1.5; }
  ol { margin: 0; padding-left: 1.1rem; color: #9bb7b2; font-size: 0.73rem; line-height: 1.55; }

  @media (max-width: 740px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.25rem 1rem 1rem 1.85rem;
  }
`;

const EvidenceButton = styled.button`
  align-self: end;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.48rem 0.7rem;
  border: 1px solid rgba(76, 225, 211, 0.22);
  border-radius: 6px;
  background: rgba(76, 225, 211, 0.06);
  color: #8fe9dc;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 750;
  cursor: pointer;
  white-space: nowrap;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover { background: rgba(76, 225, 211, 0.12); border-color: rgba(76, 225, 211, 0.4); }
  svg { width: 13px; height: 13px; }

  @media (max-width: 740px) { justify-self: start; }
`;

const ChangesGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 0.95fr) minmax(360px, 1.35fr);
  gap: 1.25rem;
  padding-top: 0.4rem;

  @media (max-width: 820px) { grid-template-columns: 1fr; }
`;

const Section = styled.div`
  min-width: 0;

  h3 {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0 0 0.8rem;
    color: #bfe3dc;
    font-size: 0.74rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  h3 svg { width: 14px; height: 14px; color: #4ce1d3; }
`;

const Trend = styled.div`
  height: 140px;
  display: flex;
  align-items: flex-end;
  gap: 0.55rem;
  padding: 0.8rem 0.7rem 0;
  border-left: 1px solid rgba(209, 232, 226, 0.08);
  border-bottom: 1px solid rgba(209, 232, 226, 0.08);
  background: repeating-linear-gradient(to top, transparent 0 34px, rgba(209, 232, 226, 0.045) 35px);
`;

const TrendBar = styled.div`
  flex: 1;
  min-width: 18px;
  height: ${(props) => Math.max(8, props.score)}%;
  position: relative;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(to top, rgba(17, 100, 102, 0.65), #4ce1d3);
  opacity: ${(props) => (props.latest ? 1 : 0.55)};
  transition: opacity 160ms ease, filter 160ms ease;

  &:hover { opacity: 1; filter: brightness(1.12); }
  span {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    color: #b9dbd5;
    font-size: 0.62rem;
    font-weight: 700;
  }
`;

const ChangeList = styled.div`
  max-height: 160px;
  overflow: auto;
`;

const ChangeRow = styled.button`
  width: 100%;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.65rem;
  padding: 0.58rem 0.2rem;
  border: 0;
  border-bottom: 1px solid rgba(209, 232, 226, 0.06);
  background: transparent;
  color: #a9c5c0;
  font: inherit;
  text-align: left;
  cursor: pointer;

  svg { width: 14px; height: 14px; color: ${(props) => props.color}; }
  span { overflow: hidden; font-size: 0.72rem; text-overflow: ellipsis; white-space: nowrap; }
  small { color: ${(props) => props.color}; font-size: 0.6rem; font-weight: 800; text-transform: uppercase; }
  &:hover span { color: #d7eee9; }
`;

const MonitorLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 0.75fr) minmax(360px, 1.25fr);
  gap: 1.5rem;
  padding-top: 0.45rem;

  @media (max-width: 780px) { grid-template-columns: 1fr; }
`;

const MonitorStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-height: 92px;

  .status-icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    border: 1px solid ${(props) => (props.enabled ? 'rgba(76,225,211,.28)' : 'rgba(148,163,184,.16)')};
    border-radius: 50%;
    background: ${(props) => (props.enabled ? 'rgba(76,225,211,.08)' : 'rgba(148,163,184,.05)')};
    color: ${(props) => (props.enabled ? '#4ce1d3' : '#718b86')};
  }
  .status-icon svg { width: 21px; height: 21px; }
  strong { display: block; color: #d7eee9; font-size: 0.9rem; }
  p { margin: 0.3rem 0 0; color: #75968f; font-size: 0.72rem; line-height: 1.45; }
`;

const MonitorForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  .form-label strong { display: block; color: #bddbd5; font-size: 0.76rem; }
  .form-label span { display: block; margin-top: 0.2rem; color: #668881; font-size: 0.66rem; }

  @media (max-width: 520px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Segmented = styled.div`
  display: flex;
  padding: 3px;
  border: 1px solid rgba(76, 225, 211, 0.12);
  border-radius: 7px;
  background: rgba(0, 0, 0, 0.18);

  button {
    min-height: 31px;
    padding: 0 0.72rem;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: #75968f;
    font: inherit;
    font-size: 0.67rem;
    font-weight: 700;
    cursor: pointer;
  }
  button[aria-pressed='true'] { background: rgba(76, 225, 211, 0.12); color: #bff7ed; }

  @media (max-width: 520px) { width: 100%; button { flex: 1; } }
`;

const Toggle = styled.button`
  width: 42px;
  height: 23px;
  flex: 0 0 auto;
  padding: 2px;
  border: 1px solid ${(props) => (props.active ? 'rgba(76,225,211,.45)' : 'rgba(148,163,184,.22)')};
  border-radius: 999px;
  background: ${(props) => (props.active ? 'rgba(17,100,102,.75)' : 'rgba(148,163,184,.08)')};
  cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease;

  &::after {
    content: '';
    display: block;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: ${(props) => (props.active ? '#d1fff6' : '#77918c')};
    transform: translateX(${(props) => (props.active ? '17px' : '0')});
    transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const SaveRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.25rem;

  span { color: #6ee7b7; font-size: 0.68rem; }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 36px;
  padding: 0 0.85rem;
  border: 1px solid rgba(76, 225, 211, 0.42);
  border-radius: 6px;
  background: #116466;
  color: #effffc;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;

  &:hover { background: #167577; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  svg { width: 14px; height: 14px; }
`;

const formatTime = (timestamp) =>
  timestamp
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp)
    : 'Not scheduled';

const scoreMeta = (score) => {
  if (score >= 90) return { label: 'Strong posture', color: '#6ee7b7' };
  if (score >= 75) return { label: 'Good posture', color: '#4ce1d3' };
  if (score >= 55) return { label: 'Needs attention', color: '#f0d060' };
  return { label: 'High exposure', color: '#ff7b72' };
};

const SecurityCommandCenter = ({ url, findings, changes, summary, onJumpTo }) => {
  const [activeTab, setActiveTab] = useState('remediation');
  const [monitoring, setMonitoring] = useState(() => getMonitoringConfig(url));
  const [saved, setSaved] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMonitoring(getMonitoringConfig(url));
    setSaved(false);
  }, [url]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (
      !monitoring.enabled ||
      !monitoring.browserAlerts ||
      !monitoring.nextCheck ||
      monitoring.nextCheck > now ||
      !('Notification' in window) ||
      Notification.permission !== 'granted'
    ) return;
    const notificationKey = `webscan-notified-${url}-${monitoring.nextCheck}`;
    if (sessionStorage.getItem(notificationKey)) return;
    new Notification('WebScan check due', { body: `${url} is ready for its next security scan.` });
    sessionStorage.setItem(notificationKey, '1');
  }, [monitoring, now, url]);

  const priorities = useMemo(
    () =>
      findings
        .filter((finding) => finding.severity !== 'pass')
        .sort((a, b) => severityRank[a.severity] - severityRank[b.severity])
        .slice(0, 8),
    [findings],
  );

  const posture = scoreMeta(summary.score);
  const isDue = Boolean(monitoring.enabled && monitoring.nextCheck && monitoring.nextCheck <= now);

  const handleSaveMonitoring = async () => {
    let browserAlerts = monitoring.browserAlerts;
    if (browserAlerts && 'Notification' in window && Notification.permission === 'default') {
      browserAlerts = (await Notification.requestPermission()) === 'granted';
    }
    if (browserAlerts && (!('Notification' in window) || Notification.permission === 'denied')) {
      browserAlerts = false;
    }
    const next = saveMonitoringConfig(url, { ...monitoring, browserAlerts });
    setMonitoring(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <Shell aria-label="Security command center">
      <Overview>
        <ScoreBlock>
          <Gauge score={summary.score} color={posture.color} aria-label={`Security score ${summary.score} out of 100`}>
            <strong>{summary.score}</strong>
          </Gauge>
          <ScoreCopy>
            <span className="eyebrow"><ShieldCheck size={14} /> Security posture</span>
            <h2>
              {posture.label}
              {summary.scoreDelta !== 0 && (
                <Delta positive={summary.scoreDelta > 0}>
                  {summary.scoreDelta > 0 ? <TrendingUp /> : <TrendingDown />}
                  {summary.scoreDelta > 0 ? '+' : ''}{summary.scoreDelta}
                </Delta>
              )}
            </h2>
            <p>{summary.totalScans} recorded scan{summary.totalScans === 1 ? '' : 's'} for this target</p>
          </ScoreCopy>
        </ScoreBlock>
        <Metric color="#ff7b72"><strong>{summary.criticalIssues}</strong><span>Critical</span></Metric>
        <Metric color="#ffcb9a"><strong>{summary.issueCount}</strong><span>High risk</span></Metric>
        <Metric color="#6ee7b7"><strong>{summary.passedChecks}</strong><span>Passing</span></Metric>
      </Overview>

      <TabBar role="tablist" aria-label="Security intelligence">
        <Tab type="button" role="tab" active={activeTab === 'remediation'} aria-selected={activeTab === 'remediation'} onClick={() => setActiveTab('remediation')}>
          <Wrench /> Remediation <TabCount>{priorities.length}</TabCount>
        </Tab>
        <Tab type="button" role="tab" active={activeTab === 'changes'} aria-selected={activeTab === 'changes'} onClick={() => setActiveTab('changes')}>
          <History /> Changes <TabCount>{changes.length}</TabCount>
        </Tab>
        <Tab type="button" role="tab" active={activeTab === 'monitoring'} aria-selected={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')}>
          <Radar /> Watch mode
        </Tab>
      </TabBar>

      {activeTab === 'remediation' && (
        <Pane role="tabpanel">
          {priorities.length ? priorities.map((finding, index) => {
            const meta = severityMeta[finding.severity];
            const advice = getRemediationAdvice(finding);
            return (
              <FindingRow key={`${finding.cardId}-${finding.title}-${index}`}>
                <FindingSummary color={meta.color}>
                  <span className="severity-line" />
                  <span className="finding-copy">
                    <span className="finding-title">{finding.title}</span>
                    <span className="finding-detail">{finding.detail || advice.impact}</span>
                  </span>
                  <Badge color={meta.color}>{meta.label}</Badge>
                  <span className="effort"><Badge color="#72a69d">{advice.effort}</Badge></span>
                  <ChevronRight className="chevron" size={15} />
                </FindingSummary>
                <FixBody>
                  <div><span className="label">Why it matters</span><p>{advice.impact}</p></div>
                  <div><span className="label">Recommended fix</span><ol>{advice.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
                  <EvidenceButton type="button" onClick={() => onJumpTo(finding.cardId)}>
                    View evidence <ArrowUpRight />
                  </EvidenceButton>
                </FixBody>
              </FindingRow>
            );
          }) : (
            <EmptyState><div><CheckCircle2 size={25} /><strong>No active remediation items</strong><p>The analyzed controls are currently passing.</p></div></EmptyState>
          )}
        </Pane>
      )}

      {activeTab === 'changes' && (
        <Pane role="tabpanel">
          <ChangesGrid>
            <Section>
              <h3><TrendingUp /> Posture trend</h3>
              <Trend aria-label="Security score history">
                {summary.trend.map((scan, index) => (
                  <TrendBar key={scan.id} score={scan.score} latest={index === summary.trend.length - 1} title={`${scan.score}/100 · ${formatTime(scan.timestamp)}`}>
                    <span>{scan.score}</span>
                  </TrendBar>
                ))}
              </Trend>
            </Section>
            <Section>
              <h3><History /> Since previous scan</h3>
              {changes.length ? (
                <ChangeList>
                  {changes.map((change, index) => {
                    const color = change.type === 'resolved' ? '#6ee7b7' : change.type === 'new' ? '#ff7b72' : '#f0d060';
                    return (
                      <ChangeRow key={`${change.checkId}-${index}`} color={color} type="button" onClick={() => onJumpTo(change.checkId)}>
                        {change.type === 'resolved' ? <CheckCircle2 /> : <AlertTriangle />}
                        <span>{change.message}</span>
                        <small>{change.type}</small>
                      </ChangeRow>
                    );
                  })}
                </ChangeList>
              ) : (
                <EmptyState><div><RefreshCw size={22} /><strong>{summary.isFirstScan ? 'Baseline established' : 'No posture changes'}</strong><p>{summary.isFirstScan ? 'The next scan will show what changed.' : 'Findings match the previous scan.'}</p></div></EmptyState>
              )}
            </Section>
          </ChangesGrid>
        </Pane>
      )}

      {activeTab === 'monitoring' && (
        <Pane role="tabpanel">
          <MonitorLayout>
            <MonitorStatus enabled={monitoring.enabled}>
              <span className="status-icon">{monitoring.enabled ? <Radar /> : <Clock3 />}</span>
              <div>
                <strong>{!monitoring.enabled ? 'Watch mode is off' : isDue ? 'Security check due now' : 'Target is on watch'}</strong>
                <p>{monitoring.enabled ? `Next check: ${formatTime(monitoring.nextCheck)}` : `Last analyzed: ${formatTime(summary.lastScanTime?.getTime())}`}</p>
              </div>
            </MonitorStatus>
            <MonitorForm>
              <FormRow>
                <div className="form-label"><strong>Continuous watch</strong><span>Keep a recurring check cadence for this target</span></div>
                <Toggle type="button" role="switch" active={monitoring.enabled} aria-checked={monitoring.enabled} aria-label="Toggle continuous watch" onClick={() => setMonitoring((current) => ({ ...current, enabled: !current.enabled }))} />
              </FormRow>
              <FormRow>
                <div className="form-label"><strong>Scan cadence</strong><span>Choose how often posture should be reviewed</span></div>
                <Segmented aria-label="Scan cadence">
                  {['daily', 'weekly', 'monthly'].map((cadence) => (
                    <button key={cadence} type="button" aria-pressed={monitoring.cadence === cadence} onClick={() => setMonitoring((current) => ({ ...current, cadence }))}>
                      {cadence[0].toUpperCase() + cadence.slice(1)}
                    </button>
                  ))}
                </Segmented>
              </FormRow>
              <FormRow>
                <div className="form-label"><strong>Browser alerts</strong><span>Notify this device when the next check is due</span></div>
                <Toggle type="button" role="switch" active={monitoring.browserAlerts} aria-checked={monitoring.browserAlerts} aria-label="Toggle browser alerts" onClick={() => setMonitoring((current) => ({ ...current, browserAlerts: !current.browserAlerts }))} />
              </FormRow>
              <SaveRow>
                {saved && <span>Schedule saved</span>}
                {isDue && <PrimaryButton type="button" onClick={() => window.location.reload()}><RefreshCw /> Run now</PrimaryButton>}
                <PrimaryButton type="button" onClick={handleSaveMonitoring}><CalendarClock /> Save watch</PrimaryButton>
              </SaveRow>
            </MonitorForm>
          </MonitorLayout>
        </Pane>
      )}
    </Shell>
  );
};

export default SecurityCommandCenter;
