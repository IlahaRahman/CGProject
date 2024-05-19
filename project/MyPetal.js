import { CGFobject } from "../lib/CGF.js";

class MyPetal extends CGFobject {
  constructor(scene, width, height) {
    super(scene);
    this.width = width;
    this.height = height;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      // First triangle
      0, 0, 0, // Vertex 0
      this.width, 0, 0, // Vertex 1
      this.width / 2, this.height, 0, // Vertex 2

      // Second triangle
      this.width / 2, this.height, 0, // Vertex 2 (repeated)
      0, this.height, 0, // Vertex 3
      0, 0, 0, // Vertex 0 (repeated)
    ];

    this.indices = [
      // First triangle
      0, 1, 2,
      // Second triangle
      3, 4, 5,
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}

export { MyPetal };
