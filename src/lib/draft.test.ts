import {describe, expect, it} from 'vitest';
import {createDraft, draftReducer, type DraftOrigin} from './draft';

const origin: DraftOrigin = {campaignId:'campaign', officialId:'house-member', chamber:'house', stateCode:'OR', template:'short'};
const other: DraftOrigin = {...origin, officialId:'senator', chamber:'senate', template:'short', platform:'x'};

describe('draft state', () => {
  it('restores exact Unicode, whitespace, baseline and origin after replacement', () => {
    const initial = createDraft('Original baseline', origin);
    const edited = draftReducer(initial, {type:'edit', text:'  e\u0301 👨‍👩‍👧‍👦\r\n\n {{leader}}\t'});
    const replaced = draftReducer(edited, {type:'replace', text:'New template', origin:other});
    expect(replaced.baseline).toBe('New template');
    expect(replaced.origin).toEqual(other);
    expect(draftReducer(replaced, {type:'undo'})).toEqual(edited);
    expect(initial).toEqual(createDraft('Original baseline', origin));
  });
  it('preserves an existing Undo on an identical reset', () => {
    const replaced = draftReducer(createDraft('before', origin), {type:'replace', text:'after', origin:other});
    expect(draftReducer(replaced, {type:'replace', text:'after', origin:other})).toBe(replaced);
    expect(draftReducer(replaced, {type:'undo'}).text).toBe('before');
  });
  it('keeps only the previous replacement and invalidates Undo after editing', () => {
    const first = draftReducer(createDraft('a', origin), {type:'replace', text:'b', origin:other});
    const second = draftReducer(first, {type:'replace', text:'c', origin});
    expect(draftReducer(second, {type:'undo'})).toEqual(createDraft('b', other));
    const edited = draftReducer(second, {type:'edit', text:'d'});
    expect(edited.undo).toBeNull();
    expect(draftReducer(edited, {type:'undo'})).toBe(edited);
  });
  it('treats clearing to empty as an edit and supports undoing a clear replacement', () => {
    const initial = createDraft('template', origin);
    expect(draftReducer(initial, {type:'edit', text:''}).baseline).toBe('template');
    const reset = draftReducer(initial, {type:'replace', text:'', origin:{...other, template:'empty'}});
    expect(draftReducer(reset, {type:'undo'})).toEqual(initial);
  });
});
