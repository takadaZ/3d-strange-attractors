import { attractors } from './attractors';
import { render, disposeGL } from './render';
import { Camera } from 'three';

function getByCss(selector: string) {
  return document.querySelector(selector) as HTMLElement;
}

function getsByCss(selector: string) {
  return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
}

function setEvents(selector: string, ...events: [string, EventListener][]) {
  getsByCss(selector).forEach(el => {
    events.forEach(([eventType, listener]) => el.addEventListener(eventType, listener));
  });
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

function setDisplay(displayState: string, selector: string) {
  getsByCss(selector).forEach(el => el.style.display = displayState);
}

interface Animation {
  enabled: boolean,
  handle: number,
}

class State {
  gl: GL | any;
  animation: Animation = {
    enabled: true,
    handle: 0
  };
}

const glState: State = new State();

function resetRenderer() {
  cancelAnimation();
  switchAnimation(glState.animation.enabled);
  const attractor = getSelectName().value;
  const canvas = getByCss('#canvas');
  disposeGL(canvas);
  glState.gl = render(canvas, attractor, document.body.clientWidth, document.body.clientHeight);
  tick(glState)(0);
}

// レンダリング
function tick(state: State) {
  return (timestamp: number) => {
    const { renderer, scene, camera, controls, line } = state.gl;
    controls.autoRotate = state.animation.enabled;
    controls.update();
    state.animation.handle = requestAnimationFrame(tick(state));
    renderer.render(scene, camera);
  }
}

function cancelAnimation() {
  if (glState.animation.handle) {
    cancelAnimationFrame(glState.animation.handle);
    glState.animation.handle = 0;
  }
}

function switchAnimation(animation: boolean) {
  glState.animation.enabled = animation;
  setDisplay(animation ? 'none' : 'block', '.play_arrow');
  setDisplay(animation ? 'block' : 'none', '.pause');
}

function init() {
  setEvents('#done',
    ['click', _ => {
      setDisplay('none', '#settings');
      setDisplay('block', '#canvas,#ope-icons i');
      resetRenderer();
    }]
  );
  setEvents('#canvas,#ope-icons',
    ['mousemove', _ => getsByCss('#ope-icons i').forEach(el => el.style.animation = 'fade-in-out 3s ease 0.1s forwards')]
  );
  setEvents('.arrow_back',
    ['click', _ => {
      setDisplay('block', '#settings');
      setDisplay('none', '#canvas,#ope-icons i');
      disposeGL(getByCss('#canvas'));
      const { renderer, scene, controls, line } = glState.gl as GL;
      controls.dispose();
      scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
      renderer.dispose();
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
    ['click', _ => switchAnimation(false)]
  );
  setEvents('.play_arrow',
    ['click', _ => switchAnimation(true)]
  );

  createSelectName();
}

window.addEventListener('resize', resetRenderer)
window.addEventListener('DOMContentLoaded', init);
getsByCss('#ope-icons i').forEach(el => el.addEventListener('animationend', _ => el.style.animation = ''));
