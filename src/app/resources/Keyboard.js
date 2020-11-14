export default class Keyboard {
  constructor(layout, language) {
    this.layout = layout;
    this.language = language;

    this.keyboard = null;
    this.textarea = null;
  }
  render() {
    console.log('Keyboard', this.layout, this.language);
    this.renderElements();
  }

  renderElements() {
    // TODO: add language choice select menu and an os toggle

      const mainContainer = document.createElement('div');
      mainContainer.setAttribute('class', 'container');

      this.textarea = document.createElement('textarea');
      this.textarea.setAttribute('class', 'textarea use-keyboard');
      this.textarea.placeholder = 'Tap on keyboard to begin typing...';
      this.textarea.autofocus = true;

      this.keyboard = document.createElement('div');
      this.keyboard.setAttribute('class', 'keyboard');
  
      const resetButton = document.createElement('button');
      resetButton.setAttribute('class', 'clear-button');
      resetButton.innerHTML = 'Clear Textarea';

      const title = document.createElement('h1');
      title.innerHTML = 'virtual keyboard';

      const infoText = document.createElement('div');
      infoText.classList = 'info';
      infoText.innerHTML = '<p>This is a simple virtual keyboard project for a course</p>';
  
      // Add to DOM
      document.body.append(mainContainer);
      mainContainer.append(title);
      mainContainer.append(this.textarea);
      mainContainer.append(this.keyboard);
  
      // this.keyboard.append(this.createKeys());
      // this.keys = this.keyboard.querySelectorAll('.keyboard__key');

      mainContainer.append(infoText);
      mainContainer.append(resetButton);
    }
}

