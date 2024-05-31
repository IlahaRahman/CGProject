import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MySphere } from './MySphere.js'; // Assuming you have a MySphere class
import { MyWing } from './MyWing.js';
import { MyCylinder } from './MyCylinder.js'; // Assuming you have a MyCylinder class

export class MyBee extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        // Initialize position, orientation, and velocity
        this.position = vec3.fromValues(0, 5, 0);
        this.basePosition = vec3.fromValues(0, 5, 0); // Base position for oscillation
        this.orientation = 0; // Angle around the YY axis
        this.velocity = vec3.create(); // Initially zero

        // Create bee components
        this.head = new MySphere(scene, 16, 8);
        this.thorax = new MySphere(scene, 16, 8);
        this.abdomen = new MySphere(scene, 16, 8);
        this.wing1 = new MyWing(scene);
        this.wing2 = new MyWing(scene);
        this.antenna = new MyCylinder(scene, 8, 1);
        this.leg = new MyCylinder(scene, 8, 1);

        // Create appearances
        this.yellowAppearance = new CGFappearance(scene);
        this.yellowAppearance.setAmbient(1, 1, 0, 1);
        this.yellowAppearance.setDiffuse(1, 1, 0, 1);
        this.yellowAppearance.setSpecular(1, 1, 0, 1);
        this.yellowAppearance.setShininess(10);

        this.blackAppearance = new CGFappearance(scene);
        this.blackAppearance.setAmbient(0, 0, 0, 1);
        this.blackAppearance.setDiffuse(0, 0, 0, 1);
        this.blackAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.blackAppearance.setShininess(10);

        this.wingTexture = new CGFappearance(scene);
        this.wingTexture.setTexture(new CGFtexture(scene, 'images/beewing.jpg'));
        this.wingTexture.setAmbient(1, 1, 1, 0.6); // Semi-transparent wings
        this.wingTexture.setDiffuse(1, 1, 1, 0.6);
        this.wingTexture.setSpecular(1, 1, 1, 0.6);
        this.wingTexture.setShininess(10);

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    update(delta_t) {
        // Update position based on velocity and delta_t
        let displacement = vec3.create();
        vec3.scale(displacement, this.velocity, delta_t);
        vec3.add(this.position, this.position, displacement);

        // Update the oscillation time
        this.oscillationTime += delta_t;

        // Apply vertical oscillation
        let oscillationHeight = Math.sin(this.oscillationTime * Math.PI * 2) * 0.1; // Oscillate up and down by 0.1 units
        this.position[1] = this.basePosition[1] + oscillationHeight;

        // Update wing flapping
        this.wingAngle = Math.sin(this.oscillationTime * Math.PI * 10) * Math.PI / 8; // Wing flapping with 5Hz frequency
    }

    display() {
        const time = performance.now() / 1000; // Get the current time in seconds

        // Calculate the oscillation and wing flapping animations
        const oscillation = Math.sin(time * 2 * Math.PI) * 0.1; // Up and down oscillation
        const wingFlap = Math.sin(time * 10 * Math.PI) * Math.PI / 8; // Wing flapping

        // Enable alpha blending for transparency
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.enable(this.scene.gl.BLEND);

        this.scene.pushMatrix();
        this.scene.translate(this.position[0], this.position[1] + oscillation, this.position[2]);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.scale(this.scene.scaleFactor, this.scene.scaleFactor, this.scene.scaleFactor);

        // Display the abdomen (yellow)
        this.scene.pushMatrix();
        this.yellowAppearance.apply();
        this.scene.scale(1, 1, 1);
        this.scene.translate(0, 0, -1);
        this.abdomen.display();
        this.scene.popMatrix();

        // Display the thorax (black)
        this.scene.pushMatrix();
        this.blackAppearance.apply();
        this.scene.scale(0.8, 0.8, 0.8);
        this.scene.translate(0, 0, 0.5);
        this.thorax.display();
        this.scene.popMatrix();

        // Display the head (yellow)
        this.scene.pushMatrix();
        this.yellowAppearance.apply();
        this.scene.translate(0, 0, 1.5);
        this.scene.scale(0.6, 0.6, 0.6);
        this.head.display();
        this.scene.popMatrix();

        // Display the left eye (black)
        this.scene.pushMatrix();
        this.blackAppearance.apply();
        this.scene.translate(0.4, 0.3, 1.9); // Adjust translation to position eyes correctly
        this.scene.scale(0.2, 0.3, 0.1); // Scale to make the eye more oval
        this.head.display();
        this.scene.popMatrix();
    
        // Display the right eye (black)
        this.scene.pushMatrix();
        this.blackAppearance.apply();
        this.scene.translate(-0.4, 0.3, 1.9); // Adjust translation to position eyes correctly
        this.scene.scale(0.2, 0.3, 0.1); // Scale to make the eye more oval
        this.head.display();
        this.scene.popMatrix();

        const segmentLength = 0.1; // Length of each segment
        const numSegments = 10; // Number of segments for each antenna
        const bendAngle = Math.PI / 18; // Bend angle for each segment for a gradual curve

        // Display the left antenna (black)
        this.scene.pushMatrix();
        this.blackAppearance.apply();
        this.scene.translate(0.7, 1.0, 2.1); // Adjusted starting position of left antenna
        this.scene.rotate(Math.PI / 6, 1, 0, 0); // Initial orientation to raise the antenna
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        for (let i = 0; i < numSegments; i++) {
            this.scene.pushMatrix();
            this.scene.scale(0.03, 0.03, segmentLength); // Scale each segment to be slightly thicker
            this.antenna.display();
            this.scene.popMatrix();
    
            // Move to the next segment position and apply cumulative rotation
            this.scene.translate(0, 0, segmentLength); // Translate along the segment length
            this.scene.rotate(bendAngle, 1, 0, 0); // Apply cumulative rotation for a natural bend
        }
    
        this.scene.popMatrix();
    
        // Display the right antenna (black)
        this.scene.pushMatrix();
        this.blackAppearance.apply();
        this.scene.translate(-0.7, 1.0, 2.1); // Adjusted starting position of right antenna
        this.scene.rotate(Math.PI / 6, 1, 0, 0); // Initial orientation to raise the antenna
        this.scene.rotate(Math.PI / 2, 0, 1, 0); // Adjust the rotation to match the left antenna
    
        for (let i = 0; i < numSegments; i++) {
            this.scene.pushMatrix();
            this.scene.scale(0.03, 0.03, segmentLength); // Scale each segment to be slightly thicker
            this.antenna.display();
            this.scene.popMatrix();
    
            // Move to the next segment position and apply cumulative rotation
            this.scene.translate(0, 0, segmentLength); // Translate along the segment length
            this.scene.rotate(bendAngle, 1, 0, 0); // Apply cumulative rotation for a natural bend
        }
    
        this.scene.popMatrix();

        // Display the left leg (black)
        this.scene.pushMatrix();
        this.blackAppearance.apply();
        this.scene.translate(0.4, -0.6, 0.5); // Adjust translation to position leg correctly
        this.scene.rotate(Math.PI / 6, 1, 0, 0); // Adjust rotation for the correct angle
        this.scene.scale(0.1, 0.1, 0.5); // Adjust scale to reflect the leg segment
        this.leg.display();
        this.scene.popMatrix();
    
        // Display the right leg (black)
        this.scene.pushMatrix();
        this.blackAppearance.apply();
        this.scene.translate(-0.4, -0.6, 0.5); // Adjust translation to position leg correctly
        this.scene.rotate(Math.PI / 6, 1, 0, 0); // Adjust rotation for the correct angle
        this.scene.scale(0.1, 0.1, 0.5); // Adjust scale to reflect the leg segment
        this.leg.display();
        this.scene.popMatrix();

        // Draw transparent wings last
        this.scene.gl.depthMask(false); // Disable depth writing for transparent objects
        this.wingTexture.apply();

        // Left wing
        this.scene.pushMatrix();
        this.scene.translate(0.9, 0.4, 0.5); // Adjust position
        this.scene.rotate(Math.PI / 8, 0, 1, 0); // Adjust rotation
        this.scene.rotate(wingFlap, 0, 1, 0); // Apply wing flapping animation
        this.scene.scale(1.5, 1.5, 1); // Adjust scale to make wings smaller
        this.wing1.display();
        this.scene.popMatrix();

        // Right wing
        this.scene.pushMatrix();
        this.scene.translate(-0.9, 0.4, 0.5); // Adjust position
        this.scene.rotate(-Math.PI / 8, 0, 1, 0); // Adjust rotation around Y-axis

        this.scene.rotate(-wingFlap, 0, 1, 0); // Apply wing flapping animation
        this.scene.scale(1.5, 1.5, 1); // Adjust scale to make wings smaller
        this.wing2.display();
        this.scene.popMatrix();

        this.scene.gl.depthMask(true); // Re-enable depth writing
        this.scene.gl.disable(this.scene.gl.BLEND);

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
        this.basePosition = vec3.fromValues(0, 5, 0);
        this.orientation = 0;
        this.velocity = vec3.create();
        this.oscillationTime = 0;
    }

    setPosition(x, y, z) {
        this.position = vec3.fromValues(x, y, z);
        this.basePosition = vec3.fromValues(x, y, z);
    }
}
