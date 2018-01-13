import { attractors } from './attractors';
import { render, disposeGL } from './render';
import { view } from 'ramda';
import { win32 } from 'path';

function getByCss(selector: string) {
  return document.querySelector(selector) as HTMLElement;
}

function setEvents(selector: string, ...events: [string, EventListener][]) {
  events.forEach(([eventType, listener]) => getByCss(selector).addEventListener(eventType, listener));
}

function createSelectOption(name: string) {
  const elOption = document.createElement('option');
  elOption.value = name;
  elOption.text = name;
  return elOption;
}

function createSelectName() {
  const elSelectName = getSelectName();
  Object.keys(attractors).map(key => elSelectName.appendChild(createSelectOption(key)));
}

function getSelectName() {
  return getByCss('#selectName') as HTMLSelectElement;
}

function setDisplayElements(displayState: string, ...selectors: string[]) {
  selectors.forEach(selector => getByCss(selector).style.display = displayState);
}

function resetRenderer() {
  const attractor = getSelectName().value;
  const canvas = getByCss('#canvas');
  disposeGL(canvas);
  render(canvas, attractor, document.body.clientWidth, document.body.clientHeight);
}

function init() {
  setEvents('#done',
    ['click', _ => {
      setDisplayElements('none', '#settings');
      setDisplayElements('block', '#canvas', '#ope-icons');
      resetRenderer();
    }]
  );
  setEvents('#canvas',
    ['mousemove', _ => {
      function hideEl() {
        switchStyle('3s', '0', 'hidden', '-100px');
      }
      function switchStyle(delay: string, opacity: string, visibility: string, top: string) {
        const opeIcons = getByCss('#ope-icons');
        const transitionend = 'transitionend';
        opeIcons.removeEventListener(transitionend, hideEl);
        if (visibility = 'visible') {
          opeIcons.addEventListener(transitionend, hideEl);
        }
        opeIcons.style.transitionDelay = delay;
        opeIcons.style.opacity = opacity;
        opeIcons.style.visibility = visibility; 
        opeIcons.style.top = top;     
      }
      switchStyle('0.1s', '1', 'visible', '0');
    }]
  );
  setEvents('.arrow_back',
    ['click', _ => {
      setDisplayElements('block', '#settings');
      setDisplayElements('none', '#canvas', '#ope-icons');
      disposeGL(getByCss('#canvas'));
    }]
  );
  setEvents('.fullscreen',
    ['click', _ => {
      const canvas = getByCss('#canvas') as HTMLDivElement | any;
      if (canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
      } else {
        canvas.mozRequestFullScreen();
      }
    }]);

  createSelectName();
}

window.addEventListener('resize', resetRenderer)
window.addEventListener('DOMContentLoaded', init);
