import { modifierKeys, keyboardLayout } from "../common";
import { createElement } from "../utils/createElement";

const STANDARD = 0;
const SUPER = 1;
const COMMAND = 8984;
export default class Key {
    constructor(code, value) {
        this.code = code;
        this.value = value;
        this.type = (modifierKeys.includes(this.code)) ? 'modifier' : 'alphanumeric';
        
        this.pressed = false;
    }

    render() {
        const keyClasses = (this.type === 'modifier') ? `keyboard__key ${this.code.toLowerCase()}` : 'keyboard__key';
        return createElement('button', { class: keyClasses, type: this.type, code: this.code }, this.handleKeyValues());
    }

    navigationKeys() {
        // TODO: add navigation button keys
        const navigationKeys = keyboardLayout.navigation.map(row => row.map(arrow => {
            console.log('arrow', arrow);
        }));
        return navigationKeys;
    }

    handleKeyValues() {
        const textValues = [];
        textValues.push(createElement('span', { class: 'key__value' }, this.value[STANDARD]));
        if (Number(this.value[SUPER]) === COMMAND) this.value[SUPER] = (String.fromCharCode(Number(this.value[SUPER])));
        if (this.value.length > 1) textValues.push(createElement('span', { class: 'key__superscript' }, this.value[SUPER]));

        return textValues;
    }
}