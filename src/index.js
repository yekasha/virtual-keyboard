require('./styles/index.css');

import Keyboard from './app/resources/Keyboard';
import { keyboardLayout } from './app/common/';
import { defaultSettings } from './app/config';

document.addEventListener("DOMContentLoaded", () => {
  const { language, platofrms } = defaultSettings
  const os = (navigator.platform.includes('Win')) ? platofrms[0] : platofrms[1];
  console.log(`V-Keyboard is initiated with ${os} layout in ${language.name} language`);

  const layout = keyboardLayout[os.toLowerCase()];
  const keyboard = new Keyboard(layout, language.code);
  
  keyboard.render();
});

