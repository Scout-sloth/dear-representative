import {afterEach, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import App from '../App';

afterEach(() => {cleanup(); vi.useRealTimers(); vi.unstubAllGlobals();});
const change = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), {target:{value}});
const text = (label: string) => screen.getByLabelText<HTMLTextAreaElement>(label).value;

it('offers one letter reset and leaves matching text, clipboard feedback and Undo unchanged', async () => {
  vi.stubGlobal('navigator', {clipboard: {writeText: vi.fn().mockResolvedValue(undefined)}});
  render(<App/>);
  expect(screen.queryByRole('button', {name:'Apply selected template'})).toBeNull();
  expect(screen.getAllByRole('button', {name:'Reset to selected template'})).toHaveLength(1);
  const original = text('Your message');
  fireEvent.click(screen.getByRole('button', {name:'Reset to selected template'}));
  expect(text('Your message')).toBe(original);
  expect(screen.queryByRole('button', {name:'Undo letter draft replacement'})).toBeNull();
  change('Your message', 'Previous edits');
  fireEvent.click(screen.getByRole('button', {name:'Reset to selected template'}));
  fireEvent.click(screen.getByRole('button', {name:'Copy complete message'}));
  await screen.findByRole('button', {name:'Copied!'});
  fireEvent.click(screen.getByRole('button', {name:'Reset to selected template'}));
  expect(screen.getByRole('button', {name:'Copied!'})).toBeTruthy();
  fireEvent.click(screen.getByRole('button', {name:'Undo letter draft replacement'}));
  expect(text('Your message')).toBe('Previous edits');
});

it('keeps independent Undo snapshots through selection changes, elapsed time and sender edits', () => {
  vi.useFakeTimers();
  render(<App/>);
  change('Your message', '  Exact letter\n👨‍👩‍👧‍👦  ');
  change('Your social draft', 'Exact social\ne\u0301');
  fireEvent.click(screen.getByRole('button', {name:'Reset to selected template'}));
  fireEvent.click(screen.getByRole('button', {name:'Reset social draft'}));
  change('Congressional office', 'wyden');
  change('Starting template', 'detailed');
  change('Social platform', 'x');
  change('Your name (optional)', 'Alex');
  change('City (optional)', 'Salem');
  vi.advanceTimersByTime(60 * 60 * 1000);
  const letterUndo = screen.getByRole('button', {name:'Undo letter draft replacement'});
  expect(letterUndo.previousElementSibling?.textContent).toBe('Reset to selected template');
  expect(letterUndo.parentElement).toBe(screen.getByRole('button', {name:'Copy complete message'}).parentElement);
  expect(letterUndo.parentElement?.classList.contains('actions')).toBe(true);
  const letterStatus = letterUndo.parentElement?.nextElementSibling;
  expect(letterStatus?.getAttribute('aria-live')).toBe('polite');
  expect(letterStatus?.getAttribute('aria-atomic')).toBe('true');
  expect(letterStatus?.textContent).toContain('Letter draft replaced.');
  expect(letterStatus?.querySelector('button')).toBeNull();
  letterUndo.focus();
  expect(document.activeElement).toBe(letterUndo);
  fireEvent.click(letterUndo);
  expect(text('Your message')).toBe('  Exact letter\n👨‍👩‍👧‍👦  ');
  expect(document.activeElement).toBe(screen.getByLabelText('Your message'));
  const socialUndo = screen.getByRole('button', {name:'Undo social draft replacement'});
  expect(socialUndo.parentElement).toBe(screen.getByRole('button', {name:'Copy social draft'}).parentElement);
  expect(socialUndo.previousElementSibling?.textContent).toBe('Reset social draft');
  expect(socialUndo.parentElement?.nextElementSibling?.getAttribute('aria-live')).toBe('polite');
  expect(socialUndo.parentElement?.nextElementSibling?.querySelector('button')).toBeNull();
  fireEvent.click(screen.getByRole('button', {name:'Undo social draft replacement'}));
  expect(text('Your social draft')).toBe('Exact social\ne\u0301');
  expect(document.activeElement).toBe(screen.getByLabelText('Your social draft'));
  expect(screen.getByLabelText<HTMLSelectElement>('Congressional office').value).toBe('wyden');
  expect(screen.getByLabelText<HTMLInputElement>('Your name (optional)').value).toBe('Alex');
  expect(screen.getByLabelText<HTMLInputElement>('City (optional)').value).toBe('Salem');
});

it('retains pristine and intentionally emptied drafts until explicit replacement', () => {
  render(<App/>);
  const original = text('Your message');
  change('Congressional office', 'wyden');
  change('Starting template', 'short');
  expect(text('Your message')).toBe(original);
  change('Your message', '');
  change('Congressional office', 'bonamici');
  expect(text('Your message')).toBe('');
  fireEvent.click(screen.getByRole('button', {name:'Reset to selected template'}));
  expect(text('Your message')).not.toBe('');
  fireEvent.click(screen.getByRole('button', {name:'Reset to selected template'}));
  fireEvent.click(screen.getByRole('button', {name:'Undo letter draft replacement'}));
  expect(text('Your message')).toBe('');
});

it('ends Undo after another edit without affecting the other composer', () => {
  render(<App/>);
  change('Your message', 'Letter');
  change('Your social draft', 'Social');
  fireEvent.click(screen.getByRole('button', {name:'Reset to selected template'}));
  fireEvent.click(screen.getByRole('button', {name:'Reset social draft'}));
  change('Your message', 'More editing');
  expect(screen.queryByRole('button', {name:'Undo letter draft replacement'})).toBeNull();
  expect(screen.getByRole('button', {name:'Undo social draft replacement'})).toBeTruthy();
});
