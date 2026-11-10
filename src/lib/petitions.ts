import type {Petition} from '../types';

export function signatureSnapshot(petition: Petition): number | undefined {
  const count = petition.signatures;
  if (count === undefined || !Number.isSafeInteger(count) || count < 0
    || !petition.checkedAt || !petition.signatureSourceUrl
    || !petition.signatureVerification || petition.signatureVerification === 'unverified') return undefined;
  return count;
}

// Stable across locales and input order. Unknown is never converted to zero.
export function sortPetitions(petitions: readonly Petition[]): Petition[] {
  return [...petitions].sort((a, b) => {
    const first = signatureSnapshot(a), second = signatureSnapshot(b);
    if (first !== undefined && second === undefined) return -1;
    if (first === undefined && second !== undefined) return 1;
    if (first !== undefined && second !== undefined && first !== second) return second - first;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

export const signatureSourceLabels = {
  direct: 'Direct page check',
  cached: 'Cached page evidence',
  'third-party': 'Third-party report',
  unverified: 'Unverified',
};
