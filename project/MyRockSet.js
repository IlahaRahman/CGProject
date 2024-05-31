import { CGFobject } from '../lib/CGF.js';
import { MyRock } from './MyRock.js';

export class MyRockSet extends CGFobject {
  constructor(scene, numRocks, position) {
    super(scene);
    this.numRocks = numRocks;
    this.position = position || [0, 0, 0]; // Initial position
    this.rocks = [];

    this.initRocks();
  }

  initRocks() {
    let yOffset = 0;

    for (let i = 0; i < this.numRocks; i++) {
      const size = Math.random() * 2 + 0.5; // Random size between 0.5 and 2.5
      const x = Math.random() * 2 - 1; // Slight random x position for stacking
      const z = Math.random() * 2 - 1; // Slight random z position for stacking

      const rock = new MyRock(this.scene, size);
      rock.setPosition(x, yOffset, z);

      // Apply random scaling for non-uniform dimensions
      rock.scale = [
        1 + Math.random() * 0.5, // Scale X
        1 + Math.random() * 0.5, // Scale Y
        1 + Math.random() * 0.5, // Scale Z
      ];

      // Apply random rotation
      rock.rotation = [
        Math.random() * Math.PI, // Rotate around X
        Math.random() * Math.PI, // Rotate around Y
        Math.random() * Math.PI, // Rotate around Z
      ];

      this.rocks.push(rock);
      yOffset += size * 0.5; // Increment yOffset for stacking
    }
  }

  display() {
    this.scene.pushMatrix();

    // Translate to the initial position of the rock set
    this.scene.translate(this.position[0], this.position[1], this.position[2]);

    for (let rock of this.rocks) {
      this.scene.pushMatrix();

      // Apply transformations
      this.scene.translate(rock.position[0], rock.position[1], rock.position[2]);
      this.scene.rotate(rock.rotation[0], 1, 0, 0);
      this.scene.rotate(rock.rotation[1], 0, 1, 0);
      this.scene.rotate(rock.rotation[2], 0, 0, 1);
      this.scene.scale(rock.scale[0], rock.scale[1], rock.scale[2]);

      rock.display();
      this.scene.popMatrix();
    }

    this.scene.popMatrix();
  }
}
