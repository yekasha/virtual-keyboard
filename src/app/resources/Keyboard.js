import { keyboardLayout, modifierKeys, navigationKeys } from '../common';
import { supportedLanguages, supportedPlatforms } from '../config';
import { UI } from '../config/constants';
import { createElement } from '../utils/createElement';
import Key from './Key';
import Textarea from './Textarea';

const WINDOWS = 0;
const IOS = 1;
export default class Keyboard {
  constructor(language) {
    this.activeLanguage = language;

    this.OS = !navigator.platform.includes('Mac')
      ? supportedPlatforms[WINDOWS]
      : supportedPlatforms[IOS];

    this.isWindows = !navigator.platform.includes('Mac');

    this.keyboard = null;
    this.textarea = null;

    this.languages = [];
    this.languageIndex = {};

    this.shiftEnabled = false;
    this.capsEnabled = false;

    this.setupSupportedLanguages();
  }

  render() {
    this.renderDOMElements();
    this.setLanguageOptions();
    this.handleKeyEvents();
  }

  setupSupportedLanguages() {
    supportedLanguages.forEach(
      (language, index) => (this.languageIndex[language.code] = index)
    );
    localStorage.setItem('lang', this.activeLanguage.code);
  }

  renderDOMElements() {
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

    const langIndex = this.languageIndex[this.activeLanguage.code];
    const title = createElement(
      'h1',
      { class: 'title', type: 'text' },
      UI.title[langIndex]
    );

    const langDisabledOption = createElement(
      'option',
      {},
      'Available languages:'
    );

    langDisabledOption.selected = false;
    langDisabledOption.disabled = true;
    this.languages.push(langDisabledOption);

    supportedLanguages.forEach((lang) => {
      const langOption = createElement(
        'option',
        { value: lang.code, id: lang.code },
        lang.name
      );
      this.languages.push(langOption);
    });

    const languageSwitch = createElement(
      'select',
      {
        class: 'language-switch',
        name: 'languages',
        onchange: () => {
          this.updateLanguage();
        },
      },
      this.languages
    );

    const osSwitchText = createElement('span', {}, this.OS);
    const osSwitchToggle = createElement('input', {
      type: 'checkbox',
      class: 'os-toggle',
      id: 'os',
      onclick: () => {
        this.setToggleEvent();
      },
    });

    const osSwitch = createElement('label', { class: 'switch', for: 'os' }, [
      osSwitchToggle,
      createElement('div'),
      osSwitchText,
    ]);

    const resetButton = createElement(
      'button',
      {
        class: 'clear',
        type: 'text',
        onclick: () => {
          this.textarea.clear();
        },
      },
      UI.clear[langIndex]
    );

    const languageContainer = createElement('div', { class: 'select' }, [
      languageSwitch,
    ]);

    const header = createElement('div', { class: 'header' }, [
      title,
      osSwitch,
      languageContainer,
      resetButton,
    ]);

    this.textarea = new Textarea(langIndex);
    this.keyboard = createElement(
      'div',
      { class: 'keyboard' },
      this.renderKeys()
    );

    const infoText = createElement(
      'div',
      { class: 'info', type: 'text' },
      UI.info[langIndex]
    );
    const mainContainer = createElement('div', { class: 'container' }, [
      header,
      this.textarea.render(),
      this.keyboard,
      infoText,
    ]);
    document.body.append(mainContainer);
  }

  renderKeys() {
    return keyboardLayout[this.OS].map((row, rowIndex) =>
      row.map((key, index) => {
        const languageMatrix = this.activeLanguage.keys[this.OS];
        const value = languageMatrix[rowIndex][index];
        return (key = new Key(key, value).render());
      })
    );
  }

  addKeyboardListeners() {
    this.keyboard.addEventListener('click', (e) => {
      e.preventDefault();

      let element = e.target;

      if (element.localName === 'div') return;
      if (element.localName === 'span') element = element.parentNode;
      if (
        modifierKeys
          .join(' ')
          .toLowerCase()
          .includes(element.classList.value.split(' ')[1])
      )
        this.handleModifierKey(element);
      if (element.classList.value.includes('Arrow'))
        this.textarea.handleArrowNavigation(element);
      else this.handleAlphanumericInput(element);
    });
  }

