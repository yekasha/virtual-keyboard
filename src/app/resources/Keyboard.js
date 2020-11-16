import { supportedLanguages, supportedPlatforms } from "../config";
import { UI } from "../config/constants";
import { createElement } from "../utils/createElement";

const WINDOWS = 0;
const IOS = 1;
export default class Keyboard {
  constructor(language) {
    this.activeLanguage = language;

    this.activeLayout = (!navigator.platform.includes('Mac')) ? supportedPlatforms[WINDOWS] : supportedPlatforms[IOS];
    this.isWindows = (!navigator.platform.includes('Mac'));

    this.keyboard = null;
    this.textarea = null;

    this.languages = [];
    this.languageIndex = {};

    this.setupSupportedLanguages();
  }

  render() {
    this.renderDOMElements();
    this.setLanguageOption();
  }

  setupSupportedLanguages() {
    supportedLanguages.forEach((language, index) => this.languageIndex[language.code] = index);
    this.setLocalStorage(this.activeLanguage.code);
  }

  setLocalStorage(code) {
    localStorage.setItem('lang', code);
  }

  renderDOMElements() {
    const langIndex = this.languageIndex[this.activeLanguage.code];
    const title = createElement('h1', { class: 'title' }, UI.title[langIndex]);

    supportedLanguages.forEach(lang => {
      const langOption = createElement('option', { value: lang.code, id: lang.code }, lang.name);
      this.languages.push(langOption);
    });

    const languageSwitch = createElement('select', { class: 'language-switch', name: 'languages' }, this.languages);

    const osSwitchText = createElement('span', {}, this.activeLayout);
    const osSwitchToggle = createElement('input', { 
      type: 'checkbox', 
      class: 'os-toggle', 
      id: 'os', 
      onClick: () => { this.setToggleEvent() }
    });
    const osSwitch = createElement('label', { class: 'os-switch', for: 'os' }, [osSwitchToggle, osSwitchText,]);

    const header = createElement('div', { class: 'header' }, [title, languageSwitch, osSwitch]);

    this.textarea = createElement('textarea', { 
      class: 'textarea use-keyboard', 
      placeholder: UI.placeholder[langIndex], 
      autofocus: true
    });
    
    this.keyboard = createElement('div', { class: 'keyboard' });

    const infoText = createElement('div', { class: 'info' }, UI.description[langIndex]);
    const resetButton = createElement('button', { class: 'clear-button' }, UI.clear[langIndex]);

    const mainContainer = createElement('div', { class: 'container' }, [header, this.textarea, this.keyboard, infoText, resetButton]);
    document.body.append(mainContainer);
   
    // this.keyboard.append(this.createKeys());
    // this.keys = this.keyboard.querySelectorAll('.keyboard__key');
    }

  setLanguageOption() {
    const languageOptions = document.querySelectorAll('option');
    languageOptions.forEach(option => option.selected = false );
    document.getElementById(this.activeLanguage.code).selected = true;
  }

  setToggleEvent() {
    this.isWindows = !this.isWindows;
    
    this.activeLayout = (this.isWindows) ? supportedPlatforms[WINDOWS] : supportedPlatforms[IOS];
    document.querySelector('label > span').innerText =  this.activeLayout;
    localStorage.setItem('os',  this.activeLayout );
  }
}

