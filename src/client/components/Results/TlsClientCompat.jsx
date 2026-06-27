import { Card } from 'client/components/Form/Card';
import { ExpandableRow } from 'client/components/Form/Row';

const PROTOCOL_NAMES = {
  512: 'SSL 2.0',
  768: 'SSL 3.0',
  769: 'TLS 1.0',
  770: 'TLS 1.1',
  771: 'TLS 1.2',
  772: 'TLS 1.3',
};

const buildTitle = (c) => {
  const platform = c.platform ? ` (${c.platform})` : '';
  const version = c.version ? ` ${c.version}` : '';
  const ref = c.isReference ? ' *' : '';
  return `${c.name || 'Client'}${platform}${version}${ref}`;
};

const optionalRow = (lbl, val) =>
  val == null || val === '' ? null : { lbl, val: String(val) };

// Per-client fields shown when the simulated handshake succeeded
const successFields = (sim) =>
  [
    optionalRow(
      'Protocol',
      PROTOCOL_NAMES[sim.protocolId] || (sim.protocolId ? String(sim.protocolId) : null),
    ),
    optionalRow('Cipher', sim.suiteName),
    optionalRow('Key Exchange', sim.kxType),
    optionalRow('Key Exchange Strength', sim.kxStrength),
    optionalRow('DH Strength', sim.dhStrength),
    optionalRow('Key Algorithm', sim.keyAlg),
    optionalRow('Key Size', sim.keySize),
    optionalRow('Signature Algorithm', sim.sigAlg),
    optionalRow('Attempts', sim.attempts > 1 ? sim.attempts : null),
  ].filter(Boolean) ;

// Per-client fields shown when the simulated handshake failed
const failureFields = (sim) => {
  const reason =
    sim.alertDescription || sim.errorMessage || 'This client cannot complete the TLS handshake';
  return [{ lbl: '', val: '', plaintext: reason }];
};

const TlsClientCompatCard = (props



) => {
  const sims = props.data?.endpoints?.[0]?.details?.sims?.results;
  if (!sims?.length) return null;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {sims.map((sim, i) => {
        const ok = sim.errorCode === 0;
        return (
          <ExpandableRow
            key={`tls-cli-${i}`}
            lbl={buildTitle(sim.client || {})}
            val={ok ? '✅' : '❌'}
            rowList={ok ? successFields(sim) : failureFields(sim)}
          />
        );
      })}
    </Card>
  );
};

export default TlsClientCompatCard;
