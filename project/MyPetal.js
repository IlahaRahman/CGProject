import { CGFobject } from '../lib/CGF.js';
import { Triangle } from './Triangle.js';

/**
 * Represents a petal. It's composed of two triangles joined together.
 */
class MyPetal extends CGFobject {
  constructor(scene, length = 2, peakHeight = 1) {
    super(scene);

    this.scene = scene;
    this.length = length;
    this.peakHeight = peakHeight;

    this.firstTriangle = new Triangle(scene, this.length, this.peakHeight);
    this.secondTriangle = new Triangle(scene, this.length, this.peakHeight);

    this.initBuffers();
  }

  enableNormalViz() {
    super.enableNormalViz();
    this.firstTriangle.enableNormalViz();
    this.secondTriangle.enableNormalViz();
  }

  disableNormalViz() {
    super.disableNormalViz();
    this.firstTriangle.disableNormalViz();
    this.secondTriangle.disableNormalViz();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
  }

  display() {
    // Display the first triangle (closer to center)
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 8, 0, 0, 1); // Adjust rotation for curvature
    this.firstTriangle.display();
    this.scene.popMatrix();

    // Display the second triangle (farther from center)
    this.scene.pushMatrix();
    this.scene.translate(0, this.peakHeight, 0);
    this.scene.rotate(Math.PI / 8, 0, 0, 1); // Adjust rotation for curvature
    this.secondTriangle.display();
    this.scene.popMatrix();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}

export { MyPetal };
