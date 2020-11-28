import '../styles/main.scss';

import Keyboard from './resources/Keyboard';
import { supportedLanguages } from './config';

document.addEventListener('DOMContentLoaded', () => {
  const currentLanguage = supportedLanguages[0];
  const keyboard = new Keyboard(currentLanguage);
  keyboard.render();
});

['|', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', "'", '¿'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '´', '+'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ', '{', '}'],
  ['<', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-'];
