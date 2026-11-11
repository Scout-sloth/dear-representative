import {useEffect, useRef, useState} from 'react';
import type {Legislator, TemplateId} from '../types';
import type {DraftAction, DraftState} from '../lib/draft';
import {templateLabels} from '../lib/messages';
import {copyText} from '../lib/clipboard';
import DraftUndo, {DraftUndoStatus} from './DraftUndo';

export default function RecipientMessage({official, kind, draft, onAction, onReset}: {
  official: Legislator; kind: TemplateId;
  draft: DraftState; onAction: (action: DraftAction) => void; onReset: () => void;
}) {
  const editor = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState('');
  const revision = useRef(0);
  useEffect(() => {setStatus(''); revision.current++; return () => {revision.current++;};}, [draft.text]);
  async function copy() {
    const current = ++revision.current;
    setStatus('');
    const copied = await copyText(draft.text);
    if (current !== revision.current) return;
    setStatus(copied ? `Message copied for ${official.name}.` : 'Copy unavailable. Select and copy this message manually.');
  }
  return <div className="recipient-message">
    <label>Message for {official.name}
      <textarea ref={editor} rows={8} value={draft.text} onChange={e => onAction({type:'edit', text:e.target.value})} aria-describedby={`template-${official.id}`}/>
    </label>
    <p id={`template-${official.id}`} className="hint">{draft.origin.template !== kind
      ? `Selected: ${templateLabels[kind]}. Existing draft retained; reset to apply.`
      : `${official.chamber === 'house' ? 'House' : 'Senate'} · ${templateLabels[kind]} template`}</p>
    <div className="actions">
      <button type="button" onClick={() => copy()} disabled={!draft.text.length}>Copy message</button>
      <button type="button" className="button secondary" onClick={onReset}>Reset to selected template</button>
      <DraftUndo available={draft.undo !== null} label="letter" onUndo={() => {onAction({type:'undo'}); editor.current?.focus();}}/>
    </div>
    <DraftUndoStatus available={draft.undo !== null} label="letter"/>
    <p className="hint" role="status" aria-live="polite" aria-atomic="true">{status}</p>
  </div>;
}
