import {afterEach, describe, expect, it, vi} from 'vitest';
import {countGraphemes, isSafeSocialProfile, officialSocialAccounts} from './social';
import {officials} from '../data/states/oregon';
import type {SocialAccount} from '../types';

afterEach(() => vi.restoreAllMocks());
describe('social account data', () => {
  it('publishes only sourced official-office accounts with matching plain profile URLs', () => {
    for (const official of officials) {
      const accounts = official.socialAccounts ?? [];
      expect(new Set(accounts.map(a => a.id)).size).toBe(accounts.length);
      expect(officialSocialAccounts(official)).toEqual(accounts);
      for (const account of accounts) {
        expect(account.status).toBe('verified');
        expect(account.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(account.sourceUrls.length).toBeGreaterThan(0);
        for (const source of account.sourceUrls) {
          const url = new URL(source);
          expect(url.protocol).toBe('https:');
          expect(url.hostname).toMatch(/\.(house|senate)\.gov$/);
        }
      }
    }
  });
  const account: SocialAccount = {id:'test', platform:'x', handle:'RepBentz', profileUrl:'https://x.com/RepBentz', accountType:'official-office', status:'verified', lastVerified:'2026-11-09', sourceUrls:['https://bentz.house.gov/']};
  it.each(['javascript:alert(1)', 'https://x.com.evil.test/RepBentz', 'https://x.com/RepBentz?text=private', 'https://x.com/RepBentz#private', 'https://user@x.com/RepBentz', 'https://x.com/intent/tweet'])('rejects unsafe or non-profile URL %s', profileUrl => {
    expect(isSafeSocialProfile({...account, profileUrl})).toBe(false);
  });
  it('excludes personal, campaign, unknown and unverified accounts', () => {
    for (const accountType of ['personal', 'campaign', 'unknown'] as const) {
      expect(officialSocialAccounts({...officials[0], socialAccounts:[{...account, accountType}]})).toEqual([]);
    }
    expect(officialSocialAccounts({...officials[0], socialAccounts:[{...account, status:'unverified', lastVerified:null}]})).toEqual([]);
    expect(officialSocialAccounts({...officials[0], socialAccounts:undefined})).toEqual([]);
  });
  it('rejects Bluesky query strings and mismatched handles', () => {
    const bluesky: SocialAccount = {...account, platform:'bluesky', handle:'wyden.senate.gov', profileUrl:'https://bsky.app/profile/wyden.senate.gov'};
    expect(isSafeSocialProfile(bluesky)).toBe(true);
    expect(isSafeSocialProfile({...bluesky, profileUrl:bluesky.profileUrl + '?text=secret'})).toBe(false);
    expect(isSafeSocialProfile({...bluesky, handle:'someone.bsky.social'})).toBe(false);
  });
});

describe('Bluesky counting', () => {
  it.each([['',0], ['abc',3], ['e\u0301',1], ['👨‍👩‍👧‍👦',1], ['🇺🇸👍🏽',2], ['漢字',2], ['a'.repeat(301),301]])('counts graphemes in %s', (text, count) => {
    expect(countGraphemes(text)).toBe(count);
  });
  it('reports unavailable exact counting without a misleading fallback', () => {
    vi.spyOn(Intl, 'Segmenter', 'get').mockReturnValue(undefined as never);
    expect(countGraphemes('👨‍👩‍👧‍👦')).toBeNull();
  });
});
