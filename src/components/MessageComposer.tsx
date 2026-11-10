import {useReducer, useRef, useState} from 'react';
import {createDraft, draftReducer, type DraftOrigin} from '../lib/draft';
import DraftUndo, {DraftUndoStatus} from './DraftUndo';
import ContactActions from './ContactActions';
import SocialComposer from './SocialComposer';
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
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const official = officials.find(o => o.id === officialId)!;

  const origin: DraftOrigin = {campaignId: campaign.id, officialId, chamber: official.chamber, stateCode: state.code, template: kind};
  const [draft, dispatch] = useReducer(draftReducer, undefined, () => createDraft(renderBody(campaign, official, state, kind), origin));
  const message = draft.text;

  const full = renderCompleteMessage(campaign, official, state, message, {name, city});

  function reset() {
    const selectedTemplate = renderBody(campaign, official, state, kind);
    if (selectedTemplate === draft.text) return;
    dispatch({type: 'replace', text: selectedTemplate, origin});
    setCopiedText(null);
  }
  function undo() {
    dispatch({type: 'undo'});
    setCopiedText(null);
    editor.current?.focus();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(full);
      setCopiedText(full);
    } catch {
      setCopiedText(null);
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
      <p className="hint" id="letter-selection">Changing the official or template retains your draft. Use Reset to selected template to replace it. Review recipient references before copying; the preview subject follows the selected official.</p>
      {(draft.origin.officialId !== officialId || draft.origin.template !== kind || draft.origin.campaignId !== campaign.id) && <p className="hint" aria-live="polite">Selection changed; existing letter draft retained. Review recipient references.</p>}
      <label className="wide">
        Your message
        <textarea ref={editor} value={message} onChange={e => {dispatch({type: 'edit', text: e.target.value}); setCopiedText(null);}} rows={13} aria-describedby="letter-selection"/>
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
        <button onClick={copy}>{copiedText === full ? 'Copied!' : 'Copy complete message'}</button>
        <button className="button secondary" onClick={reset}>Reset to selected template</button>
        <DraftUndo available={draft.undo !== null} label="letter" onUndo={undo}/>
      </div>
      <DraftUndoStatus available={draft.undo !== null} label="letter"/>
      <ContactActions key={official.id} official={official} variant="selected"/>
      <SocialComposer campaign={campaign} official={official} state={state}/>
    </section>
  );
}
