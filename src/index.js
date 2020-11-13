// import Keyboard from './resources/Keyboard';
// import Key from './resources/Key';

import { defaultSettings } from './app/config';

// require('normalize.css/normalize.css');
require('./styles/index.css');

document.addEventListener("DOMContentLoaded", () => {
  console.log(`Keyboard initiated with ${defaultSettings.layout} layout in "${defaultSettings.language}" language`);

  // const keyConfiguration = new Key(defaultSettings.language);
  // return new Keyboard(keyConfiguration);
});

