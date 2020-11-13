import keys from './keys.js';

class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      textarea: null,
      keyboard: null,
      keys: []
    };

    this.properties = {
      value: '',
      capsLock: false,
      shift: false,
      language: localStorage.getItem('lang')
    };

    this.codes = keys.code;
    this.pressed = new Set();
    this.init();
  }

  init() {
    this.createElements();
    this.keypressEvents();
  }

  createElements() {
    // Create elements
    this.elements.main = document.createElement('div');
    this.elements.textarea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');

    const clear = document.createElement('button');
    const title = document.createElement('h1');
    const info = document.createElement('div');

    // Setup elements
    this.elements.main.setAttribute('class', 'container');

    title.innerHTML = 'eng / ru virtual keyboard';

    clear.setAttribute('class', 'clear-button');
    clear.innerHTML = 'Clear Textarea';
    clear.addEventListener('click', () => {
      this.clearInput();
    });

    info.classList = 'info';
    info.innerHTML = '<p>Press Shift + Alt to switch languages (project\'s based on Windows OS layout)</p>';

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
    this.elements.main.append(clear);

    this.elements.keys = this.elements.keyboard.querySelectorAll('.keyboard__key');
  }

  createKeys() {
    // Returns document fragments
    const fragment = document.createDocumentFragment();
    const { properties, elements } = this;

    // Creates keyboard layouts
    this.code = keys.code;
    this.en = keys.en;
    this.enShift = keys.enShift;
    this.ru = keys.ru;
    this.ruShift = keys.ruShift;

    // Apply set layout
    let keysLayout;
    if (properties.language === 'en') {
      keysLayout = this.en;
    } else keysLayout = this.ru;

    // Creates HTML for an icon

    keysLayout.forEach((key, i) => {
      const keyElement = document.createElement('button');

      // Add attributes and classes
      Object.assign(keyElement, {
        className: 'keyboard__key',
        type: 'button'
      });

      keyElement.dataset.code = this.code[keysLayout.indexOf(key, i)];

      switch (key) {
        case '':
          keyElement.classList.add('win');
          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
          });
          break;

        case 'Alt':
          keyElement.classList.add('alt');
          keyElement.innerHTML = 'Alt';
          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
          });
          break;

        case 'Ctrl':
          keyElement.classList.add('ctrl');
          keyElement.innerHTML = 'Ctrl';
          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
          });
          break;

        case 'Shift':
          keyElement.classList.add('shift');
          keyElement.innerHTML = 'Shift';
          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
            this.shiftToggle(event);
          });
          break;

        case 'Space':
          keyElement.classList.add('space');
          keyElement.innerHTML = 'Space';

          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);

            properties.value += ' ';
            this.triggerEvent();
          });
          break;

        case 'Backspace':
          keyElement.classList.add('backspace');
          keyElement.innerHTML = 'Backspace';

          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
            this.backspace();
          });
          break;

        case 'Caps Lock':
          keyElement.classList.add('caps');
          keyElement.innerHTML = 'Caps Lock';

          keyElement.addEventListener('click', () => {
            this.toggleCaps();
            keyElement.classList.toggle(properties.capsLock);
          });
          break;

        case 'Enter':
          keyElement.classList.add('enter');
          keyElement.innerHTML = 'Enter';

          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);

            properties.value += '\n';
            this.triggerEvent();
          });
          break;

        case 'Tab':
          keyElement.classList.add('tab');
          keyElement.innerHTML = 'Tab';

          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);

            properties.value += '    ';
            this.triggerEvent();
          });
          break;

        case '▲':
          keyElement.classList.add('arrow');
          keyElement.innerHTML = '▲';

          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
            properties.value += '▲';
            this.triggerEvent();
          });
          break;

        case '▼':
          keyElement.classList.add('arrow');
          keyElement.innerHTML = '▼';

          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
            properties.value += '▼';
            this.triggerEvent();
          });
          break;

        case '◄':
          keyElement.classList.add('arrow');
          keyElement.innerHTML = '◄';

          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
            if (elements.textarea.selectionStart > 0) {
              elements.textarea.selectionEnd -= 1;
            }
          });
          break;

        case '►':
          keyElement.classList.add('arrow');
          keyElement.innerHTML = '►';

          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
            elements.textarea.selectionStart += 1;
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener('click', (event) => {
            this.defaultFocus(event);
            properties.value += keyElement.textContent;
            this.triggerEvent();
          });
          break;
      }
      fragment.appendChild(keyElement);
    });
    return fragment;
  }

  keypressEvents() {
    window.addEventListener('keydown', (event) => {
      const key = event.code;
      const { properties, elements, codes } = this;

      Array.from(elements.keys).filter((e) => e.dataset.code === key)
        .forEach((e) => Keyboard.togglePress(e));

      // Aux vars declaration
      let keySymbol;
      let char = elements.keys[codes.indexOf(key)].textContent;

      let start = elements.textarea.selectionStart;
      let str = properties.value;

      switch (key) {
        case 'Backspace':
          this.defaultFocus(event);
          this.backspace();
          break;

        case 'Delete':
          this.defaultFocus(event);
          break;

        case 'Tab':
          this.defaultFocus(event);
          properties.value += '\t';
          this.updateKeyboard('add');
          break;

        case 'CapsLock':
          this.toggleCaps();

          break;

        case 'Enter':
          this.defaultFocus(event);
          properties.value += '\n';
          this.updateKeyboard('add');
          break;

        case 'Space':
          this.defaultFocus(event);
          properties.value += ' ';
          this.updateKeyboard('add');
          break;

        case 'ShiftLeft':
        case 'ShiftRight':
          if (!event.repeat) {
            this.shiftToggle(event);
          }
          break;
        case 'ControlLeft':
        case 'ControlRight':
          this.defaultFocus(event);
          break;

        case 'AltRight':
          event.preventDefault();
          break;

        case 'AltLeft':
          event.preventDefault();
          this.pressed.add(event.code);
          break;

        case 'ArrowUp':
          this.defaultFocus(event);
          properties.value += '▲';
          this.triggerEvent();
          break;

        case 'ArrowDown':
          this.defaultFocus(event);
          properties.value += '▼';
          this.triggerEvent();
          break;

        case 'ArrowLeft':
          this.defaultFocus(event);
          if (start > 0) {
            elements.textarea.selectionEnd -= 1;
          }
          break;

        case 'ArrowRight':
          this.defaultFocus(event);
          elements.textarea.selectionStart += 1;
          break;

        default:
          this.defaultFocus(event);

          if (properties.capsLock && properties.shift) {
            keySymbol = char.toLowerCase();
          } else if (Keyboard.checkRegister(char) && properties.shift) {
            keySymbol = !properties.capsLock ? char.toUpperCase() : char.toLowerCase();
          } else {
            keySymbol = properties.capsLock ? char.toUpperCase() : char.toLowerCase();
          }
          properties.value = str.substring(0, start) + keySymbol + str.substring(start, str.length);
          this.updateKeyboard('add');

          break;
      }
    });

    window.addEventListener('keyup', (event) => {
      const { properties, elements } = this;

      if (this.pressed.size === 2) {
        properties.language = properties.language === 'ru' ? 'en' : 'ru';
        localStorage.setItem('lang', properties.language);
      }

      if (event.key === 'Shift') {
        properties.shift = false;
        if (properties.language === 'en') {
          for (let i = 0; i < elements.keys.length; i += 1) {
            elements.keys[i].innerHTML = this.en[i];
          }
        } else {
          for (let i = 0; i < elements.keys.length; i += 1) {
            elements.keys[i].innerHTML = this.ru[i];
          }
        }
      }

      this.pressed = new Set();
    });
  }

  // Aux functions
  defaultFocus(event) {
    this.elements.textarea.focus();
    event.preventDefault();
  }

  triggerEvent() {
    this.elements.textarea.value = this.properties.value;
  }

  toggleCaps() {
    const { properties } = this;
    properties.capsLock = !properties.capsLock;

    this.elements.keys.forEach((e) => {
      let text = e.textContent;
      if (text.length < 2) {
        e.textContent = properties.capsLock ? text.toUpperCase() : text.toLowerCase();
      }
    });
  }

  shiftToggle(event) {
    this.pressed.add(event.code);
    this.properties.shift = true;

    if (this.properties.language === 'en') {
      for (let i = 0; i < this.elements.keys.length; i += 1) {
        this.elements.keys[i].innerHTML = this.enShift[i];
      }
    } else {
      for (let i = 0; i < this.elements.keys.length; i += 1) {
        this.elements.keys[i].innerHTML = this.ruShift[i];
      }
    }
  }

  clearInput() {
    this.properties.value = '';
    this.updateKeyboard();
    this.elements.textarea.focus();
  }

  updateKeyboard(mode) {
    const { elements, properties } = this;

    let selection = 0;

    switch (mode) {
      case 'add':
        selection = elements.textarea.selectionStart + 1;
        break;
      case 'remove':
        selection = elements.textarea.selectionStart - 1;
        break;
      default:
        selection = elements.textarea.selectionStart;
        break;
    }

    elements.textarea.value = properties.value;
    elements.textarea.selectionStart = selection;
    elements.textarea.selectionEnd = selection;
  }

  backspace() {
    let end = this.elements.textarea.selectionEnd;
    let start = this.elements.textarea.selectionStart;
    let str = this.properties.value;
    let selectedText = str.substring(start, end);

    if (selectedText.length > 0) {
      this.properties.value = str.replace(selectedText, '');
      this.updateKeyboard();
      return;
    }

    if (start > 0) {
      if (end === start) {
        this.properties.value = str.substring(0, start - 1) + str.substring(start, str.length);
        this.updateKeyboard('remove');
      } else {
        this.properties.value = str.substring(0, start) + str.substring(end, str.length);
        this.updateKeyboard();
      }
    } else {
      this.updateKeyboard();
    }
  }

  static checkRegister(value) {
    let checker = (value === value.toUpperCase());
    return checker;
  }

  static togglePress(element) {
    element.classList.add('key-pressed');
    setTimeout(() => {
      element.classList.remove('key-pressed');
    }, 100);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();
  return keyboard;
});
