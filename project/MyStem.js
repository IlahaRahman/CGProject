import { CGFobject } from "../lib/CGF.js";
import { MyCylinder } from "./MyCylinder.js";
import { getRandom } from "./common.js";

class MyStem extends CGFobject {
  constructor(scene, partsCount = 5) {
    super(scene);

    this.scene = scene;
    this.partsCount = partsCount;
    this.stemParts = [];

    for (let i = 0; i < this.partsCount; i++) {
      const length = getRandom(2, 4); // Random length for each stem part
      const curvature = getRandom(-0.1, 0.1); // Random curvature

      // Create stem part with random length and curvature
      const stemPart = new MyCylinder(scene, 20, 20, length, curvature);
      this.stemParts.push(stemPart);
    }
  }

  display() {
    // Display each stem part
    for (let i = 0; i < this.stemParts.length; i++) {
      const y = -i * 1.1; // Adjust the y position for each part
      this.scene.pushMatrix();
      this.scene.translate(0, y, 0);
      this.scene.scale(0.3, 1, 0.3); // Adjust scale as needed
      this.scene.rotate(Math.PI / 2, 1, 0, 0); // Rotate if needed
      this.stemParts[i].display();
      this.scene.popMatrix();
    }
  }
}

export { MyStem };
