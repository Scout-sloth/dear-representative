import {useState} from 'react';
import MultiOfficeContact from './MultiOfficeContact';
import {templateLabels} from '../lib/messages';
import type {Campaign, Legislator, State, TemplateId} from '../types';

type Props = {campaign: Campaign; officials: Legislator[]; state: State; officialId: string; onOfficialChange: (id: string) => void};

export default function MessageComposer({campaign, officials, state, officialId, onOfficialChange}: Props) {
  const [kind, setKind] = useState<TemplateId>('standard');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  return <section id="contact" className="panel" aria-labelledby="compose-title">
    <div className="section-heading">
      <div><div className="eyebrow">01 / EMAIL, FORM &amp; PHONE</div><h2 id="compose-title">Email, Form &amp; Phone</h2></div>
      <span className="pill">Private in your browser</span>
    </div>
    <div className="fields">
      <label>Congressional office
        <select value={officialId} onChange={e => onOfficialChange(e.target.value)}>
          {officials.map(o => <option key={o.id} value={o.id}>{o.name} — {o.chamber === 'senate' ? 'Senate' : `House ${o.state}-${o.district}`}</option>)}
        </select>
      </label>
      <label>Starting template
        <select value={kind} onChange={e => setKind(e.target.value as TemplateId)}>
          {(Object.keys(templateLabels) as TemplateId[]).map(k => <option value={k} key={k}>{templateLabels[k]}</option>)}
        </select>
      </label>
    </div>
    <div className="fields">
      <label>Your name (optional)<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"/></label>
      <label>City (optional)<input value={city} onChange={e => setCity(e.target.value)} placeholder={`City in ${state.name}`}/></label>
    </div>
    <MultiOfficeContact officials={officials} state={state} officialId={officialId} campaign={campaign} kind={kind} sender={{name, city}}/>
  </section>;
}
