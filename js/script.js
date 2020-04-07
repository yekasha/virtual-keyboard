class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      textarea: null,
      keyboard: null,
      keysContainer: null,
      keys: [],
    };

    this.properties = {
      valueInput: '',
      capsLock: false,
      shift: false,
      language: localStorage.getItem('lang'),
    };

    this.codes = [
      'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
      'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Delete',
      'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',
      'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight',
      'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'Home', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'End',
    ];

    this.firstRowShift = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'];
    this.firstRow = ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
    this.codesToChange = ['BracketLeft', 'BracketRight', 'Semicolon', 'Quote', 'Comma', 'Period', 'Slash'];
    this.specificButtons = ['Tab', 'CapsLock', 'ShiftLeft', 'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'Home', 'End', 'ShiftRight', 'Enter', 'Delete', 'Backspace'];

    this.pressed = new Set();

    this.init();
  }

  init() {
    document.body.innerHTML = `<div class="note">
                                  <p>Made on Windows</p>
                                  <p>Changing the language to LeftShift and LeftAlt keys</p>
                                </div>`;
    this.elements.main = document.createElement('div');
    this.elements.textarea = document.createElement('textarea');
    this.elements.keyboard = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('main');
    this.elements.keyboard.setAttribute('id', 'keyboard');
    this.elements.keysContainer.classList.add('keyboard-buttons');

    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard-key');

    this.elements.keyboard.appendChild(this.elements.keysContainer);
    this.elements.main.appendChild(this.elements.textarea);
    this.elements.main.appendChild(this.elements.keyboard);

    document.body.appendChild(this.elements.main);


    document.addEventListener('mouseup', () => {
      [...this.elements.keys].map((el) => (el.textContent === 'CapsLock' ? this.properties.capsLock ? el.classList.add('keyboard-key-pressed') : el.classList.remove('keyboard-key-pressed') : el.classList.remove('keyboard-key-pressed')));
    });

    window.addEventListener('keydown', (event) => {
      const key = event.code;

      Array.from(this.elements.keys)
        .filter((el) => el.dataset.code === key)
        .forEach((el) => this._togglePress(el, true));
      switch (key) {
        case 'Backspace':
          this.elements.textarea.focus();
          event.preventDefault();
          if (this.elements.textarea.selectionStart !== 0) {
            if (this.elements.textarea.selectionEnd === this.elements.textarea.selectionStart) {
              this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart - 1) + this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length);
              this._oninput(key, this.elements.textarea.selectionStart - 1);
            } else {
              this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart) + this.properties.valueInput.substring(this.elements.textarea.selectionEnd, this.properties.valueInput.length);
              this._oninput(key, this.elements.textarea.selectionStart);
            }
          } else { this._oninput(key, this.elements.textarea.selectionStart); }

          break;

        case 'Delete':
          this.elements.textarea.focus();
          event.preventDefault();
          if (this.elements.textarea.selectionEnd === this.elements.textarea.selectionStart) { this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart) + this.properties.valueInput.substring(this.elements.textarea.selectionStart + 1, this.properties.valueInput.length); } else { this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart) + this.properties.valueInput.substring(this.elements.textarea.selectionEnd, this.properties.valueInput.length); }
          this._oninput(key, this.elements.textarea.selectionStart);

          break;

        case 'Tab':
          this.elements.textarea.focus();
          event.preventDefault();
          this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)}\t${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
          this._oninput(key, ++this.elements.textarea.selectionStart);
          break;

        case 'CapsLock':
          this._toggleCapsLock();
          Array.from(this.elements.keys).find((el) => el.textContent === event.key).classList.toggle('keyboard-key-pressed', this.properties.capsLock);
          break;

        case 'Enter':
          this.elements.textarea.focus();
          event.preventDefault();
          this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)}\n${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
          this._oninput(key, ++this.elements.textarea.selectionStart);

          break;

        case 'Space':
          this.elements.textarea.focus();
          event.preventDefault();
          this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)} ${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
          this._oninput(key, ++this.elements.textarea.selectionStart);

          break;

        case 'ShiftLeft':
          if (!event.repeat) {
            this.pressed.add(event.code);
            this.properties.shift = true;

            if (this.properties.language === 'en') {
              this.elements.keys[this.codes.indexOf('BracketLeft')].textContent = '{';
              this.elements.keys[this.codes.indexOf('BracketRight')].textContent = '}';
              this.elements.keys[this.codes.indexOf('Semicolon')].textContent = ':';
              this.elements.keys[this.codes.indexOf('Quote')].textContent = '"';
              this.elements.keys[this.codes.indexOf('Comma')].textContent = '<';
              this.elements.keys[this.codes.indexOf('Period')].textContent = '>';
              this.elements.keys[this.codes.indexOf('Slash')].textContent = '?';
            } else { this.elements.keys[this.codes.indexOf('Slash')].textContent = ','; }
            if (this.firstRowShift[0] === 'ё' && this.properties.language === 'en') {
              this.firstRowShift.shift();
              this.firstRowShift.unshift('~');
            } else if (this.firstRowShift[0] === '~' && this.properties.language === 'ru') {
              this.firstRowShift.shift();
              this.firstRowShift.unshift('ё');
            }
            for (let i = 0; i < 13; i++) {
              this.elements.keys[i].textContent = this.firstRowShift[i];
            }
            for (const key of this.elements.keys) {
              if (key.textContent.length === 1) {
                if (this._isUpper(key.textContent)) { key.textContent = key.textContent.toLowerCase(); } else { key.textContent = key.textContent.toUpperCase(); }
              }
            }

            if (this.properties.capsLock) { this.elements.keys[0].textContent = this.elements.keys[0].textContent.toLowerCase(); } else { this.elements.keys[0].textContent = this.elements.keys[0].textContent.toUpperCase(); }
          }
          break;

        case 'ShiftRight':
          if (!event.repeat) {
            this.properties.shift = true;

            if (this.properties.language === 'en') {
              this.elements.keys[this.codes.indexOf('BracketLeft')].textContent = '{';
              this.elements.keys[this.codes.indexOf('BracketRight')].textContent = '}';
              this.elements.keys[this.codes.indexOf('Semicolon')].textContent = ':';
              this.elements.keys[this.codes.indexOf('Quote')].textContent = '"';
              this.elements.keys[this.codes.indexOf('Comma')].textContent = '<';
              this.elements.keys[this.codes.indexOf('Period')].textContent = '>';
              this.elements.keys[this.codes.indexOf('Slash')].textContent = '?';
            } else { this.elements.keys[this.codes.indexOf('Slash')].textContent = ','; }
            if (this.firstRowShift[0] === 'ё' && this.properties.language === 'en') {
              this.firstRowShift.shift();
              this.firstRowShift.unshift('~');
            } else if (this.firstRowShift[0] === '~' && this.properties.language === 'ru') {
              this.firstRowShift.shift();
              this.firstRowShift.unshift('ё');
            }
            for (let i = 0; i < 13; i++) {
              this.elements.keys[i].textContent = this.firstRowShift[i];
            }
            for (const key of this.elements.keys) {
              if (key.textContent.length === 1) {
                if (this._isUpper(key.textContent)) { key.textContent = key.textContent.toLowerCase(); } else { key.textContent = key.textContent.toUpperCase(); }
              }
            }

            if (this.properties.capsLock) { this.elements.keys[0].textContent = this.elements.keys[0].textContent.toLowerCase(); } else { this.elements.keys[0].textContent = this.elements.keys[0].textContent.toUpperCase(); }
          }
          break;

        case 'Home':
          this.elements.textarea.focus();
          event.preventDefault();
          this._oninput(key, 0);
          break;

        case 'End':
          this.elements.textarea.focus();
          event.preventDefault();
          this._oninput(key, this.properties.valueInput.length);
          break;

        case 'ControlLeft':
        case 'ControRight':
          break;

        case key.includes('Meta'):
          break;

        case 'AltRight':
          event.preventDefault();
          break;

        case 'AltLeft':
          event.preventDefault();
          this.pressed.add(event.code);
          break;


        default:
          if (!this.specificButtons.includes(key)) {
            console.log(key);
            this.elements.textarea.focus();
            event.preventDefault();
            console.log(this.elements.keys[this.codes.indexOf(key)].textContent);
            let keySymbol;
            if (this.properties.capsLock && this.properties.shift) { keySymbol = this.elements.keys[this.codes.indexOf(key)].textContent.toLowerCase(); } else
            if (this._isUpper(this.elements.keys[this.codes.indexOf(key)].textContent) && this.properties.shift) { keySymbol = !this.properties.capsLock ? this.elements.keys[this.codes.indexOf(key)].textContent.toUpperCase() : this.elements.keys[this.codes.indexOf(key)].textContent.toLowerCase(); } else {
              console.log(this.properties.capsLock);
              keySymbol = this.properties.capsLock ? this.elements.keys[this.codes.indexOf(key)].textContent.toUpperCase() : this.elements.keys[this.codes.indexOf(key)].textContent.toLowerCase();
            }
            this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart) + keySymbol + this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length);
            this._oninput(key, ++this.elements.textarea.selectionStart);
          }

          break;
      }
      // console.log(this.pressed);
    });

    window.addEventListener('keyup', (event) => {
      console.log(event);
      if (event.key === 'Shift') {
        this.properties.shift = false;
        if (this.properties.language === 'en') {
          this.elements.keys[this.codes.indexOf('BracketLeft')].textContent = '[';
          this.elements.keys[this.codes.indexOf('BracketRight')].textContent = ']';
          this.elements.keys[this.codes.indexOf('Semicolon')].textContent = ';';
          this.elements.keys[this.codes.indexOf('Quote')].textContent = '\'';
          this.elements.keys[this.codes.indexOf('Comma')].textContent = ',';
          this.elements.keys[this.codes.indexOf('Period')].textContent = '.';
          this.elements.keys[this.codes.indexOf('Slash')].textContent = '/';
        } else { this.elements.keys[this.codes.indexOf('Slash')].textContent = '.'; }

        if (this.firstRow[0] === 'ё' && this.properties.language === 'en') {
          this.firstRow.shift();
          this.firstRow.unshift('`');
        } else if (this.firstRow[0] === '`' && this.properties.language === 'ru') {
          this.firstRow.shift();
          this.firstRow.unshift('Ё');
        }
        for (let i = 0; i < 13; i++) {
          this.elements.keys[i].textContent = this.firstRow[i];
        }
        for (const key of this.elements.keys) {
          if (key.textContent.length === 1) {
            if (this._isUpper(key.textContent)) {
              key.textContent = key.textContent.toLowerCase();
            } else { key.textContent = key.textContent.toUpperCase(); }
          }
        }
        if (this.properties.capsLock) { this.elements.keys[0].textContent = this.elements.keys[0].textContent.toUpperCase(); } else { this.elements.keys[0].textContent = this.elements.keys[0].textContent.toLowerCase(); }
      }
      if (event.key !== 'CapsLock') {
        Array.from(this.elements.keys)
          .filter((el) => el.dataset.code === event.code)
          .forEach((el) => this._togglePress(el, false));
      }
      if (this.pressed.size === 2) {
        this.properties.language = this.properties.language === 'ru' ? 'en' : 'ru';
        localStorage.setItem('lang', this.properties.language);
        [...this.elements.keysContainer.children].forEach((el) => el.remove());
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard-key');
      }
      this.pressed.delete(event.code);
    });
  }

  _createKeys() {
    const fragment = document.createDocumentFragment();

    const keysLayout = this.properties.language === 'ru' ? [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'delete',
      'capslock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
      'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '↑', 'rshift',
      'ctrl', 'win', 'alt', 'space', 'alt', 'ctrl', 'home', '←', '↓', '→', 'end',
    ] : [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
      'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'delete',
      'capslock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
      'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '↑', 'rshift',
      'ctrl', 'win', 'alt', 'space', 'alt', 'ctrl', 'home', '←', '↓', '→', 'end',
    ];

    keysLayout.forEach((key, i) => {
      const keyElement = document.createElement('button');

      keyElement.classList.add('keyboard-key');
      keyElement.setAttribute('type', 'button');

      keyElement.dataset.code = this.codes[keysLayout.indexOf(key, i)];

      const lineBreak = ['backspace', 'delete', 'enter', 'rshift', 'end'].includes(key);

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Backspace';

          keyElement.addEventListener('mousedown', () => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');

            if (this.elements.textarea.selectionStart !== 0) {
              if (this.elements.textarea.selectionEnd === this.elements.textarea.selectionStart) {
                this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart - 1) + this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length);
                this._oninput(key, this.elements.textarea.selectionStart - 1);
              } else {
                this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart) + this.properties.valueInput.substring(this.elements.textarea.selectionEnd, this.properties.valueInput.length);
                this._oninput(key, this.elements.textarea.selectionStart);
              }
            } else { this._oninput(key, this.elements.textarea.selectionStart); }
          });
          break;

        case 'delete':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Delete';

          keyElement.addEventListener('mousedown', () => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');

            if (this.elements.textarea.selectionEnd === this.elements.textarea.selectionStart) { this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart) + this.properties.valueInput.substring(this.elements.textarea.selectionStart + 1, this.properties.valueInput.length); } else { this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart) + this.properties.valueInput.substring(this.elements.textarea.selectionEnd, this.properties.valueInput.length); }
            this._oninput(key, this.elements.textarea.selectionStart);
          });
          break;

        case 'tab':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Tab';

          keyElement.addEventListener('mousedown', () => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)}\t${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
            this._oninput(key, ++this.elements.textarea.selectionStart);
          });
          break;

        case 'capslock':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'CapsLock';

          keyElement.addEventListener('mousedown', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard-key-pressed', this.properties.capsLock);
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Enter';

          keyElement.addEventListener('mousedown', () => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)}\n${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
            this._oninput(key, ++this.elements.textarea.selectionStart);
          });
          break;

        case 'space':
          keyElement.classList.add('keyboard-key-extra-wide');

          keyElement.addEventListener('mousedown', () => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this.properties.valueInput = `${this.properties.valueInput.substring(0, this.elements.textarea.selectionStart)} ${this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length)}`;
            this._oninput(key, ++this.elements.textarea.selectionStart);
          });
          break;

        case 'shift':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Shift';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
          });

          break;

        case 'rshift':
          keyElement.classList.add('keyboard-key-wide');
          keyElement.innerHTML = 'Shift';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
          });

          break;

        case 'home':
          keyElement.innerHTML = 'Home';

          keyElement.addEventListener('mousedown', () => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this._oninput(key, 0);
          });
          break;

        case 'end':
          keyElement.innerHTML = 'End';

          keyElement.addEventListener('mousedown', () => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            this._oninput(key, this.properties.valueInput.length);
          });
          break;

        case 'ctrl':
          keyElement.innerHTML = 'Ctrl';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
          });
          break;

        case 'win':
          keyElement.innerHTML = 'Win';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
          });
          break;

        case 'alt':
          keyElement.innerHTML = 'Alt';

          keyElement.addEventListener('mousedown', () => {
            keyElement.classList.add('keyboard-key-pressed');
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('mousedown', () => {
            this.elements.textarea.focus();
            event.preventDefault();
            keyElement.classList.add('keyboard-key-pressed');
            const keySymbol = this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this.properties.valueInput = this.properties.valueInput.substring(0, this.elements.textarea.selectionStart) + keySymbol + this.properties.valueInput.substring(this.elements.textarea.selectionStart, this.properties.valueInput.length);
            this._oninput(key, ++this.elements.textarea.selectionStart);
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (lineBreak) {
        const breakk = document.createElement('div');
        breakk.classList.add('break');
        fragment.appendChild(breakk);
      }
    });
    return fragment;
  }

  _oninput(handlerName, sS) {
    this.elements.textarea.value = this.properties.valueInput;

    this.elements.textarea.selectionStart = sS;
    this.elements.textarea.selectionEnd = sS;
  }

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.textContent.length === 1) { key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase(); }
    }
  }

  _togglePress(element, option) {
    element.classList.toggle('keyboard-key-pressed', option);
    if (element.textContent === 'Win') {
      setTimeout(() => {
        element.classList.toggle('keyboard-key-pressed', false);
      }, 100);
    }
    // console.log(element);
    // console.log(option);
  }

  _isUpper(str) {
    if (str === str.toUpperCase()) return true;
    return false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();
});
