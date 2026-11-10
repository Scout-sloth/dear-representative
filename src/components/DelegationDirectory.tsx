import type {Legislator, State} from '../types';
import ContactActions from './ContactActions';

export default function DelegationDirectory({officials, state}: {officials: Legislator[]; state: State}) {
  return (
    <section id="directory" className="panel" aria-labelledby="directory-title">
      <div className="eyebrow">04 / DIRECTORY</div>
      <h2 id="directory-title">Directory</h2>
      <p>{state.name} congressional delegation</p>
      <p>House contact forms may limit submissions to district residents. Find your district using the <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer">official House lookup ↗</a>.</p>
      <div className="directory">
        {officials.map(o => (
          <article className="directory-card" key={o.id}>
            <strong>{o.name}</strong>
            <span>{o.chamber === 'senate' ? 'U.S. Senator' : `House · ${o.state}-${o.district}`}</span>
            <ContactActions official={o}/>
          </article>
        ))}
      </div>
    </section>
  );
}
