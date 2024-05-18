import { CGFobject } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";
import { MyCylinder } from "./MyCylinder.js";

export class MyBee extends CGFobject {
  constructor(scene) {
    super(scene);

    this.scene = scene;

    // Define parts of the bee
    this.head = new MySphere(scene, 16, 8);
    this.body = new MySphere(scene, 16, 8);
    this.wings = [new MyCylinder(scene, 16, 8), new MyCylinder(scene, 16, 8)];
    this.antennae = [new MyCylinder(scene, 8, 4), new MyCylinder(scene, 8, 4)];
    this.legs = [
      new MyCylinder(scene, 8, 4),
      new MyCylinder(scene, 8, 4),
      new MyCylinder(scene, 8, 4),
      new MyCylinder(scene, 8, 4),
      new MyCylinder(scene, 8, 4),
      new MyCylinder(scene, 8, 4),
    ];

    // Textures and appearances
    this.bodyTexture = new CGFappearance(scene);
    this.bodyTexture.setAmbient(1, 1, 0, 1);
    this.bodyTexture.setDiffuse(1, 1, 0, 1);
    this.bodyTexture.setSpecular(0, 0, 0, 1);
    this.bodyTexture.setShininess(10);

    this.wingTexture = new CGFappearance(scene);
    this.wingTexture.setAmbient(0.9, 0.9, 0.9, 0.5); // Semi-transparent wings
    this.wingTexture.setDiffuse(0.9, 0.9, 0.9, 0.5);
    this.wingTexture.setSpecular(0.9, 0.9, 0.9, 0.5);
    this.wingTexture.setShininess(10);
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    // Draw head
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 1.5);
    this.scene.scale(0.5, 0.5, 0.5);
    this.bodyTexture.apply();
    this.head.display();
    this.scene.popMatrix();

    // Draw body
    this.scene.pushMatrix();
    this.scene.scale(0.5, 0.5, 1.0);
    this.bodyTexture.apply();
    this.body.display();
    this.scene.popMatrix();

    // Draw wings
    this.wingTexture.apply();
    for (let i = 0; i < this.wings.length; i++) {
      this.scene.pushMatrix();
      this.scene.translate(0, 0.5, i === 0 ? 0.5 : -0.5);
      this.scene.rotate(i === 0 ? Math.PI / 6 : -Math.PI / 6, 1, 0, 0);
      this.scene.scale(0.1, 0.5, 1);
      this.wings[i].display();
      this.scene.popMatrix();
    }

    // Draw antennae
    this.bodyTexture.apply();
    for (let i = 0; i < this.antennae.length; i++) {
      this.scene.pushMatrix();
      this.scene.translate(i === 0 ? -0.15 : 0.15, 0.35, 1.9);
      this.scene.rotate(Math.PI / 4, 1, 0, 0);
      this.scene.scale(0.05, 0.5, 0.05);
      this.antennae[i].display();
      this.scene.popMatrix();
    }

    // Draw legs
    for (let i = 0; i < this.legs.length; i++) {
      this.scene.pushMatrix();
      this.scene.translate((i % 2 === 0 ? -0.3 : 0.3), -0.3, 0.5 - Math.floor(i / 2) * 0.5);
      this.scene.rotate(-Math.PI / 4, 1, 0, 0);
      this.scene.scale(0.05, 0.5, 0.05);
      this.legs[i].display();
      this.scene.popMatrix();
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
