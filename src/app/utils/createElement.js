const appendChild = (parent, child) => {
  if (Array.isArray(child))
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
  else
    parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};

export const createElement = (tag, props, ...children) => {
  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]) => {
    console.log(name.startsWith('on'), name in window);
    if (name.startsWith('on') && name in window) {
      console.log('CREATE ELEMENT', value);
      element.addEventListener(name.substr(2), value);
    } else element.setAttribute(name, value.toString());
  });

  children.forEach((child) => appendChild(element, child));
  return element;
};