  handleKeyEvents() {
    this.addKeyboardListeners();
    window.addEventListener('keydown', (e) => {
      e.preventDefault();

      const key = e.code;
      const pressedKey = this.keyboard.querySelector(`button[code=${key}]`);

      pressedKey.classList.add('key-pressed');
      setTimeout(() => {
        pressedKey.classList.remove('key-pressed');
      }, 150);

      if (modifierKeys.includes(key)) return this.handleModifierKey(pressedKey);
      if (navigationKeys.includes(key))
        return this.handleArrowNavigation(pressedKey);
      else return this.handleAlphanumericInput(pressedKey);
    });

    window.addEventListener('keyup', (e) => {
      if (e.code.includes('Shift')) {
        this.shiftEnabled = false;
        this.manageShiftPress();
      }
      if (e.code.includes('Caps')) {
        this.capsEnabled = false;
        this.manageLetterCase();
      }
    });
  }

  handleArrowNavigation(element) {
    const arrowCode = element.getAttribute('code');
    const textarea = document.querySelector('textarea');

    switch (arrowCode) {
      case 'ArrowUp':
        break;
      case 'ArrowDown':
        break;
      case 'ArrowLeft':
        if (textarea.selectionEnd > 0) textarea.selectionEnd -= 1;
        break;
      case 'ArrowRight':
        textarea.selectionStart += 1;
        break;
      default:
        break;
    }
  }

  handleModifierKey(element) {
    const keyCode = element.getAttribute('code');
    switch (keyCode) {
      case 'Space':
        this.textarea.update(' ');
        break;
      case 'Enter':
        console.log('enter is pressed');
        this.textarea.update('\n');
        break;
      case 'Tab':
        this.textarea.update('\t');
        break;
      case 'Backspace':
        this.textarea.backspace();
        break;
      case 'CapsLock':
        this.capsEnabled = !this.capsEnabled;
        this.manageLetterCase();
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.shiftEnabled = !this.shiftEnabled;
        this.manageShiftPress();
        break;
      default:
        break;
    }
  }

  handleAlphanumericInput(prop) {
    let inputValue = this.capsEnabled
      ? prop.textContent.toUpperCase().charAt(0)
      : prop.textContent.toLowerCase().charAt(0);
    inputValue = this.shiftEnabled
      ? this.enableShiftedInput(prop.textContent)
      : inputValue;
    this.textarea.update(inputValue);
  }

  enableShiftedInput(text) {
    if (text.length === 1) return text.toUpperCase();
    else return text.charAt(1);
  }

  manageLetterCase() {
    const charKeys = this.keyboard.querySelectorAll('[type=alpha] > span');
    charKeys.forEach((key) => {
      key.innerText =
        this.capsEnabled || this.shiftEnabled
          ? key.innerText.toUpperCase()
          : key.innerText.toLowerCase();
    });
  }

  manageShiftPress() {
    this.manageLetterCase();
    const keysToShift = this.keyboard.querySelectorAll('[type=snumeric]');

    keysToShift.forEach((key) => {
      key.classList.toggle('shifted');
    });
  }

  setLanguageOptions() {
    const languageCode = document.querySelector('select').value;
    localStorage.setItem('lang', languageCode);

    supportedLanguages.forEach((language) => {
      if (languageCode === language.code) this.activeLanguage = language;
    });
  }

  updateKeyboardKeys() {
    document.querySelector('.keyboard').remove();
    this.keyboard = createElement(
      'div',
      { class: 'keyboard' },
      this.renderKeys()
    );
    document
      .querySelector('textarea')
      .insertAdjacentElement('afterend', this.keyboard);

    this.addKeyboardListeners();
  }

  updateUIText() {
    const UIElements = document.querySelectorAll('[type="text"]');
    UIElements.forEach((element) => {
      element.innerText =
        UI[element.classList][this.languageIndex[this.activeLanguage.code]];
    });
  }

  updateLanguage() {
    this.setLanguageOptions();
    this.textarea.updateLanguage(this.languageIndex[this.activeLanguage.code]);
    this.updateUIText();
    this.updateKeyboardKeys();
  }

  setToggleEvent() {
    this.isWindows = !this.isWindows;
    this.OS = this.isWindows
      ? supportedPlatforms[WINDOWS]
      : supportedPlatforms[IOS];
    document.querySelector('label > span').innerText = this.OS;
    localStorage.setItem('os', this.OS);

    this.updateKeyboardKeys();
  }
}
