import { CGFobject } from '../lib/CGF.js';
import { crossProduct } from './common.js';

class MyReceptacle extends CGFobject {
  constructor(scene, sideCount = 4) {
    super(scene);

    this.scene = scene;
    this.sideCount = sideCount;
    this.executed = false;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    const centerPoint = [0, 0.5, 0];

    const delta = (Math.PI * 2) / this.sideCount;
    for (let i = 0; i < this.sideCount; i++) {
      const angle = delta * i;

      const point1 = [Math.cos(angle + delta), 0, Math.sin(angle + delta)];
      const point2 = [Math.cos(angle), 0, Math.sin(angle)];

      this.vertices.push(...centerPoint, ...point1, ...point2);
      this.indices.push(i * 3, i * 3 + 1, i * 3 + 2);

      const normal = crossProduct(centerPoint, point1, point2);
      this.normals.push(...normal, ...normal, ...normal);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}

export { MyReceptacle };
