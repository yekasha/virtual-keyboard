import keys from './keys.js';

const Keyboard = {
  elements: {
    main: null,
    inputField: null,
    virtualKeyboard: null,
    keys: [],
  },

  eventHandlers: {
    onInput: null,
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.inputField = document.createElement('textarea');
    this.elements.virtualKeyboard = document.createElement('div');

    const title = document.createElement('h1');
    const info = document.createElement('div');


    // Setup main elements
    this.elements.main.setAttribute('class', 'container');
    info.classList.add('info');

    title.innerHTML = 'eng / ru virtual keyboard';
    info.innerHTML = '<p>Press Ctrl + Alt to switch languages</p>';

    this.elements.inputField.setAttribute('class', 'textarea use-keyboard');
    this.elements.inputField.placeholder = 'Tap on keyboard to start...';
    this.elements.virtualKeyboard.setAttribute('class', 'keyboard');

    // Add to DOM
    document.body.append(this.elements.main);
    this.elements.main.append(title);
    this.elements.main.append(this.elements.inputField);
    this.elements.main.append(this.elements.virtualKeyboard);

    this.elements.virtualKeyboard.append(this.createKeys());
    this.elements.main.append(info);

    this.elements.keys = this.elements.virtualKeyboard.querySelectorAll('.keyboard__key');

    // Automatically use keyboard with input
    document.querySelectorAll('.use-keyboard').forEach((element) => {
      element.addEventListener('focus', () => {
        this.start(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
  },

  createKeys() {
    // Returns document fragments
    const fragment = document.createDocumentFragment();

    // Creates keyboard layouts
    this.keyCode = keys.keyCode;
    this.keyEng = keys.keyEng;
    this.keyEngCaps = keys.keyEngCaps;
    this.keyRus = keys.keyRus;
    this.keyRusCaps = keys.keyRusCaps;

    // Creates HTML for an icon
    const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

    this.keyEng.forEach((key) => {
      const keyElement = document.createElement('button');

      // Add attributes and classes
      Object.assign(keyElement, {
        className: 'keyboard__key',
        type: 'button',
      });

      switch (key) {

        case 'win':
          keyElement.classList.add('win');

          keyElement.addEventListener('click', () => {
          });
          break;

        case 'alt':
          keyElement.classList.add('alt');
          keyElement.innerHTML = 'Alt';

          keyElement.addEventListener('click', () => {
          });
          break;

        case 'ctrl':
          keyElement.classList.add('ctrl');
          keyElement.innerHTML = 'Ctrl';

          keyElement.addEventListener('click', () => {
          });
          break;

        case 'shift':
          keyElement.classList.add('shift');
          keyElement.innerHTML = 'Shift';

          keyElement.addEventListener('click', () => {
          });
          break;

        case 'space':
          keyElement.classList.add('space');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            // this refers to Keyboard object
            this.properties.value += ' ';
            this.triggerEvent('onInput');
          });

          break;

        case 'backspace':
          keyElement.classList.add('backspace');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            // this refers to Keyboard object
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this.triggerEvent('onInput');
          });

          break;

        case 'caps':
          keyElement.classList.add('caps');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            // this refers to Keyboard object
            this.toggleCapsLock();
            keyElement.classList.toggle(this.properties.capsLock);
          });

          break;

        case 'enter':
          keyElement.classList.add('enter');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            // this refers to Keyboard object
            this.properties.value += '\n';
            this.triggerEvent('onInput');
          });

          break;

        case 'tab':
          keyElement.classList.add('tab');
          keyElement.innerHTML = createIconHTML('keyboard_tab');

          keyElement.addEventListener('click', () => {
            // this refers to Keyboard object
            this.properties.value += '    ';
            this.triggerEvent('onInput');
          });

          break;

        case 'arrow_up':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_up');
          keyElement.classList.add('arrow');

          keyElement.addEventListener('click', () => {
            // this refers to Keyboard object
            this.properties.value += 'up';
            this.triggerEvent('onInput');
          });

          break;

        case 'arrow_down':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_down');
          keyElement.classList.add('arrow');

          keyElement.addEventListener('click', () => {
            // this refers to Keyboard object
            this.properties.value += 'down';
            this.triggerEvent('onInput');
          });

          break;

        case 'arrow_left':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');
          keyElement.classList.add('arrow');

          keyElement.addEventListener('click', () => {
            this.elements.inputField.selectionStart -= 1;
          });

          break;

        case 'arrow_right':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');
          keyElement.classList.add('arrow');

          keyElement.addEventListener('click', () => {
            this.elements.inputField.selectionStart += 1;
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this.triggerEvent('onInput');
          });

          break;
      }

      fragment.appendChild(keyElement);
    });

    return fragment;
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  start(initialValue, onInput) {
    this.properties.value = initialValue || '';
    this.eventHandlers.onInput = onInput;
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    this.elements.keys.forEach((key) => {
      if (key.textContent.length < 2) {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    });
  },
};

function start() {
  Keyboard.init();
}

window.addEventListener('DOMContentLoaded', start);
