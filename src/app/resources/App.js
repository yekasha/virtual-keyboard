import Keyboard from './Keyboard';
import { supportedLanguages } from '../config';
export default class App {
  constructor() {
    this.keyboard = null;
  }

  render() {
    document.addEventListener('DOMContentLoaded', () => {
      const currentLanguage = supportedLanguages[0];
      this.keyboard = new Keyboard(currentLanguage);
      this.keyboard.render();
    });
  }
}
