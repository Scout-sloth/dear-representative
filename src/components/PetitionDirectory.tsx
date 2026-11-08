import {useState} from 'react';
import type {Petition} from '../types';

export default function PetitionDirectory({petitions}: {petitions: Petition[]}) {
  const [scope, setScope] = useState('all');
  const visiblePetitions = petitions.filter(p =>
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
      <p>External petitions are listed for reference, not endorsed or ranked. Read each petition's text, organizer, and privacy terms before signing. Signature counts are omitted until verified.</p>
      <div className="petitions">
        {visiblePetitions.map(p => (
          <article className="petition" key={p.id}>
            <div>
              <span className="tag">{p.scope === 'both' ? 'Both chambers' : p.scope === 'house' ? 'House' : 'Senate'}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <small>{p.platform} · Signature count not verified</small>
            </div>
            <a href={p.url} target="_blank" rel="noopener noreferrer">View petition ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}
