import { keyboardLayout, modifierKeys } from "../common";
import { supportedLanguages, supportedPlatforms } from "../config";
import { UI } from "../config/constants";
import { createElement } from "../utils/createElement";
import Key from "./Key";
import Textarea from "./Textarea";

const WINDOWS = 0;
const IOS = 1;
export default class Keyboard {
  constructor(language) {
    this.activeLanguage = language;

    this.OS = (!navigator.platform.includes('Mac')) ? supportedPlatforms[WINDOWS] : supportedPlatforms[IOS];
    this.isWindows = (!navigator.platform.includes('Mac'));

    this.keyboard = null;
    this.textarea = null;

    this.languages = [];
    this.languageIndex = {};

    this.layout = [];

    this.shiftEnabled = false;
    this.capsEnabled = false;

    this.setupSupportedLanguages();
  }

  render() {
    this.renderDOMElements();
    this.setLanguageOptions();
    this.renderKeys(this.OS);
    this.handleKeyEvents();
  }

  setupSupportedLanguages() {
    supportedLanguages.forEach((language, index) => this.languageIndex[language.code] = index);
    localStorage.setItem('lang', this.activeLanguage.code);
  }

  renderDOMElements() {
    const langIndex = this.languageIndex[this.activeLanguage.code];
    const title = createElement('h1', { class: 'title' }, UI.title[langIndex]);

    supportedLanguages.forEach(lang => {
      const langOption = createElement('option', { value: lang.code, id: lang.code }, lang.name);
      this.languages.push(langOption);
    });

    const languageSwitch = createElement('select', { 
      class: 'language-switch', 
      name: 'languages',
      onChange: () => { this.setLanguageEvent() }
    }, this.languages);

    const osSwitchText = createElement('span', {}, this.OS);
    const osSwitchToggle = createElement('input', { 
      type: 'checkbox', 
      class: 'os-toggle', 
      id: 'os', 
      onClick: () => { this.setToggleEvent() }
    });
    const osSwitch = createElement('label', { class: 'os-switch', for: 'os' }, [osSwitchToggle, osSwitchText,]);

    const header = createElement('div', { class: 'header' }, [title, languageSwitch, osSwitch]);

    this.textarea = new Textarea(langIndex);
    const textarea = this.textarea.render();
    
    this.keyboard = createElement('div', { class: 'keyboard' }, this.renderKeys());

    const infoText = createElement('div', { class: 'info' }, UI.description[langIndex]);
    const resetButton = createElement('button', { class: 'clear-button' }, UI.clear[langIndex]);

    const mainContainer = createElement('div', { class: 'container' }, [header, textarea, this.keyboard, infoText, resetButton]);
    document.body.append(mainContainer);
  }

  renderKeys() {    
    this.layout = (keyboardLayout[this.OS.toLowerCase()]).map((row, rowIndex) => row.map((key, index) => { 
      const languageMatrix = this.activeLanguage.keys[this.OS.toLowerCase()];
      const value = languageMatrix[rowIndex][index];
      return key = new Key(key, value).render();
    }));
    return this.layout;
  }

  handleKeyEvents() {
    this.keyboard.addEventListener('click', e => {
      e.preventDefault();
      
      let target = e.target;
      if (target.localName === 'span') target = target.parentNode;
      if (modifierKeys.join(' ').toLowerCase().includes(target.classList.value.split(' ')[1])) this.handleModifierKey(target);
      else this.handleAlphanumericKey(target);
    });

    window.addEventListener('keydown', e => {
      e.preventDefault();

      const key = e.code;
      const pressedKey = this.keyboard.querySelector(`button[code=${key}]`);
      if (modifierKeys.includes(key)) this.handleModifierKey(pressedKey); 
      else this.handleAlphanumericKey(pressedKey);
      
      pressedKey.classList.add('key-pressed');
      setTimeout(() => { pressedKey.classList.remove('key-pressed'); }, 100);
    });
  }

  handleModifierKey(target) {
    console.log('modifier', target);
  }

  handleAlphanumericKey(prop) {
    let inputValue = this.capsEnabled ? prop.textContent.toUpperCase().charAt(0) : prop.textContent.toLowerCase().charAt(0);
    inputValue = (this.shiftEnabled) ? this.enableShiftOnKey(prop.textContent) : inputValue;
    this.textarea.update(inputValue);
  }

  enableShiftOnKey(text) {
    if (text.length === 1) return text.toUpperCase();
    else return text.charAt(1);
  }

  setLanguageOptions() {
    const languageOptions = document.querySelectorAll('option');
    languageOptions.forEach(option => option.selected = false );
    document.getElementById(this.activeLanguage.code).selected = true;
  }

  setLanguageEvent() {
    console.log('lang changed');
    // change UI lang
    // set local storage
    // change all key language...
  }

  setToggleEvent() {
    this.isWindows = !this.isWindows;
    
    this.OS = (this.isWindows) ? supportedPlatforms[WINDOWS] : supportedPlatforms[IOS];
    document.querySelector('label > span').innerText =  this.OS;
    localStorage.setItem('os',  this.OS );
  }
}

