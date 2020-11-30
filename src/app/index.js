import '../styles/main.scss';

import Keyboard from './resources/Keyboard';
import { supportedLanguages } from './config';

document.addEventListener('DOMContentLoaded', () => {
  const currentLanguage = supportedLanguages[0];
  const keyboard = new Keyboard(currentLanguage);
  keyboard.render();
});

import BackgroundTheme from './utils/backgroundTheme';
