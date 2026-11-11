import type {Sender} from '../types';
import {createDraft, draftReducer, type DraftAction, type DraftOrigin, type DraftSnapshot} from './draft';

type Field = 'name' | 'city';
type Range = {start: number; end: number; managed: boolean; value: string};
type Personalization = Record<Field, Range>;
type Snapshot = DraftSnapshot & {personalization: Personalization};
export type PersonalizedDraft = Snapshot & {undo: Snapshot | null; sender: Required<Sender>};
const fields: Field[] = ['name', 'city'];
const normalized = (sender: Sender): Required<Sender> => ({name:sender.name?.trim() ?? '', city:sender.city?.trim() ?? ''});

function replaceRange(draft: PersonalizedDraft, field: Field, text: string): PersonalizedDraft {
  const range = draft.personalization[field];
  const delta = text.length - (range.end - range.start);
  const personalization = {...draft.personalization, [field]:{...range, end:range.start + text.length}};
  for (const other of fields) {
    if (other === field) continue;
    const r = personalization[other];
    // Name precedes city even when both are zero-width insertion anchors.
    if (r.start >= range.end && (r.start > range.start || other === 'city')) {
      personalization[other] = {...r, start:r.start + delta, end:r.end + delta};
    }
  }
  return {...draft, text:draft.text.slice(0, range.start) + text + draft.text.slice(range.end), personalization};
}

function renderPersonalization(draft: PersonalizedDraft, stateName: string): PersonalizedDraft {
  for (const field of fields) {
    const range = draft.personalization[field];
    if (!range.managed) continue;
    const prefix = draft.text.slice(0, range.start);
    const name = draft.personalization.name;
    const breaks = field === 'city' && name.end > name.start && name.end === range.start ? 1 : 2;
    const existingBreaks = prefix.match(/\n*$/)![0].length;
    const separator = prefix.length ? '\n'.repeat(Math.max(0, breaks - existingBreaks)) : '';
    const content = field === 'name' ? `Sincerely,\n${range.value}` : `${range.value}, ${stateName}`;
    draft = replaceRange(draft, field, range.value ? separator + content : '');
  }
  return draft;
}

export function createPersonalizedDraft(body: string, origin: DraftOrigin, sender: Sender, stateName: string): PersonalizedDraft {
  const values = normalized(sender);
  const draft = renderPersonalization({...createDraft(body, origin), undo:null, sender:values, personalization:{
    name:{start:body.length, end:body.length, managed:true, value:values.name},
    city:{start:body.length, end:body.length, managed:true, value:values.city},
  }}, stateName);
  return {...draft, baseline:draft.text};
}

export function personalizeDraft(draft: PersonalizedDraft, sender: Sender, stateName: string): PersonalizedDraft {
  const values = normalized(sender);
  if (values.name === draft.sender.name && values.city === draft.sender.city) return draft;
  const personalization = {...draft.personalization};
  for (const field of fields) {
    if (values[field] !== draft.sender[field] && personalization[field].managed) {
      personalization[field] = {...personalization[field], value:values[field]};
    }
  }
  // Automatic field updates preserve the existing Undo snapshot. Undo remains exact.
  return renderPersonalization({...draft, personalization, sender:values}, stateName);
}

export function editPersonalizedDraft(draft: PersonalizedDraft, text: string): PersonalizedDraft {
  if (text === draft.text) return draft;
  let start = 0;
  while (start < text.length && start < draft.text.length && text[start] === draft.text[start]) start++;
  let end = draft.text.length;
  let newEnd = text.length;
  while (end > start && newEnd > start && draft.text[end - 1] === text[newEnd - 1]) {end--; newEnd--;}
  const delta = newEnd - end;
  const personalization = {...draft.personalization};
  for (const field of fields) {
    const r = personalization[field];
    // Edits touching a nonempty generated range (including its boundaries) transfer
    // ownership to the visitor. A broad replacement conservatively transfers all
    // touched fields; no matching-text search is used to guess ownership afterward.
    const touched = r.start === r.end
      ? false
      : start === end ? start > r.start && start <= r.end : start < r.end && end > r.start;
    if (touched) {
      personalization[field] = {...r, managed:false, start:Math.min(r.start, start), end:Math.max(newEnd, r.end + delta)};
    } else if (r.start === r.end && r.start > start && r.start < end) {
      personalization[field] = {...r, start:newEnd, end:newEnd};
    } else if (r.start >= end) {
      personalization[field] = {...r, start:r.start + delta, end:r.end + delta};
    }
  }
  return {...draft, ...draftReducer(draft, {type:'edit', text}), personalization, undo:null};
}

export function replacePersonalizedDraft(draft: PersonalizedDraft, next: PersonalizedDraft): PersonalizedDraft {
  if (draft.text === next.text) return draft;
  const {text, baseline, origin, personalization} = draft;
  return {...next, undo:{text, baseline, origin, personalization}};
}

export function actOnPersonalizedDraft(draft: PersonalizedDraft, action: DraftAction): PersonalizedDraft {
  if (action.type === 'edit') return editPersonalizedDraft(draft, action.text);
  if (action.type === 'undo') return draft.undo ? {...draft, ...draft.undo, undo:null} : draft;
  throw new Error('Use replacePersonalizedDraft to replace text and its tracked personalization together');
}
