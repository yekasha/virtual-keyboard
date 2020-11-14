const appendChild = (parent, child) => {
	if (Array.isArray(child)) child.forEach((nestedChild) => appendChild(parent, nestedChild));
	parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};

export const createElement = (tag, props, ...children) => {
	const element = document.createElement(tag)

	Object.entries(props || {}).forEach(([name, value]) => {
		if (name.startsWith('on') && name.toLowerCase() in window) element.addEventListener(name.toLowerCase().substr(2), value);
		element.setAttribute(name, value.toString());
	});

	children.forEach((child) => {
		appendChild(element, child)
	});

	return element;
};