import test from 'node:test';
import assert from 'node:assert/strict';

import { isBlockedExamShortcut, isBlockedClipboardAction } from './examSecurity.ts';

test('blocks common cheat shortcuts', () => {
  const ctrlV = { key: 'v', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
  const ctrlC = { key: 'c', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
  const cmdShiftI = { key: 'i', ctrlKey: false, metaKey: true, shiftKey: true, altKey: false } as KeyboardEvent;

  assert.equal(isBlockedExamShortcut(ctrlV), true);
  assert.equal(isBlockedExamShortcut(ctrlC), true);
  assert.equal(isBlockedExamShortcut(cmdShiftI), true);
});

test('blocks clipboard actions used for cheating', () => {
  const copy = { type: 'copy' } as Event;
  const paste = { type: 'paste' } as Event;
  const cut = { type: 'cut' } as Event;

  assert.equal(isBlockedClipboardAction(copy), true);
  assert.equal(isBlockedClipboardAction(paste), true);
  assert.equal(isBlockedClipboardAction(cut), true);
});
