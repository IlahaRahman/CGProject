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

    // Create flowers at each position in the garden
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const x = getRandom(-20, 20); // Random x position
        const z = getRandom(-20, 20); // Random z position
        this.flowers.push(new MyFlower(scene));
        this.flowers[this.flowers.length - 1].setPosition(x, z); // Set position of the flower
      }
    }
  }

  display() {
    // Display all flowers in the garden
    for (let i = 0; i < this.flowers.length; i++) {
      // Calculate position of the flower based on row and column
      const row = Math.floor(i / this.cols);
      const col = i % this.cols;
      const x = (col - this.cols / 2) * 5; // Adjust position based on garden size
      const z = (row - this.rows / 2) * 5; // Adjust position based on garden size
      
      this.scene.pushMatrix();
      this.scene.translate(x, 0, z); // Translate to flower position
      this.flowers[i].display(); // Display the flower
      this.scene.popMatrix();
    }
  }
}

export { MyGarden };
