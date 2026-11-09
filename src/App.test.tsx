import {afterEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import App from './App';
import baseline from './lib/__fixtures__/original-messages.json';

afterEach(() => {cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals();});
const editor = () => screen.getByLabelText<HTMLTextAreaElement>('Your message');
const name = () => screen.getByLabelText<HTMLInputElement>('Your name (optional)');
const city = () => screen.getByLabelText<HTMLInputElement>('City (optional)');
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
    for (const name of ['Message composer','Oregon congressional delegation','Petition directory']) {
      expect(screen.getByRole('region', {name}).parentElement?.tagName).toBe('MAIN');
    }
  });
  it('keeps selected identity visible and shares the same phone actions with the directory', () => {
    render(<App/>);
    const composer = screen.getByRole('region', {name:'Message composer'});
    const directory = screen.getByRole('region', {name:'Oregon congressional delegation'});
    expect(within(composer).getByRole('heading', {name:'Suzanne Bonamici'})).toBeTruthy();
    for (const section of [composer, directory]) {
      const contact = within(section).getByRole('group', {name:'Contact Suzanne Bonamici'});
      expect(within(contact).getByRole('link', {name:/225-0855.*Call Suzanne/}).getAttribute('href')).toBe('tel:+12022250855');
      expect(within(contact).getByRole('button', {name:/Copy Suzanne/}).textContent).toBe('Copy');
    }
    change(screen.getByLabelText('Congressional office'), 'wyden');
    expect(within(composer).getByRole('heading', {name:'Ron Wyden'})).toBeTruthy();
    expect(within(composer).getByText('U.S. Senator')).toBeTruthy();
    expect(within(composer).queryByRole('heading', {name:'Suzanne Bonamici'})).toBeNull();
  });
  it('starts with the existing House standard draft', () => {
    render(<App/>);
    expect(editor().value).toBe(baseline.house.standard);
  });

  it('preserves sender fields when switching officials/templates and resetting only the selected body', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {clipboard: {writeText}});
    render(<App/>);
    change(name(), 'Alex');
    change(city(), 'Salem');
    change(editor(), 'Personal edits');
    change(screen.getByLabelText('Congressional office'), 'wyden');
    expect(editor().value).toBe(baseline.senate.standard);
    change(editor(), 'More edits');
    change(screen.getByLabelText('Starting template'), 'detailed');
    expect(editor().value).toBe(baseline.senate.detailed);
    change(editor(), 'Final edits');
    fireEvent.click(screen.getByRole('button', {name: 'Copy complete message'}));
    await screen.findByRole('button', {name: 'Copied!'});
    fireEvent.click(screen.getByRole('button', {name: 'Reset to Original Template'}));
    expect(editor().value).toBe(baseline.senate.detailed);
    expect(name().value).toBe('Alex');
    expect(city().value).toBe('Salem');
    expect(screen.getByRole('button', {name: 'Copy complete message'})).toBeTruthy();
    fireEvent.click(screen.getByRole('button', {name: 'Copy complete message'}));
    await waitFor(() => expect(writeText).toHaveBeenLastCalledWith(
      `Subject: Question about congressional leadership — Ron Wyden\n\n${baseline.senate.detailed}\n\nSincerely,\nAlex\nSalem, Oregon`,
    ));
    change(screen.getByLabelText('Congressional office'), 'bonamici');
    expect(editor().value).toBe(baseline.house.detailed);
    expect(screen.getByRole('button', {name: 'Copy complete message'})).toBeTruthy();
  });

  it('copies the edited body with subject and optional signature without resetting edits', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {clipboard: {writeText}});
    render(<App/>);
    change(editor(), 'My own message {{leader}}');
    change(name(), ' Alex ');
    expect(editor().value).toBe('My own message {{leader}}');
    fireEvent.click(screen.getByRole('button', {name: 'Copy complete message'}));
    await screen.findByRole('button', {name: 'Copied!'});
    expect(writeText).toHaveBeenCalledWith('Subject: Question about congressional leadership — Suzanne Bonamici\n\nMy own message {{leader}}\n\nSincerely,\nAlex\n[City], Oregon');
  });

  it('retains the manual-copy fallback when clipboard access fails', async () => {
    vi.stubGlobal('navigator', {clipboard: {writeText: vi.fn().mockRejectedValue(new Error('denied'))}});
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App/>);
    fireEvent.click(screen.getByRole('button', {name: 'Copy complete message'}));
    await waitFor(() => expect(alert).toHaveBeenCalledWith('Clipboard access unavailable. Select and copy the preview text instead.'));
    expect(editor().value).toBe(baseline.house.standard);
  });

  it('preserves petition filtering and external contact links', () => {
    render(<App/>);
    expect(screen.getAllByRole('link', {name: 'Official contact form ↗'})[0].getAttribute('href')).toBe('https://bonamici.house.gov/contact/email');
    change(screen.getByLabelText('Filter'), 'house');
    expect(screen.queryByRole('heading', {name: 'Remove Chuck Schumer for a younger leader'})).toBeNull();
    expect(screen.getByRole('heading', {name: 'Remove Chuck Schumer and Hakeem Jeffries from leadership roles'})).toBeTruthy();
  });

  it('copying a phone number does not change the draft, sender fields or message copy state', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {clipboard: {writeText}});
    render(<App/>);
    change(editor(), 'My draft');
    change(name(), 'Alex');
    change(city(), 'Salem');
    fireEvent.click(screen.getAllByRole('button', {name: /Copy Suzanne Bonamici.*phone number/})[0]);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('(202) 225-0855'));
    expect(editor().value).toBe('My draft');
    expect(name().value).toBe('Alex');
    expect(city().value).toBe('Salem');
    expect(screen.getByRole('button', {name: 'Copy complete message'})).toBeTruthy();
    change(screen.getByLabelText('Congressional office'), 'wyden');
    expect(screen.queryByText('Number copied.')).toBeNull();
    expect(editor().value).toBe(baseline.senate.standard);
  });
});
