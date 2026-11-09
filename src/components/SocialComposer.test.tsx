import {afterEach, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import App from '../App';
import SocialComposer from './SocialComposer';
import {officials, oregon} from '../data/states/oregon';
import {congressionalLeadership as campaign} from '../campaigns/congressional-leadership';
import {renderBody} from '../lib/messages';
import blueskyArtwork from '../assets/social/dear-representative-social-icons/bluesky.svg?raw';
import twitterArtwork from '../assets/social/dear-representative-social-icons/twitter.svg?raw';

afterEach(() => {cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); Reflect.deleteProperty(document, 'execCommand');});
function openComposer() {
  fireEvent.click(screen.getByText('Write a social post'));
}
const editor = () => screen.getByLabelText<HTMLTextAreaElement>('Your social draft');
const change = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), {target:{value}});

it('keeps a native collapsed disclosure with original decorative artwork inside its clickable summary', () => {
  render(<SocialComposer campaign={campaign} official={officials[0]} state={oregon}/>);
  const summary = screen.getByText('Write a social post').closest('summary')!;
  const details = summary.parentElement as HTMLDetailsElement;
  expect(details.open).toBe(false);
  expect(summary.querySelectorAll('a, button, [tabindex]')).toHaveLength(0);
  const icons = summary.querySelectorAll('svg');
  expect(icons).toHaveLength(2);
  for (const [i, artwork] of [blueskyArtwork, twitterArtwork].entries()) {
    const original = new DOMParser().parseFromString(artwork, 'image/svg+xml').documentElement;
    expect(icons[i].getAttribute('viewBox')).toBe(original.getAttribute('viewBox'));
    expect(icons[i].querySelector('path')?.getAttribute('d')).toBe(original.querySelector('path')?.getAttribute('d'));
    expect(icons[i].querySelector('path')?.getAttribute('fill')).toBe('currentColor');
    expect(icons[i].getAttribute('aria-hidden')).toBe('true');
    expect(icons[i].closest('.social-heading-icons')?.getAttribute('aria-hidden')).toBe('true');
  }
  fireEvent.click(icons[0]);
  expect(details.open).toBe(true);
  fireEvent.click(summary);
  expect(details.open).toBe(false);
});

it('uses Twitter labels while preserving the internal identifier and profile destination', () => {
  render(<App/>); openComposer();
  expect(screen.getByRole('option', {name:'Twitter'}).getAttribute('value')).toBe('x');
  change('Social platform', 'x');
  expect(screen.getByText(/Twitter has a standard limit of 280 weighted characters/)).toBeTruthy();
  expect(screen.getByRole('link', {name:/Open Twitter/}).getAttribute('href')).toBe('https://x.com/');
  expect(screen.getAllByRole('link', {name:/Twitter: @RepBentz/})[0].getAttribute('href')).toBe('https://x.com/RepBentz');
  expect(screen.queryByRole('option', {name:'X'})).toBeNull();
});

it('starts empty and retains social text independently through official, template and platform changes', () => {
  render(<App/>); openComposer();
  expect(editor().value).toBe('');
  change('Your social draft', 'Keep my @recipient and words');
  change('Your name (optional)', 'Private Name');
  change('City (optional)', 'Private City');
  change('Your message', 'Letter only');
  change('Congressional office', 'wyden');
  change('Starting template', 'detailed');
  change('Social platform', 'x');
  expect(editor().value).toBe('Keep my @recipient and words');
  expect(screen.getByText(/Selected office: Ron Wyden/).textContent).toContain('Review recipient references');
  expect(screen.getByText(/280 weighted/)).toBeTruthy();
  expect(editor().getAttribute('aria-describedby')).toContain('social-limit');
});

it('imports only rendered House/Senate bodies, confirms overwrites, and resets only the social draft', () => {
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
  render(<App/>); openComposer();
  change('Your name (optional)', 'Private Name');
  change('City (optional)', 'Private City');
  change('Your message', 'Letter only');
  fireEvent.click(screen.getByRole('button', {name:'Use existing short template'}));
  expect(confirm).not.toHaveBeenCalled();
  expect(editor().value).toBe(renderBody(campaign, officials.find(o => o.id === 'bonamici')!, oregon, 'short'));
  change('Your social draft', 'Keep me');
  change('Congressional office', 'wyden');
  fireEvent.click(screen.getByRole('button', {name:'Use existing short template'}));
  expect(editor().value).toBe('Keep me');
  confirm.mockReturnValue(true);
  fireEvent.click(screen.getByRole('button', {name:'Use existing short template'}));
  expect(editor().value).toBe(renderBody(campaign, officials[0], oregon, 'short'));
  expect(editor().value).not.toContain('Private');
  const letter = screen.getByLabelText<HTMLTextAreaElement>('Your message').value;
  confirm.mockReturnValue(false);
  fireEvent.click(screen.getByRole('button', {name:'Reset social draft'}));
  expect(editor().value).not.toBe('');
  confirm.mockReturnValue(true);
  fireEvent.click(screen.getByRole('button', {name:'Reset social draft'}));
  expect(editor().value).toBe('');
  expect(screen.getByLabelText<HTMLTextAreaElement>('Your message').value).toBe(letter);
  expect(screen.getByLabelText<HTMLInputElement>('Your name (optional)').value).toBe('Private Name');
  expect(screen.getByLabelText<HTMLInputElement>('City (optional)').value).toBe('Private City');
});

