import {afterEach, expect, it} from 'vitest';
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import PetitionDirectory from './PetitionDirectory';
import {petitions} from '../campaigns/congressional-leadership/petitions';

afterEach(cleanup);
it('displays all ten in engagement order with snapshot sources and readable totals', () => {
  render(<PetitionDirectory petitions={petitions}/>);
  expect(screen.getAllByRole('article')).toHaveLength(10);
  expect(screen.getAllByRole('heading', {level:3})[0].textContent).toBe('House Democrats:  CHOOSE A NEW SPEAKER');
  expect(screen.getByText('1,112,820 signatures')).toBeTruthy();
  expect(screen.getByText(/snapshots, not live totals/)).toBeTruthy();
  expect(screen.getAllByText(/Direct page check/)).toHaveLength(10);
  for (const article of screen.getAllByRole('article')) {
    expect(article.querySelector('time')?.getAttribute('datetime')).toBe('2026-11-10');
    const destination = within(article).getByRole('link', {name:'View petition ↗'});
    const source = within(article).getByRole('link', {name:'Count source'});
    expect(source.getAttribute('href')).toBe(destination.getAttribute('href'));
    expect(source.getAttribute('rel')).toBe('noopener noreferrer');
  }
  fireEvent.change(screen.getByLabelText('Filter'), {target:{value:'senate'}});
  expect(screen.getAllByRole('article')).toHaveLength(8);
  expect(screen.getAllByRole('heading', {level:3})[0].textContent).toBe('Replace Chuck Schumer as Senate Majority Leader');
});

it('distinguishes cached, third-party and unavailable evidence without inventing dates', () => {
  const base = petitions[0];
  render(<PetitionDirectory petitions={[
    {...base,id:'unknown',signatures:undefined,checkedAt:undefined,organizer:undefined,verification:undefined},
    {...base,id:'cached',signatures:125430,signatureVerification:'cached'},
    {...base,id:'report',signatures:0,signatureVerification:'third-party'},
  ]}/>);
  expect(screen.getByText('125,430 signatures')).toBeTruthy();
  expect(screen.getByText('0 signatures')).toBeTruthy();
  expect(screen.getByText(/Cached page evidence/)).toBeTruthy();
  expect(screen.getByText(/Third-party report/)).toBeTruthy();
  const last = screen.getAllByRole('article')[2];
  expect(last.textContent).toContain('Signature count unavailable or unverified');
  expect(last.textContent).toContain('Organizer unavailable');
  expect(last.textContent).toContain('Petition title and destination not verified');
  expect(last.querySelector('time')).toBeNull();
});
