import type {Legislator, SocialAccount} from '../types';

export const socialPlatforms = {
  bluesky: {label: 'Bluesky', url: 'https://bsky.app/'},
  x: {label: 'Twitter', url: 'https://x.com/'},
} as const;
export type ComposerPlatform = keyof typeof socialPlatforms;

// Only plain profile URLs are permitted, never intents, queries, or credentials.
export function isSafeSocialProfile(account: SocialAccount): boolean {
  const handle = account.handle;
  if (account.platform === 'x') {
    return /^[A-Za-z0-9_]{1,15}$/.test(handle) && account.profileUrl === `https://x.com/${handle}`;
  }
  if (account.platform === 'bluesky') {
    return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z][a-z0-9-]*$/i.test(handle)
      && account.profileUrl === `https://bsky.app/profile/${handle}`;
  }
  return false; // Instagram support is deferred.
}

export function officialSocialAccounts(official: Legislator): SocialAccount[] {
  return (official.socialAccounts ?? []).filter(account =>
    account.status === 'verified' && account.accountType === 'official-office' && isSafeSocialProfile(account));
}

// Structural typing keeps the ES2022 build compatible with browsers lacking Segmenter.
type SegmenterConstructor = new (locale?: string, options?: {granularity: 'grapheme'}) => {
  segment(text: string): Iterable<unknown>;
};
export function countGraphemes(text: string): number | null {
  const Segmenter = (Intl as typeof Intl & {Segmenter?: SegmenterConstructor}).Segmenter;
  if (!Segmenter) return null;
  return Array.from(new Segmenter(undefined, {granularity: 'grapheme'}).segment(text)).length;
}
