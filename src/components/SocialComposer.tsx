import {useRef, useState} from 'react';
import type {Campaign, Legislator, State} from '../types';
import {renderBody} from '../lib/messages';
import {copyText} from '../lib/clipboard';
import {countGraphemes, socialPlatforms, type ComposerPlatform} from '../lib/social';
import blueskyIcon from '../assets/social/dear-representative-social-icons/bluesky.svg?raw';
import twitterIcon from '../assets/social/dear-representative-social-icons/twitter.svg?raw';

export default function SocialComposer({campaign, official, state}: {campaign: Campaign; official: Legislator; state: State}) {
  const [draft, setDraft] = useState('');
  const [platform, setPlatform] = useState<ComposerPlatform>('bluesky');
  const [status, setStatus] = useState('');
  const revision = useRef(0);
  const count = platform === 'bluesky' ? countGraphemes(draft) : null;

  function updateDraft(text: string) {
    revision.current++;
    setDraft(text);
    setStatus('');
  }
  function importTemplate() {
    if (draft.length && !window.confirm('Replace your social draft with the existing short template?')) return;
    updateDraft(renderBody(campaign, official, state, 'short'));
  }
  function reset() {
    if (draft.length && !window.confirm('Clear your social draft?')) return;
    updateDraft('');
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
      <textarea rows={6} value={draft} onChange={e => updateDraft(e.target.value)} aria-describedby="social-recipient social-limit social-open"/>
    </label>
    <p className="hint" id="social-limit">{platform === 'bluesky'
      ? count === null ? 'Bluesky allows 300 grapheme clusters. Exact counting is unavailable in this browser; check the final length on Bluesky.'
        : `${count} / 300 grapheme clusters${count > 300 ? ' — over the Bluesky limit; shorten your draft before posting.' : '.'}`
      : 'Twitter has a standard limit of 280 weighted characters. Emoji, some scripts, and links count differently. Check the final length on Twitter; no exact Twitter counter is provided.'}</p>
    <div className="actions">
      <button type="button" className="button secondary" onClick={importTemplate}>Use existing short template</button>
      <button type="button" className="button secondary" onClick={reset}>Reset social draft</button>
    </div>
    <p className="hint">Importing uses the existing letter’s short body, which may need shortening. No sender details or social handles are added.</p>
    <div className="actions">
      <button type="button" disabled={!draft.length} onClick={copy}>Copy social draft</button>
      <a href={socialPlatforms[platform].url} target="_blank" rel="noopener noreferrer">Open {socialPlatforms[platform].label} ↗</a>
    </div>
    <p className="hint" id="social-open">Copy places text on your device clipboard. Opening a platform does not send your draft. Paste, review, and submit there yourself.</p>
    <p className="hint" role="status" aria-live="polite">{status}</p>
  </details>;
}
