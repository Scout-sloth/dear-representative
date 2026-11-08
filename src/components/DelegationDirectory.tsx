import type {Legislator, State} from '../types';

export default function DelegationDirectory({officials, state}: {officials: Legislator[]; state: State}) {
  return (
    <section className="panel" aria-labelledby="directory-title">
      <div className="eyebrow">02 / DIRECTORY</div>
      <h2 id="directory-title">{state.name} congressional delegation</h2>
      <p>House contact forms may limit submissions to district residents. Find your district using the <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer">official House lookup ↗</a>.</p>
      <div className="directory">
        {officials.map(o => (
          <article className="directory-card" key={o.id}>
            <strong>{o.name}</strong>
            <span>{o.chamber === 'senate' ? 'U.S. Senator' : `House · ${o.state}-${o.district}`}</span>
            <a href={o.contacts[0].url} target="_blank" rel="noopener noreferrer">Contact / official site ↗</a>
          </article>
        ))}
      </div>
    </section>
  );
}
