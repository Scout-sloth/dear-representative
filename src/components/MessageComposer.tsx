import {useEffect, useState} from 'react';
import ContactActions from './ContactActions';
import {renderBody, renderCompleteMessage, templateLabels} from '../lib/messages';
import type {Campaign, Legislator, State, TemplateId} from '../types';

type Props = {
  campaign: Campaign;
  officials: Legislator[];
  state: State;
  initialOfficialId: string;
};

export default function MessageComposer({campaign, officials, state, initialOfficialId}: Props) {
  const [officialId, setOfficialId] = useState(initialOfficialId);
  const [kind, setKind] = useState<TemplateId>('standard');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [copied, setCopied] = useState(false);
  const official = officials.find(o => o.id === officialId)!;

  useEffect(() => {
    setMessage(renderBody(campaign, official, state, kind));
    setCopied(false);
  }, [campaign, official, state, kind]);

  const full = renderCompleteMessage(campaign, official, state, message, {name, city});

  function reset() {
    setMessage(renderBody(campaign, official, state, kind));
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
    } catch {
      setCopied(false);
      alert('Clipboard access unavailable. Select and copy the preview text instead.');
    }
  }

  return (
    <section className="panel" aria-labelledby="compose-title">
      <div className="section-heading">
        <div>
          <div className="eyebrow">01 / WRITE</div>
          <h2 id="compose-title">Message composer</h2>
        </div>
        <span className="pill">Private in your browser</span>
      </div>
      <div className="fields">
        <label>
          Congressional office
          <select value={officialId} onChange={e => setOfficialId(e.target.value)}>
            {officials.map(o => (
              <option key={o.id} value={o.id}>
                {o.name} — {o.chamber === 'senate' ? 'Senate' : `House ${o.state}-${o.district}`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Starting template
          <select value={kind} onChange={e => setKind(e.target.value as TemplateId)}>
            {(Object.keys(templateLabels) as TemplateId[]).map(k => (
              <option value={k} key={k}>{templateLabels[k]}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="hint">Changing the official or template resets the editor to a new starting draft. Edit freely before copying.</p>
      <label className="wide">
        Your message
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={13}/>
      </label>
      <div className="fields">
        <label>
          Your name (optional)
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/>
        </label>
        <label>
          City (optional)
          <input value={city} onChange={e => setCity(e.target.value)} placeholder={`City in ${state.name}`}/>
        </label>
      </div>
      <div className="preview">
        <div className="preview-title">Copy-ready preview <span>{full.length.toLocaleString()} characters</span></div>
        <pre>{full}</pre>
      </div>
      <div className="actions">
        <button onClick={copy}>{copied ? 'Copied!' : 'Copy complete message'}</button>
        <button className="button secondary" onClick={reset}>Reset to Original Template</button>
      </div>
      <ContactActions key={official.id} official={official} variant="selected"/>
    </section>
  );
}
