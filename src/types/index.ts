export type Chamber = 'senate' | 'house';
export interface State {
    code: string;
    name: string;
}
export type ContactMethod = {
    status: 'verified' | 'review';
    sourceUrl?: string;
    verifiedAt?: string;
} & ({
    kind: 'contact-form' | 'website';
    url: string;
} | {
    kind: 'email';
    address: string;
} | {
    kind: 'phone';
    number: string;
});
export interface Legislator {
    id: string;
    name: string;
    salutation: string;
    state: State['code'];
    chamber: Chamber;
    district?: number;
    // The first contact is the primary official web destination.
    contacts: [
        Extract<ContactMethod, {
            kind: 'contact-form' | 'website';
        }>,
        ...ContactMethod[]
    ];
    websiteUrl: string;
    notes?: string;
}
export type Petition = {
    id: string;
    title: string;
    url: string;
    platform: string;
    scope: 'house' | 'senate' | 'both';
    organizer?: string;
    signatures?: number;
    checkedAt?: string;
    description: string;
};
export type TemplateId = 'short' | 'standard' | 'detailed';
export interface MessageTemplate {
    id: TemplateId;
    chamber: Chamber;
    body: string;
}
export interface Campaign {
    id: string;
    title: string;
    details: Record<Chamber, Record<string, string>>;
    templates: Record<Chamber, Record<TemplateId, MessageTemplate>>;
    subject: string;
    signature: string;
    senderFallbacks: {
        name: string;
        city: string;
    };
    petitions: Petition[];
}
export interface Sender {
    name?: string;
    city?: string;
}
