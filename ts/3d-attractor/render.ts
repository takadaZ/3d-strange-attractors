import { attractors } from './attractors';
import { rK } from './runge-kutta';
import * as R from 'ramda';
import * as THREE from 'three';

export function render(
  name = 'Lorenz',
  width = 960,
  height = 640,
  recursion = 50000,
) {

  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
 
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
  R.range(0, recursion).reduce(inputXYZ => {
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
 
  // 初回実行
  tick();
 
  function tick() {
    requestAnimationFrame(tick);
 
    // 箱を回転させる
    line.rotation.x += 0.01;
    line.rotation.y += 0.01;
 
    // レンダリング
    renderer.render(scene, camera);
  }
}
