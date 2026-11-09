export type Chamber = 'senate' | 'house';
export interface State {
    code: string;
    name: string;
}
export type Verification = {
    status: 'verified';
    sourceUrls: [string, ...string[]];
    lastVerified: string;
} | {
    status: 'unverified' | 'unknown';
    sourceUrls: string[];
    lastVerified: null;
};
export type FormFunctionality = {
    status: 'tested';
    checkedAt: string;
    scope: string;
    notes: string;
} | {
    status: 'not-tested' | 'could-not-test';
    checkedAt: string;
    notes: string;
};
export type ContactMethod = Verification & {id: string} & ({
    kind: 'contact-form';
    url: string;
    functionality: FormFunctionality;
} | {
    kind: 'website';
    url: string;
} | {
    kind: 'email';
    address: string;
} | {
    kind: 'phone';
    number: string;
    office: 'washington-dc' | 'district';
});
export type ContactRestriction = {
    type: 'district-residency' | 'state-residency' | 'zip-verification' | 'address-verification' | 'other' | 'unknown-policy';
    effect: 'response-policy' | 'required-information' | 'verification-step' | 'submission-block' | 'unknown';
    appliesTo: string[];
    description: string;
} & ({status: 'verified'; sourceUrl: string; lastVerified: string} | {
    status: 'unverified' | 'unknown'; sourceUrl?: string; lastVerified: null;
});
export type SocialPlatform = 'bluesky' | 'x' | 'instagram';
export type SocialAccount = Verification & {
    id: string;
    platform: SocialPlatform;
    accountType: 'official-office' | 'personal' | 'campaign' | 'unknown';
    handle: string;
    profileUrl: string;
};
export interface Legislator {
    socialAccounts?: SocialAccount[];
    id: string;
    name: string;
    salutation: string;
    state: State['code'];
    chamber: Chamber;
    district?: number;
    identityVerification: Verification;
    contacts: ContactMethod[];
    contactRestrictions: ContactRestriction[];
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
