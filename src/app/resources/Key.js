import { modifierKeys, keyboardLayout } from '../common';
import { createElement } from '../utils/createElement';

const STANDARD = 0;
const SUPER = 1;
const COMMAND = 8984;

const TYPE = {
  alpha: 'alpha',
  symbol: 'snumeric',
  nav: 'navigation',
  mod: 'modifier',
};
export default class Key {
  constructor(code, value) {
    this.code = code;
    this.value = value;
    this.type = this.assignKeyType();
  }

  render() {
    const keyClasses =
      this.type === 'modifier'
        ? `keyboard__key ${this.code.toLowerCase()}`
        : 'keyboard__key';
    if (this.type === TYPE.nav) return this.navigationKeys();
    return createElement(
      'button',
      { class: keyClasses, type: this.type, code: this.code },
      this.handleKeyValues()
    );
  }

  assignKeyType() {
    if (modifierKeys.includes(this.code)) return TYPE.mod;
    if (this.code === 'Arrows') return TYPE.nav;
    if (this.value.length > 1) return TYPE.symbol;
    return TYPE.alpha;
  }

  navigationKeys() {
    const navigationKeys = keyboardLayout.navigation.map((row) =>
      row.map((arrow) => {
        this.code = arrow;
        return createElement(
          'button',
          {
            class: `keyboard__key ${this.code}`,
            type: this.type,
            code: this.code,
          },
          createElement('span', { class: 'key__value' }, '')
        );
      })
    );
    return createElement('div', { class: 'keyboard__nav' }, navigationKeys);
  }

  handleKeyValues() {
    const textValues = [];
    textValues.push(
      createElement('span', { class: 'key__value' }, this.value[STANDARD])
    );
    if (Number(this.value[SUPER]) === COMMAND)
      this.value[SUPER] = String.fromCharCode(Number(this.value[SUPER]));
    if (this.value.length > 1)
      textValues.push(
        createElement('span', { class: 'key__superscript' }, this.value[SUPER])
      );
    return textValues;
  }
}
