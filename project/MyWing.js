import { CGFobject } from '../lib/CGF.js';

class MyWing extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      0, 0, 0,
      1, 0, 0,
      0.5, 0, 1
    ];

    this.indices = [0, 1, 2];

    this.normals = [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    ];

    this.texCoords = [
      0, 0,
      1, 0,
      0.5, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.scene.pushMatrix();
    this.scene.scale(2, 1, 1); // Adjust the wing size
    super.display();
    this.scene.popMatrix();
  }
}

export { MyWing };
