import type { Legislator, State } from '../../types';
export const oregon: State = { code: 'OR', name: 'Oregon' };
// Official domains are supplied; exact contact paths should be rechecked before launch.
export const officials: Legislator[] = [
    { id: 'wyden', name: 'Ron Wyden', salutation: 'Senator Wyden', state: 'OR', chamber: 'senate', contacts: [{ kind: 'contact-form', url: 'https://www.wyden.senate.gov/contact', status: 'review' }], websiteUrl: 'https://www.wyden.senate.gov/' },
    { id: 'merkley', name: 'Jeff Merkley', salutation: 'Senator Merkley', state: 'OR', chamber: 'senate', contacts: [{ kind: 'contact-form', url: 'https://www.merkley.senate.gov/connect/contact/', status: 'review' }], websiteUrl: 'https://www.merkley.senate.gov/' },
    { id: 'bonamici', name: 'Suzanne Bonamici', salutation: 'Representative Bonamici', state: 'OR', chamber: 'house', district: 1, contacts: [{ kind: 'contact-form', url: 'https://bonamici.house.gov/contact', status: 'review' }], websiteUrl: 'https://bonamici.house.gov/' },
    { id: 'bentz', name: 'Cliff Bentz', salutation: 'Representative Bentz', state: 'OR', chamber: 'house', district: 2, contacts: [{ kind: 'website', url: 'https://bentz.house.gov/', status: 'review' }], websiteUrl: 'https://bentz.house.gov/', notes: 'Contact-form path pending verification' },
    { id: 'dexter', name: 'Maxine Dexter', salutation: 'Representative Dexter', state: 'OR', chamber: 'house', district: 3, contacts: [{ kind: 'website', url: 'https://dexter.house.gov/', status: 'review' }], websiteUrl: 'https://dexter.house.gov/', notes: 'Contact-form path pending verification' },
    { id: 'hoyle', name: 'Val Hoyle', salutation: 'Representative Hoyle', state: 'OR', chamber: 'house', district: 4, contacts: [{ kind: 'website', url: 'https://hoyle.house.gov/', status: 'review' }], websiteUrl: 'https://hoyle.house.gov/', notes: 'Office may restrict web-form submissions by district ZIP code' },
    { id: 'bynum', name: 'Janelle Bynum', salutation: 'Representative Bynum', state: 'OR', chamber: 'house', district: 5, contacts: [{ kind: 'website', url: 'https://bynum.house.gov/', status: 'review' }], websiteUrl: 'https://bynum.house.gov/', notes: 'Contact-form path pending verification' },
    { id: 'salinas', name: 'Andrea Salinas', salutation: 'Representative Salinas', state: 'OR', chamber: 'house', district: 6, contacts: [{ kind: 'website', url: 'https://salinas.house.gov/', status: 'review' }], websiteUrl: 'https://salinas.house.gov/', notes: 'Contact-form path pending verification' }
];
