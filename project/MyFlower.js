import { CGFobject } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";
import { getRandom } from "./common.js";
import { MyReceptacle } from "./MyReceptacle.js";
import { MyPetal } from "./MyPetal.js";

/**
 * Flower consists of stem, center (aka stamen) and petals.
 */
export class MyFlower extends CGFobject {
  constructor(scene, petalCount = 3, stemPartsCount = 5) {
    super(scene);

    this.scene = scene;
    this.petalCount = petalCount;
    this.stemPartsCount = stemPartsCount;

    this.stemParts = [];
    for (let i = 0; i < this.stemPartsCount; i++) {
      this.stemParts.push(new MyCylinder(scene, 20, 20));
    }

    this.receptacle = new MyReceptacle(scene, 16, 8);

    this.petals = [];
    this.petalYoffsets = [];
    for (let i = 0; i < this.petalCount; i++) {
      this.petals.push(new MyPetal(scene, 0.5, 1)); // Adjust width and height as needed
      this.petalYoffsets.push(getRandom(-0.5, 0.5));
    }

    this.position = { x: 0, y: 0, z: 0 }; // Initialize position
    this.scale = 1; // Initialize scale

    this.initBuffers();
  }

  setPosition(x, y, z) {
    this.position = { x, y, z }; // Set position including y for ground level
  }

  setScale(scale) {
    this.scale = scale;
  }

  enableNormalViz() {
    super.enableNormalViz();

    for (let i = 0; i < this.stemParts.length; i++) {
      this.stemParts[i].enableNormalViz();
    }

    this.receptacle.enableNormalViz();

    for (let i = 0; i < this.petals.length; i++) {
      this.petals[i].enableNormalViz();
    }
  }

  disableNormalViz() {
    super.disableNormalViz();

    for (let i = 0; i < this.stemParts.length; i++) {
      this.stemParts[i].disableNormalViz();
    }

    this.receptacle.disableNormalViz();

    for (let i = 0; i < this.petals.length; i++) {
      this.petals[i].disableNormalViz();
    }
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.scene.pushMatrix();
    this.scene.translate(this.position.x, this.position.y, this.position.z);
    this.scene.scale(this.scale, this.scale, this.scale); // Apply scaling

    // Display stem parts
    for (let i = 0; i < this.stemParts.length; i++) {
      const y = i * 1.1;
      this.scene.pushMatrix();
      this.scene.translate(0, y, 0);
      this.scene.scale(0.3, 1, 0.3);
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);
      this.stemParts[i].display();
      this.scene.popMatrix();
    }

    // Display receptacle
    this.scene.setAmbient(1, 1, 0, 1);
    this.scene.setDiffuse(1, 1, 0, 1);
    this.scene.setSpecular(1, 1, 1, 1);
    this.scene.pushMatrix();
    this.scene.translate(0, this.stemParts.length * 1.1, 0);
    this.receptacle.display();
    this.scene.popMatrix();

    // Display petals
    const receptacleY = this.stemParts.length * 1.1; // Calculate the y position for the receptacle
    for (let i = 0; i < this.petals.length; i++) {
        const angle = (i / this.petalCount) * 2 * Math.PI; // Calculate the angle for each petal

        this.scene.setAmbient(1, 192 / 255, 204 / 255, 1);
        this.scene.setDiffuse(1, 192 / 255, 204 / 255, 1);

        this.scene.pushMatrix();
        this.scene.translate(0, receptacleY, 0); // Move to the top of the stem
        this.scene.rotate(angle, 0, 1, 0); // Rotate around the y-axis
        this.scene.translate(0.5, 0, 0); // Move the petal outwards from the center
        this.scene.rotate(Math.PI / 4, 1, 0, 0); // Rotate to align the petals correctly
        this.petals[i].display();
        this.scene.popMatrix();
    }

    this.scene.popMatrix();
  }
}
