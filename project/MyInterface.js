import { CGFinterface, dat } from '../lib/CGF.js';

export class MyInterface extends CGFinterface {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    // Initialize GUI (using dat.GUI or similar)
    this.gui = new dat.GUI();

    return true;
  }
}
