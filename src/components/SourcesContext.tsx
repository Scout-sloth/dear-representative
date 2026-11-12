import type {CampaignResearch} from '../types/research';

export default function SourcesContext({research}: {research: CampaignResearch}) {
  return <section id="sources" className="panel" aria-labelledby="sources-title">
    <div className="eyebrow">05 / SOURCES &amp; CONTEXT</div>
    <h2 id="sources-title">Sources &amp; Context</h2>
    <p className="hint">Evidence and research notes for this campaign. Expand a topic to review sources, dates, and limits; unfinished research is not a factual conclusion.</p>
    {research.topics.map(topic => <details className="research-topic" key={topic.id}>
      <summary>{topic.title}{topic.status === 'research-in-progress' && <span className="research-status"> — Research in progress</span>}</summary>
      <p>{topic.summary}</p>
      {topic.limitations && <p className="hint">{topic.limitations}</p>}
      {topic.entries.map(entry => <article className="research-entry" key={entry.id} aria-labelledby={`research-${entry.id}`}>
        <h3 id={`research-${entry.id}`}>{entry.title}</h3>
        <p className="hint">Subjects: {entry.subjects.join(', ')}</p>
        <p>{entry.summary}</p>
        {entry.limitations && <p className="hint">{entry.limitations}</p>}
        <ul className="research-sources">
          {entry.sources.map(source => <li key={source.id}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a>
            <p className="hint">{source.publisher} · {source.kind === 'primary' ? 'Primary source' : 'Secondary source'}<br/>
              {source.date ? <>{source.date.label}: <time dateTime={source.date.value}>{source.date.value}</time>. </> : 'Publication/event date not confirmed. '}
              {source.status === 'verified' ? <>Last verified: <time dateTime={source.lastVerified}>{source.lastVerified}</time>.</> : <>Pending verification.{source.lastChecked && <> Last checked: <time dateTime={source.lastChecked}>{source.lastChecked}</time>.</>}</>}
            </p>
            {source.notes && <p className="hint">{source.notes}</p>}
          </li>)}
        </ul>
      </article>)}
    </details>)}
    <details className="research-topic">
      <summary>How we evaluate evidence</summary>
      <dl>{research.methodology.map(item => <div key={item.id}><dt>{item.title}</dt><dd>{item.description}</dd></div>)}</dl>
    </details>
  </section>;
}
