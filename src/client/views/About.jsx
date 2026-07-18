import styled from '@emotion/styled';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Eye,
  Globe2,
  History,
  Layers3,
  LockKeyhole,
  Network,
  Radar,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AnimatedGitHubIcon } from 'client/components/Form/Button';
import Nav from 'client/components/Form/Nav';
import Footer from 'client/components/misc/Footer';
import docs from 'client/utils/docs';

const GITHUB_REPO = 'https://github.com/Mohammed-razin-cr/Web-Scan';
const AUTHOR_PROFILE = 'https://github.com/Mohammed-razin-cr';

const DIAGNOSTIC_CATEGORIES = [
  {
    id: 'all',
    label: 'All diagnostics',
    icon: Layers3,
    accent: '#4ce1d3',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: Network,
    accent: '#4ce1d3',
    ids: [
      'get-ip',
      'dns',
      'location',
      'hosts',
      'redirects',
      'txt-records',
      'status',
      'ports',
      'trace-route',
      'server-info',
      'dns-server',
      'subdomains',
    ],
  },
  {
    id: 'security',
    label: 'Security and trust',
    icon: LockKeyhole,
    accent: '#ffcb9a',
    ids: [
      'ssl',
      'headers',
      'dnssec',
      'hsts',
      'security-txt',
      'mail-config',
      'firewall',
      'http-security',
      'block-lists',
      'threats',
      'tls-connection',
      'tls-security-audit',
      'tls-client-compat',
    ],
  },
  {
    id: 'web',
    label: 'Web intelligence',
    icon: Globe2,
    accent: '#d1e8e2',
    ids: [
      'cookies',
      'robots-txt',
      'quality',
      'carbon',
      'tech-stack',
      'sitemap',
      'linked-pages',
      'social-tags',
      'screenshot',
    ],
  },
  {
    id: 'domain',
    label: 'Domain and history',
    icon: History,
    accent: '#d9b08c',
    ids: ['domain', 'whois', 'archives', 'rank'],
  },
];

const FALLBACK_CATEGORY = DIAGNOSTIC_CATEGORIES[1];
const CATEGORY_BY_DIAGNOSTIC = new Map(
  DIAGNOSTIC_CATEGORIES.flatMap((category) =>
    (category.ids || []).map((diagnosticId) => [diagnosticId, category]),
  ),
);

const DIAGNOSTICS = docs.map((diagnostic) => ({
  ...diagnostic,
  category: CATEGORY_BY_DIAGNOSTIC.get(diagnostic.id) || FALLBACK_CATEGORY,
}));

const PageFrame = styled.div`
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 2rem));
  margin: 0 auto;
  padding-top: 0.75rem;

  @media (max-width: 640px) {
    width: calc(100% - 1.25rem);
    padding-top: 0.5rem;
  }
`;

const HeaderActions = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const RepositoryLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 2.625rem;
  padding: 0 0.95rem;
  color: #d1e8e2;
  background: rgba(17, 100, 102, 0.16);
  border: 1px solid rgba(76, 225, 211, 0.24);
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 750;
  line-height: 1;
  text-decoration: none;
  transition:
    color 180ms ease,
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;

  &:hover {
    color: #ffffff;
    background: rgba(17, 100, 102, 0.3);
    border-color: rgba(76, 225, 211, 0.5);
    transform: translateY(-1px);
  }

  svg {
    flex: 0 0 auto;
  }

  @media (max-width: 520px) {
    width: 2.5rem;
    min-height: 2.5rem;
    padding: 0;

    span,
    svg:last-child {
      display: none;
    }
  }
`;

const Main = styled.main`
  width: 100%;
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(22rem, 0.92fr);
  align-items: center;
  gap: 4.5rem;
  min-height: 37rem;
  padding: 4.5rem 0 4rem;
  border-bottom: 1px solid rgba(209, 232, 226, 0.12);

  @media (max-width: 1020px) {
    grid-template-columns: minmax(0, 1fr) minmax(19rem, 0.78fr);
    gap: 2.5rem;
  }

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 2.75rem;
    min-height: 0;
    padding: 3.75rem 0;
  }

  @media (max-width: 640px) {
    gap: 1.75rem;
    padding: 2.75rem 0 2.25rem;
  }

  @media (max-width: 640px) and (max-height: 650px) {
    padding-bottom: 1rem;
  }
