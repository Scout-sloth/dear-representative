import {useEffect, useRef, useState} from 'react';
import type {Campaign, Legislator, Sender, State, TemplateId} from '../types';
import type {DraftAction} from '../lib/draft';
import {createPersonalizedDraft, personalizeDraft, replacePersonalizedDraft, actOnPersonalizedDraft, type PersonalizedDraft} from '../lib/personalizedDraft';
import {renderBody} from '../lib/messages';
import RecipientMessage from './RecipientMessage';
import ContactActions from './ContactActions';

export default function MultiOfficeContact({officials, state, officialId, campaign, kind, sender}: {officials: Legislator[]; state: State; officialId: string; campaign: Campaign; kind: TemplateId; sender: Sender}) {
  const delegation = officials.filter(o => o.state === state.code);
  const [choices, setChoices] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, PersonalizedDraft>>({});
  const [openStatus, setOpenStatus] = useState('');
  const track = useRef<HTMLUListElement>(null);
  const [scroll, setScroll] = useState({previous:false, next:false});
  const house = delegation.find(o => o.id === officialId && o.chamber === 'house');
  const defaults = [...(house ? [house] : []), ...delegation.filter(o => o.chamber === 'senate')];
  const ordered = [...defaults, ...delegation.filter(o => !defaults.some(d => d.id === o.id))];
  const recipients = ordered.filter(o => choices[o.id] ?? defaults.some(d => d.id === o.id));
  const recipientKey = recipients.map(o => o.id).join(',');
  const forms = recipients.flatMap(o => o.contacts.filter(c => c.kind === 'contact-form' && c.status === 'verified').slice(0, 1));

  function initialDraft(o: Legislator) {
    return createPersonalizedDraft(renderBody(campaign, o, state, kind), {campaignId:campaign.id, officialId:o.id, chamber:o.chamber, stateCode:state.code, template:kind}, sender, state.name);
  }
  // Store first-visit drafts before cards can unmount; selection never discards them.
  useEffect(() => {
    setDrafts(current => {
      const missing = recipients.filter(o => !current[o.id]);
      return missing.length ? {...current, ...Object.fromEntries(missing.map(o => [o.id, initialDraft(o)]))} : current;
    });
  }, [recipientKey, campaign, kind, state]);
  useEffect(() => {
    setDrafts(current => Object.fromEntries(Object.entries(current).map(([id, draft]) => [id, personalizeDraft(draft, sender, state.name)])));
  }, [sender.name, sender.city, state.name]);
  function act(o: Legislator, action: DraftAction) {
    setDrafts(current => ({...current, [o.id]:actOnPersonalizedDraft(current[o.id] ?? initialDraft(o), action)}));
  }
  function reset(o: Legislator) {
    const next = initialDraft(o);
    setDrafts(current => ({...current, [o.id]:replacePersonalizedDraft(current[o.id] ?? next, next)}));
  }
  function resetAll() {
    setDrafts(current => {
      const updated = {...current};
      for (const o of recipients) {
        const next = initialDraft(o);
        updated[o.id] = replacePersonalizedDraft(current[o.id] ?? next, next);
      }
      return updated;
    });
  }
  useEffect(() => {
    setOpenStatus('');
    const element = track.current;
    if (!element) return;
    element.scrollLeft = 0;
    const measure = () => setScroll({previous:element.scrollLeft > 1, next:element.scrollLeft + element.clientWidth < element.scrollWidth - 1});
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(element);
    element.addEventListener('scroll', measure);
    window.addEventListener('resize', measure);
    return () => {observer?.disconnect(); element.removeEventListener('scroll', measure); window.removeEventListener('resize', measure);};
  }, [recipientKey]);

  function move(direction: number) {
    const element = track.current;
    if (element) element.scrollBy({left:direction * ((element.firstElementChild?.getBoundingClientRect().width ?? element.clientWidth) + 12), behavior:'auto'});
  }
  function openForms() {
    // Keep every attempt in this direct click handler. noopener/noreferrer can
    // return null even on success, so never interpret a null result as delivery
    // or a definite popup-blocker diagnosis. Do not retry or bypass the blocker.
    let unconfirmed = 0;
    for (const form of forms) {
      if (form.kind !== 'contact-form') continue;
      try {if (!window.open(form.url, '_blank', 'noopener,noreferrer')) unconfirmed++;}
      catch {unconfirmed++;}
    }
    setOpenStatus(`Attempted to open ${forms.length} forms. ${unconfirmed ? `${unconfirmed} tab openings could not be confirmed; browsers may block multiple tabs. Use individual Open official form links for any missing tabs.` : 'Check your tabs and use individual Open official form links for any missing forms.'} Nothing was submitted or marked complete.`);
  }

  return <div className="multi-office" role="group" aria-labelledby="multi-office-title">
    <h3 id="multi-office-title">Contact your representatives</h3>
    <p className="hint">Congressional contact forms generally request your address and ZIP code. Each office has its own requirements, and you'll submit your message separately.</p>
    <details className="office-choices">
      <summary>Choose additional offices or deselect recipients</summary>
      <p className="hint">The House card follows Congressional office above; choosing a senator does not assume a House district. Other House districts represent different constituencies. Selecting an office does not establish residency or eligibility.</p>
      <fieldset className="office-selection">
        <legend>Offices to contact</legend>
        <div className="office-options">
          {ordered.map(o => <label className="check-label" key={o.id}>
            <input type="checkbox" checked={recipients.some(r => r.id === o.id)} onChange={e => setChoices(current => ({...current, [o.id]:e.target.checked}))}/>
            {o.name} — {o.chamber === 'senate' ? 'Senate' : `House ${o.state}-${o.district}`}
          </label>)}
        </div>
      </fieldset>
      <button type="button" className="button secondary" onClick={() => setChoices(Object.fromEntries(delegation.map(o => [o.id, true])))}>Select all {state.name} offices</button>
    </details>
    <div className="actions">
      <button type="button" className="button secondary" onClick={resetAll} disabled={!recipients.length}>Reset all selected messages</button>
      <button type="button" className="button secondary" onClick={openForms} disabled={!forms.length}>Open all {forms.length} forms</button>
    </div>
    <p className="hint">Browsers may block multiple tabs. Individual form links remain available below.</p>
    <p className="hint" role="status" aria-live="polite" aria-atomic="true">{openStatus}</p>
    <p className="hint" id="completion-help">“Completed by me” is a manual reminder, not a delivery confirmation. Progress stays in memory until this page is reloaded or closed.</p>
    <div className="card-navigation" role="group" aria-label="Contact card navigation">
      <button type="button" className="button secondary" disabled={!scroll.previous} onClick={() => move(-1)} aria-controls="contact-cards">← Previous offices</button>
      <button type="button" className="button secondary" disabled={!scroll.next} onClick={() => move(1)} aria-controls="contact-cards">Next offices →</button>
    </div>
    {recipients.length === 0 && <p className="hint">No offices selected. Choose recipients above to see contact actions.</p>}
    <ul ref={track} id="contact-cards" className="contact-cards" aria-label="Selected offices" tabIndex={0} onKeyDown={e => {
      if (e.target !== e.currentTarget) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1);}
      if (e.key === 'Home' || e.key === 'End') {e.preventDefault(); e.currentTarget.scrollTo({left:e.key === 'Home' ? 0 : e.currentTarget.scrollWidth, behavior:'auto'});}
    }}>
      {recipients.map(o => <li className="contact-card" key={o.id}>
        <ContactActions official={o} variant="compact">
          <RecipientMessage official={o} kind={kind} draft={drafts[o.id] ?? initialDraft(o)} onAction={action => act(o, action)} onReset={() => reset(o)}/>
        </ContactActions>
        <label className="check-label"><input type="checkbox" checked={completed[o.id] ?? false} onChange={e => setCompleted(current => ({...current, [o.id]:e.target.checked}))} aria-label={`Completed by me: ${o.name}`} aria-describedby="completion-help"/>Completed by me</label>
      </li>)}
    </ul>
  </div>;
}
