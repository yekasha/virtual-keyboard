import { defaultSettings } from '../config';
import * as keyboard from './keyCodes.json';

const keyboardLayout = keyboard.filter(preset => preset.layout === defaultSettings.layout);
if (!keyboardLayout) throw new Error('Keyboard layout is malformed, please check config');

// const keysMap = keyboardLayout.keys;
// const arrowMap = keyboardLayout.navigation;

export default { keyboardLayout };
