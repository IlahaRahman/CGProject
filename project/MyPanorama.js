import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MySphere } from './MySphere.js';


export class MyPanorama extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.texture = texture;
        this.sphere = new MySphere(scene, 50, 50, true); // Create an inverted sphere


        this.panoramaMaterial=new CGFappearance(scene);
        this.panoramaMaterial.setAmbient(0.7,0.7,0.7,1);
        this.panoramaMaterial.setDiffuse(0.7,0.7,0.7,1);
        this.panoramaMaterial.setEmission(1, 1, 1, 1);
        this.panoramaMaterial.setTexture(texture);
        this.panoramaMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        this.scene.pushMatrix();
        this.panoramaMaterial.apply(); // Only emissive component for the material
        this.sphere.display(); // Draw the inverted sphere
        this.scene.popMatrix();
    }
}
