import { CGFobject } from "../lib/CGF.js";

export class MyWing extends CGFobject {
  constructor(scene) {
    super(scene);
    this.scene = scene;

    this.vertices = [
      -0.5, 0, 0,
      0.5, 0, 0,
      0.3, 0.5, 0,
      -0.3, 0.5, 0,
      0, 1, 0
    ];

    this.indices = [
      0, 1, 2,
      0, 2, 3,
      3, 2, 4
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.texCoords = [
      0, 0,
      1, 0,
      0.85, 0.5,
      0.15, 0.5,
      0.5, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  initBuffers() {
    this.gl = this.scene.gl;
    this.initGLBuffers();
  }

  display() {
    this.scene.pushMatrix();
    super.display();
    this.scene.popMatrix();
  }
}