it('works without an account, never truncates, and copies exactly without putting drafts into links', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('navigator', {clipboard:{writeText}});
  render(<SocialComposer campaign={campaign} official={{...officials[0], socialAccounts:[]}} state={oregon}/>); openComposer();
  const text = '👨‍👩‍👧‍👦'.repeat(301) + '?private=secret&name=Alex';
  change('Your social draft', text);
  expect(screen.getByText(/over the Bluesky limit/)).toBeTruthy();
  fireEvent.click(screen.getByRole('button', {name:'Copy social draft'}));
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Social draft copied.'));
  expect(writeText).toHaveBeenCalledWith(text);
  expect(editor().value).toBe(text);
  expect(screen.getByRole('link', {name:/Open Bluesky/}).getAttribute('href')).toBe('https://bsky.app/');
  change('Social platform', 'x');
  const link = screen.getByRole('link', {name:/Open Twitter/});
  expect(link.getAttribute('href')).toBe('https://x.com/');
  expect(link.getAttribute('rel')).toBe('noopener noreferrer');
});

it('restores textarea focus and selection and removes temporary controls when fallback copying fails', async () => {
  vi.stubGlobal('navigator', {});
  Object.defineProperty(document, 'execCommand', {configurable:true, value:vi.fn(() => {throw new Error('denied');})});
  render(<SocialComposer campaign={campaign} official={officials[0]} state={oregon}/>); openComposer();
  change('Your social draft', 'copy my words');
  editor().focus(); editor().setSelectionRange(2, 6, 'backward');
  fireEvent.click(screen.getByRole('button', {name:'Copy social draft'}));
  await waitFor(() => expect(screen.getByRole('status').textContent).toContain('Copy unavailable'));
  expect(document.activeElement).toBe(editor());
  expect([editor().selectionStart, editor().selectionEnd, editor().selectionDirection]).toEqual([2,6,'backward']);
  expect(document.querySelectorAll('textarea').length).toBe(1);
});

it('keeps social verification sources accessible in the existing details', () => {
  render(<App/>);
  const region = screen.getByRole('region', {name:'Message composer'});
  const contact = within(region).getByRole('group', {name:'Contact Suzanne Bonamici'});
  const profile = within(contact).getByRole('link', {name:/Bluesky: @repbonamici/});
  expect(profile.closest('details')).toBeNull();
  const source = within(contact).getByText(/Official-office social profile @repbonamici/);
  expect(source.closest('details')).not.toBeNull();
  expect(source.textContent).toContain('2026-11-09');
  expect(within(source).getByRole('link', {name:'Source 1'}).getAttribute('href')).toBe('https://bonamici.house.gov/');
});

it('labels unavailable exact counting and keeps the draft usable', () => {
  vi.spyOn(Intl, 'Segmenter', 'get').mockReturnValue(undefined as never);
  render(<SocialComposer campaign={campaign} official={officials[0]} state={oregon}/>); openComposer();
  change('Your social draft', '👨‍👩‍👧‍👦');
  expect(screen.getByText(/Exact counting is unavailable/)).toBeTruthy();
  expect(editor().value).toBe('👨‍👩‍👧‍👦');
  expect(screen.getByRole<HTMLButtonElement>('button', {name:'Copy social draft'}).disabled).toBe(false);
});

it('does not report an old clipboard operation as copying an edited draft', async () => {
  let finish!: () => void;
  vi.stubGlobal('navigator', {clipboard:{writeText: () => new Promise<void>(resolve => {finish = resolve;})}});
  render(<SocialComposer campaign={campaign} official={officials[0]} state={oregon}/>); openComposer();
  change('Your social draft', 'Old text');
  fireEvent.click(screen.getByRole('button', {name:'Copy social draft'}));
  change('Your social draft', 'New text');
  finish();
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe(''));
  expect(editor().value).toBe('New text');
});
