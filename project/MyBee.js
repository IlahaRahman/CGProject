import { CGFobject } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";
import { MyCylinder } from "./MyCylinder.js";
import { MyWing } from "./MyWing.js";
import { CGFappearance, CGFtexture } from "../lib/CGF.js";

export class MyBee extends CGFobject {
  constructor(scene, wingTexture, eyeTexture, legTexture) {
    super(scene);
    this.scene = scene;

    this.wingTexture = new CGFtexture(scene, wingTexture);
    this.eyeTexture = new CGFtexture(scene, eyeTexture);
    this.legTexture = new CGFtexture(scene, legTexture);

    this.head = new MySphere(scene, 16, 8);
    this.thorax = new MySphere(scene, 16, 8);
    this.abdomen = new MySphere(scene, 16, 8);
    this.antennaSegments = [];
    for (let i = 0; i < 5; i++) {
      this.antennaSegments.push(new MyCylinder(scene, 8, 1));
    }
    this.eye1 = new MySphere(scene, 8, 8);
    this.eye2 = new MySphere(scene, 8, 8);
    this.leg1 = new MyCylinder(scene, 8, 1);
    this.leg2 = new MyCylinder(scene, 8, 1);
    this.wing1 = new MyWing(scene);
    this.wing2 = new MyWing(scene);

    this.position = { x: 0, y: 3, z: 0 };
    this.orientation = 0;
    this.velocity = { x: 0, y: 0, z: 0 };

    this.yellowAppearance = new CGFappearance(scene);
    this.yellowAppearance.setAmbient(1.0, 1.0, 0.0, 1);
    this.yellowAppearance.setDiffuse(1.0, 1.0, 0.0, 1);
    this.yellowAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.yellowAppearance.setShininess(10);

    this.blackAppearance = new CGFappearance(scene);
    this.blackAppearance.setAmbient(0.0, 0.0, 0.0, 1);
    this.blackAppearance.setDiffuse(0.1, 0.1, 0.1, 1);
    this.blackAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.blackAppearance.setShininess(10);

    this.wingAppearance = new CGFappearance(scene);
    this.wingAppearance.setAmbient(1.0, 1.0, 1.0, 0.5);
    this.wingAppearance.setDiffuse(1.0, 1.0, 1.0, 0.5);
    this.wingAppearance.setSpecular(0.1, 0.1, 0.1, 0.5);
    this.wingAppearance.setShininess(10);
    this.wingAppearance.setTexture(this.wingTexture);
    this.wingAppearance.setTextureWrap('REPEAT', 'REPEAT');

    this.initBuffers();
  }

  setPosition(x, y, z) {
    this.position = { x, y, z };
  }

  enableNormalViz() {
    super.enableNormalViz();
    this.head.enableNormalViz();
    this.thorax.enableNormalViz();
    this.abdomen.enableNormalViz();
    this.antennaSegments.forEach(segment => segment.enableNormalViz());
    this.eye1.enableNormalViz();
    this.eye2.enableNormalViz();
    this.leg1.enableNormalViz();
    this.leg2.enableNormalViz();
    this.wing1.enableNormalViz();
    this.wing2.enableNormalViz();
  }

  disableNormalViz() {
    super.disableNormalViz();
    this.head.disableNormalViz();
    this.thorax.disableNormalViz();
    this.abdomen.disableNormalViz();
    this.antennaSegments.forEach(segment => segment.disableNormalViz());
    this.eye1.disableNormalViz();
    this.eye2.disableNormalViz();
    this.leg1.disableNormalViz();
    this.leg2.disableNormalViz();
    this.wing1.disableNormalViz();
    this.wing2.disableNormalViz();
  }

  turn(v) {
    this.orientation += v;
    this.updateVelocity();
  }

  accelerate(v) {
    this.velocity.x += v * Math.sin(this.orientation);
    this.velocity.z += v * Math.cos(this.orientation);
  }

  reset() {
    this.position = { x: 0, y: 3, z: 0 };
    this.orientation = 0;
    this.velocity = { x: 0, y: 0, z: 0 };
  }

  update(t) {
    const deltaTime = t / 1000; // Convert time to seconds
    this.position.x += this.velocity.x * deltaTime;
    this.position.z += this.velocity.z * deltaTime;
  }

