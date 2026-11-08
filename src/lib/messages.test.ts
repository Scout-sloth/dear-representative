import { describe, expect, it } from 'vitest';
import { congressionalLeadership as campaign } from '../campaigns/congressional-leadership';
import { legislators, states } from '../data/states';
import { campaigns } from '../campaigns';
import { renderBody, renderCompleteMessage, renderTemplate } from './messages';
import baseline from './__fixtures__/original-messages.json';
import type { Sender } from '../types';
const state = states[0];
const house = legislators.find(o => o.id === 'bonamici')!;
const senate = legislators.find(o => o.id === 'wyden')!;
describe('message rendering', () => {
    for (const official of [house, senate]) {
        for (const kind of ['short', 'standard', 'detailed'] as const) {
            it(`preserves the original ${official.chamber} ${kind} wording exactly`, () => {
                expect(renderBody(campaign, official, state, kind)).toBe(baseline[official.chamber][kind]);
            });
        }
    }
    it.each<[
        Sender,
        string,
        string
    ]>([
        [{}, '[Your name]', '[City]'],
        [{ name: '  ', city: '\t' }, '[Your name]', '[City]'],
        [{ name: ' Alex ' }, 'Alex', '[City]'],
        [{ city: ' Salem ' }, '[Your name]', 'Salem'],
        [{ name: ' Alex ', city: ' Salem ' }, 'Alex', 'Salem'],
    ])('handles optional sender fields: %j', (sender, name, city) => {
        expect(renderCompleteMessage(campaign, house, state, 'Edited body', sender)).toBe(`Subject: Question about congressional leadership — Suzanne Bonamici\n\nEdited body\n\nSincerely,\n${name}\n${city}, Oregon`);
    });
    it('substitutes explicit salutations, state names and campaign details', () => {
        const otherCampaign = { ...campaign, details: { ...campaign.details, house: { ...campaign.details.house, leader: 'Example leader' } } };
        const body = renderBody(otherCampaign, { ...house, salutation: 'Representative Example-Smith' }, { code: 'XX', name: 'Example State' }, 'short');
        expect(body).toContain('Dear Representative Example-Smith,');
        expect(body).toContain('I am an Example State resident');
        expect(body).toContain('support Example leader');
    });
    it('does not interpret user text as placeholders or markup', () => {
        const message = renderCompleteMessage(campaign, house, state, '{{leader}} <b>my words</b>', { name: '{{officialName}} $&' });
        expect(message).toContain('{{leader}} <b>my words</b>');
        expect(message).toContain('Sincerely,\n{{officialName}} $&');
    });
    it('reports unknown placeholders instead of silently dropping text', () => {
        expect(() => renderTemplate('{{typo}}', { officialName: '', salutation: '', stateName: '', senderName: '', senderCity: '', details: {} })).toThrow('Unknown message placeholder: typo');
    });
});
describe('data consistency', () => {
    it('has unique identifiers and valid Oregon contacts without invented verification', () => {
        expect(states.map(s => s.code)).toEqual(['OR']);
        expect(new Set(legislators.map(o => o.id)).size).toBe(legislators.length);
        expect(legislators).toHaveLength(8);
        for (const official of legislators) {
            expect(states.some(s => s.code === official.state)).toBe(true);
            expect(official.salutation).toBeTruthy();
            if (official.chamber === 'house')
                expect(official.district).toBeGreaterThan(0);
            else
                expect(official.district).toBeUndefined();
            const contact = official.contacts[0];
            expect(new URL(contact.url).hostname).toMatch(/\.(house|senate)\.gov$/);
            expect(contact.status).toBe('review');
            expect(contact.verifiedAt).toBeUndefined();
        }
    });
    it('provides every template and unique petition IDs for each campaign', () => {
        expect(new Set(campaigns.map(c => c.id)).size).toBe(campaigns.length);
        for (const entry of campaigns) {
            for (const official of [house, senate])
                for (const kind of ['short', 'standard', 'detailed'] as const) {
                    expect(entry.templates[official.chamber][kind]).toMatchObject({ id: kind, chamber: official.chamber });
                    expect(renderBody(entry, official, state, kind)).not.toMatch(/\{\{\w+\}\}/);
                }
            expect(new Set(entry.petitions.map(p => p.id)).size).toBe(entry.petitions.length);
        }
    });
});
