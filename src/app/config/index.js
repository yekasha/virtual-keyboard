import { UI } from './constants';

import ENGLISH from './lang/en.lang.json';
import SPANISH from './lang/es.lang.json';
import RUSSIAN from './lang/ru.lang.json';

const supportedLanguages = [ENGLISH, SPANISH, RUSSIAN];
const supportedPlatforms = ['Windows', 'iOS'];

export {
  supportedLanguages,
  supportedPlatforms,
  UI
};
