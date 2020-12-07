// Runge-Kutta method

import * as R from 'ramda'; 

type DiffArgFun = { (a: number, b: number, dt: number): number };

const diffArgFun = (divided: number) => (a: number, b: number, dt: number) => a + b * dt / divided;
const diffArgFuns: DiffArgFun[] = [
  R.identity as DiffArgFun,
  diffArgFun(2),
  diffArgFun(2),
  diffArgFun(1),
];

function getRKResult(diffs: XYZ[], i: number, dt: number) {
  return diffs[0][i] + (diffs[1][i] + 2 * diffs[2][i] + 2 * diffs[3][i] + diffs[4][i]) * dt / 6;
}

export function rK({ diff, dt }: IAttractor) {
  return ({ x, y, z }: THREE.Vector3) => {
    // const  { x, y, z } = vector3;
    const diffs = diffArgFuns.reduce((acc, fun) => {
      const [diffX, diffY, diffZ] = R.last(acc) as XYZ;
      const input = [fun(x, diffX, dt), fun(y, diffY, dt), fun(z, diffZ, dt)] as XYZ;
      return acc.concat([diff(input)]);
    }, [[x, y, z]] as XYZ[]);

    return [x, y, z].map((_, i) => getRKResult(diffs, i, dt)) as XYZ;
  }
}
