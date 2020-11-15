import { createElement } from "../utils/createElement";

export default class Keyboard {
  constructor(layout, language) {
    this.layout = layout;
    this.language = language;

    this.keyboard = null;
    this.textarea = null;
  }
  render() {
    this.renderDOMElements();
  }

  renderDOMElements() {
    // TODO: add language choice select menu and an os toggle
    const title = createElement('h1', { class: 'title' }, 'virtual keyboard');
    const languageSwitch = createElement('div', { class: 'language-switch' }, 'en / es / ru');
    const osSwitch = createElement('div', { class: 'os-switch' }, 'windows / ios');

    const header = createElement('div', { class: 'header' }, [title, languageSwitch, osSwitch]);

    this.textarea = createElement('textarea', { 
      class: 'textarea use-keyboard', 
      placeholder: 'Tap on keyboard to begin typing...', 
      autofocus: true
    });
    
    this.keyboard = createElement('div', { class: 'keyboard' });

    const infoText = createElement('div', { class: 'info' }, 'This is a simple virtual keyboard project for a course');
    const resetButton = createElement('button', { class: 'clear-button' }, 'Clear textarea');

    const mainContainer = createElement('div', { class: 'container' }, [header, this.textarea, this.keyboard, infoText, resetButton]);
    document.body.append(mainContainer);
   
    // this.keyboard.append(this.createKeys());
    // this.keys = this.keyboard.querySelectorAll('.keyboard__key');
    }
}

