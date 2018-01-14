import { attractors } from './attractors';
import { render, disposeGL } from './render';
import { view, scan } from 'ramda';
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

const glState: GLState | any = {
  gl: null,
  animate: true,
};

function resetRenderer() {
  const attractor = getSelectName().value;
  const canvas = getByCss('#canvas');
  disposeGL(canvas);
  glState.gl = render(canvas, attractor, document.body.clientWidth, document.body.clientHeight);
  tick(glState)();
}

function tick(state: GLState) {
  return () => {
    const { renderer, scene, camera, line } = state.gl;
    if (state.animate) { 
      requestAnimationFrame(tick(state));
      // 箱を回転させる
      line.rotation.x += 0.01;
      line.rotation.y += 0.01;
    }
    // レンダリング
    renderer.render(scene, camera);
  }
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
  setEvents('.pause',
    ['click', _ => {
      glState.animate = false;
      setDisplayElements('none', '.pause');
      setDisplayElements('block', '.play_arrow');
    }]
  );
  setEvents('.play_arrow',
    ['click', _ => {
      glState.animate = true;
      setDisplayElements('block', '.pause');
      setDisplayElements('none', '.play_arrow');
      tick(glState)();
    }]
  );

  createSelectName();
}

window.addEventListener('resize', resetRenderer)
window.addEventListener('DOMContentLoaded', init);
