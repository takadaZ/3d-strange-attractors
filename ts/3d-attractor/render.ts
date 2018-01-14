import { attractors } from './attractors';
import { rK } from './runge-kutta';
import * as R from 'ramda';
import * as THREE from 'three';

export function disposeGL(canvas: HTMLElement) {
  (Array.from(canvas.children) as HTMLCanvasElement[]).forEach(child => {
    const gl = child.getContext('webgl') as WebGLRenderingContext;
    const numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    for (let unit = 0; unit < numTextureUnits; ++unit) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const numAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    for (let attrib = 0; attrib < numAttributes; ++attrib) {
      gl.vertexAttribPointer(attrib, 1, gl.FLOAT, false, 0, 0);
    }
    gl.canvas.width = 1;
    gl.canvas.height = 1;
    canvas.removeChild(child);
  });
}

declare global {
  interface GL {
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    line: THREE.Line
  }
  interface GLState {
    gl: GL,
    animate: boolean
  }
}

export function render(
  canvas: HTMLElement,
  name = 'Lorenz',
  width = 960,
  height = 640,
  recursion = 50000,
): GL {

  const renderer = new THREE.WebGLRenderer();

  // レンダラーを作成
  renderer.autoClear = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  canvas.appendChild(renderer.domElement);

  // シーンを作成
  const scene = new THREE.Scene();

  // Attractorを生成
  const attractor = new attractors[name]() as IAttractor;
  const { fov, cameraPos, initXYZ } = attractor;

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 100000);
  camera.position.set(0, 0, cameraPos);
 
  // main
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const geometry = new THREE.Geometry();
  R.range(0, attractor.recursion || recursion).reduce(inputXYZ => {
    const xyz = rK(inputXYZ, attractor);
    const [x, y, z] = xyz;
    geometry.vertices.push(new THREE.Vector3(x, y, z));
    return xyz;
  }, initXYZ);

  const line = new THREE.Line(geometry, material);
  // シーンに追加
  scene.add(line);

  // 平行光源
  const light = new THREE.DirectionalLight(0xFFFFFF);
  light.intensity = 2; // 光の強さを倍に
  light.position.set(1, 1, 1);

  // シーンに追加
  scene.add(light);

  return {
    renderer,
    scene,
    camera,
    line
  };
}
