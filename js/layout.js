import keys from './keys.js';

class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      textarea: null,
      keyboard: null,
      keys: [],
    };

    this.properties = {
      value: '',
      capsLock: false,
      shift: false,
      language: 'en', // localStorage.getItem('lang')
    };

    this.eventHandlers = {
      onInput: null,
    };

    this.codes = keys.code;
    this.pressed = new Set();
    this.init();
  }

  init() {
    this.createElements();

    window.addEventListener('keydown', (event) => {
      const key = event.code;

      Array.from(this.elements.keys)
        .filter((e) => e.dataset.code === key)
        .forEach((e) => this.pressedKey(e, true));
    });
  }

  createElements() {
    // Create elements
    this.elements.main = document.createElement('div');
    this.elements.textarea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');

    const title = document.createElement('h1');
    const info = document.createElement('div');

    // Setup elements
    this.elements.main.setAttribute('class', 'container');

    title.innerHTML = 'eng / ru virtual keyboard';

    info.classList = 'info';
    info.innerHTML = '<p>Press Ctrl + Alt to switch languages (project\'s based on Windows OS layout)</p>';

    this.elements.textarea.setAttribute('class', 'textarea use-keyboard');
    this.elements.textarea.placeholder = 'Tap on keyboard to start...';
    this.elements.textarea.autofocus = true;

    this.elements.keyboard.setAttribute('class', 'keyboard');

    // Add to DOM
    document.body.append(this.elements.main);
    this.elements.main.append(title);
    this.elements.main.append(this.elements.textarea);
    this.elements.main.append(this.elements.keyboard);

    this.elements.keyboard.append(this.createKeys());
    this.elements.main.append(info);

    this.elements.keys = this.elements.keyboard.querySelectorAll('.keyboard__key');
  }

  createKeys() {
    // Returns document fragments
    const fragment = document.createDocumentFragment();
    const { properties } = this;

    // Creates keyboard layouts
    this.code = keys.code;
    this.en = keys.en;
    this.enCaps = keys.enShift;
    this.ru = keys.ru;
    this.ruCaps = keys.ruShift;

    // Apply set layout
    let keysLayout;
    if (this.properties.language === 'en') {
      keysLayout = this.en;
    } else keysLayout = this.ru;

    // Creates HTML for an icon
    const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

    keysLayout.forEach((key, i) => {
      const keyElement = document.createElement('button');

      // Add attributes and classes
      Object.assign(keyElement, {
        className: 'keyboard__key',
        type: 'button',
      });

      keyElement.dataset.code = this.code[keysLayout.indexOf(key, i)];

      switch (key) {
        case 'win':
          keyElement.classList.add('win');
          this.defaultClick(keyElement);
          break;

        case 'alt':
          keyElement.classList.add('alt');
          keyElement.innerHTML = 'Alt';
          this.defaultClick(keyElement);
          break;

        case 'ctrl':
          keyElement.classList.add('ctrl');
          keyElement.innerHTML = 'Ctrl';
          this.defaultClick(keyElement);
          break;

        case 'shift':
          keyElement.classList.add('shift');
          keyElement.innerHTML = 'Shift';
          this.defaultClick(keyElement);
          break;

        case 'space':
          keyElement.classList.add('space');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();

            properties.value += ' ';
            this.triggerEvent('onInput');
          });
          break;

        case 'backspace':
          keyElement.classList.add('backspace');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();

            properties.value = properties.value.substring(0, properties.value.length - 1);
            this.triggerEvent('onInput');
          });
          break;

        case 'caps':
          keyElement.classList.add('caps');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle(properties.capsLock);
          });
          break;

        case 'enter':
          keyElement.classList.add('enter');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();

            properties.value += '\n';
            this.triggerEvent('onInput');
          });
          break;

        case 'tab':
          keyElement.classList.add('tab');
          keyElement.innerHTML = createIconHTML('keyboard_tab');

          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();

            properties.value += '    ';
            this.triggerEvent('onInput');
          });
          break;

        case 'arrow_up':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_up');
          keyElement.classList.add('arrow');

          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();
            properties.value += 'up';
            this.triggerEvent('onInput');
          });
          break;

        case 'arrow_down':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_down');
          keyElement.classList.add('arrow');

          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();
            properties.value += 'down';
            this.triggerEvent('onInput');
          });
          break;

        case 'arrow_left':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');
          keyElement.classList.add('arrow');

          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();
            this.elements.textarea.selectionStart -= 1;
          });
          break;

        case 'arrow_right':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');
          keyElement.classList.add('arrow');

          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();
            this.elements.textarea.selectionStart += 1;
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener('click', (e) => {
            this.elements.textarea.focus();
            e.preventDefault();
            const keyRegister = this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            properties.value += keyRegister;
            this.triggerEvent('onInput');
          });
          break;
      }
      fragment.appendChild(keyElement);
    });
    return fragment;
  }

  defaultClick(item) {
    item.addEventListener('click', (e) => {
      this.elements.textarea.focus();
      e.preventDefault();
    });
  }

  triggerEvent(handlerName) {
   if (handlerName === 'onInput') {
     this.elements.textarea.value = this.properties.value;
   }
  }

}

// pressedKey(el, bool) {
//   el.classList.toggle('key-pressed', bool);
//   if (el.textContent === 'win') {
//     setTimeout(() => {
//       el.classList.toggle('key-pressed', false);
//     }, 100);
//   }
// }

// changeLanguage() {
//    Change language on Ctrl + Alt
//   document.addEventListener('keydown', (event) => {
//     if (event.ctrlKey === true && event.altKey === true) {
//       if (this.properties.lang === 'en') {
//         this.properties.lang = 'ru';
//         localStorage.setItem('lang', this.properties.lang);
//         this.createKeys();
//       } else {
//         this.properties.lang = 'en';
//         localStorage.setItem('lang', this.properties.lang);
//         this.createKeys();
//       }
//     }
//   });
// }
// start(initialValue, onInput) {
//   this.properties.value = initialValue || '';
//   this.eventHandlers.onInput = onInput;
// }

// toggleCapsLock() {
//   let cap = this.properties.capsLock;
//   cap = !cap;

//   for (const key of this.elements.keys) {
//     if (key.textContent.length === 1) {
// key.textContent = this.properties.capsLock ?
// key.textContent.toUpperCase() : key.textContent.toLowerCase();
//     }
//   }
// }

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();
  return keyboard;
});