`;

const HeroCopy = styled.div`
  min-width: 0;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 1.15rem;
  color: #ffcb9a;
  font-size: 0.78rem;
  font-weight: 750;
  line-height: 1.3;

  svg {
    color: #4ce1d3;
  }
`;

const HeroTitle = styled.h1`
  max-width: 46rem;
  margin: 0;
  color: #f7fbfa;
  font-size: 4.5rem;
  font-weight: 850;
  line-height: 1.02;
  letter-spacing: 0;

  span {
    color: #4ce1d3;
  }

  @media (max-width: 1020px) {
    font-size: 3.75rem;
  }

  @media (max-width: 640px) {
    font-size: 3rem;
    line-height: 1.06;
  }

  @media (max-width: 390px) {
    font-size: 2.55rem;
  }
`;

const HeroDescription = styled.p`
  max-width: 42rem;
  margin: 1.45rem 0 0;
  color: #a8bbb7;
  font-size: 1.08rem;
  line-height: 1.75;

  @media (max-width: 640px) {
    margin-top: 1.2rem;
    font-size: 0.98rem;
    line-height: 1.68;
  }
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;

const actionStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 2.9rem;
  padding: 0 1.15rem;
  border-radius: 7px;
  font-size: 0.88rem;
  font-weight: 750;
  line-height: 1;
  text-decoration: none;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease,
    color 180ms ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryAction = styled(Link)`
  ${actionStyles}
  color: #061311;
  background: #4ce1d3;
  border: 1px solid #4ce1d3;

  &:hover {
    color: #061311;
    background: #78e9df;
    border-color: #78e9df;
  }
`;

const SecondaryAction = styled.a`
  ${actionStyles}
  color: #d1e8e2;
  background: rgba(209, 232, 226, 0.04);
  border: 1px solid rgba(209, 232, 226, 0.18);

  &:hover {
    color: #ffffff;
    background: rgba(209, 232, 226, 0.08);
    border-color: rgba(209, 232, 226, 0.34);
  }
`;

const HeroMetrics = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 34rem;
  margin: 2.35rem 0 0;
  padding: 1.15rem 0;
  border-top: 1px solid rgba(209, 232, 226, 0.12);
  border-bottom: 1px solid rgba(209, 232, 226, 0.12);

  div {
    min-width: 0;
    padding: 0 1rem;
    border-right: 1px solid rgba(209, 232, 226, 0.1);
  }

  div:first-of-type {
    padding-left: 0;
  }

  div:last-of-type {
    padding-right: 0;
    border-right: 0;
  }

  dt {
    margin-top: 0.3rem;
    color: #829691;
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.35;
  }

  dd {
    margin: 0;
    color: #f7fbfa;
    font-size: 1.2rem;
    font-weight: 800;
    line-height: 1.2;
  }

  @media (max-width: 390px) {
    div {
      padding: 0 0.65rem;
    }

    dd {
      font-size: 1.05rem;
    }

    dt {
      font-size: 0.66rem;
    }
  }
`;

const ScopeColumn = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: 0;

  @media (max-width: 820px) {
    justify-content: center;
  }

  @media (max-width: 640px) and (max-height: 650px) {
    display: none;
  }
`;

const ScopeFrame = styled.div`
  position: relative;
  width: min(100%, 24rem);
  aspect-ratio: 1;

  @media (max-width: 640px) {
    width: min(100%, 16.5rem);
  }
`;

const ScopeDisc = styled.div`
  position: absolute;
  inset: 7%;
  overflow: hidden;
  border: 1px solid rgba(76, 225, 211, 0.3);
  border-radius: 50%;
  background:
    linear-gradient(rgba(76, 225, 211, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(76, 225, 211, 0.055) 1px, transparent 1px), #071916;
  background-size: 2.25rem 2.25rem;
  box-shadow:
    inset 0 0 4rem rgba(17, 100, 102, 0.2),
    0 1.5rem 5rem rgba(0, 0, 0, 0.28);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border: 1px solid rgba(76, 225, 211, 0.16);
    border-radius: 50%;
  }

  &::before {
    inset: 19%;
  }

  &::after {
    inset: 37%;
  }
`;

