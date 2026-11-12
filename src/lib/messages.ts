import type { Campaign, Legislator, Sender, State, TemplateId } from '../types';
export const templateLabels: Record<TemplateId, string> = {
    short: 'Short', detailed: 'Detailed',
};
export interface MessageContext {
    officialName: string;
    salutation: string;
    stateName: string;
    senderName: string;
    senderCity: string;
    details: Record<string, string>;
}
// One substitution pass keeps supplied values literal, even if they contain placeholders.
export function renderTemplate(template: string, context: MessageContext): string {
    const { details, ...fields } = context;
    const values: Record<string, string> = { ...details, ...fields };
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
        if (!Object.hasOwn(values, key))
            throw new Error(`Unknown message placeholder: ${key}`);
        return values[key];
    });
}
function contextFor(campaign: Campaign, official: Legislator, state: State, sender: Sender = {}): MessageContext {
    return {
        officialName: official.name,
        salutation: official.salutation,
        stateName: state.name,
        senderName: sender.name?.trim() || campaign.senderFallbacks.name,
        senderCity: sender.city?.trim() || campaign.senderFallbacks.city,
        details: campaign.details[official.chamber],
    };
}
export function renderBody(campaign: Campaign, official: Legislator, state: State, kind: TemplateId): string {
    return renderTemplate(campaign.templates[official.chamber][kind].body, contextFor(campaign, official, state));
}
export function renderSubject(campaign: Campaign, official: Legislator, state: State, kind: TemplateId): string {
    return renderTemplate(campaign.templates[official.chamber][kind].subject ?? campaign.subject, contextFor(campaign, official, state));
}
export function renderCompleteMessage(campaign: Campaign, official: Legislator, state: State, body: string, sender: Sender = {}, kind: TemplateId = 'short'): string {
    const context = contextFor(campaign, official, state, sender);
    return `Subject: ${renderSubject(campaign, official, state, kind)}\n\n${body}${renderTemplate(campaign.signature, context)}`;
}
