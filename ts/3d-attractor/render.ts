import { attractors } from './attractors';
import { rK } from './runge-kutta';
import * as R from 'ramda';
import 'three/examples/js/controls/OrbitControls';
import * as three from 'three';
import 'three/examples/js/effects/CardboardEffect';

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
    line: THREE.Mesh
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
  const effect = new THREE.CardboardEffect(renderer);
  //初期化時とリサイズ処理内
  effect.setSize(width, height);
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
  const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 100000);
  camera.position.set(0, 0, cameraPos);

  // camera.position.set( 0, 0, 20);
  camera.lookAt( new THREE.Vector3() );
  
  //レンズの焦点距離(この値によって視差の大小が決まる?)
  camera.focalLength = camera.position.distanceTo( new THREE.Vector3() );  
  // camera.focalLength = 2;

  const controls = new THREE.OrbitControls(camera);
  controls.autoRotate = true;

  // const path = new THREE.CatmullRomCurve3();
  // main
  // const vectors = R.range(0, attractor.recursion || recursion).reduce((inputXYZ: XYZ) => {
  //   const xyz = rK(inputXYZ, attractor);
  //   const [x, y, z] = xyz;
  //   path.points.push(new THREE.Vector3(x, y, z));
  //   return xyz;
  // }, initXYZ);

  const S = (f: any) => (g: any) => (x: any) => f(x)(g(x));
  const B = (f: any) => (g: any) => (x: any) => f(g(x));
　const rk = rK(attractor);

  const attrVectors = R.range(0, attractor.recursion || recursion)
    .reduce(S(R.flip(R.append))(B(rk)(R.last)), [initXYZ])
    .map(([x, y, z]: XYZ) => new THREE.Vector3(x, y, z));

  const path = new THREE.CatmullRomCurve3(attrVectors);

  const geometry = new THREE.TubeGeometry(path, 10000, 0.3, 20);

  const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  const line = new THREE.Mesh( geometry, material );
  scene.add(line);

  // const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

  // const geometry = new THREE.Geometry();
  // R.range(0, attractor.recursion || recursion).reduce(inputXYZ => {
  //   const xyz = rK(inputXYZ, attractor);
  //   const [x, y, z] = xyz;
  //   geometry.vertices.push(new THREE.Vector3(x, y, z).multiplyScalar(1));
  //   return xyz;
  // }, initXYZ);

  // const line = new THREE.Line(geometry, material);
  // シーンに追加
  // scene.add(line);

  // 平行光源
  const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
  // light.intensity = 2; // 光の強さを倍に
  light.position.set(1000, 1000, 1000);

  // シーンに追加
  scene.add(light);

  return { renderer: effect, scene, camera, controls, line };
}
