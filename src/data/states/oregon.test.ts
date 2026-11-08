import {describe, expect, it} from 'vitest';
import {officials} from './oregon';
import {formatPhone} from '../../lib/contacts';

function expectOfficialUrl(value: string) {
  const url = new URL(value);
  expect(url.protocol).toBe('https:');
  expect(url.username + url.password).toBe('');
  expect(url.hostname).toMatch(/(^|\.)(house|senate)\.gov$/);
}

function expectDate(value: string | null) {
  expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10)).toBe(value);
  expect(value! <= new Date().toISOString().slice(0, 10)).toBe(true);
}

describe('Oregon contact data', () => {
  it('includes two senators and all six House districts, with independent identity sources', () => {
    expect(officials).toHaveLength(8);
    expect(new Set(officials.map(o => o.id)).size).toBe(8);
    expect(officials.filter(o => o.chamber === 'senate')).toHaveLength(2);
    expect(officials.filter(o => o.chamber === 'house').map(o => o.district).sort()).toEqual([1,2,3,4,5,6]);
    for (const official of officials) {
      expect(official.state).toBe('OR');
      expect(official.name).toBeTruthy();
      expect(official.identityVerification.status).toBe('verified');
      expect(official.identityVerification.sourceUrls.length).toBeGreaterThan(0);
      official.identityVerification.sourceUrls.forEach(expectOfficialUrl);
      expectDate(official.identityVerification.lastVerified);
    }
  });

  it('has separately verified form, website and D.C. phone records for every official', () => {
    for (const official of officials) {
      expect(new Set(official.contacts.map(c => c.id)).size).toBe(official.contacts.length);
      expect(official.contacts.map(c => c.kind).sort()).toEqual(['contact-form','phone','website']);
      for (const contact of official.contacts) {
        expect(contact.status).toBe('verified');
        expectDate(contact.lastVerified);
        expect(contact.sourceUrls.length).toBeGreaterThan(0);
        contact.sourceUrls.forEach(expectOfficialUrl);
        if (contact.kind === 'contact-form' || contact.kind === 'website') expectOfficialUrl(contact.url);
        if (contact.kind === 'website') expect(contact.url).toBe(official.websiteUrl);
        if (contact.kind === 'phone') {
          expect(contact.office).toBe('washington-dc');
          expect(contact.number).toMatch(/^\+1202\d{7}$/);
          expect(formatPhone(contact.number)).toMatch(/^\(202\) \d{3}-\d{4}$/);
        }
        if (contact.kind === 'contact-form') {
          expect(['not-tested', 'could-not-test']).toContain(contact.functionality.status);
          expectDate(contact.functionality.checkedAt);
          expect(contact.functionality.notes).toBeTruthy();
        }
      }
    }
  });

  it('records evidence for restrictions without turning unknown policies into verified claims', () => {
    for (const official of officials) {
      expect(official.contactRestrictions.length).toBeGreaterThan(0);
      for (const restriction of official.contactRestrictions) {
        expect(restriction.description).toBeTruthy();
        expect(restriction.appliesTo.length).toBeGreaterThan(0);
        restriction.appliesTo.forEach(id => expect(official.contacts.some(c => c.id === id)).toBe(true));
        if (restriction.status === 'verified') {
          expectOfficialUrl(restriction.sourceUrl);
          expectDate(restriction.lastVerified);
          expect(restriction.effect).not.toBe('unknown');
        } else expect(restriction.lastVerified).toBeNull();
      }
    }
    for (const id of ['bynum','salinas']) {
      expect(officials.find(o => o.id === id)!.contactRestrictions).toContainEqual(expect.objectContaining({
        type:'address-verification', effect:'verification-step', status:'verified', appliesTo:['form'],
      }));
    }
    expect(officials.flatMap(o => o.contactRestrictions).some(r => r.effect === 'submission-block')).toBe(false);
  });
});
