const container = document.createElement('div');
container.setAttribute('class', 'container');
document.body.append(container);

const title = document.createElement('h1');
title.innerHTML = 'eng / ru virtual keyboard';
container.append(title);

const inputField = document.createElement('input');
const placeholderText = 'Tap on the keyboard to start...';
inputField.setAttribute('class', 'input');
inputField.placeholder = placeholderText;
container.append(inputField);

const virtualKeyboard = document.createElement('div');
virtualKeyboard.setAttribute('class', 'keyboard');
container.append(virtualKeyboard);

const row = document.createElement('div');
row.setAttribute('class', 'row');
virtualKeyboard.append(row);

const key = document.createElement('button');
Object.assign(key, {
  className: 'keyboard__key',
  type: 'button',
  innerHTML: '2',
});
row.append(key);

const sup = document.createElement('sup');
Object.assign(sup, {
  innerHTML: '@',
});
key.prepend(sup);
