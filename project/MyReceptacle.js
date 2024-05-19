import { CGFobject } from '../lib/CGF.js';
import { MySphere } from './MySphere.js'; // Import MySphere
import { crossProduct } from './common.js';

class MyReceptacle extends MySphere { // Extend MySphere
  constructor(scene, slices = 20, stacks = 20) {
    super(scene, slices, stacks); // Call the MySphere constructor
  }

  // If you have any additional methods specific to MyReceptacle, you can add them here
  // For example, if you want to override the display method, you can do so
  display() {
    super.display(); // Call the display method of MySphere
    // Add any additional display logic for MyReceptacle if needed
  }
}

export { MyReceptacle };
