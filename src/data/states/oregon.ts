import type {Legislator, State} from '../../types';
import {officials as generatedOfficials, generatedAt} from './oregon.generated';

export const oregon: State = {code: 'OR', name: 'Oregon'};

/**
 * Oregon congressional delegation imported from unitedstates/congress-legislators.
 * Refresh with `npm run generate:legislators`. Records are generation-verified against
 * that dataset (not hand-tested form submissions). See each legislator's `notes`.
 */
export const officials: Legislator[] = generatedOfficials;

if (officials.length === 0) {
  throw new Error('Oregon officials list is empty. Run `npm run generate:legislators` and fix import errors before building.');
}

export {generatedAt};

/** Look up a generated Oregon official by bioguide id or case-insensitive name substring. */
export function oregonOfficial(idOrName: string): Legislator {
  const needle = idOrName.trim().toLowerCase();
  const found = officials.find(o =>
    o.id.toLowerCase() === needle
    || o.name.toLowerCase() === needle
    || o.name.toLowerCase().includes(needle)
    || o.salutation.toLowerCase().includes(needle));
  if (!found) throw new Error(`No Oregon official matching ${JSON.stringify(idOrName)}`);
  return found;
}
