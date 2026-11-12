/**
 * Build-time import of current legislators from unitedstates/congress-legislators.
 *
 * Downloads documented public JSON endpoints, filters to one state (default OR),
 * maps into the app's Legislator shape, and writes a checked-in TypeScript module.
 * No visitor/browser network fetch — run at build/dev/CI time only.
 *
 * Usage:
 *   npm run generate:legislators
 *   npm run generate:legislators -- --state=WA
 *   node scripts/generate-oregon-legislators.mjs --state=OR --out=src/data/states/oregon.generated.ts
 *
 * Expanding beyond Oregon: pass --state=XX (postal code). Add a thin state wrapper
 * (see oregon.ts) and register it in src/data/states/index.ts.
 */

import {writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

/** Documented unitedstates.github.io JSON endpoints (pin these URLs). */
export const SOURCE_URLS = Object.freeze({
  legislatorsCurrent: 'https://unitedstates.github.io/congress-legislators/legislators-current.json',
  socialMedia: 'https://unitedstates.github.io/congress-legislators/legislators-social-media.json',
  districtOffices: 'https://unitedstates.github.io/congress-legislators/legislators-district-offices.json',
});

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia',
};

function parseArgs(argv) {
  const args = {state: 'OR', out: null};
  for (const arg of argv) {
    if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).toUpperCase();
    else if (arg.startsWith('--out=')) args.out = arg.slice('--out='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function fail(message) {
  console.error(`generate-legislators: ${message}`);
  process.exit(1);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {Accept: 'application/json', 'User-Agent': 'dear-representative-generate-legislators/1.0'},
  });
  if (!response.ok) fail(`Failed to download ${url} (${response.status} ${response.statusText})`);
  try {
    return await response.json();
  } catch {
    fail(`Response from ${url} was not valid JSON`);
  }
}

/** Defensive accessors — new fields are ignored; missing required fields are errors. */
function asObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object`);
  return value;
}

function currentTerm(person) {
  const terms = Array.isArray(person.terms) ? person.terms : [];
  if (terms.length === 0) return null;
  return terms[terms.length - 1];
}

function isCurrentForState(person, state) {
  const term = currentTerm(person);
  if (!term || typeof term !== 'object') return false;
  if (term.state !== state) return false;
  if (term.type !== 'sen' && term.type !== 'rep') return false;
  // legislators-current.json is already current; still reject clearly ended terms if present.
  if (typeof term.end === 'string') {
    const end = Date.parse(`${term.end}T23:59:59Z`);
    if (!Number.isNaN(end) && end < Date.now()) return false;
  }
  return true;
}

export function toE164(phone) {
  if (typeof phone !== 'string' || !phone.trim()) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

function normalizeHttpsUrl(value, label) {
  if (typeof value !== 'string' || !value.trim()) return null;
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    fail(`${label} is not a valid URL: ${value}`);
  }
  if (url.protocol === 'http:') url.protocol = 'https:';
  if (url.protocol !== 'https:') fail(`${label} must be https: ${value}`);
  return url.href;
}

function ensureTrailingSlash(href) {
  const url = new URL(href);
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}

function officialName(person) {
  const name = asObject(person.name, 'person.name');
  if (typeof name.official_full === 'string' && name.official_full.trim()) return name.official_full.trim();
  const parts = [name.first, name.last].filter(part => typeof part === 'string' && part.trim());
  if (parts.length === 2) return parts.join(' ');
  fail(`Missing official name for bioguide ${person?.id?.bioguide ?? '(unknown)'}`);
}

function lastName(person) {
  const name = asObject(person.name, 'person.name');
  if (typeof name.last === 'string' && name.last.trim()) return name.last.trim();
  const full = officialName(person);
  return full.split(/\s+/).at(-1);
}

function assertGovUrl(url, label) {
  const host = new URL(url).hostname.toLowerCase();
  if (!/(^|\.)(house|senate)\.gov$/.test(host)) fail(`${label} must be a house.gov or senate.gov URL: ${url}`);
}

function mapSocialAccounts(bioguide, socialEntry, websiteUrl, generatedAt) {
  const social = socialEntry?.social;
  if (!social || typeof social !== 'object') return [];
  const accounts = [];
  const twitter = typeof social.twitter === 'string' ? social.twitter.replace(/^@/, '').trim() : '';
  if (twitter) {
    if (!/^[A-Za-z0-9_]{1,15}$/.test(twitter)) {
      console.warn(`Skipping invalid twitter handle for ${bioguide}: ${twitter}`);
    } else {
      accounts.push({
        id: `${bioguide}-x`,
        platform: 'x',
        accountType: 'official-office',
        handle: twitter,
        profileUrl: `https://x.com/${twitter}`,
        status: 'verified',
        sourceUrls: [websiteUrl],
        lastVerified: generatedAt,
      });
    }
  }
  // Bluesky is not published in congress-legislators social media JSON; do not invent handles.
  // Instagram is typed but deferred in the UI.
  return accounts;
}

