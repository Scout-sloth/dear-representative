import {afterEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import ContactActions from './ContactActions';
import {officials} from '../data/states/oregon';
import type {Legislator} from '../types';

afterEach(() => {cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); Reflect.deleteProperty(document, 'execCommand');});
const official = officials.find(o => o.id === 'bynum')!;

describe('contact actions', () => {
  it('shows a verified form, visible D.C. number and user-activated call link with details collapsed', () => {
    const {container} = render(<ContactActions official={official}/>);
    expect(screen.getByRole('link', {name:'Official contact form ↗'}).getAttribute('href')).toBe('https://bynum.house.gov/contact/email-me');
    expect(screen.getByText('(202) 225-5711')).toBeTruthy();
    expect(screen.getByRole('link', {name:/Call Janelle/}).getAttribute('href')).toBe('tel:+12022255711');
    expect(container.querySelector('details')!.open).toBe(false);
    fireEvent.click(screen.getByText('Sources and contact details'));
    expect(container.querySelector('details')!.open).toBe(true);
    expect(screen.getByText(/Functionality could not be tested/)).toBeTruthy();
  });

  it('copies only the number after a click and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {clipboard:{writeText}});
    render(<ContactActions official={official}/>);
    expect(writeText).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {name:/Copy Janelle/}));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Number copied.'));
    expect(writeText).toHaveBeenCalledWith('(202) 225-5711');
  });

  it('provides a manual fallback on clipboard failure', async () => {
    vi.stubGlobal('navigator', {clipboard:{writeText:vi.fn().mockRejectedValue(new Error('denied'))}});
    render(<ContactActions official={official}/>);
    fireEvent.click(screen.getByRole('button', {name:/Copy Janelle/}));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('Select and copy the displayed number'));
    expect(screen.getByText('(202) 225-5711')).toBeTruthy();
  });

  it('shows documented form verification prominently without blocking phone or website', () => {
    const {container} = render(<ContactActions official={official}/>);
    expect(container.querySelector('.contact-notice')!.textContent).toContain('verify an address within the district');
    expect(screen.getByRole('link', {name:'Official website ↗'})).toBeTruthy();
    expect(screen.getByRole('link', {name:/Call Janelle/})).toBeTruthy();
    expect(screen.getByText(/A response is not guaranteed/)).toBeTruthy();
    expect(container.querySelector('.contact-notice')!.textContent).not.toContain('blocks');
  });

  it('keeps unknown policy and ordinary required fields in the secondary area', () => {
    const {container} = render(<ContactActions official={officials.find(o => o.id === 'merkley')!}/>);
    expect(container.querySelector('.contact-notice')).toBeNull();
    expect(container.querySelector('details')!.textContent).toContain('requires an address');
    expect(container.querySelector('details')!.textContent).toContain('Status: unknown');
  });

  it('labels missing and unverified methods without conflating URL and functionality', () => {
    const unavailable: Legislator = {...official, contacts:official.contacts.filter(c => c.kind === 'website'), contactRestrictions:[]};
    const {rerender} = render(<ContactActions official={unavailable}/>);
    expect(screen.getByText('Contact-form URL not verified.')).toBeTruthy();
    expect(screen.getByText('Washington, D.C. phone number not verified.')).toBeTruthy();
    rerender(<ContactActions official={{...official, contacts:official.contacts.map(c => c.kind === 'contact-form' ? {...c,status:'unverified',lastVerified:null} : c)}}/>);
    expect(screen.getByRole('link', {name:/unverified link/})).toBeTruthy();
  });

  it('reports independently tested functionality only with its explicit scope', () => {
    const tested: Legislator = {...official, contacts:official.contacts.map(c => c.kind === 'contact-form'
      ? {...c, functionality:{status:'tested', checkedAt:'2026-11-08', scope:'keyboard navigation only', notes:'No submission tested.'}} : c)};
    render(<ContactActions official={tested}/>);
    expect(screen.getByText(/Independently tested \(keyboard navigation only\)/)).toBeTruthy();
  });

  it('uses the number itself as the calling link beside a compact Copy button', () => {
    render(<ContactActions official={official}/>);
    const phone = screen.getByRole('link', {name:/225-5711.*Call Janelle/});
    const copy = screen.getByRole('button', {name:/Copy Janelle/});
    expect(phone.textContent).toBe('(202) 225-5711');
    expect(copy.textContent).toBe('Copy');
    expect(phone.parentElement).toBe(copy.parentElement);
    expect(screen.queryByText('Call', {exact:true})).toBeNull();
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
  });

  it('keeps selected identity above the actions and outside expandable details', () => {
    const {container, rerender} = render(<ContactActions official={official} variant="selected"/>);
    expect(screen.getByText('Selected representative')).toBeTruthy();
    expect(screen.getByRole('heading', {name:'Janelle Bynum'}).closest('details')).toBeNull();
    expect(screen.getByText('U.S. Representative · OR-5')).toBeTruthy();
    expect(container.querySelector('.contact-actions--selected')).toBeTruthy();
    rerender(<ContactActions official={officials.find(o => o.id === 'wyden')!} variant="selected"/>);
    expect(screen.getByRole('heading', {name:'Ron Wyden'})).toBeTruthy();
    expect(screen.getByText('U.S. Senator')).toBeTruthy();
  });

  it.each([true, false])('announces the actual legacy fallback result: %s', async result => {
    vi.stubGlobal('navigator', {});
    Object.defineProperty(document, 'execCommand', {value:vi.fn(() => result), configurable:true});
    render(<ContactActions official={official}/>);
    fireEvent.click(screen.getByRole('button', {name:/Copy Janelle/}));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain(result ? 'Number copied.' : 'Copy unavailable.'));
    expect(document.querySelector('textarea')).toBeNull();
  });
});
