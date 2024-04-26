import {CGFobject} from '../lib/CGF.js';
import { MySphere } from './MySphere.js';


export class MyPanorama extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.texture = texture;
        this.sphere = new MySphere(scene, 50, 50, true); // Create an inverted sphere
    }

    display() {
        this.scene.pushMatrix();
        this.scene.setEmissive(1, 1, 1, 1); // Only emissive component for the material
        this.texture.bind(); // Activate the texture
        this.sphere.display(); // Draw the inverted sphere
        this.texture.unbind(); // Deactivate the texture
        this.scene.popMatrix();
    }
}
