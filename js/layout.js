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
      language: localStorage.getItem('lang'),
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

    clear.innerHTML = 'Clear Textarea';

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
    //this.elements.main.append(clear);

    this.elements.keys = this.elements.keyboard.querySelectorAll('.keyboard__key');
  }

  createKeys() {
    // Returns document fragments
    const fragment = document.createDocumentFragment();
    const { properties,elements } = this;

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
        case '':
          keyElement.classList.add('win');
          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
          });
          break;

        case 'Alt':
          keyElement.classList.add('alt');
          keyElement.innerHTML = 'Alt';
          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
          });
          break;

        case 'Ctrl':
          keyElement.classList.add('ctrl');
          keyElement.innerHTML = 'Ctrl';
          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
          });
          break;

        case 'Shift':
          keyElement.classList.add('shift');
          keyElement.innerHTML = 'Shift';
          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
          });
          break;

        case 'Space':
          keyElement.classList.add('space');
          keyElement.innerHTML = 'Space';
          //keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();

            properties.value += ' ';
            this.triggerEvent();
          });
          break;

        case 'Backspace':
          keyElement.classList.add('backspace');
          keyElement.innerHTML = 'Backspace';
         // keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();

            properties.value = properties.value.substring(0, properties.value.length - 1);
            this.triggerEvent();
          });
          break;

        case 'Caps Lock':
          keyElement.classList.add('caps');
          keyElement.innerHTML = 'Caps Lock';
         // keyElement.innerHTML = createIconHTML('keyboard_capslock');

          keyElement.addEventListener('click', () => {
            this.toggleCaps();
            keyElement.classList.toggle(properties.capsLock);
          });
          break;

        case 'Enter':
          keyElement.classList.add('enter');
          keyElement.innerHTML = 'Enter';
         // keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();

            properties.value += '\n';
            this.triggerEvent();
          });
          break;

        case 'Tab':
          keyElement.classList.add('tab');
          keyElement.innerHTML = 'Tab';
         // keyElement.innerHTML = createIconHTML('keyboard_tab');

          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();

            properties.value += '    ';
            this.triggerEvent();
          });
          break;

        case '▲':
         // keyElement.innerHTML = createIconHTML('keyboard_arrow_up');
          keyElement.classList.add('arrow');
          keyElement.innerHTML = '▲';

          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
            properties.value += '▲';
            this.triggerEvent();
          });
          break;

        case '▼':
         // keyElement.innerHTML = createIconHTML('keyboard_arrow_down');
          keyElement.classList.add('arrow');
          keyElement.innerHTML = '▼';

          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
            properties.value += '▼';
            this.triggerEvent();
          });
          break;

        case '◄':
         // keyElement.innerHTML = createIconHTML('keyboard_arrow_left');
          keyElement.classList.add('arrow');
          keyElement.innerHTML = '◄';

          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
            elements.textarea.selectionEnd -= 1;
          });
          break;

        case '►':
         // keyElement.innerHTML = createIconHTML('keyboard_arrow_right');
          keyElement.classList.add('arrow');
          keyElement.innerHTML = '►';

          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
            elements.textarea.selectionStart += 1;
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener('click', (e) => {
            this.defaultFocus();
            const keyRegister = properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            properties.value += keyRegister;
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
      .forEach((e) => this.togglePress(e));  
        
        switch (key) {
          case 'Backspace':
            this.defaultFocus();
            if (elements.textarea.selectionStart > 0) {
              if (elements.textarea.selectionEnd === elements.textarea.selectionStart) {
                properties.value = properties.value.substring(0, elements.textarea.selectionStart - 1) + properties.value.substring(elements.textarea.selectionStart, properties.value.length);
                this.addValue(key, 'remove');
              } else {
                properties.value = properties.value.substring(0, elements.textarea.selectionStart) + properties.value.substring(elements.textarea.selectionEnd, properties.value.length);
                this.addValue(key);
              }
            } else { 
              this.addValue(key); 
            }
            break;
  
          case 'Delete':
           this.defaultFocus();
            break;
            
          case 'Tab':
            this.defaultFocus();
            properties.value = `${properties.value.substring(0, elements.textarea.selectionStart)}    ${properties.value.substring(elements.textarea.selectionStart, properties.value.length)}`;
            this.addValue(key, 'add');
            break;    
  
          case 'CapsLock':
            //this.defaultFocus();
            this.toggleCaps();
    
            break;
  
          case 'Enter':
            this.defaultFocus();
            properties.value = `${properties.value.substring(0, elements.textarea.selectionStart)}\n${properties.value.substring(elements.textarea.selectionStart, properties.value.length)}`;
            this.addValue(key, 'add');
            break;
  
          case 'Space':
            this.defaultFocus();
            properties.value = `${properties.value.substring(0, elements.textarea.selectionStart)} ${properties.value.substring(elements.textarea.selectionStart, properties.value.length)}`;
            this.addValue(key, 'add');
            break;
  
          case 'ShiftLeft':
          case 'ShiftRight':
            if (!event.repeat) {
              console.log('all test');
              this.pressed.add(event.code);
              properties.shift = true;
  
              if (properties.language === 'en') {
                console.log('en test');
                for (let i = 0; i < elements.keys.length; i++) {
                  elements.keys[i].innerHTML = this.enShift[i];
                }
              } else { 
            
                for (let i = 0; i < elements.keys.length; i++) {
                  console.log('ru 2 test');
                  elements.keys[i].innerHTML = this.ruShift[i];
                }
              }
            }
            break;
          case 'ControlLeft':
          case 'ControlRight':
            this.defaultFocus();
            break;

  
          case 'AltRight':
            event.preventDefault();
            break;
  
          case 'AltLeft':
            event.preventDefault();
            this.pressed.add(event.code);
            break;
  
          case 'ArrowUp':
            this.defaultFocus();
            properties.value += '▲';
            this.triggerEvent();
            break;

          case 'ArrowDown':
            this.defaultFocus();
            properties.value += '▼';
            this.triggerEvent();
            break;

          case 'ArrowLeft':
            this.defaultFocus();
            elements.textarea.selectionEnd -= 1;
            break;

          case 'ArrowRight':
            this.defaultFocus();
            elements.textarea.selectionStart += 1;
            break;

          default:
              this.defaultFocus();
              
              let symbol;
              if (properties.capsLock && properties.shift) { 
                symbol = elements.keys[codes.indexOf(key)].textContent.toLowerCase(); 
              } else if (this.checkRegister(elements.keys[codes.indexOf(key)].textContent) && properties.shift) { 
                symbol = !properties.capsLock ? elements.keys[codes.indexOf(key)].textContent.toUpperCase() : elements.keys[codes.indexOf(key)].textContent.toLowerCase(); }
                else {
                symbol = properties.capsLock ? elements.keys[codes.indexOf(key)].textContent.toUpperCase() : elements.keys[codes.indexOf(key)].textContent.toLowerCase();
              }
              properties.value = + symbol + properties.value.substring(elements.textarea.selectionStart, properties.value.length);
              this.addValue(key,'add');
           
            break;
        }  
    });

    window.addEventListener('keyup', (event) => {
      const { properties, elements } = this;
     
      if (event.key === 'Shift') {
        
        properties.shift = false;
        if (properties.language === 'en') {
          for (let i = 0; i < elements.keys.length; i++) {
            elements.keys[i].innerHTML = this.en[i];
          }
        } else { 
          for (let i = 0; i < elements.keys.length; i++) {
            elements.keys[i].innerHTML = this.ru[i];
          }
        }
        }

        if (this.pressed.size === 2) {
          console.log(this.pressed.size);
          properties.language = properties.language === 'ru' ? 'en' : 'ru';
          localStorage.setItem('lang', properties.language);
          [...this.elements.keyboard.children].forEach((e) => e.remove());
          elements.keyboard.appendChild(this.createKeys());
          elements.keys = elements.keyboard.querySelectorAll('.keyboard-key');
        }
        this.pressed = new Set();

    });
  }



  // Helper functions
  defaultFocus() {
    this.elements.textarea.focus();
    event.preventDefault();
  }

  triggerEvent() {
    this.elements.textarea.value = this.properties.value;
  }

  toggleCaps() {
    const { properties } = this;
    properties.capsLock = !properties.capsLock;
    for (const e of this.elements.keys) {
      if (e.textContent.length < 2) { 
        e.textContent = properties.capsLock ? e.textContent.toUpperCase() : e.textContent.toLowerCase(); 
      }
    }
  }

  addValue(element, selection) {
    const { elements, properties } = this;
    
    switch(selection) {
      case 'add':
        selection = elements.textarea.selectionStart += elements.textarea.selectionStart;
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

  checkRegister(value) {
    let checker = (value === value.toUpperCase()) ? true : false;
    return checker;
  }

  togglePress(element) {
    element.classList.add('key-pressed');
    setTimeout(() => {
        element.classList.remove('key-pressed');
      }, 100);
    }
}




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


window.addEventListener('DOMContentLoaded', () => {
  const keyboard = new Keyboard();
  return keyboard;
});
