import * as keyboard from './keyCodes.json';

const keyboardLayout = keyboard;
if (!keyboardLayout) throw new Error('Keyboard is malformed, please contact the developer');

const modifierKeys = ['Tab', 'CapsLock', 'Shift', 'Control', 'Meta', 'Alt', 'Space', 'Enter', 'Backspace']

export { keyboardLayout, modifierKeys };