function mapDistrictPhones(bioguide, officesEntry, websiteUrl, generatedAt) {
  const offices = Array.isArray(officesEntry?.offices) ? officesEntry.offices : [];
  const phones = [];
  const seen = new Set();
  for (const [index, office] of offices.entries()) {
    if (!office || typeof office !== 'object') continue;
    const number = toE164(office.phone);
    if (!number) continue;
    // Skip duplicates (some members list the same phone for multiple cities).
    if (seen.has(number)) continue;
    seen.add(number);
    const city = typeof office.city === 'string' && office.city.trim() ? office.city.trim() : `office-${index + 1}`;
    const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `office-${index + 1}`;
    phones.push({
      id: `district-phone-${slug}`,
      kind: 'phone',
      office: 'district',
      number,
      status: 'verified',
      sourceUrls: [websiteUrl],
      lastVerified: generatedAt,
    });
  }
  return phones;
}

export function mapPersonToLegislator(person, {socialByBioguide, officesByBioguide, generatedAt, sourceEndpoint}) {
  const ids = asObject(person.id, 'person.id');
  const bioguide = ids.bioguide;
  if (typeof bioguide !== 'string' || !bioguide.trim()) fail('Current legislator missing id.bioguide');
  const term = currentTerm(person);
  if (!term) fail(`No terms for ${bioguide}`);
  const chamber = term.type === 'sen' ? 'senate' : term.type === 'rep' ? 'house' : null;
  if (!chamber) fail(`${bioguide}: unsupported term.type ${term.type}`);
  if (typeof term.state !== 'string' || !term.state) fail(`${bioguide}: missing term.state`);

  const websiteRaw = normalizeHttpsUrl(term.url, `${bioguide} term.url`);
  if (!websiteRaw) fail(`${bioguide}: missing required term.url (official website)`);
  assertGovUrl(websiteRaw, `${bioguide} term.url`);
  const websiteUrl = ensureTrailingSlash(websiteRaw);

  const formRaw = normalizeHttpsUrl(term.contact_form, `${bioguide} term.contact_form`) ?? websiteUrl;
  assertGovUrl(formRaw, `${bioguide} contact-form URL`);

  const dcPhone = toE164(term.phone);
  if (!dcPhone) fail(`${bioguide}: missing or invalid term.phone (Washington, D.C.)`);

  if (chamber === 'house') {
    if (typeof term.district !== 'number' || !Number.isInteger(term.district) || term.district < 0) {
      fail(`${bioguide}: House member missing integer term.district`);
    }
  }

  const name = officialName(person);
  const salutation = `${chamber === 'senate' ? 'Senator' : 'Representative'} ${lastName(person)}`;
  const formFromContactField = Boolean(term.contact_form);

  const contacts = [
    {
      id: 'form',
      kind: 'contact-form',
      url: formRaw,
      status: 'verified',
      sourceUrls: formFromContactField && formRaw !== websiteUrl ? [formRaw, websiteUrl] : [websiteUrl],
      lastVerified: generatedAt,
      functionality: {
        status: 'not-tested',
        checkedAt: generatedAt,
        notes: formFromContactField
          ? `Imported from congress-legislators term.contact_form on ${generatedAt}. Form interaction and submission were not tested.`
          : `congress-legislators had no term.contact_form; using official website URL as the contact entry point (generated ${generatedAt}). Form interaction and submission were not tested.`,
      },
    },
    {
      id: 'dc-phone',
      kind: 'phone',
      office: 'washington-dc',
      number: dcPhone,
      status: 'verified',
      sourceUrls: [websiteUrl],
      lastVerified: generatedAt,
    },
    {
      id: 'website',
      kind: 'website',
      url: websiteUrl,
      status: 'verified',
      sourceUrls: [websiteUrl],
      lastVerified: generatedAt,
    },
    ...mapDistrictPhones(bioguide, officesByBioguide.get(bioguide), websiteUrl, generatedAt),
  ];

  const contactIds = contacts.map(c => c.id);
  if (new Set(contactIds).size !== contactIds.length) fail(`${bioguide}: duplicate contact ids`);

  return {
    id: bioguide,
    name,
    salutation,
    state: term.state,
    chamber,
    ...(chamber === 'house' ? {district: term.district} : {}),
    websiteUrl,
    identityVerification: {
      status: 'verified',
      sourceUrls: [websiteUrl],
      lastVerified: generatedAt,
    },
    contacts,
    contactRestrictions: [
      {
        type: 'unknown-policy',
        effect: 'unknown',
        appliesTo: ['form', 'dc-phone'],
        description: 'Residency-based response or submission policies are not published in congress-legislators; this generated record does not claim a hand-verified restriction.',
        status: 'unknown',
        sourceUrl: websiteUrl,
        lastVerified: null,
      },
    ],
    socialAccounts: mapSocialAccounts(bioguide, socialByBioguide.get(bioguide), websiteUrl, generatedAt),
    notes: `Generated from unitedstates/congress-legislators (${sourceEndpoint}) on ${generatedAt}. Contact-form URLs prefer term.contact_form when present, otherwise the official website. No emails invented. Social handles (when present) come from legislators-social-media.json; Bluesky is omitted because that dataset does not publish it. Verification dates are generation dates, not independent submission tests.`,
  };
}