  updateVelocity() {
    const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
    this.velocity.x = speed * Math.sin(this.orientation);
    this.velocity.z = speed * Math.cos(this.orientation);
  }

  display() {
    const time = performance.now() / 1000; // Get the current time in seconds

    const oscillation = Math.sin(time * 2 * Math.PI) * 0.1; // Up and down oscillation
    const wingFlap = Math.sin(time * 10 * Math.PI) * Math.PI / 8; // Wing flapping

    this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
    this.scene.gl.enable(this.scene.gl.BLEND);

    this.scene.pushMatrix();
    this.scene.translate(this.position.x, this.position.y + oscillation, this.position.z);
    this.scene.rotate(this.orientation, 0, 1, 0);

    // Display head in yellow
    this.scene.pushMatrix();
    this.scene.translate(0, 0.8, 0);
    this.scene.scale(0.5, 0.5, 0.5);
    this.yellowAppearance.apply();
    this.head.display();
    this.scene.popMatrix();

    // Display eyes in black
    const eyeScale = 0.1;

    this.scene.pushMatrix();
    this.scene.translate(0.3, 1.0, 0.3);
    this.scene.scale(eyeScale, eyeScale, eyeScale);
    this.blackAppearance.apply();
    this.eye1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-0.3, 1.0, 0.3);
    this.scene.scale(eyeScale, eyeScale, eyeScale);
    this.blackAppearance.apply();
    this.eye2.display();
    this.scene.popMatrix();

    // Display thorax in black
    this.scene.pushMatrix();
    this.scene.translate(0, 0.4, -0.6);
    this.scene.scale(0.6, 0.6, 0.6);
    this.blackAppearance.apply();
    this.thorax.display();
    this.scene.popMatrix();

    // Display abdomen in yellow
    this.scene.pushMatrix();
    this.scene.translate(0, 0.4, -1.4);
    this.scene.scale(0.7, 0.7, 0.7);
    this.yellowAppearance.apply();
    this.abdomen.display();
    this.scene.popMatrix();

    // Display antennae in black (curved)
    const antennaLength = 0.5; // Make the antennae longer
    const segmentAngle = Math.PI / 8;
    this.scene.pushMatrix();
    this.scene.translate(0.2, 1, 0.2);
    this.scene.rotate(segmentAngle, 1, 0, 0);
    this.scene.scale(0.05, antennaLength, 0.05);
    this.blackAppearance.apply();
    this.antennaSegments.forEach(segment => segment.display());
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-0.2, 1, 0.2);
    this.scene.rotate(segmentAngle, 1, 0, 0);
    this.scene.scale(0.05, antennaLength, 0.05);
    this.blackAppearance.apply();
    this.antennaSegments.forEach(segment => segment.display());
    this.scene.popMatrix();

    // Display legs
    this.scene.pushMatrix();
    this.scene.translate(0.5, -0.2, -0.3); // Move leg away from body
    this.scene.rotate(-Math.PI / 4, 1, 0, 0);
    this.scene.scale(0.05, 0.05, 0.5);
    this.legTexture.bind();
    this.leg1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-0.5, -0.2, -0.3); // Move leg away from body
    this.scene.rotate(-Math.PI / 4, 1, 0, 0);
    this.scene.scale(0.05, 0.05, 0.5);
    this.legTexture.bind();
    this.leg2.display();
    this.scene.popMatrix();

    this.scene.popMatrix();

    // Draw transparent wings last
    this.scene.gl.depthMask(false); // Disable depth writing for transparent objects
    this.wingAppearance.apply();

    this.scene.pushMatrix();
    this.scene.translate(this.position.x, this.position.y + oscillation, this.position.z);
    this.scene.rotate(this.orientation, 0, 1, 0);

    // First wing
    this.scene.pushMatrix();
    this.scene.translate(0.7, 0.5, -0.5);
    this.scene.rotate(Math.PI / 6 + wingFlap, 0, 1, 0);
    this.wing1.display();
    this.scene.popMatrix();

    // Second wing
    this.scene.pushMatrix();
    this.scene.translate(-0.7, 0.5, -0.5);
    this.scene.rotate(-Math.PI / 6 - wingFlap, 0, 1, 0);
    this.wing2.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
    this.scene.gl.depthMask(true); // Re-enable depth writing

    this.scene.gl.disable(this.scene.gl.BLEND);
  }
}
