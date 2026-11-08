import {afterEach, describe, expect, it, vi} from 'vitest';
import {copyPhoneText} from './clipboard';

afterEach(() => {
  document.body.replaceChildren();
  window.getSelection()?.removeAllRanges();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, 'execCommand');
});

function command(result: boolean | Error) {
  const copy = vi.fn(() => {
    const temporary = document.activeElement as HTMLTextAreaElement;
    expect(temporary.value).toBe('(202) 225-0855');
    expect(temporary.selectionStart).toBe(0);
    expect(temporary.selectionEnd).toBe(14);
    if (result instanceof Error) throw result;
    return result;
  });
  Object.defineProperty(document, 'execCommand', {value: copy, configurable: true});
  return copy;
}

describe('phone clipboard helper', () => {
  it('prefers the asynchronous API without creating temporary controls', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {clipboard: {writeText}});
    const fallback = command(true);
    expect(await copyPhoneText('(202) 225-0855')).toBe(true);
    expect(writeText).toHaveBeenCalledWith('(202) 225-0855');
    expect(fallback).not.toHaveBeenCalled();
    expect(document.querySelector('textarea')).toBeNull();
  });

  it.each([true, false, new Error('blocked')])('restores editor focus, backwards selection and scroll after fallback result %s', async result => {
    vi.stubGlobal('navigator', {});
    const editor = document.createElement('textarea');
    editor.value = 'An existing message';
    document.body.append(editor);
    editor.focus();
    editor.setSelectionRange(3, 11, 'backward');
    editor.scrollTop = 20;
    editor.scrollLeft = 4;
    command(result);
    expect(await copyPhoneText('(202) 225-0855')).toBe(result === true);
    expect(document.activeElement).toBe(editor);
    expect(editor.value).toBe('An existing message');
    expect([editor.selectionStart, editor.selectionEnd, editor.selectionDirection]).toEqual([3, 11, 'backward']);
    expect([editor.scrollTop, editor.scrollLeft]).toEqual([20, 4]);
    expect(document.querySelectorAll('textarea')).toHaveLength(1);
  });

  it('preserves an input caret when the asynchronous API rejects', async () => {
    vi.stubGlobal('navigator', {clipboard:{writeText:vi.fn().mockRejectedValue(new Error('denied'))}});
    const input = document.createElement('input');
    input.value = 'Alex';
    document.body.append(input);
    input.focus();
    input.setSelectionRange(2, 2);
    command(true);
    expect(await copyPhoneText('(202) 225-0855')).toBe(true);
    expect(document.activeElement).toBe(input);
    expect([input.selectionStart, input.selectionEnd]).toEqual([2, 2]);
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('restores a backwards document selection and button focus on failure', async () => {
    vi.stubGlobal('navigator', {});
    const button = document.createElement('button');
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Selectable preview';
    document.body.append(button, paragraph);
    button.focus();
    const text = paragraph.firstChild!;
    const selection = window.getSelection()!;
    selection.setBaseAndExtent(text, 8, text, 2);
    command(false);
    expect(await copyPhoneText('(202) 225-0855')).toBe(false);
    expect(document.activeElement).toBe(button);
    expect([selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset]).toEqual([text, 8, text, 2]);
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('leaves focus alone if neither clipboard mechanism exists', async () => {
    vi.stubGlobal('navigator', {});
    Object.defineProperty(document, 'execCommand', {value:undefined, configurable:true});
    expect(await copyPhoneText('(202) 225-0855')).toBe(false);
    expect(document.body.children).toHaveLength(0);
  });

  it('restores the current editor state if focus changes while the API is pending', async () => {
    let reject!: (error: Error) => void;
    vi.stubGlobal('navigator', {clipboard:{writeText:() => new Promise<void>((_, fail) => {reject = fail;})}});
    const result = copyPhoneText('(202) 225-0855');
    const editor = document.createElement('textarea');
    editor.value = 'New editing position';
    document.body.append(editor);
    editor.focus();
    editor.setSelectionRange(5, 5);
    command(true);
    reject(new Error('denied'));
    expect(await result).toBe(true);
    expect(document.activeElement).toBe(editor);
    expect([editor.selectionStart, editor.selectionEnd]).toEqual([5, 5]);
  });
});
