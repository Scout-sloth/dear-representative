import {afterEach, expect, it} from 'vitest';
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import SourcesContext from './SourcesContext';
import {research} from '../campaigns/congressional-leadership/research';

afterEach(cleanup);
it('renders seven collapsed topics and a native expandable methodology', () => {
  render(<SourcesContext research={research}/>);
  expect(document.querySelectorAll('details')).toHaveLength(8);
  for (const details of document.querySelectorAll('details')) {
    expect(details.open).toBe(false);
    fireEvent.click(details.querySelector('summary')!);
    expect(details.open).toBe(true);
    fireEvent.click(details.querySelector('summary')!);
    expect(details.open).toBe(false);
  }
  expect(research.topics.filter(t=>t.status==='research-in-progress')).toHaveLength(6);
  expect(research.methodology).toHaveLength(5);
});

it('shows verified vote context and distinguishes checked from verified dates', () => {
  render(<SourcesContext research={research}/>);
  fireEvent.click(screen.getByText('Defense spending and NDAA voting records'));
  expect(screen.getByText(/This was Senate approval/)).toBeTruthy();
  expect(screen.getByText(/roll-call page retains an earlier title/)).toBeTruthy();
  const pending=screen.getByRole('article',{name:'2015 Senate reference — pending verification'});
  expect(pending.textContent).toContain('Research in progress');
  expect(pending.textContent).toContain('Last checked: 2026-11-11');
  expect(pending.textContent).not.toContain('Last verified:');
  expect(pending.textContent).toContain('Publication/event date not confirmed');
  expect(within(pending).getByRole('link').getAttribute('href')).toBe('https://www.govtrack.us/congress/votes/114-2015/s301');
  const verified=screen.getByRole('article',{name:'2025: Senate concurrence in the FY2026 NDAA text'});
  expect(verified.textContent).toContain('Vote date: 2025-12-17');
  expect(verified.textContent).toContain('Last verified: 2026-11-11');
});

it('uses unique IDs, dated verification and safe external links from campaign data', () => {
  const ids:string[]=[];
  render(<SourcesContext research={research}/>);
  for (const topic of research.topics) for(const entry of topic.entries) for(const source of entry.sources){
    ids.push(source.id);
    expect(new URL(source.url).protocol).toBe('https:');
    if(source.status==='verified') expect(source.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    else expect(source.lastVerified).toBeUndefined();
    if(source.date) expect(source.date.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
  expect(new Set(ids).size).toBe(ids.length);
  for(const link of document.querySelectorAll('a')) {
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  }
});

it('handles incomplete future entries without fabricating dates or subjects',()=>{
  render(<SourcesContext research={{methodology:[],topics:[{id:'future',title:'Future topic',summary:'Research scope',status:'research-in-progress',entries:[{id:'future-entry',title:'Future reference',subjects:['Hakeem Jeffries'],summary:'Pending',sources:[{id:'future-source',title:'Reference',publisher:'Publisher',url:'https://example.org/',kind:'secondary',status:'pending'}]}]}]}}/>);
  expect(screen.getByText(/Future topic/).textContent).toContain('Research in progress');
  expect(screen.getByText('Subjects: Hakeem Jeffries')).toBeTruthy();
  expect(screen.getByText(/Publication\/event date not confirmed/).textContent).not.toContain('Last checked');
});
