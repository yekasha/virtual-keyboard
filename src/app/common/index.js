import * as keyboard from './keyCodes.json';

const keyboardLayout = keyboard;
if (!keyboardLayout) throw new Error('Keyboard is malformed, please contact the developer');

const modifierKeys = ['Tab', 'CapsLock', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight', 'AltLeft', 'AltRight', 'Space', 'Enter', 'Backspace']

export { keyboardLayout, modifierKeys };
