export default function DraftUndo({available, label, onUndo}: {
  available: boolean;
  label: 'letter' | 'social';
  onUndo: () => void;
}) {
  return available ? <button type="button" className="button secondary" onClick={onUndo} aria-label={`Undo ${label} draft replacement`}>Undo</button> : null;
}

export function DraftUndoStatus({available, label}: {available: boolean; label: 'letter' | 'social'}) {
  return <div className="hint draft-undo-status" aria-live="polite" aria-atomic="true">
    {available && `${label === 'letter' ? 'Letter' : 'Social'} draft replaced. Undo is available until you edit or replace this draft.`}
  </div>;
}
