import type {Chamber, TemplateId} from '../types';

export interface DraftOrigin {
  campaignId: string;
  officialId: string;
  chamber: Chamber;
  stateCode: string;
  template: TemplateId | 'empty';
  platform?: 'bluesky' | 'x';
}
export interface DraftSnapshot {
  text: string;
  baseline: string;
  origin: DraftOrigin;
}
export interface DraftState extends DraftSnapshot {
  undo: DraftSnapshot | null;
}
export type DraftAction =
  | {type: 'edit'; text: string}
  | {type: 'replace'; text: string; origin: DraftOrigin}
  | {type: 'undo'};

export function createDraft(text: string, origin: DraftOrigin): DraftState {
  return {text, baseline: text, origin, undo: null};
}

// Selection changes deliberately are not draft actions. Only explicit replacement
// changes the baseline/origin; Undo stores exact strings, without normalization.
export function draftReducer(state: DraftState, action: DraftAction): DraftState {
  switch (action.type) {
    case 'edit':
      return {...state, text: action.text, undo: null};
    case 'replace':
      if (action.text === state.text) return state;
      return {...createDraft(action.text, action.origin), undo: {
        text: state.text, baseline: state.baseline, origin: state.origin,
      }};
    case 'undo':
      return state.undo ? {...state.undo, undo: null} : state;
  }
}
