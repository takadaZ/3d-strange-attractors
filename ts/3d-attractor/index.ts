import { attractors } from './attractors';
import { render } from './render';

window.addEventListener('DOMContentLoaded', init);

function createSelectOption(name: string) {
  const elOption = document.createElement('option');
  elOption.value = name;
  elOption.text = name;
  return elOption;
}

function createSelectName() {
  const elSelectName = getSelectName();
  Object.keys(attractors).forEach(key => {
    elSelectName.appendChild(createSelectOption(key));
  });
}

function getSelectName() {
  return document.querySelector('#selectName') as HTMLSelectElement;
}

function setDisplayElement(displayState: string, selector: string) {
  const el = document.querySelector(selector) as HTMLElement;
  el.style.display = displayState;
}

function init() {
  const elButtonDone = document.querySelector('#done') as HTMLButtonElement;
  elButtonDone.addEventListener('click', _ => {
    const attractor = getSelectName().value;
    setDisplayElement('none', '#settings');
    setDisplayElement('block', '#canvas');
    render(attractor);
  });
  createSelectName();
}
