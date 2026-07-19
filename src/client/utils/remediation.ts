import type { Finding } from 'client/analysis/types';

export interface RemediationAdvice {
  impact: string;
  effort: 'Low effort' | 'Medium effort' | 'High effort';
  steps: string[];
}

const adviceByCard: Record<string, RemediationAdvice> = {
  ssl: {
    impact: 'Protects encrypted traffic and prevents browser trust failures.',
    effort: 'Medium effort',
    steps: ['Renew or replace the certificate with the correct hostname.', 'Enable automated renewal and verify the full certificate chain.'],
  },
  'http-security': {
    impact: 'Reduces browser-based attacks such as injection, framing, and content sniffing.',
    effort: 'Low effort',
    steps: ['Add the missing response header at the web server or CDN.', 'Deploy in report-only mode when applicable, then rescan before enforcing.'],
  },
  hsts: {
    impact: 'Prevents protocol downgrade and accidental HTTP access.',
    effort: 'Low effort',
    steps: ['Redirect all HTTP requests to HTTPS.', 'Add Strict-Transport-Security with an appropriate max-age after HTTPS is stable.'],
  },
  ports: {
    impact: 'Shrinks the externally reachable attack surface.',
    effort: 'Medium effort',
    steps: ['Confirm whether the exposed service is required.', 'Restrict access by firewall or private network and disable cleartext protocols.'],
  },
  cookies: {
    impact: 'Reduces session theft and cross-site request risk.',
    effort: 'Low effort',
    steps: ['Set Secure and HttpOnly on session cookies.', 'Choose a restrictive SameSite policy and validate authentication flows.'],
  },
  dnssec: {
    impact: 'Protects DNS responses from tampering and spoofing.',
    effort: 'Medium effort',
    steps: ['Enable DNSSEC with the authoritative DNS provider.', 'Publish the DS record through the registrar and verify the chain of trust.'],
  },
  'mail-config': {
    impact: 'Reduces domain spoofing, phishing, and unauthorized email delivery.',
    effort: 'Medium effort',
    steps: ['Review SPF and DKIM alignment for every legitimate sender.', 'Deploy DMARC in monitoring mode, then move toward quarantine or reject.'],
  },
  threats: {
    impact: 'Limits exposure to malware, phishing, and reputation damage.',
    effort: 'High effort',
    steps: ['Isolate the affected host or content and preserve evidence.', 'Remove malicious artifacts, rotate exposed credentials, and request reputation review.'],
  },
  'block-lists': {
    impact: 'Restores deliverability and customer trust.',
    effort: 'High effort',
    steps: ['Identify the activity that triggered the listing.', 'Remediate the source, document the fix, and submit delisting requests.'],
  },
  headers: {
    impact: 'Reduces infrastructure fingerprinting and targeted exploitation.',
    effort: 'Low effort',
    steps: ['Remove unnecessary server and framework disclosure headers.', 'Confirm the application still operates correctly, then rescan.'],
  },
};

const defaultAdvice: RemediationAdvice = {
  impact: 'Improves the domain security posture and reduces avoidable exposure.',
  effort: 'Medium effort',
  steps: ['Review the finding evidence and confirm the affected configuration.', 'Apply the least disruptive fix, validate it in staging, and rescan.'],
};

export const getRemediationAdvice = (finding: Finding): RemediationAdvice =>
  adviceByCard[finding.cardId] || defaultAdvice;
