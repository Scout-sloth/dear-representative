import {useReducer, useRef, useState} from 'react';
import {createDraft, draftReducer, type DraftOrigin} from '../lib/draft';
import DraftUndo, {DraftUndoStatus} from './DraftUndo';
import type {Campaign, Legislator, State} from '../types';
import {renderBody} from '../lib/messages';
import {copyText} from '../lib/clipboard';
import {countGraphemes, socialPlatforms, type ComposerPlatform} from '../lib/social';
import blueskyIcon from '../assets/social/dear-representative-social-icons/bluesky.svg?raw';
import twitterIcon from '../assets/social/dear-representative-social-icons/twitter.svg?raw';

export default function SocialComposer({campaign, official, state}: {campaign: Campaign; official: Legislator; state: State}) {
  const [platform, setPlatform] = useState<ComposerPlatform>('bluesky');
  const origin: DraftOrigin = {campaignId: campaign.id, officialId: official.id, chamber: official.chamber, stateCode: state.code, template: 'empty', platform};
  const [draftState, dispatch] = useReducer(draftReducer, undefined, () => createDraft('', origin));
  const draft = draftState.text;
  const editor = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState('');
  const revision = useRef(0);
  const count = platform === 'bluesky' ? countGraphemes(draft) : null;

  function updateDraft(text: string) {
    revision.current++;
    dispatch({type: 'edit', text});
    setStatus('');
  }
  function importTemplate() {
    revision.current++;
    setStatus('');
    dispatch({type: 'replace', text: renderBody(campaign, official, state, 'short'), origin: {...origin, template: 'short'}});
  }
  function reset() {
    revision.current++;
    setStatus('');
    dispatch({type: 'replace', text: '', origin});
  }
  function undo() {
    revision.current++;
    setStatus('');
    dispatch({type: 'undo'});
    editor.current?.focus();
  }
  async function copy() {
    const copiedRevision = revision.current;
    const copied = await copyText(draft);
    if (revision.current === copiedRevision) setStatus(copied ? 'Social draft copied.' : 'Copy unavailable. Select and copy the social draft manually.');
  }

  return <details className="social-composer">
    <summary>
      <span className="social-disclosure-arrow" aria-hidden="true">›</span>
      <span className="social-heading-content">
        <span>Write a social post</span>
        {/* Trusted local artwork only; inline SVG preserves currentColor and original paths. */}
        <span className="social-heading-icons" aria-hidden="true">
          <span dangerouslySetInnerHTML={{__html: blueskyIcon}}/>
          <span dangerouslySetInnerHTML={{__html: twitterIcon}}/>
        </span>
      </span>
    </summary>
    <p className="hint">Social posts may be public. Social profiles are separate from congressional correspondence channels; a response is not guaranteed. External platforms have their own privacy practices.</p>
    <p className="hint" id="social-recipient">Selected office: {official.name}. Your social draft is retained when switching officials or platforms. Review recipient references and mentions before posting.</p>
    <label>Social platform
      <select value={platform} onChange={e => {setPlatform(e.target.value as ComposerPlatform); setStatus('');}}>
        {Object.entries(socialPlatforms).map(([id, p]) => <option key={id} value={id}>{p.label}</option>)}
      </select>
    </label>
    <label className="wide">Your social draft
      <textarea ref={editor} rows={6} value={draft} onChange={e => updateDraft(e.target.value)} aria-describedby="social-recipient social-limit social-open"/>
    </label>
    <p className="hint" id="social-limit">{platform === 'bluesky'
      ? count === null ? 'Bluesky allows 300 grapheme clusters. Exact counting is unavailable in this browser; check the final length on Bluesky.'
        : `${count} / 300 grapheme clusters${count > 300 ? ' — over the Bluesky limit; shorten your draft before posting.' : '.'}`
      : 'Twitter has a standard limit of 280 weighted characters. Emoji, some scripts, and links count differently. Check the final length on Twitter; no exact Twitter counter is provided.'}</p>
    <p className="hint">Importing uses the existing letter’s short body, which may need shortening. No sender details or social handles are added.</p>
    <div className="actions">
      <button type="button" disabled={!draft.length} onClick={copy}>Copy social draft</button>
      <button type="button" className="button secondary" onClick={reset}>Reset social draft</button>
      <DraftUndo available={draftState.undo !== null} label="social" onUndo={undo}/>
      <button type="button" className="button secondary" onClick={importTemplate}>Use existing short template</button>
      <a href={socialPlatforms[platform].url} target="_blank" rel="noopener noreferrer">Open {socialPlatforms[platform].label} ↗</a>
    </div>
    <DraftUndoStatus available={draftState.undo !== null} label="social"/>
    <p className="hint" id="social-open">Copy places text on your device clipboard. Opening a platform does not send your draft. Paste, review, and submit there yourself.</p>
    <p className="hint" role="status" aria-live="polite">{status}</p>
  </details>;
}
