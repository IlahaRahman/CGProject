import {CGFobject} from '../lib/CGF.js';
import { MyRock } from './MyRock.js';

export class MyRockSet {
    constructor(scene, numRocks) {
        this.scene = scene;
        this.numRocks = numRocks;
        this.rocks = [];

        this.initRocks();
    }

    initRocks() {
        for (let i = 0; i < this.numRocks; i++) {
            // Generate random position, size, and orientation for each rock
            const x = Math.random() * 100 - 50; // Example: Random x position between -50 and 50
            const y = Math.random() * 100 - 50; // Example: Random y position between -50 and 50
            const z = Math.random() * 100 - 50; // Example: Random z position between -50 and 50
            const size = Math.random() * 5 + 1; // Example: Random size between 1 and 6

            const rock = new MyRock(this.scene, size);
            rock.setPosition(x, y, z);

            this.rocks.push(rock);
        }
    }

    display() {
        for (const rock of this.rocks) {
            rock.display();
        }
    }
}
