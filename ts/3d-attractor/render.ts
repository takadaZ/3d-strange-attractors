import { attractors } from './attractors';
import { rK } from './runge-kutta';
import * as R from 'ramda';
import 'three/examples/js/controls/OrbitControls';
import * as three from 'three';
import 'three/examples/js/effects/StereoEffect';

declare global {
  const THREE: typeof three;
  const BufferGeometry: typeof three.BufferGeometry;
}

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
    controls: THREE.OrbitControls,
    line: THREE.Line
  }
}

export function render(
  canvas: HTMLElement,
  name = 'Lorenz',
  width = 960,
  height = 640,
  recursion = 50000,
): GL {

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // const effect = new THREE.CardboardEffect(renderer);
  const effect = new THREE.StereoEffect(renderer);
  //初期化時とリサイズ処理内
  effect.setSize(width, height);
  effect.setEyeSeparation(2)
  //ループ処理内で
  // effect.render( シーン, カメラ);

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
  // const camera = new THREE.PerspectiveCamera( 60, canW / canH, 0.001, 2000);
  const camera = new THREE.PerspectiveCamera(70, width / height, 1, 100000);
  // camera.position.set(0, 0, cameraPos);

  camera.position.set(0, 0, 20);
  // camera.lookAt(scene.position);
  
  //レンズの焦点距離(この値によって視差の大小が決まる?)
  // camera.setFocalLength(camera.position.distanceTo(new THREE.Vector3())); // focalLength = camera.position.distanceTo(new THREE.Vector3());  
  // camera.setFocalLength(300);
  // camera.focalLength = 2;

  const controls = new THREE.OrbitControls(camera);
  controls.autoRotate = true;

  // const S = (f: any) => (g: any) => (x: any) => f(x)(g(x));
  const geometry = new THREE.Geometry();
　const rk = rK(attractor);
  const getVector3 = ([x, y, z]: XYZ) => new THREE.Vector3(x, y, z);
  const setVector3 = (vector3: THREE.Vector3) => geometry.vertices.push(vector3);

  R.range(0, attractor.recursion || recursion)
    .reduce(R.compose(R.tap(setVector3), getVector3, rk), getVector3(initXYZ));
  // .reduce(S(R.flip(R.append))(R.compose(getVector3, rk, R.last)), [getVector3(initXYZ)]);
  // .map(([x, y, z]: XYZ) => new THREE.Vector3(x, y, z));

  // const path = new THREE.CatmullRomCurve3(attrVectors);

  // const geometry = new THREE.TubeGeometry(path, 10000, 0.3, 20);

  // const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  // const line = new THREE.Mesh( geometry, material );
  // scene.add(line);

  const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

  // geometry.vertices = attrVectors;

  const line = new THREE.Line(geometry, material);
  // シーンに追加
  scene.add(line);

  // 平行光源
  const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
  // light.intensity = 2; // 光の強さを倍に
  light.position.set(1000, 1000, 1000);

  // シーンに追加
  scene.add(light);

  // const geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
  // const material = new THREE.MeshNormalMaterial();
  // const mesh = new THREE.Mesh( geometry, material );
  // mesh.position.set( 0, 0, -1 );

  // scene.add( mesh );
  
  return { renderer: effect, scene, camera, controls, line };
}
