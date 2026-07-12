import { useMemo, } from 'react';
import styled from '@emotion/styled';


const ORDER = ['critical', 'issue', 'warning', 'info', 'pass'];










const IcoCritical = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IcoIssue = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const IcoWarning = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IcoInfo = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);
const IcoPass = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const META = {
  critical: {
    label: 'Critical',
    color: '#ff6b6b',
    bg: 'rgba(255, 107, 107, 0.06)',
    border: 'rgba(255, 107, 107, 0.35)',
    icon: <IcoCritical />,
    defaultOpen: true,
  },
  issue: {
    label: 'Issues',
    color: '#ffcb9a',
    bg: 'rgba(255, 203, 154, 0.06)',
    border: 'rgba(255, 203, 154, 0.3)',
    icon: <IcoIssue />,
    defaultOpen: true,
  },
  warning: {
    label: 'Warnings',
    color: '#f0d060',
    bg: 'rgba(240, 208, 96, 0.05)',
    border: 'rgba(240, 208, 96, 0.25)',
    icon: <IcoWarning />,
    defaultOpen: false,
  },
  info: {
    label: 'Informational',
    color: '#4ce1d3',
    bg: 'rgba(76, 225, 211, 0.05)',
    border: 'rgba(76, 225, 211, 0.22)',
    icon: <IcoInfo />,
    defaultOpen: false,
  },
  pass: {
    label: 'Passing',
    color: '#6ee7b7',
    bg: 'rgba(110, 231, 183, 0.05)',
    border: 'rgba(110, 231, 183, 0.22)',
    icon: <IcoPass />,
    defaultOpen: false,
  },
};

/* ── Layout ─────────────────────────────────────────────── */
const Outer = styled.div`
  width: min(1400px, 96vw);
  margin: 0 auto;
`;

const PanelCard = styled.div`
  background: linear-gradient(145deg, rgba(10, 28, 25, 0.9) 0%, rgba(6, 18, 16, 0.96) 100%);
  border: 1px solid rgba(76, 225, 211, 0.12);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(76, 225, 211, 0.06);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1.5rem;
    right: 1.5rem;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(76, 225, 211, 0.4), transparent);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.4rem;
  border-bottom: 1px solid rgba(76, 225, 211, 0.08);
  background: rgba(76, 225, 211, 0.03);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.9rem 1rem;
  }
`;

const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ce1d3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const PanelTitle = styled.span`
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4ce1d3;
`;

const SeverityChips = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    margin-left: 0;
    width: 100%;
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.65rem;
  border-radius: 50px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${p => p.color};
  background: ${p => p.bg};
  border: 1px solid ${p => p.border};

  span {
    color: inherit;
    font-size: inherit;
    font-weight: 900;
  }
`;

const PanelBody = styled.div`
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

/* ── Severity Section ───────────────────────────────────── */
const SevDetails = styled.details`
  border: 1px solid ${p => p.border};
  border-left: 3px solid ${p => p.color};
  border-radius: 8px;
  background: ${p => p.bg};
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &[open] {
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
`;

const SevSummary = styled.summary`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
  transition: background 0.15s ease;

  &::-webkit-details-marker { display: none; }
  &::marker { display: none; }

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .sev-icon {
    display: flex;
    align-items: center;
    color: ${p => p.color};
    flex-shrink: 0;
  }

  .sev-label {
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${p => p.color};
  }

  .sev-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.4rem;
    height: 1.4rem;
    padding: 0 0.4rem;
    border-radius: 50px;
    background: ${p => p.color}22;
    color: ${p => p.color};
    font-size: 0.65rem;
    font-weight: 900;
  }

  .chevron {
    margin-left: auto;
    color: ${p => p.color};
    opacity: 0.6;
    font-size: 0.6rem;
    transition: transform 0.2s ease;
  }

  details[open] & .chevron {
    transform: rotate(180deg);
  }
`;

/* ── Finding Items ──────────────────────────────────────── */
const FindingList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.25rem 0.9rem 0.65rem 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
`;

const FindingItem = styled.li`
  display: grid;
  grid-template-columns: 1.1rem 1fr;
  gap: 0.5rem;
  align-items: start;
  padding: 0.45rem 0.35rem;
  border-radius: 6px;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .fi-dot {
    margin-top: 0.4rem;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${p => p.color};
    flex-shrink: 0;
  }

  .fi-body {
    display: flex;
    flex-direction: column;
    gap: 0.18rem;
  }

  .fi-title {
    background: none;
    border: none;
    color: #d1e8e2;
    font-family: inherit;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 0;
    text-align: left;
    cursor: pointer;
    line-height: 1.35;
    transition: color 0.15s ease;

    &:hover, &:focus-visible {
      color: ${p => p.color};
      outline: none;
    }
  }

  .fi-detail {
    font-size: 0.72rem;
    color: #5a8a83;
    line-height: 1.4;
    font-weight: 400;
  }
`;

/* ── Component ──────────────────────────────────────────── */





const AdvisoryPanel = ({ findings, onJumpTo }) => {
  const { grouped, visible } = useMemo(() => {
    const grouped = {
      critical: [], issue: [], warning: [], info: [], pass: [],
    };
    for (const f of findings) grouped[f.severity].push(f);
    return { grouped, visible: ORDER.filter((sev) => grouped[sev].length) };
  }, [findings]);

  if (!findings.length) return null;

  return (
    <Outer>
      <PanelCard>
        <PanelHeader>
          <ShieldIcon />
          <PanelTitle>Security Advisory</PanelTitle>
          <SeverityChips>
            {visible.map((sev) => {
              const m = META[sev];
              return (
                <Chip key={sev} color={m.color} bg={m.bg} border={m.border}>
                  {m.icon}
                  <span>{grouped[sev].length}</span>
                  {m.label}
                </Chip>
              );
            })}
          </SeverityChips>
        </PanelHeader>
        <PanelBody>
          {visible.map((sev) => {
            const meta = META[sev];
            const items = grouped[sev];
            return (
              <SevDetails
                key={sev}
                id={`advisory-${sev}`}
                open={meta.defaultOpen}
                color={meta.color}
                bg={meta.bg}
                border={meta.border}
              >
                <SevSummary color={meta.color}>
                  <span className="sev-icon">{meta.icon}</span>
                  <span className="sev-label">{meta.label}</span>
                  <span className="sev-count">{items.length}</span>
                  <span className="chevron">▼</span>
                </SevSummary>
                <FindingList>
                  {items.map((f, i) => (
                    <FindingItem key={`${f.cardId}-${i}`} color={meta.color}>
                      <span className="fi-dot" />
                      <span className="fi-body">
                        <button type="button" className="fi-title" onClick={() => onJumpTo(f.cardId)}>
                          {f.title}
                        </button>
                        {f.detail && <span className="fi-detail">{f.detail}</span>}
                      </span>
                    </FindingItem>
                  ))}
                </FindingList>
              </SevDetails>
            );
          })}
        </PanelBody>
      </PanelCard>
    </Outer>
  );
};

export default AdvisoryPanel;