function sortWithSeniority(people, mapped) {
  const rank = new Map();
  for (const person of people) {
    const term = currentTerm(person);
    const bioguide = person?.id?.bioguide;
    if (!bioguide || !term) continue;
    // senior before junior; unknown ranks last
    const order = term.state_rank === 'senior' ? 0 : term.state_rank === 'junior' ? 1 : 2;
    rank.set(bioguide, order);
  }
  return [...mapped].sort((a, b) => {
    if (a.chamber !== b.chamber) return a.chamber === 'senate' ? -1 : 1;
    if (a.chamber === 'senate') return (rank.get(a.id) ?? 2) - (rank.get(b.id) ?? 2) || a.name.localeCompare(b.name);
    return (a.district ?? 0) - (b.district ?? 0);
  });
}

function indexByBioguide(rows, label) {
  if (!Array.isArray(rows)) fail(`${label} must be a JSON array`);
  const map = new Map();
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const bioguide = row.id?.bioguide;
    if (typeof bioguide === 'string' && bioguide) map.set(bioguide, row);
  }
  return map;
}

function renderModule({state, stateName, generatedAt, officials, sourceUrls}) {
  const banner = `/**
 * AUTO-GENERATED FILE - do not edit by hand.
 * Generated ${generatedAt} for ${state} (${stateName}) from unitedstates/congress-legislators.
 * Refresh: npm run generate:legislators
 * Other states: npm run generate:legislators -- --state=XX
 */
`;
  return `${banner}import type {Legislator} from '../../types';

export const generatedAt = ${JSON.stringify(generatedAt)} as const;
export const generatedState = ${JSON.stringify(state)} as const;
export const generatedStateName = ${JSON.stringify(stateName)} as const;
export const sourceUrls = ${JSON.stringify(sourceUrls, null, 2)} as const;

export const officials: Legislator[] = ${JSON.stringify(officials, null, 2)};
`;
}

