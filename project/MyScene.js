import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyPanorama } from './MyPanorama.js';
import { MyPlane } from './MyPlane.js';
import { MySphere } from './MySphere.js';
import { MyRock } from './MyRock.js';
import { MyFlower } from './MyFlower.js';
import { MyBee } from './MyBee.js';
import { getRandom } from './common.js';
import { MyGarden } from './MyGarden.js';
import { MyRockSet } from './MyRockSet.js';

export class MyScene extends CGFscene {
  constructor() {
    super();
    this.panoramaTexture = null;
    this.panorama = null;
    this.rocks = [];
    this.rockSet = null;
    this.flowers = [];
    this.bee = null;
    this.lastUpdateTime=0;
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

    // Enable alpha blending
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);

    // Initialize scene objects
    this.axis = new CGFaxis(this);
    this.plane = new MyPlane(this, 30);
    this.sphere = new MySphere(this, 20, 20);
    this.garden = new MyGarden(this, 5, 5); // Create a 5x5 garden

    // Objects connected to MyInterface
    this.displayAxis = true;
    this.displayNormals=false;
    this.scaleFactor = 1;
    this.speedFactor = 1;

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

    // Define red color appearance for rocks
    this.rockAppearance = new CGFappearance(this);
    this.rockAppearance.setAmbient(1.0, 0.0, 0.0, 1.0);
    this.rockAppearance.setDiffuse(1.0, 0.0, 0.0, 1.0);
    this.rockAppearance.setSpecular(1.0, 0.0, 0.0, 1.0);
    this.rockAppearance.setShininess(10);

    this.grayAppearance = new CGFappearance(this);
    this.grayAppearance.setAmbient(0.1, 0.1, 0.1, 1);
    this.grayAppearance.setDiffuse(0.1, 0.1, 0.1, 1);
    this.grayAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.grayAppearance.setShininess(10);

    // Create rocks
    this.createRocks();

    // Create rock set (pile)
    this.createRockSet();

    // Create flowers
    this.createFlowers();

    // Create a bee
    this.createBee();

    // Ensure 'gui' is initialized before adding controls
    if (this.gui) {
      this.gui.gui.add(this, 'scaleFactor', 0.5, 3).name('Scale Factor');
      this.gui.gui.add(this, 'speedFactor', 0.1, 3).name('Speed Factor');
    }
  }

  createRocks() {
    const groundY = -50; // Y-position of the ground plane
    const positions = [];

    for (let i = 0; i < 10; i++) {
      const size = Math.random() * 2 + 0.5; // Random size between 0.5 and 2.5
      let x, z;
      let isOverlapping;

      do {
        x = getRandom(-50, 50); // Random x position within a larger range
        z = getRandom(-50, 50); // Random z position within a larger range
        isOverlapping = positions.some(pos => Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2) < size * 2);
      } while (isOverlapping);

      positions.push({ x, z });

      const rock = new MyRock(this, size);
      rock.setPosition(x, groundY, z);
      this.rocks.push(rock);

      console.log(`Rock ${i}: Position (${x}, ${groundY}, ${z}) Size ${size}`);
    }
  }

  createRockSet() {
    const groundY = -50; // Y-position of the ground plane
    const x = getRandom(-50, 50); // Random x position within a larger range
    const z = getRandom(-50, 50); // Random z position within a larger range

    this.rockSet = new MyRockSet(this, 10, [x, groundY, z]);
  }

  createFlowers() {

    const numFlowers = 10;
    const groundY = -50; // Y-position of the ground plane
    for (let i = 0; i < numFlowers; i++) {
      const x = getRandom(-20, 20);
      const z = getRandom(-20, 20);
      const flower = new MyFlower(this);
      flower.setPosition(x, groundY, z); // Set y to groundY for ground level
      flower.setScale(Math.random() * 2 + 1); // Random scale between 1 and 3
      this.flowers.push(flower);
    }
  }

  createBee() {
    this.bee = new MyBee(this, 'images/beewing.jpg'); // Using the uploaded wing texture
    this.bee.setPosition(0, 5, 0);
    console.log('Bee created and position set');
  }

  initLights() {
    this.lights[0].setPosition(15, 0, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
      0.4, // Field of view
      0.1, // Near plane
      1000, // Far plane
      vec3.fromValues(15, 15, 15), // Camera position
      vec3.fromValues(0, 0, 0) // Target
    );
  }

  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }

  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    if (this.displayAxis) this.axis.display();

    this.pushMatrix();
    this.grassAppearance.apply();
    this.translate(0, -100, 0); // Ensure this matches the groundY in createRocks
    this.scale(400, 400, 400);
    this.rotate(-Math.PI / 2.0, 1, 0, 0);
    this.plane.display();
    this.popMatrix();

    this.pushMatrix();
    this.earthAppearance.apply();
    this.translate(0, -100, 0);
    this.translate(0, (200 * this.scaleFactor) / 2, 0);
    this.sphere.display();
    this.popMatrix();

    this.pushMatrix();
    this.scale(200, 200, 200);
    this.panorama.display();
    this.popMatrix();

    // Display all rocks
    this.rockAppearance.apply(); // Apply red appearance for rocks
    for (let rock of this.rocks) {
      this.pushMatrix();
      this.translate(rock.position[0], rock.position[1], rock.position[2]);
      rock.display();
      this.popMatrix();
    }

    // Display rock set (pile)
    this.rockSet.display();

    // Display flowers
    this.flowers.forEach((flower) => {
      this.pushMatrix();
      this.translate(flower.position.x, flower.position.y, flower.position.z);
      flower.display();
      this.popMatrix();
    });

    // Display garden
    this.pushMatrix();
    this.garden.display();
    this.popMatrix();

    // Display bee
    this.pushMatrix();
    this.bee.display();
    this.popMatrix();
  }

  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
      this.bee.accelerate(0.1 * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
      this.bee.accelerate(-0.1 * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyA")) {
      text += " A ";
      keysPressed = true;
      this.bee.turn(0.1 * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyD")) {
      text += " D ";
      keysPressed = true;
      this.bee.turn(-0.1 * this.speedFactor);
    }

    if (this.gui.isKeyPressed("KeyR")) {
      text += " R ";
      keysPressed = true;
      this.bee.reset();
    }

    if (keysPressed) console.log(text);
    {
      console.log(`Keys pressed: ${text}`);
    }
  }

  

  update(t) {
   
    const delta_t = t - (this.lastUpdateTime || 0);
    this.lastUpdateTime = t;

    this.checkKeys();
    this.bee.update(delta_t / 1000.0); // Convert milliseconds to seconds
    // this.garden.display();
  }
}
