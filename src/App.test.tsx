import {afterEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import App from './App';

afterEach(() => {cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals();});
const change = (element: HTMLElement, value: string) => fireEvent.change(element, {target: {value}});

describe('composer', () => {
  it('discloses local composition, clipboard use and hosting privacy without hiding the notice', () => {
    render(<App/>);
    expect(screen.getByText('Find official congressional contact channels, write your own message, and explore public petitions. Your message stays in your browser. Nothing is submitted automatically.')).toBeTruthy();
    const disclosure = screen.getByRole('region', {name:'Your privacy'});
    expect(disclosure.closest('details')).toBeNull();
    expect(disclosure.textContent).toContain('browser memory');
    expect(disclosure.textContent).toContain('device clipboard');
    expect(disclosure.textContent).toContain('External congressional and petition websites');
    expect(disclosure.textContent).toContain('technical request information and access logs');
    expect(within(disclosure).getByRole('link', {name:'GitHub’s privacy statement'}).getAttribute('href')).toBe('https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement');
    for (const name of ['Email, Form & Phone','Social','Petitions','Directory']) {
      expect(screen.getByRole('region', {name}).parentElement?.tagName).toBe('MAIN');
    }
  });
  it('orders four full-width sections with matching navigation targets and a permanent Social section', () => {
    render(<App/>);
    const sections = Array.from(document.querySelectorAll('main > section'));
    expect(sections.map(s => s.id)).toEqual(['contact','social','petitions','directory']);
    expect(sections.map(s => s.querySelector('h2')?.textContent?.trim())).toEqual(['Email, Form & Phone','Social','Petitions','Directory']);
    const navigation = screen.getByRole('navigation', {name:'Page sections'});
    expect(within(navigation).getAllByRole('link').map(a => a.getAttribute('href'))).toEqual(['#contact','#social','#petitions','#directory']);
    const social = screen.getByRole('region', {name:'Social'});
    expect(social.querySelector('details, summary')).toBeNull();
    change(screen.getByLabelText('Your social draft'), 'Retain my draft');
    change(screen.getByLabelText('Congressional office'), 'wyden');
    expect(screen.getByLabelText<HTMLTextAreaElement>('Your social draft').value).toBe('Retain my draft');
  });

  it('keeps selected identity visible and shares the same phone actions with the directory', () => {
    render(<App/>);
    const composer = screen.getByRole('region', {name:'Email, Form & Phone'});
    const directory = screen.getByRole('region', {name:'Directory'});
    expect(within(composer).getByRole('heading', {name:'Suzanne Bonamici'})).toBeTruthy();
    for (const section of [composer, directory]) {
      const contact = within(section).getByRole('group', {name:'Contact Suzanne Bonamici'});
      expect(within(contact).getByRole('link', {name:/225-0855.*Call Suzanne/}).getAttribute('href')).toBe('tel:+12022250855');
      expect(within(contact).getByRole('button', {name:/Copy Suzanne/}).textContent).toBe('Copy');
    }
    change(screen.getByLabelText('Congressional office'), 'wyden');
    const selectedContact = within(composer).getByRole('group', {name:'Contact Ron Wyden'});
    expect(within(selectedContact).getByRole('heading', {name:'Ron Wyden'})).toBeTruthy();
    expect(within(selectedContact).getByText('U.S. Senator')).toBeTruthy();
    expect(within(composer).queryByRole('heading', {name:'Suzanne Bonamici'})).toBeNull();
  });
  it('preserves petition filtering and external contact links', () => {
    render(<App/>);
    expect(screen.getByRole('link', {name: 'Open official form for Suzanne Bonamici'}).getAttribute('href')).toBe('https://bonamici.house.gov/contact/email');
    change(screen.getByLabelText('Filter'), 'house');
    expect(screen.queryByRole('heading', {name: 'Remove Chuck Schumer for a younger leader'})).toBeNull();
    expect(screen.getByRole('heading', {name: 'Remove Chuck Schumer and Hakeem Jeffries from leadership roles'})).toBeTruthy();
  });

});
