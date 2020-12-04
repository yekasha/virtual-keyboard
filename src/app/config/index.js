import { UI, diacritic } from './constants';

import ENGLISH from './lang/en.lang.json';
import SPANISH from './lang/es.lang.json';
import RUSSIAN from './lang/ru.lang.json';

const supportedLanguages = [ENGLISH, SPANISH, RUSSIAN];
const supportedPlatforms = ['windows', 'macos'];

export { supportedLanguages, supportedPlatforms, UI, diacritic };
