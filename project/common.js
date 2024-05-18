import { CGFobject } from "../lib/CGF.js";

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  export { getRandom };
  
  function crossProduct(v1, v2, v3) {
    const ux = v2[0] - v1[0];
    const uy = v2[1] - v1[1];
    const uz = v2[2] - v1[2];

    const vx = v3[0] - v1[0];
    const vy = v3[1] - v1[1];
    const vz = v3[2] - v1[2];

    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;

    return [nx, ny, nz];
}

export {crossProduct}