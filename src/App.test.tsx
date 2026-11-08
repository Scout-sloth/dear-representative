import {afterEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import App from './App';
import baseline from './lib/__fixtures__/original-messages.json';

afterEach(() => {cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals();});
const editor = () => screen.getByLabelText<HTMLTextAreaElement>('Your message');
const name = () => screen.getByLabelText<HTMLInputElement>('Your name (optional)');
const city = () => screen.getByLabelText<HTMLInputElement>('City (optional)');
const change = (element: HTMLElement, value: string) => fireEvent.change(element, {target: {value}});

describe('composer', () => {
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
    expect(screen.getByRole('link', {name: 'Official contact page ↗'}).getAttribute('href')).toBe('https://bonamici.house.gov/contact');
    change(screen.getByLabelText('Filter'), 'house');
    expect(screen.queryByRole('heading', {name: 'Remove Chuck Schumer for a younger leader'})).toBeNull();
    expect(screen.getByRole('heading', {name: 'Remove Chuck Schumer and Hakeem Jeffries from leadership roles'})).toBeTruthy();
  });
});