const ScopeCrosshair = styled.div`
  position: absolute;
  inset: 7%;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(76, 225, 211, 0.13);
  }

  &::before {
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
  }

  &::after {
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
  }
`;

const ScopeSweep = styled.div`
  position: absolute;
  inset: 7%;
  border-radius: 50%;
  background: conic-gradient(
    from 20deg,
    transparent 0deg,
    transparent 250deg,
    rgba(76, 225, 211, 0.02) 276deg,
    rgba(76, 225, 211, 0.28) 354deg,
    transparent 360deg
  );
  animation: radar-turn 8s linear infinite;
  pointer-events: none;

  @keyframes radar-turn {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ScopeCore = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 5.25rem;
  height: 5.25rem;
  border: 1px solid rgba(76, 225, 211, 0.4);
  border-radius: 50%;
  background: #081c19;
  transform: translate(-50%, -50%);

  img {
    width: 3.5rem;
    height: 3.5rem;
    object-fit: contain;
  }

  @media (max-width: 640px) {
    width: 4.5rem;
    height: 4.5rem;

    img {
      width: 3rem;
      height: 3rem;
    }
  }
`;

const ScopeNode = styled.div`
  position: absolute;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.42rem 0.55rem;
  color: #d1e8e2;
  background: rgba(6, 20, 17, 0.94);
  border: 1px solid rgba(76, 225, 211, 0.25);
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 750;
  line-height: 1;

  svg {
    color: #ffcb9a;
  }

  &[data-position='tls'] {
    top: 12%;
    left: 9%;
  }

  &[data-position='dns'] {
    top: 18%;
    right: 2%;
  }

  &[data-position='waf'] {
    right: 0;
    bottom: 18%;
  }

  &[data-position='osint'] {
    bottom: 12%;
    left: 5%;
  }
`;

const SignalPoint = styled.span`
  position: absolute;
  z-index: 2;
  width: 0.48rem;
  height: 0.48rem;
  border: 1px solid #071916;
  border-radius: 50%;
  background: #ffcb9a;
  animation: signal-pulse 2.8s ease-in-out infinite;
  animation-delay: var(--delay);

  &[data-point='one'] {
    top: 29%;
    left: 33%;
  }

  &[data-point='two'] {
    top: 39%;
    right: 23%;
  }

  &[data-point='three'] {
    right: 33%;
    bottom: 27%;
  }

  @keyframes signal-pulse {
    0%,
    100% {
      opacity: 0.45;
      transform: scale(0.75);
    }
    45% {
      opacity: 1;
      transform: scale(1.25);
    }
  }
`;

const ScopeCaption = styled.div`
  position: absolute;
  right: 14%;
  bottom: 2%;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: #8da39e;
  font-size: 0.72rem;
  font-weight: 650;

  svg {
    color: #4ce1d3;
  }
`;

const Section = styled.section`
  padding: 5.25rem 0;
  scroll-margin-top: 6rem;

  @media (max-width: 640px) {
    padding: 4rem 0;
  }

  @media (max-width: 640px) and (max-height: 650px) {
    padding-top: 2rem;
  }
`;

const SectionHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(20rem, 0.7fr);
  align-items: end;
  gap: 3rem;
  margin-bottom: 2.25rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SectionKicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  color: #4ce1d3;
  font-size: 0.78rem;
  font-weight: 750;
`;

const SectionTitle = styled.h2`
  max-width: 42rem;
  margin: 0;
  color: #f7fbfa;
  font-size: 2.6rem;
  font-weight: 820;
  line-height: 1.14;
  letter-spacing: 0;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

const SectionLead = styled.p`
  margin: 0;
  color: #96aaa5;
  font-size: 0.98rem;
  line-height: 1.7;
`;

const FilterToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem;
  background: rgba(6, 20, 17, 0.72);
  border: 1px solid rgba(209, 232, 226, 0.12);
  border-radius: 8px;

  @media (max-width: 820px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const SearchField = styled.div`
  position: relative;
  flex: 0 0 17rem;

  > svg {
    position: absolute;
    top: 50%;
    left: 0.8rem;
    color: #71857f;
    transform: translateY(-50%);
    pointer-events: none;
  }

  @media (max-width: 820px) {
    flex-basis: auto;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 2.7rem;
  padding: 0 2.55rem 0 2.45rem;
  color: #f7fbfa;
  background: rgba(209, 232, 226, 0.035);
  border: 1px solid rgba(209, 232, 226, 0.13);
  border-radius: 6px;
  font: inherit;
  font-size: 0.84rem;
  outline: none;
  transition:
    background 180ms ease,
    border-color 180ms ease;

  &::placeholder {
    color: #6f827d;
  }

  &:focus {
    background: rgba(209, 232, 226, 0.055);
    border-color: rgba(76, 225, 211, 0.48);
  }
`;

const ClearSearch = styled.button`
  position: absolute;
  top: 50%;
  right: 0.45rem;
  display: grid;
  place-items: center;
  width: 1.85rem;
  height: 1.85rem;
  padding: 0;
  color: #8fa29e;
  background: transparent;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  transform: translateY(-50%);

  &:hover {
    color: #ffffff;
    background: rgba(209, 232, 226, 0.08);
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  flex: 1;
  gap: 0.35rem;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryTab = styled.button`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 0.42rem;
  min-height: 2.7rem;
  padding: 0 0.78rem;
  color: #879b96;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition:
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease;

  &:hover {
    color: #d1e8e2;
    background: rgba(209, 232, 226, 0.045);
  }

  &[aria-selected='true'] {
    color: #f7fbfa;
    background: rgba(17, 100, 102, 0.22);
    border-color: rgba(76, 225, 211, 0.22);
  }
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 1.5rem;
  margin: 1.2rem 0 0.8rem;
  color: #788c87;
  font-size: 0.76rem;
  font-weight: 650;

  strong {
    color: #b7c9c5;
    font-weight: 700;
  }
`;

const DiagnosticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 590px) {
    grid-template-columns: 1fr;
  }
`;

const DiagnosticItem = styled.article`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.85rem;
  min-height: 8.1rem;
  padding: 1rem;
  background: rgba(7, 25, 22, 0.64);
  border: 1px solid rgba(209, 232, 226, 0.1);
  border-radius: 8px;
  transition:
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;

  &:hover {
    background: rgba(9, 31, 27, 0.78);
    border-color: color-mix(in srgb, var(--accent) 38%, transparent);
    transform: translateY(-2px);
  }

  @media (max-width: 590px) {
    min-height: 7.25rem;
    padding: 0.9rem;
  }
`;

const DiagnosticIcon = styled.div`
  display: grid;
  place-items: center;
  width: 2.15rem;
  height: 2.15rem;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
  border-radius: 7px;
`;

const DiagnosticContent = styled.div`
  min-width: 0;
`;

const DiagnosticTitle = styled.h3`
  margin: 0;
  color: #ecf6f3;
  font-size: 0.9rem;
  font-weight: 760;
  line-height: 1.3;
  letter-spacing: 0;
`;

const DiagnosticCategory = styled.div`
  margin-top: 0.25rem;
  color: var(--accent);
  font-size: 0.66rem;
  font-weight: 700;
  line-height: 1.3;
`;

const DiagnosticDescription = styled.p`
  display: -webkit-box;
  overflow: hidden;
  margin: 0.55rem 0 0;
  color: #81948f;
  font-size: 0.76rem;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const ShowAllButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  margin: 1.3rem auto 0;
  padding: 0 1rem;
  color: #d1e8e2;
  background: transparent;
  border: 1px solid rgba(209, 232, 226, 0.16);
  border-radius: 7px;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 720;
  cursor: pointer;
  transition:
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease;

  &:hover {
    color: #ffffff;
    background: rgba(209, 232, 226, 0.05);
    border-color: rgba(76, 225, 211, 0.34);
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: grid;
  place-items: center;
  min-height: 12rem;
  padding: 2rem;
  color: #879b96;
  border: 1px dashed rgba(209, 232, 226, 0.16);
  border-radius: 8px;
  text-align: center;

  svg {
    margin-bottom: 0.75rem;
    color: #4ce1d3;
  }

  strong {
    display: block;
    margin-bottom: 0.3rem;
    color: #d1e8e2;
  }

  p {
    margin: 0;
    font-size: 0.84rem;
  }
`;

const TrustSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 4.5rem;
  padding: 5rem 0;
  border-top: 1px solid rgba(209, 232, 226, 0.12);
  border-bottom: 1px solid rgba(209, 232, 226, 0.12);
  scroll-margin-top: 6rem;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  @media (max-width: 640px) {
    padding: 4rem 0;
  }
`;

const TrustIntro = styled.div`
  align-self: start;

  p {
    max-width: 34rem;
    margin: 1.1rem 0 0;
    color: #96aaa5;
    font-size: 0.95rem;
    line-height: 1.7;
  }
`;

const TrustList = styled.div`
  display: grid;
  gap: 0;
`;

const TrustItem = styled.article`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(209, 232, 226, 0.1);

  &:first-of-type {
    padding-top: 0;
  }

  &:last-of-type {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

const TrustIcon = styled.div`
  display: grid;
  place-items: center;
  width: 2.7rem;
  height: 2.7rem;
  color: var(--icon-color);
  background: color-mix(in srgb, var(--icon-color) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--icon-color) 22%, transparent);
  border-radius: 8px;
`;

const TrustCopy = styled.div`
  min-width: 0;

  h3 {
    margin: 0;
    color: #ecf6f3;
    font-size: 1rem;
    font-weight: 760;
    line-height: 1.35;
  }

  p {
    margin: 0.5rem 0 0;
    color: #879b96;
    font-size: 0.84rem;
    line-height: 1.65;
  }
`;

const InlineLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #4ce1d3;
  font-weight: 700;

  &:hover {
    color: #8ef5ec;
  }
`;

const ClosingSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 2rem;
  padding: 4.5rem 0 1rem;

  h2 {
    margin: 0;
    color: #f7fbfa;
    font-size: 2rem;
    font-weight: 820;
    line-height: 1.2;
    letter-spacing: 0;
  }

  p {
    margin: 0.7rem 0 0;
    color: #8fa39e;
    font-size: 0.92rem;
    line-height: 1.65;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    padding-top: 3.75rem;

    > a {
      width: 100%;
    }
  }
`;

export default function About() {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!location.hash) return;

    const scrollTimer = window.setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);

    return () => window.clearTimeout(scrollTimer);
  }, [location]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredDiagnostics = useMemo(
    () =>
      DIAGNOSTICS.filter((diagnostic) => {
        const matchesCategory =
          activeCategory === 'all' || diagnostic.category.id === activeCategory;
        const matchesQuery =
          !normalizedQuery ||
          diagnostic.title.toLowerCase().includes(normalizedQuery) ||
          diagnostic.description.toLowerCase().includes(normalizedQuery);

        return matchesCategory && matchesQuery;
      }),
    [activeCategory, normalizedQuery],
  );

  const canCollapse = activeCategory === 'all' && !normalizedQuery;
  const visibleDiagnostics =
    canCollapse && !showAll ? filteredDiagnostics.slice(0, 12) : filteredDiagnostics;

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setShowAll(categoryId !== 'all');
  };

  const handleListToggle = () => {
    if (showAll) {
      setShowAll(false);
      window.requestAnimationFrame(() => {
        document.getElementById('diagnostics')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
      return;
    }

    setShowAll(true);
  };

  return (
    <div>
      <PageFrame>
        <Nav quiet>
          <HeaderActions aria-label="Project links">
            <RepositoryLink
              target="_blank"
              rel="noreferrer"
              href={GITHUB_REPO}
              aria-label="View WebScan on GitHub"
              title="View WebScan on GitHub"
            >
              <AnimatedGitHubIcon size={18} />
              <span>View on GitHub</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </RepositoryLink>
          </HeaderActions>
        </Nav>

        <Main>
          <Hero aria-labelledby="about-title">
            <HeroCopy>
              <Eyebrow>
                <Radar size={16} aria-hidden="true" />
                Website intelligence, made clear
              </Eyebrow>
              <HeroTitle id="about-title">
                About <span>WebScan</span>
              </HeroTitle>
              <HeroDescription>
                WebScan turns public web signals into one clear security and intelligence report.
                Inspect infrastructure, trust, technology, and reputation from a single scan.
              </HeroDescription>

              <HeroActions>
                <PrimaryAction to="/check">
                  Start a scan
                  <ArrowRight size={17} aria-hidden="true" />
                </PrimaryAction>
                <SecondaryAction href="#diagnostics">
                  Explore diagnostics
                  <ChevronDown size={17} aria-hidden="true" />
                </SecondaryAction>
              </HeroActions>

              <HeroMetrics aria-label="WebScan at a glance">
                <div>
                  <dd>{docs.length}</dd>
                  <dt>Intelligence checks</dt>
                </div>
                <div>
                  <dd>Live</dd>
                  <dt>On-demand analysis</dt>
                </div>
                <div>
                  <dd>Zero</dd>
                  <dt>Query logs</dt>
                </div>
              </HeroMetrics>
            </HeroCopy>

            <ScopeColumn aria-hidden="true">
              <ScopeFrame>
                <ScopeDisc />
                <ScopeCrosshair />
                <ScopeSweep />
                <ScopeCore>
                  <img src="/logo-icon-transparent.png" alt="" />
                </ScopeCore>
                <ScopeNode data-position="tls">
                  <ShieldCheck size={13} /> TLS
                </ScopeNode>
                <ScopeNode data-position="dns">
                  <Network size={13} /> DNS
                </ScopeNode>
                <ScopeNode data-position="waf">
                  <LockKeyhole size={13} /> WAF
                </ScopeNode>
                <ScopeNode data-position="osint">
                  <Eye size={13} /> OSINT
                </ScopeNode>
                <SignalPoint data-point="one" style={{ '--delay': '0s' }} />
                <SignalPoint data-point="two" style={{ '--delay': '0.8s' }} />
                <SignalPoint data-point="three" style={{ '--delay': '1.6s' }} />
                <ScopeCaption>
                  <CheckCircle2 size={14} /> {docs.length} signals connected
                </ScopeCaption>
              </ScopeFrame>
            </ScopeColumn>
          </Hero>

          <Section id="diagnostics" aria-labelledby="diagnostics-title">
            <SectionHeader>
              <div>
                <SectionKicker>
                  <Layers3 size={16} aria-hidden="true" />
                  Supported diagnostics
                </SectionKicker>
                <SectionTitle id="diagnostics-title">
                  Coverage from the edge to the origin.
                </SectionTitle>
              </div>
              <SectionLead>
                Search the complete intelligence catalog or focus on one area of a target's public
                footprint. Every signal is organized into the same unified report.
              </SectionLead>
            </SectionHeader>

            <FilterToolbar aria-label="Filter supported diagnostics">
              <SearchField>
                <Search size={17} aria-hidden="true" />
                <SearchInput
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={`Search ${docs.length} diagnostics`}
                  aria-label="Search supported diagnostics"
                />
                {query && (
                  <ClearSearch
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear diagnostics search"
                    title="Clear search"
                  >
                    <X size={15} aria-hidden="true" />
                  </ClearSearch>
                )}
              </SearchField>

              <CategoryTabs role="tablist" aria-label="Diagnostic categories">
                {DIAGNOSTIC_CATEGORIES.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <CategoryTab
                      key={category.id}
                      id={`diagnostic-tab-${category.id}`}
                      type="button"
                      role="tab"
                      aria-selected={activeCategory === category.id}
                      aria-controls="diagnostics-list"
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <CategoryIcon size={14} aria-hidden="true" />
                      {category.label}
                    </CategoryTab>
                  );
                })}
              </CategoryTabs>
            </FilterToolbar>

            <ResultMeta aria-live="polite">
              <span>
                Showing <strong>{visibleDiagnostics.length}</strong> of{' '}
                <strong>{filteredDiagnostics.length}</strong>
              </span>
              {normalizedQuery && <span>Search: {query.trim()}</span>}
            </ResultMeta>

            <DiagnosticsGrid
              id="diagnostics-list"
              role="tabpanel"
              aria-labelledby={`diagnostic-tab-${activeCategory}`}
            >
              {visibleDiagnostics.map((diagnostic) => {
                const DiagnosticIconComponent = diagnostic.category.icon;
                return (
                  <DiagnosticItem
                    key={diagnostic.id}
                    style={{ '--accent': diagnostic.category.accent }}
                  >
                    <DiagnosticIcon>
                      <DiagnosticIconComponent size={17} aria-hidden="true" />
                    </DiagnosticIcon>
                    <DiagnosticContent>
                      <DiagnosticTitle>{diagnostic.title}</DiagnosticTitle>
                      <DiagnosticCategory>{diagnostic.category.label}</DiagnosticCategory>
                      <DiagnosticDescription>{diagnostic.description}</DiagnosticDescription>
                    </DiagnosticContent>
                  </DiagnosticItem>
                );
              })}

              {visibleDiagnostics.length === 0 && (
                <EmptyState>
                  <div>
                    <Search size={24} aria-hidden="true" />
                    <strong>No matching diagnostics</strong>
                    <p>Try a different term or choose another category.</p>
                  </div>
                </EmptyState>
              )}
            </DiagnosticsGrid>

            {canCollapse && filteredDiagnostics.length > 12 && (
              <ShowAllButton type="button" onClick={handleListToggle}>
                {showAll ? (
                  <>
                    Show fewer diagnostics
                    <ChevronUp size={16} aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Show all {filteredDiagnostics.length} diagnostics
                    <ChevronDown size={16} aria-hidden="true" />
                  </>
                )}
              </ShowAllButton>
            )}
          </Section>

          <TrustSection id="privacy" aria-labelledby="privacy-title">
            <TrustIntro>
              <SectionKicker>
                <ShieldCheck size={16} aria-hidden="true" />
                Trust by design
              </SectionKicker>
              <SectionTitle id="privacy-title">Built to inspect, never to track.</SectionTitle>
              <p>
                Clear intelligence should not require surrendering your own. WebScan keeps the
                product transparent and the scan experience private.
              </p>
            </TrustIntro>

            <TrustList>
              <TrustItem>
                <TrustIcon style={{ '--icon-color': '#4ce1d3' }}>
                  <ShieldCheck size={20} aria-hidden="true" />
                </TrustIcon>
                <TrustCopy>
                  <h3>Queries stay private</h3>
                  <p>
                    Queried hosts, IP addresses, and user data are not stored. Privacy-friendly
                    analytics count visits, while basic error reporting helps keep WebScan reliable.
                  </p>
                </TrustCopy>
              </TrustItem>

              <TrustItem>
                <TrustIcon style={{ '--icon-color': '#ffcb9a' }}>
                  <Code2 size={20} aria-hidden="true" />
                </TrustIcon>
                <TrustCopy>
                  <h3>Open source and auditable</h3>
                  <p>
                    WebScan is released under the MIT License and developed by{' '}
                    <InlineLink target="_blank" rel="noreferrer" href={AUTHOR_PROFILE}>
                      Mohammed Razin <ArrowUpRight size={13} aria-hidden="true" />
                    </InlineLink>
                    . Review, modify, deploy, or contribute directly on GitHub.
                  </p>
                </TrustCopy>
              </TrustItem>
            </TrustList>
          </TrustSection>

          <ClosingSection>
            <div>
              <h2>See what a domain reveals.</h2>
              <p>Run a complete WebScan report in one secure, focused workflow.</p>
            </div>
            <PrimaryAction to="/check">
              Analyze a website
              <ArrowRight size={17} aria-hidden="true" />
            </PrimaryAction>
          </ClosingSection>
        </Main>
      </PageFrame>

      <Footer />
    </div>
  );
}
