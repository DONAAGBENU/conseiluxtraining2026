export function isBlockedExamShortcut(event: KeyboardEvent): boolean {
  if (!event) return false;

  const key = event.key.toLowerCase();
  const modKeyPressed = event.ctrlKey || event.metaKey || event.altKey;

  if (!modKeyPressed && !['f5', 'f12', 'escape', 'printscreen', 'home', 'end', 'pageup', 'pagedown'].includes(key)) {
    return false;
  }

  const blockedModifierKeys = ['c', 'v', 'x', 'a', 'p', 's', 'u', 'w', 't', 'r', 'n', 'l', 'g', 'm', 'd', 'j', 'i', 'y', 'z', 'q'];

  if ((event.ctrlKey || event.metaKey) && (blockedModifierKeys.includes(key) || (event.shiftKey && key === 'i'))) {
    return true;
  }

  if (event.altKey && ['tab', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) {
    return true;
  }

  return ['f5', 'f12', 'escape', 'printscreen', 'home', 'end', 'pageup', 'pagedown'].includes(key);
}

export function isBlockedClipboardAction(event: Event): boolean {
  const type = event.type.toLowerCase();
  return ['copy', 'cut', 'paste', 'beforecopy', 'beforecut', 'beforepaste', 'contextmenu'].includes(type);
}
