import type {ContactMethod, ContactRestriction} from '../types';

export function formatPhone(number: string): string {
  if (!/^\+1[2-9]\d{2}[2-9]\d{6}$/.test(number)) throw new Error('Expected a canonical U.S. phone number');
  return `(${number.slice(2, 5)}) ${number.slice(5, 8)}-${number.slice(8)}`;
}

export function phoneHref(number: string): string {
  formatPhone(number);
  return `tel:${number}`;
}

export const contactLabels: Record<ContactMethod['kind'], string> = {
  'contact-form': 'Contact form', website: 'Official website', phone: 'Phone', email: 'Direct email',
};

export function materialRestrictions(restrictions: ContactRestriction[], methodId: string): ContactRestriction[] {
  return restrictions.filter(r => r.status === 'verified' && r.appliesTo.includes(methodId)
    && ['response-policy', 'verification-step', 'submission-block'].includes(r.effect));
}
