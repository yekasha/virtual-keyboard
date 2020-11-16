import { UI } from "../config";
import { createElement } from "../utils/createElement";

export default class Textarea {
    constructor(index) {
        this.index = index;
        this.value = '';
        this.selection = {
          start: 0,
          end: 0
        }
    }

    render() {
        return createElement('textarea', { 
            class: 'textarea use-keyboard', 
            placeholder: UI.placeholder[this.index], 
            autofocus: true
          });
    }

    update(input) {
      const domElement = document.querySelector('textarea');
      domElement.focus();
      domElement.value += input;
    }

    focus(e) {
      this.focus();
      e.preventDefault();
    }

    clear() {
      document.querySelector('textarea').value = '';
      this.update();
      this.focus();
    }

}