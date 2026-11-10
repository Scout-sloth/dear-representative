import {useState} from 'react';
import type {Petition} from '../types';
import {signatureSnapshot, signatureSourceLabels, sortPetitions} from '../lib/petitions';

export default function PetitionDirectory({petitions}: {petitions: Petition[]}) {
  const [scope, setScope] = useState('all');
  const visiblePetitions = sortPetitions(petitions).filter(p =>
    scope === 'all' || p.scope === scope || (scope !== 'both' && p.scope === 'both'),
  );

  return (
    <section className="panel" aria-labelledby="petitions-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">03 / PETITIONS</div>
          <h2 id="petitions-title">Petition directory</h2>
        </div>
        <label className="filter">
          Filter
          <select value={scope} onChange={e => setScope(e.target.value)}>
            <option value="all">All</option>
            <option value="house">House</option>
            <option value="senate">Senate</option>
            <option value="both">Both chambers</option>
          </select>
        </label>
      </div>
      <p>External petitions are listed for reference, not endorsed. Sorted by recorded signature counts, highest first; unavailable counts follow. Counts are snapshots, not live totals or a measure of accuracy. Read each petition's text, organizer, and privacy terms before signing.</p>
      <div className="petitions">
        {visiblePetitions.map(p => (
          <article className="petition" key={p.id}>
            <div>
              <span className="tag">{p.scope === 'both' ? 'Both chambers' : p.scope === 'house' ? 'House' : 'Senate'}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p className="petition-count">{signatureSnapshot(p) !== undefined
                ? `${signatureSnapshot(p)!.toLocaleString('en-US')} signatures`
                : 'Signature count unavailable or unverified'}</p>
              <small>{p.platform}{p.organizer ? ` · Organizer (display name): ${p.organizer}` : ' · Organizer unavailable'}</small>
              {signatureSnapshot(p) !== undefined && <p className="hint petition-metadata">
                Snapshot · Checked <time dateTime={p.checkedAt}>{p.checkedAt}</time> (UTC) · {signatureSourceLabels[p.signatureVerification!]}.
                {' '}<a href={p.signatureSourceUrl} target="_blank" rel="noopener noreferrer">Count source</a>
              </p>}
              {p.verification?.status !== 'verified' && <p className="hint">Petition title and destination not verified.</p>}
            </div>
            <a href={p.url} target="_blank" rel="noopener noreferrer">View petition ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}
