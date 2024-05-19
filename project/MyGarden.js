import { CGFobject } from "../lib/CGF.js";
import { MyFlower } from "./MyFlower.js";
import { getRandom } from "./common.js";

class MyGarden extends CGFobject {
  constructor(scene, rows, cols) {
    super(scene);

    this.scene = scene;
    this.rows = rows;
    this.cols = cols;
    this.flowers = [];

    const spacingX = 5; // Adjust the spacing between flowers along the x-axis
    const spacingZ = 5; // Adjust the spacing between flowers along the z-axis

    // Create flowers at each position in the garden
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const petalCount = Math.floor(getRandom(3, 8));
        const stemHeight = getRandom(3, 6);

        // Uniformly space flowers and add some random variation
        const x = i * spacingX + getRandom(-1, 1);
        const z = j * spacingZ + getRandom(-1, 1);
        const flower = new MyFlower(scene, petalCount, stemHeight);
        flower.setPosition(x,z); // Set position of the flower, ensuring y is 0
        this.flowers.push(flower);
      }
    }
  }

  display() {
    // Display all flowers in the garden
    for (let i = 0; i < this.flowers.length; i++) {
      const flower = this.flowers[i];
      this.scene.pushMatrix();
      this.scene.translate(flower.position.x, flower.position.y, flower.position.z); // Translate to flower position
      flower.display(); // Display the flower
      this.scene.popMatrix();
    }
  }
}

export { MyGarden };
