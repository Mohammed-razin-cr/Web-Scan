/**
 * ViewRaw — premium "View / Download Raw Data" section
 * Uses: ShimmerButton, BorderBeam, GlowingCard, AnimatedCounter,
 *       SpotlightCard, framer-motion, lucide-react icons
 */
import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileText,
  Eye,
  EyeOff,
  Code2,
  Database,
  FileJson,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Braces,
  Share2,
} from 'lucide-react';

import colors from 'client/styles/colors';
import BorderBeam    from 'client/components/ui/BorderBeam';
import ShimmerButton from 'client/components/ui/ShimmerButton';
import SpotlightCard from 'client/components/ui/SpotlightCard';
import AnimatedCounter from 'client/components/ui/AnimatedCounter';
import { exportAsPDF } from 'client/utils/export';

/* ── keyframes ── */
const topSweep = keyframes`
  0%   { background-position:  150% center; }
  100% { background-position: -150% center; }
`;
const spinKf = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(76,225,211,0); }
  50%       { box-shadow: 0 0 0 6px rgba(76,225,211,0.12); }
`;
const floatIn = keyframes`
  from { opacity:0; transform:translateY(10px) scale(0.97); }
  to   { opacity:1; transform:translateY(0)    scale(1); }
`;

/* ── Outer card ── */
const Wrap = styled.div`
  margin: 0 auto;
  width: min(1200px, 92vw);
  position: relative;
  border-radius: 16px;
  border: 1px solid rgba(76,225,211,0.13);
  background: rgba(5, 14, 13, 0.84);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow:
    0 12px 48px rgba(0,0,0,0.38),
    inset 0 1px 0 rgba(76,225,211,0.06);
  overflow: hidden;
  animation: ${floatIn} 0.5s cubic-bezier(0.16,1,0.3,1) both;

  /* top accent line */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 1.5rem; right: 1.5rem;
    height: 1px;
    background: linear-gradient(
      90deg, transparent,
      rgba(76,225,211,0.55) 35%,
      rgba(255,203,154,0.3) 65%,
      transparent
    );
    background-size: 200% auto;
    animation: ${topSweep} 4s linear infinite;
  }
`;

/* ── Header row ── */
const HeadRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.5rem 0;
  flex-wrap: wrap;
`;

const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const HeadIcon = styled.div`
  width: 2rem; height: 2rem;
  border-radius: 8px;
  background: rgba(76,225,211,0.08);
  border: 1px solid rgba(76,225,211,0.2);
  display: grid; place-items: center;
  color: #4ce1d3;
  flex-shrink: 0;
`;

const HeadTitle = styled.h3`
  margin: 0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(76,225,211,0.9);
`;

