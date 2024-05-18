import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFshader, CGFtexture } from "../lib/CGF.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from './MySphere.js';
import { MyRock } from './MyRock.js';
import { MyRockSet } from "./MyRockSet.js";
import { MyFlower } from "./MyFlower.js";
import { getRandom } from "./common.js";
// import { MyGarden } from "./MyGarden.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.panoramaTexture = null;
    this.panorama = null;
    this.myRockSet = null;
    this.rocks = [];
    this.flowers = [];
  }

  init(application) {
    super.init(application);
    this.initCameras();
    this.initLights();

    // Background color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    // Initialize scene objects
    this.axis = new CGFaxis(this);
    this.plane = new MyPlane(this, 30);
    this.sphere = new MySphere(this, 20, 20);
    this.myRockSet = new MyRockSet(this, 10);

    // Objects connected to MyInterface
    this.displayAxis = true;
    this.scaleFactor = 1;

    this.enableTextures(true);

    this.panoramaTexture = new CGFtexture(this, "images/panorama4.jpg");
    this.panorama = new MyPanorama(this, this.panoramaTexture);

    this.earthTexture = new CGFtexture(this, "images/earth.jpg");
    this.earthAppearance = new CGFappearance(this);
    this.earthAppearance.setTexture(this.earthTexture);
    this.earthAppearance.setTextureWrap('REPEAT', 'REPEAT');

    this.grassTexture = new CGFtexture(this, "images/grass.jpg");
    this.grassAppearance = new CGFappearance(this);
    this.grassAppearance.setTexture(this.grassTexture);
    this.grassAppearance.setTextureWrap('REPEAT', 'REPEAT');

    this.grayAppearance = new CGFappearance(this);
    this.grayAppearance.setAmbient(0.5, 0.5, 0.5, 1); // Gray ambient color
    this.grayAppearance.setDiffuse(0.5, 0.5, 0.5, 1); // Gray diffuse color
    this.grayAppearance.setSpecular(0.1, 0.1, 0.1, 1); // Gray specular color
    this.grayAppearance.setShininess(10); // Shininess value for the gray appearance

    // Create rocks
    this.createRocks();

    // Create flowers
    this.createFlowers();
  }

  createRocks() {
    for (let i = 0; i < 10; i++) {
      const rock = new MyRock(this, Math.random() * 5 + 1);
      this.rocks.push(rock);
    }
  }

  createFlowers() {
    const numFlowers = 10; // Define the number of flowers
    for (let i = 0; i < numFlowers; i++) {
      const x = getRandom(-20, 20); // Random x position
      const z = getRandom(-20, 20); // Random z position
      const flower = new MyFlower(this);
      flower.setPosition(x, 0,z);
      this.flowers.push(flower);
    }
  }

  initLights() {
    this.lights[0].setPosition(15, 0, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      1.0,
      0.1,
      1000,
      vec3.fromValues(50, 10, 15),
      vec3.fromValues(0, 0, 0)
    );
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) this.axis.display();

    // ---- BEGIN Primitive drawing section

    this.pushMatrix();
    this.grassAppearance.apply();
    this.translate(0, -100, 0);
    this.scale(400, 400, 400);
    this.rotate(-Math.PI / 2.0, 1, 0, 0);
    this.plane.display();
    this.popMatrix();

    // Display the sphere
    this.pushMatrix();
    this.earthAppearance.apply();
    this.translate(0, -100, 0); // Translate by the same amount as the plane
    this.translate(0, (200 * this.scaleFactor) / 2, 0);
    this.sphere.display();
    this.popMatrix();

    // Display the panorama centered on the camera position
    this.pushMatrix();
    this.scale(200, 200, 200);
    this.panorama.display();
    this.popMatrix();

    // Display a single rock
    this.pushMatrix();
    this.grassAppearance.apply();
    this.translate(10, -100, 0); // Example: Translate the rock to a specific position
    this.rocks[0].display(); // Display the first rock in the array
    this.popMatrix();

    // Draw flowers
    this.flowers.forEach((flower) => {
      flower.display();
    });

    // ---- END Primitive drawing section
    // const error = this.gl.getError();
    // if (error !== this.gl.NO_ERROR) {
    //     console.error('WebGL error:', error);
    // }
  }
}
