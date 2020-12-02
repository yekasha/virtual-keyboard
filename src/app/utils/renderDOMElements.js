import { UI } from '../config';
import { createElement } from './createElement';

function showFeaturePanel() {
  const panel = document.querySelector('.feature-panel');
  panel.classList.toggle('visible');
}

function renderFeaturePanel() {
  const text = createElement('h2', {}, 'Features');
  const listItems = [];

  UI.features.forEach((item) => {
    listItems.push(createElement('li', {}, item));
  });

  const list = createElement('ul', {}, listItems);
  return [
    createElement('p', {}, '🦄'),
    createElement('div', { class: 'container' }, [text, list]),
  ];
}

export const DOMElements = {
  featurePanel: () => {
    return createElement(
      'div',
      {
        class: 'feature-panel',
        onclick: () => {
          showFeaturePanel();
        },
      },
      renderFeaturePanel()
    );
  },

  subtext: (index) => {
    return createElement(
      'div',
      { class: 'info', type: 'text' },
      UI.info[index]
    );
  },

  title: (index) => {
    return createElement(
      'h1',
      { class: 'title', type: 'text' },
      UI.title[index]
    );
  },
  disabledOption: () => {
    const option = createElement('option', {}, 'Available languages:');

    option.selected = false;
    option.disabled = true;

    return option;
  },
};
