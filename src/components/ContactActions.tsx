import {useState} from 'react';
import type {Legislator, Verification} from '../types';
import {contactLabels, formatPhone, materialRestrictions, phoneHref} from '../lib/contacts';
import {copyPhoneText} from '../lib/clipboard';

function Sources({verification}: {verification: Verification}) {
  return <>
    <span>{verification.status === 'verified' ? `Verified ${verification.lastVerified}` : 'Not verified'}</span>
    {verification.sourceUrls.map((url, i) => <a key={url} href={url} target="_blank" rel="noopener noreferrer">Source {i + 1}</a>)}
  </>;
}

export default function ContactActions({official, variant = 'directory'}: {official: Legislator; variant?: 'directory' | 'selected'}) {
  const [copyStatus, setCopyStatus] = useState('');
  const form = official.contacts.find(c => c.kind === 'contact-form');
  const phone = official.contacts.filter(c => c.kind === 'phone').find(c => c.office === 'washington-dc');
  const website = official.contacts.find(c => c.kind === 'website');
  const email = official.contacts.find(c => c.kind === 'email');
  const notices = official.contactRestrictions.filter(r =>
    [form?.id, phone?.id, email?.id].some(id => id && materialRestrictions([r], id).length > 0),
  );

  async function copyPhone() {
    if (!phone) return;
    setCopyStatus('');
    const copied = await copyPhoneText(formatPhone(phone.number));
    setCopyStatus(copied ? 'Number copied.' : 'Copy unavailable. Select and copy the displayed number, or press and hold it on your phone.');
  }

  return (
    <div className={`contact-actions contact-actions--${variant}`} role="group" aria-label={`Contact ${official.name}`}>
      {variant === 'selected' && <div className="selected-contact-heading">
        <div className="selected-contact-label">Selected representative</div>
        <h3>{official.name}</h3>
        <p>{official.chamber === 'senate' ? 'U.S. Senator' : `U.S. Representative · ${official.state}-${official.district}`}</p>
      </div>}
      {form ? <a className="contact-primary" href={form.url} target="_blank" rel="noopener noreferrer">
        Official contact form ↗{form.status !== 'verified' && ' (unverified link)'}
      </a> : <p className="hint">Contact-form URL not verified.</p>}
      {phone ? <div className="contact-phone">
        <span className="contact-location">Washington, D.C.</span>
        <div className="contact-phone-actions">
          <a className="contact-phone-link" href={phoneHref(phone.number)} aria-label={`${formatPhone(phone.number)} — Call ${official.name}'s Washington, D.C. office`}>{formatPhone(phone.number)}</a>
          <button type="button" className="button secondary" onClick={copyPhone} aria-label={`Copy ${official.name}'s Washington, D.C. phone number`}>Copy</button>
        </div>
        {phone.status !== 'verified' && <span className="hint">Phone number unverified</span>}
        <span className="hint copy-status" role="status" aria-live="polite" aria-atomic="true">{copyStatus}</span>
      </div> : <p className="hint">Washington, D.C. phone number not verified.</p>}
      {website && <a href={website.url} target="_blank" rel="noopener noreferrer">Official website ↗{website.status !== 'verified' && ' (unverified link)'}</a>}
      {email && <a href={`mailto:${email.address}`}>Direct email: {email.address}{email.status !== 'verified' && ' (unverified)'}</a>}
      {notices.map((r, i) => <p className="hint contact-notice" key={i}>{r.description}</p>)}
      {form && phone && notices.some(r => r.appliesTo.includes(form.id)) && <p className="hint">The office also publishes the phone number above. A response is not guaranteed.</p>}
      <details className="contact-details">
        <summary>Sources and contact details</summary>
        <p className="contact-sources">Officeholder: <Sources verification={official.identityVerification}/></p>
        {official.contacts.map(contact => <div key={contact.id}>
          <p className="contact-sources">{contactLabels[contact.kind]}: <Sources verification={contact}/></p>
          {contact.kind === 'contact-form' && <p className="hint">
            Official URL verification does not confirm form functionality.{' '}
            {contact.functionality.status === 'tested'
              ? `Independently tested (${contact.functionality.scope})`
              : contact.functionality.status === 'could-not-test' ? 'Functionality could not be tested' : 'Functionality not independently tested'}
            {' — '}{contact.functionality.checkedAt}. {contact.functionality.notes}
          </p>}
        </div>)}
        {!email && <p className="hint">No direct email address verified for general constituent correspondence.</p>}
        <p className="hint">Correspondence restrictions:</p>
        {official.contactRestrictions.length === 0 && <p className="hint">Policy not established; absence of a recorded restriction does not mean unrestricted access.</p>}
        {official.contactRestrictions.map((r, i) => <p className="hint" key={i}>
          {r.description} Applies to: {r.appliesTo.map(id => contactLabels[official.contacts.find(c => c.id === id)!.kind]).join(', ')}.
          {' '}{r.status === 'verified' ? `Verified ${r.lastVerified}.` : `Status: ${r.status}; not confirmed.`}
          {r.sourceUrl && <> <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">{r.status === 'verified' ? 'Restriction source' : 'Page reviewed'}</a></>}
        </p>)}
      </details>
    </div>
  );
}
