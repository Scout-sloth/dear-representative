import {describe, expect, it} from 'vitest';
import {formatPhone, materialRestrictions, phoneHref} from './contacts';
import type {ContactRestriction} from '../types';

describe('phone formatting', () => {
  it('formats canonical numbers and preserves all digits in calling links', () => {
    expect(formatPhone('+12022250855')).toBe('(202) 225-0855');
    expect(phoneHref('+12022250855')).toBe('tel:+12022250855');
  });
  it.each(['2022250855', '+1202225085', '+10002250855', '+12021250855', 'javascript:alert(1)'])('rejects malformed number %s', number => {
    expect(() => formatPhone(number)).toThrow();
    expect(() => phoneHref(number)).toThrow();
  });
});

describe('restriction relevance', () => {
  const base: ContactRestriction = {type:'district-residency', effect:'response-policy', appliesTo:['form'], description:'Example policy', status:'verified', sourceUrl:'https://example.house.gov/contact', lastVerified:'2026-11-08'};
  it('keeps response policies, verification steps, and blocks distinct but relevant', () => {
    for (const effect of ['response-policy','verification-step','submission-block'] as const) {
      const restriction = {...base, effect};
      expect(materialRestrictions([restriction], 'form')).toEqual([restriction]);
      expect(materialRestrictions([restriction], 'phone')).toEqual([]);
    }
  });
  it('does not promote field requirements, unverified claims or unknown policies', () => {
    expect(materialRestrictions([
      {...base, effect:'required-information'},
      {...base, status:'unverified', lastVerified:null},
      {...base, status:'unknown', effect:'unknown', lastVerified:null},
    ], 'form')).toEqual([]);
  });
});
