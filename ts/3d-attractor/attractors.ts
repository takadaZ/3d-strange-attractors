declare global {
  type XYZ = [number, number, number];
  type Diff = { (input: XYZ): XYZ };
  
  interface Attractors {
    [key: string]: any;
  }

  interface IAttractor {
    initXYZ: XYZ;
    fov: number;
    cameraPos: number;
    dt: number;
    diff: Diff;
  }
}

export const attractors: Attractors = {

  Lorenz: class implements IAttractor {
    a = 10.0;
    b = 8.0 / 3;
    r = 28.0;
    initXYZ = [0.0, 3.5, 26.0] as XYZ;
    fov = 5;
    cameraPos = 600;
    dt = 0.002;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const { a, b, r } = this;
      const x = - a * inputX + a * inputY;
      const y = r * inputX - inputY - inputX * inputZ;
      const z = - b * inputZ + inputX * inputY;
      return [x, y, z] as XYZ;
    }
  },

  Aizawa: class implements IAttractor {
    a = 0.95;
    b = 0.7;
    c = 0.6;
    d = 3.5;
    e = 0.25;
    f = 0.1;
    initXYZ = [1.0, 0.1, 0.1] as XYZ;
    fov = 5;
    cameraPos = 50;
    dt = 0.005;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const { a, b, c, d, e, f } = this;
      const x = ((inputZ - e) * inputX - d * inputY);
      const y = (d * inputX + (inputZ - b) * inputY);
      const z = (c + inputZ * inputZ - inputZ * inputZ * inputZ / 3.0 - (inputX * inputX + inputY * inputY) * (1.0 + e * inputZ) + f * inputZ * (inputX * inputX * inputX));
      return [x, y, z] as XYZ;
    }
  },

  Bouali2: class implements IAttractor {
    a = 1.0;
    initXYZ = [0.1, 5.0, 0.1] as XYZ;
    fov = 5;
    cameraPos = 300;
    dt = 0.005;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const { a } = this;    
      const x = (inputX * (4.0 - inputY) + 0.3 * inputZ);
      const y = (-inputY * (1.0 - inputX * inputX));
      const z = (-inputX * (1.5 - a * inputZ) - 0.05 * inputZ);
      return [x, y, z] as XYZ;
    }
  },

  Dequan: class implements IAttractor {
    a = 40.0;
    b = 1.833;
    c = 0.16;
    d = 0.65;
    e = 55.0;
    f = 20.0;
    initXYZ = [-4.0, 0.1, 0.1] as XYZ;
    fov = 25;
    cameraPos = 700;
    dt = 0.001;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const { a, b, c, d, e, f } = this;
      const x = (a * (inputY - inputX) + c * inputX * inputZ);
      const y = (e * inputX + f * inputY - inputX * inputZ);
      const z = (b * inputZ + inputX * inputY - d * (inputX * inputX));
      return [x, y, z] as XYZ;
    }
  },

  Halvorsen: class implements IAttractor {
    a = 1.4;
    initXYZ = [-4.0, 0.0, 0.0] as XYZ;
    fov = 5;
    cameraPos = 400;
    dt = 0.005;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const { a } = this;
      const x = (-a * inputX - 4.0 * inputY - 4.0 * inputZ - inputY * inputY);
      const y = (-a * inputY - 4.0 * inputZ - 4.0 * inputX - inputZ * inputZ);
      const z = (-a * inputZ - 4.0 * inputX - 4.0 * inputY - inputX * inputX);
      return [x, y, z] as XYZ;
    }
  },

  Ikeda: class implements IAttractor {
    a = 1.0;
    b = 0.9;
    c = 0.4;
    d = 6.0;
    initXYZ = [-4.0, 0.1, 0.1] as XYZ;
    fov = 1;
    cameraPos = 50000;
    dt = 0.05;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const { a, b, c, d } = this;
      const x = (a + b * (inputX * Math.cos(inputZ) - inputY * Math.sin(inputZ)));
      const y = (b * (inputX * Math.sin(inputZ) + inputY * Math.cos(inputZ)));
      const z = (c - d / (1.0 + inputX * inputX + inputY * inputY));
      return [x, y, z] as XYZ;
    }
  },

  // LiuChen: class implements IAttractor {
  //   a = 2.4;
  //   b = -3.78;
  //   c = 14.0;
  //   d = -11.0;
  //   e = 4.0;
  //   f = 5.58;
  //   g = 1.0;
  //   initXYZ = [-1.1, -1.1, -1.1] as XYZ;
  //   fov = 5;
  //   cameraPos = 1000;
  //   dt = 0.005;
  //   diff = ([inputX, inputY, inputZ]: XYZ) => {
  //     const { a, b, c, d, e, f, g } = this;
  //     const x = (a * inputY + b * inputX + c * inputY * inputZ);
  //     const y = (d * inputY - inputZ + e * inputX * inputZ);
  //     const z = (f * inputZ + g * inputX * inputY);
  //     return [x, y, z] as XYZ;
  //   }
  // },

  QiChen: class implements IAttractor {
    a = 38.0;
    b = 2.6666666666666665;
    c = 80.0;
    initXYZ = [-4.0, 0.1, 0.1] as XYZ;
    fov = 5;
    cameraPos = 2500;
    dt = 0.002;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const { a, b, c } = this;
      const x = (a * (inputY - inputX) + inputY * inputZ);
      const y = (c * inputX + inputY - inputX * inputZ);
      const z = (inputX * inputY - b * inputZ);
      return [x, y, z] as XYZ;
    }
  },

  // Rayleigh: class implements IAttractor {
  //   a = 9.0;
  //   b = 5.0;
  //   c = 12.0;
  //   initXYZ = [4.0, 0.1, -3.1] as XYZ;
  //   fov = 5;
  //   cameraPos = 1000;
  //   dt = 0.005;
  //   diff = ([inputX, inputY, inputZ]: XYZ) => {
  //     const { a, b, c } = this;
  //     const x = (-a * inputX + a * inputY);
  //     const y = (c * inputX - inputY - inputX * inputZ);
  //     const z = (inputX * inputY - b * inputZ);
  //     return [x, y, z] as XYZ;
  //   }
  // },

  Rossler: class implements IAttractor {
    initXYZ = [-4.0, 0.0, 0.0] as XYZ;
    fov = 5;
    cameraPos = 300;
    dt = 0.005;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const x = (-(inputY + inputZ));
      const y = (inputX + 0.2 * inputY);
      const z = (0.2 - 4.8 * inputZ + inputX * inputZ);
      return [x, y, z] as XYZ;
    }
  },

  // Thomas: class implements IAttractor {
  //   a = 0.19;
  //   initXYZ = [4.0, 0.0, 0.0] as XYZ;
  //   fov = 5;
  //   cameraPos = 1000;
  //   dt = 0.005;
  //   diff = ([inputX, inputY, inputZ]: XYZ) => {
  //     const { a } = this;
  //     const x = (a * inputX + Math.sin(inputY));
  //     const y = (-a * inputY + Math.sin(inputZ));
  //     const z = (-a * inputZ + Math.sin(inputX));
  //     return [x, y, z] as XYZ;
  //   }
  // },

  // Template
  /*
  : class implements IAttractor {
    initXYZ = [] as XYZ;
    fov = 5;
    cameraPos = 1000;
    dt = 0.005;
    diff = ([inputX, inputY, inputZ]: XYZ) => {
      const { a, b, c, d, e, f } = this;
      return [x, y, z] as XYZ;
    }
  },
  */
}
