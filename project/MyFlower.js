import { CGFobject } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";
import { MyReceptacle } from "./MyReceptacle.js";
import { MyPetal } from "./MyPetal.js";
import { getRandom } from "./common.js";

/**
 * Flower consists of stem, center (aka receptacle), and petals.
 */
export class MyFlower extends CGFobject {
  constructor(scene, petalCount = 5, stemHeight = 5, textures = {}) {
    super(scene);

    this.scene = scene;
    this.petalCount = petalCount;
    this.stemHeight = stemHeight;
    this.textures = textures;

    this.stem = new MyCylinder(scene, 20, 20);
    this.receptacle = new MyReceptacle(scene, 8);

    this.petals = [];
    for (let i = 0; i < this.petalCount; i++) {
      this.petals.push(new MyPetal(scene));
    }

    this.initBuffers();
  }

  setPosition(x, y, z) {
    this.position = { x, y, z };
  }

  enableNormalViz() {
    super.enableNormalViz();
    this.stem.enableNormalViz();
    this.receptacle.enableNormalViz();
    for (let petal of this.petals) {
      petal.enableNormalViz();
    }
  }

  disableNormalViz() {
    super.disableNormalViz();
    this.stem.disableNormalViz();
    this.receptacle.disableNormalViz();
    for (let petal of this.petals) {
      petal.disableNormalViz();
    }
  }

  applyTextures() {
    if (this.textures.stem) {
      this.scene.pushMatrix();
      this.textures.stem.bind();
      this.stem.display();
      this.scene.popMatrix();
    }
    if (this.textures.receptacle) {
      this.scene.pushMatrix();
      this.textures.receptacle.bind();
      this.receptacle.display();
      this.scene.popMatrix();
    }
    if (this.textures.petal) {
      for (let petal of this.petals) {
        this.scene.pushMatrix();
        this.textures.petal.bind();
        petal.display();
        this.scene.popMatrix();
      }
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
    // Display stem
    this.scene.pushMatrix();
    this.scene.translate(this.position.x, this.position.y, this.position.z);
    this.scene.scale(0.3, this.stemHeight, 0.3); // Adjust scale for the stem
    this.applyTextures();
    this.scene.popMatrix();

    // Display receptacle (center)
    const receptacleHeight = this.position.y + this.stemHeight;
    this.scene.pushMatrix();
    this.scene.translate(this.position.x, receptacleHeight, this.position.z);
    this.receptacle.display();
    this.scene.popMatrix();

    // Display petals
    const petalDistance = 0.7; // Distance from the center to the petals
    for (let i = 0; i < this.petalCount; i++) {
      const increment = (Math.PI * 2) / this.petalCount;
      const rotation = increment * i;

      this.scene.pushMatrix();
      this.scene.translate(this.position.x, receptacleHeight, this.position.z);
      this.scene.rotate(rotation, 0, 1, 0);
      this.scene.translate(petalDistance, 0, 0); // Translate to edge of receptacle
      this.scene.rotate(-Math.PI / 8, 0, 0, 1); // Rotate petals to face outward

      this.petals[i].display();
      this.scene.popMatrix();
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
