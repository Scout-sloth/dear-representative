// Best-effort compatibility path. Browsers may disable this deprecated command.
function copyWithSelection(text: string): boolean {
  if (typeof document.execCommand !== 'function') return false;

  // Capture immediately before the fallback, not before an asynchronous permission
  // request: the visitor may have moved focus or edited their selection meanwhile.
  const active = document.activeElement;
  const control = active instanceof HTMLTextAreaElement || active instanceof HTMLInputElement ? active : null;
  const caret = control && control.selectionStart !== null
    ? {start: control.selectionStart, end: control.selectionEnd!, direction: control.selectionDirection}
    : null;
  const selection = window.getSelection();
  const ranges = selection ? Array.from({length: selection.rangeCount}, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
  const anchor = selection?.anchorNode;
  const focus = selection?.focusNode;
  const anchorOffset = selection?.anchorOffset ?? 0;
  const focusOffset = selection?.focusOffset ?? 0;
  const scrollTop = control?.scrollTop;
  const scrollLeft = control?.scrollLeft;
  const temporary = document.createElement('textarea');
  temporary.value = text;
  temporary.readOnly = true;
  temporary.tabIndex = -1;
  temporary.style.cssText = 'position:fixed;top:0;left:-9999px;font-size:16px;';

  try {
    document.body.append(temporary);
    temporary.focus({preventScroll: true});
    temporary.select();
    temporary.setSelectionRange(0, text.length);
    return document.execCommand('copy') === true;
  } catch {
    return false;
  } finally {
    temporary.remove();
    if (active instanceof HTMLElement && active.isConnected) active.focus({preventScroll: true});
    if (selection) {
      selection.removeAllRanges();
      for (const range of ranges) selection.addRange(range);
      if (ranges.length === 1 && anchor?.isConnected && focus?.isConnected && typeof selection.setBaseAndExtent === 'function') {
        selection.setBaseAndExtent(anchor, anchorOffset, focus, focusOffset);
      }
    }
    if (control?.isConnected && caret) {
      control.setSelectionRange(caret.start, caret.end, caret.direction ?? undefined);
      control.scrollTop = scrollTop!;
      control.scrollLeft = scrollLeft!;
    }
  }
}

export async function copyPhoneText(text: string): Promise<boolean> {
  if (typeof navigator.clipboard?.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission or browser policy can reject even in a secure context.
    }
  }
  return copyWithSelection(text);
}
