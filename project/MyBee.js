import { CGFobject } from '../lib/CGF.js';

export class MyBee extends CGFobject {
    constructor(scene, wingTexture, eyeTexture, legTexture) {
        super(scene);
        this.position = vec3.fromValues(0, 5, 0);
        this.orientation = 0; // Angle around the YY axis
        this.velocity = vec3.create(); // Initially zero

        this.wingTexture = wingTexture;
        this.eyeTexture = eyeTexture;
        this.legTexture = legTexture;
    }

    update(delta_t) {
        // Update position based on velocity and delta_t
        let displacement = vec3.create();
        vec3.scale(displacement, this.velocity, delta_t);
        vec3.add(this.position, this.position, displacement);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.scale(this.scene.scaleFactor, this.scene.scaleFactor, this.scene.scaleFactor);

        // Add code to display the bee using its components

        this.scene.popMatrix();
    }

    turn(v) {
        this.orientation += v;
        // Update the velocity vector direction
        let direction = vec3.fromValues(Math.sin(this.orientation), 0, Math.cos(this.orientation));
        vec3.scale(this.velocity, direction, vec3.length(this.velocity));
    }

    accelerate(v) {
        let direction = vec3.fromValues(Math.sin(this.orientation), 0, Math.cos(this.orientation));
        let newVelocity = vec3.create();
        vec3.scale(newVelocity, direction, v);
        vec3.add(this.velocity, this.velocity, newVelocity);
    }

    reset() {
        this.position = vec3.fromValues(0, 5, 0);
        this.orientation = 0;
        this.velocity = vec3.create();
    }
}
