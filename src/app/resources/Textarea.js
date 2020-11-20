import { UI, diacritic, supportedLanguages } from "../config";
import { createElement } from "../utils/createElement";

const EMPTY_STRING = '';
export default class Textarea {
    constructor(langIndex) {
        this.index = langIndex;
        this.value = EMPTY_STRING;
        this.selection = {
          start: 0,
          end: 0
        }
    }

    updateLanguage(lang) { 
      this.index = lang; 
      document.querySelector('textarea').value = EMPTY_STRING;
      document.querySelector('textarea').placeholder = UI.placeholder[this.index];
    }

    render() {
        return createElement('textarea', { 
            class: 'textarea use-keyboard', 
            placeholder: UI.placeholder[this.index], 
            autofocus: true
          });
    }
    
    update(input) {
      const textarea = document.querySelector('textarea');
      textarea.focus();
      
      if (input) { 
        textarea.value += input; 
        this.handleDiacritic();
      }
      else textarea.value = EMPTY_STRING;
    }

    clear() {
      document.querySelector('textarea').value = EMPTY_STRING;
      this.update();
    }


    backspace() {
      console.log('add backspace key behaviour');
      // let end = this.elements.textarea.selectionEnd;
      // let start = this.elements.textarea.selectionStart;
      // let str = this.properties.value;
      // let selectedText = str.substring(start, end);
  
      // if (selectedText.length > 0) {
      //   this.properties.value = str.replace(selectedText, '');
      //   this.updateKeyboard();
      //   return;
      // }
  
      // if (start > 0) {
      //   if (end === start) {
      //     this.properties.value = str.substring(0, start - 1) + str.substring(start, str.length);
      //     this.updateKeyboard('remove');
      //   } else {
      //     this.properties.value = str.substring(0, start) + str.substring(end, str.length);
      //     this.updateKeyboard();
      //   }
      // } else {
      //   this.updateKeyboard();
      // }
    }

    handleArrowNavigation(arrow) {
      console.log('arrow move', arrow);
    }

    handleDiacritic() {
      let textareaValue = document.querySelector('textarea').value;
      const charFromEnd = (index) => textareaValue.charCodeAt(textareaValue.length - index);
      const vowels = [97, 101, 105, 111, 117];

      if (charFromEnd(2) >= 768 && charFromEnd(2) <= 879 && vowels.includes(charFromEnd(1))) {
        const valueArr = textareaValue.split('');
        [valueArr[valueArr.length - 2], valueArr[valueArr.length - 1]] = [valueArr[valueArr.length - 1], valueArr[valueArr.length - 2]];
        this.value = valueArr.join('');
      };
    }
}
