import {describe, expect, it} from 'vitest';
import {signatureSnapshot, sortPetitions} from './petitions';
import {petitions} from '../campaigns/congressional-leadership/petitions';
import type {Petition} from '../types';

function entry(id: string, signatures?: number): Petition {
  return {id, title:id, url:`https://www.change.org/p/${id}`, platform:'Change.org', scope:'both', description:'Test',
    signatures, checkedAt:'2026-11-10', signatureSourceUrl:'https://www.change.org/p/test', signatureVerification:'direct'};
}
describe('petition ordering', () => {
  it('sorts descending with unknown last, keeps zero distinct, and leaves the input untouched', () => {
    const input = [entry('unknown'), entry('low', 5), entry('zero', 0), entry('high', 125430)];
    expect(sortPetitions(input).map(p=>p.id)).toEqual(['high','low','zero','unknown']);
    expect(input.map(p=>p.id)).toEqual(['unknown','low','zero','high']);
  });
  it('breaks ties and orders unknown counts by stable ID regardless of input order', () => {
    const input = [entry('z'), entry('b', 10), entry('a', 10), entry('y')];
    expect(sortPetitions(input).map(p=>p.id)).toEqual(['a','b','y','z']);
    expect(sortPetitions([...input].reverse())).toEqual(sortPetitions(input));
  });
  it('does not present invalid counts or incomplete/unverified evidence as known', () => {
    for (const value of [-1, 1.5, NaN, Infinity]) expect(signatureSnapshot(entry('bad', value))).toBeUndefined();
    for (const patch of [{checkedAt:undefined}, {signatureSourceUrl:undefined}, {signatureVerification:undefined}, {signatureVerification:'unverified' as const}]) {
      expect(signatureSnapshot({...entry('bad', 100), ...patch})).toBeUndefined();
    }
    for (const kind of ['direct','cached','third-party'] as const) expect(signatureSnapshot({...entry('ok', 10), signatureVerification:kind})).toBe(10);
  });
});

it('retains all eight original slugs and both additions with complete direct-check metadata', () => {
  const slugs = ['remove-chuck-schumer-and-hakeem-jeffries-from-leadership-roles','replace-chuck-schumer-as-senate-majority-leader','remove-chuck-schumer-for-a-younger-leader','house-democrats-choose-a-new-speaker','oppose-hakeem-jeffries-for-speaker-of-the-house','dems-must-fire-jeffries-and-schumer','replace-schumer-and-jefferies-as-dem-leadership','oppose-hakeem-jeffries-and-chuck-schumer-as-leaders','senate-democrats-choose-a-new-majority-leader','stop-chuck-schumer-from-becoming-senate-majority-leader'];
  expect(petitions).toHaveLength(10);
  expect(new Set(petitions.map(p=>p.id)).size).toBe(10);
  expect(petitions.map(p=>new URL(p.url).pathname)).toEqual(slugs.map(s=>`/p/${s}`));
  for (const p of petitions) {
    expect(p.title.length).toBeGreaterThan(0);
    expect(p.organizer).toBeTruthy();
    expect(signatureSnapshot(p)).toBe(p.signatures);
    expect(p.checkedAt).toBe('2026-11-10');
    expect(p.signatureVerification).toBe('direct');
    expect(p.signatureSourceUrl).toBe(p.url);
    expect(p.verification).toEqual({status:'verified',sourceUrls:[p.url],lastVerified:'2026-11-10'});
  }
});
