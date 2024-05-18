import { CGFobject, CGFcamera } from "../lib/CGF.js";

export class MyCylinder extends CGFobject {
  constructor(scene, slices, stacks) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    const step = (2 * Math.PI) / this.slices; // ɑ, the degrees increment
    const stackHeightDelta = 1 / this.stacks;
    for (let i = 0; i < this.stacks + 1; i++) {
      for (let j = 0; j < this.slices; j++) {
        const vertex = [
          Math.cos(j * step),
          Math.sin(j * step),
          stackHeightDelta * i,
        ];
        this.vertices.push(...vertex);

        const normal = [Math.cos(j * step), Math.sin(j * step), 0];
        this.normals.push(...normal);
      }
    }

    for (let i = 0; i < this.stacks; i++) {
      // Offset from indices of vertices in the first stack
      const offset = this.slices * i;
      for (let j = 0; j < this.slices; j++) {
        const triangle0 = [
          offset + j,
          offset + j + 1,
          offset + j + this.slices,
        ];
        this.indices.push(...triangle0);
        let triangle1 = [
          offset + j + 1,
          offset + j + this.slices + 1,
          offset + j + this.slices,
        ];

        // Prevent off-by-one error
        if ((j + 1) % this.slices == 0) {
          triangle1[0] -= this.slices;
          triangle1[1] -= this.slices;
          triangle1[2] -= this.slices;
        }
        this.indices.push(...triangle1);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}