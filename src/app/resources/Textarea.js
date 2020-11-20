import { UI, diacritic, supportedLanguages } from "../config";
import { createElement } from "../utils/createElement";

const EMPTY_STRING = '';
export default class Textarea {
    constructor(langIndex) {
        this.index = langIndex;
        this.value = EMPTY_STRING;
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

      // TODO: fix switching caret position and input case...  (only 1 letter work for now), then caret resets
      if (input) { 
        textarea.value = `${textarea.value.substring(0, textarea.selectionStart)}${input}${textarea.value.substring(textarea.selectionEnd, textarea.value.length)}`; 
        this.handleDiacritic();
      }
      else textarea.value = EMPTY_STRING;
    }

    clear() {
      document.querySelector('textarea').value = EMPTY_STRING;
      this.update();
    }

    backspace() {
      const value = document.querySelector('textarea').value.split('');
      value.pop();
      document.querySelector('textarea').value = value.join('');
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
