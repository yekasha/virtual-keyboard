const supportedLanguages = {
  english : {
    name: 'English',
    code: 'en'
  },
  spanish: {
    name: 'Spanish',
    code: 'es'
  },
  russian: {
    name: 'Russian',
    code: 'ru'
  }
};

const defaultSettings = {
  platofrms: ['Windows', 'iOS'],
  language: supportedLanguages.english
};

export {
  supportedLanguages,
  defaultSettings
};