export async function generate({state = 'OR', outPath} = {}) {
  if (!STATE_NAMES[state]) fail(`Unknown state code: ${state}`);
  const stateName = STATE_NAMES[state];
  const generatedAt = new Date().toISOString().slice(0, 10);

  console.log(`Downloading congress-legislators JSON for ${state}...`);
  const [legislators, socialMedia, districtOffices] = await Promise.all([
    fetchJson(SOURCE_URLS.legislatorsCurrent),
    fetchJson(SOURCE_URLS.socialMedia),
    fetchJson(SOURCE_URLS.districtOffices),
  ]);

  if (!Array.isArray(legislators)) fail('legislators-current.json must be a JSON array');
  const people = legislators.filter(person => person && isCurrentForState(person, state));
  if (people.length === 0) {
    fail(`No current legislators found for state ${state}. Refusing to write an empty dropdown dataset.`);
  }

  const socialByBioguide = indexByBioguide(socialMedia, 'legislators-social-media.json');
  const officesByBioguide = indexByBioguide(districtOffices, 'legislators-district-offices.json');

  const mapped = people.map(person => mapPersonToLegislator(person, {
    socialByBioguide,
    officesByBioguide,
    generatedAt,
    sourceEndpoint: SOURCE_URLS.legislatorsCurrent,
  }));
  const officials = sortWithSeniority(people, mapped);

  const senators = officials.filter(o => o.chamber === 'senate');
  const house = officials.filter(o => o.chamber === 'house');
  if (senators.length !== 2) {
    fail(`Expected 2 senators for ${state}, found ${senators.length}. Refusing to ship incomplete data.`);
  }
  if (house.length === 0) {
    fail(`Expected at least one House member for ${state}, found 0.`);
  }
  const districts = house.map(o => o.district).sort((a, b) => a - b);
  if (new Set(districts).size !== districts.length) fail(`Duplicate House districts for ${state}`);
  // Oregon currently has six numbered districts; catch silent attrition for the default state.
  if (state === 'OR') {
    if (house.length !== 6 || districts.join(',') !== '1,2,3,4,5,6') {
      fail(`Oregon expected House districts 1–6, found [${districts.join(', ')}]. Refusing to ship incomplete data.`);
    }
  }
  if (new Set(officials.map(o => o.id)).size !== officials.length) fail('Duplicate bioguide ids');

  for (const official of officials) {
    if (!official.contacts.some(c => c.kind === 'contact-form')) fail(`${official.id}: missing contact-form`);
    if (!official.contacts.some(c => c.kind === 'phone' && c.office === 'washington-dc')) fail(`${official.id}: missing D.C. phone`);
    if (!official.contacts.some(c => c.kind === 'website')) fail(`${official.id}: missing website`);
    if (!official.websiteUrl) fail(`${official.id}: missing websiteUrl`);
  }

  const fileSlug = stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const defaultOut = resolve(ROOT, 'src/data/states', `${fileSlug}.generated.ts`);
  const destination = resolve(ROOT, outPath ?? defaultOut);
  mkdirSync(dirname(destination), {recursive: true});
  const sourceUrls = {...SOURCE_URLS};
  const contents = renderModule({state, stateName, generatedAt, officials, sourceUrls});
  writeFileSync(destination, contents, 'utf8');
  console.log(`Wrote ${officials.length} legislators (${senators.length} senate, ${house.length} house) to ${destination}`);
  return {destination, officials, generatedAt};
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
const thisPath = fileURLToPath(import.meta.url);
if (invokedPath && resolve(invokedPath) === resolve(thisPath)) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log(`Usage: node scripts/generate-oregon-legislators.mjs [--state=OR] [--out=path]`);
      process.exit(0);
    }
    await generate({state: args.state, outPath: args.out});
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
