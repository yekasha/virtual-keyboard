export default class Keyboard {
  constructor(layout, language) {
    this.layout = layout;
    this.language = language;
  }
  render() {
    console.log('Keyboard', this.layout, this.language);
  }
}