/* ── Meta chips ── */
const MetaChips = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const MetaChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(76,225,211,0.14);
  background: rgba(76,225,211,0.04);
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(209,232,226,0.55);
  letter-spacing: 0.05em;

  svg { color: #4ce1d3; flex-shrink: 0; }
`;

/* ── Body ── */
const Body = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/* ── Description block ── */
const Desc = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: rgba(209,232,226,0.5);
  max-width: 68ch;

  strong {
    color: rgba(76,225,211,0.8);
    font-weight: 600;
  }
`;

/* ── Action row ── */
const ActionRow = styled.div`
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  align-items: center;
`;

/* Ghost secondary button */
const GhostBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.68rem 1.4rem;
  border-radius: 10px;
  border: 1px solid rgba(76,225,211,0.22);
  background: rgba(76,225,211,0.05);
  color: rgba(209,232,226,0.8);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  position: relative;
  overflow: hidden;

  svg { flex-shrink: 0; transition: transform 0.25s ease; }

  &:hover {
    background: rgba(76,225,211,0.1);
    border-color: rgba(76,225,211,0.45);
    color: #4ce1d3;
    svg { transform: scale(1.15); }
  }
  &:active { transform: scale(0.97); }
`;

/* Danger close button */
const DangerBtn = styled(GhostBtn)`
  border-color: rgba(255,107,107,0.25);
  background: rgba(255,107,107,0.05);
  color: rgba(255,107,107,0.75);
  &:hover {
    background: rgba(255,107,107,0.1);
    border-color: rgba(255,107,107,0.45);
    color: #ff6b6b;
  }
`;

/* Spinning loader icon */
const SpinIcon = styled(Loader2)`
  animation: ${spinKf} 1s linear infinite;
`;

/* ── Result meta strip (shown when iframe is open) ── */
const ResultStrip = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(76,225,211,0.04);
  border: 1px solid rgba(76,225,211,0.1);
  flex-wrap: wrap;
`;

const StripItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(209,232,226,0.55);
  letter-spacing: 0.06em;

  .val {
    color: #4ce1d3;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  svg { color: rgba(76,225,211,0.6); flex-shrink: 0; }
`;

const OpenLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(76,225,211,0.7);
  text-decoration: none;
  margin-left: auto;
  padding: 0.28rem 0.7rem;
  border-radius: 6px;
  border: 1px solid rgba(76,225,211,0.18);
  background: rgba(76,225,211,0.04);
  transition: all 0.2s ease;
  &:hover {
    color: #4ce1d3;
    background: rgba(76,225,211,0.1);
    border-color: rgba(76,225,211,0.4);
    text-decoration: none;
  }
  svg { flex-shrink: 0; }
`;

/* ── iFrame wrapper ── */
const IFrameWrap = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(76,225,211,0.12);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
`;

const StyledIframe = styled.iframe`
  width: 100%;
  min-height: 54vh;
  height: 100%;
  border: none;
  display: block;
  background: #0b1f1d;
`;

/* top bar of the iframe */
const IFrameBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1rem;
  background: rgba(4,12,11,0.9);
  border-bottom: 1px solid rgba(76,225,211,0.1);

  .dots { display: flex; gap: 5px; }
  .dot  {
    width: 10px; height: 10px; border-radius: 50%;
    &.r { background: #ff6b6b; }
    &.y { background: #ffcb9a; }
    &.g { background: #4ce1d3; }
  }

  .url-pill {
    flex: 1;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(209,232,226,0.38);
    letter-spacing: 0.04em;
    background: rgba(76,225,211,0.04);
    border: 1px solid rgba(76,225,211,0.1);
    border-radius: 6px;
    padding: 0.22rem 0.65rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/* ── Success toast ── */
const SuccessTag = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.32rem 0.75rem;
  border-radius: 999px;
  background: rgba(76,225,211,0.08);
  border: 1px solid rgba(76,225,211,0.28);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4ce1d3;
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

/* ── framer variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: -8, scale: 0.98,
    transition: { duration: 0.25 } },
};

/* ── Component ── */
const ViewRaw = ({ everything = [] }) => {
  const [resultUrl, setResultUrl]   = useState(null);
  const [loading,   setLoading]     = useState(false);
  const [error,     setError]       = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [pdfDone,    setPdfDone]    = useState(false);

  const totalKeys = everything.length;
  const totalBytes = (() => {
    try {
      const obj = {};
      everything.forEach(i => { obj[i.id] = i.result; });
      return (new Blob([JSON.stringify(obj)]).size / 1024).toFixed(1);
    } catch { return '—'; }
  })();

  const makeResults = () => {
    const result = {};
    everything.forEach(item => { result[item.id] = item.result; });
    return result;
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(makeResults(), null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'webscan-results.json';
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleDownloadPDF = () => {
    try {
      exportAsPDF({
        address: everything[0]?.id ? window.location.pathname.replace('/check/', '') : 'scan',
        id: `scan-${Date.now()}`,
        results: everything.map(item => ({
          title: item.title || item.id,
          tags: [item.title || item.id],
          status: 'completed',
          severity: 'info',
          data: item.result,
        })),
      });
      setPdfDone(true);
      setTimeout(() => setPdfDone(false), 2500);
    } catch (e) {
      console.error('PDF error', e);
    }
  };

  const fetchResultsUrl = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://jsonhero.io/api/create.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'WebScan results',
          content: makeResults(),
          readOnly: true,
          ttl: 3600,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResultUrl(data.location);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpotlightCard spotColor="rgba(76,225,211,0.06)">
      <Wrap>
        {/* border beam */}
        <BorderBeam colorStart="#4ce1d3" colorEnd="#ffcb9a" duration={5} dual />

        {/* ── header ── */}
        <HeadRow>
          <HeadLeft>
            <HeadIcon>
              <Database size={14} />
            </HeadIcon>
            <HeadTitle>View / Download Raw Data</HeadTitle>
          </HeadLeft>

          <MetaChips>
            <MetaChip>
              <Braces size={11} />
              <AnimatedCounter value={totalKeys} suffix=" checks" duration={800} />
            </MetaChip>
            <MetaChip>
              <FileJson size={11} />
              {totalBytes} KB
            </MetaChip>
            <MetaChip>
              <Code2 size={11} />
              JSON
            </MetaChip>
          </MetaChips>
        </HeadRow>

        {/* ── body ── */}
        <Body>
          <Desc>
            Raw results from your scan in <strong>JSON format</strong> — download locally
            or view interactively via JSONHero. Import into any tool for further analysis.
          </Desc>

          {/* ── action buttons ── */}
          <ActionRow>
            {/* PRIMARY: Download PDF */}
            <ShimmerButton
              onClick={handleDownloadPDF}
              style={{ height: '2.65rem', borderRadius: '10px', fontSize: '0.8rem', padding: '0 1.4rem', minWidth: 'unset' }}
            >
              {pdfDone
                ? <><CheckCircle2 size={15} /> PDF Saved!</>
                : <><FileText size={15} /> Download PDF</>
              }
            </ShimmerButton>

            {/* SECONDARY: Download JSON */}
            <GhostBtn
              type="button"
              onClick={handleDownload}
              whileTap={{ scale: 0.96 }}
            >
              {downloaded
                ? <><CheckCircle2 size={14} /> Saved!</>
                : <><FileJson size={14} /> Download JSON</>
              }
            </GhostBtn>

            {/* view / update */}
            <GhostBtn
              type="button"
              onClick={fetchResultsUrl}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
            >
              {loading
                ? <><SpinIcon size={14} /> Loading…</>
                : <><Eye size={14} /> {resultUrl ? 'Refresh View' : 'View in Browser'}</>
              }
            </GhostBtn>

            {/* hide */}
            <AnimatePresence>
              {resultUrl && (
                <DangerBtn
                  type="button"
                  onClick={() => setResultUrl(null)}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, scale: 0.85, x: -8 }}
                  animate={{ opacity: 1, scale: 1,    x: 0 }}
                  exit={{    opacity: 0, scale: 0.85, x: -8 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                >
                  <EyeOff size={14} /> Hide
                </DangerBtn>
              )}
            </AnimatePresence>

            {/* success indicators */}
            <AnimatePresence>
              {pdfDone && (
                <SuccessTag
                  key="pdf-ok"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{    opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                >
                  <CheckCircle2 size={12} /> PDF Ready
                </SuccessTag>
              )}
              {downloaded && (
                <SuccessTag
                  key="dl-ok"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{    opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                >
                  <CheckCircle2 size={12} /> Saved
                </SuccessTag>
              )}
            </AnimatePresence>
          </ActionRow>

          {/* ── error ── */}
          <AnimatePresence>
            {error && (
              <motion.p
                variants={fadeUp} initial="hidden" animate="show" exit="exit"
                style={{ margin: 0, fontSize: '0.82rem', color: '#ff6b6b',
                  background: 'rgba(255,107,107,0.07)',
                  border: '1px dashed rgba(255,107,107,0.25)',
                  borderRadius: '8px', padding: '0.65rem 1rem' }}
              >
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── result strip + iframe ── */}
          <AnimatePresence>
            {resultUrl && (
              <motion.div
                key="iframe-block"
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              >
                {/* meta strip */}
                <ResultStrip
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, duration: 0.35, ease: [0.16,1,0.3,1] }}
                >
                  <StripItem>
                    <Share2 size={13} />
                    <span>Live on JSONHero</span>
                  </StripItem>
                  <StripItem>
                    <Database size={13} />
                    <span><AnimatedCounter value={totalKeys} className="val" duration={600} /> records</span>
                  </StripItem>
                  <StripItem>
                    <FileJson size={13} />
                    <span className="val">{totalBytes} KB</span>
                  </StripItem>
                  <OpenLink href={resultUrl} target="_blank" rel="noreferrer">
                    Open <ExternalLink size={11} />
                  </OpenLink>
                </ResultStrip>

                {/* iframe with browser chrome */}
                <IFrameWrap
                  initial={{ opacity: 0, scaleY: 0.96 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: 0.1, duration: 0.45, ease: [0.16,1,0.3,1] }}
                >
                  <IFrameBar>
                    <div className="dots">
                      <span className="dot r" />
                      <span className="dot y" />
                      <span className="dot g" />
                    </div>
                    <span className="url-pill">{resultUrl}</span>
                  </IFrameBar>
                  <StyledIframe title="WebScan results via JSONHero" src={resultUrl} />
                </IFrameWrap>
              </motion.div>
            )}
          </AnimatePresence>
        </Body>
      </Wrap>
    </SpotlightCard>
  );
};

export default ViewRaw;
