import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyPanorama } from './MyPanorama.js';
import { MyPlane } from './MyPlane.js';
import { MySphere } from './MySphere.js';
import { MyRock } from './MyRock.js';
import { MyFlower } from './MyFlower.js';
import { MyBee } from './MyBee.js';
import { getRandom } from './common.js';
import { MyGarden } from './MyGarden.js';

export class MyScene extends CGFscene {
    constructor() {
        super();
        this.panoramaTexture = null;
        this.panorama = null;
        this.rocks = [];
        this.flowers = [];
        this.bee = null;
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
        this.garden = new MyGarden(this, 5, 5); // Create a 5x5 garden

        // Objects connected to MyInterface
        this.displayAxis = true;
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

        this.grayAppearance = new CGFappearance(this);
        this.grayAppearance.setAmbient(0.1, 0.1, 0.1, 1);
        this.grayAppearance.setDiffuse(0.1, 0.1, 0.1, 1);
        this.grayAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.grayAppearance.setShininess(10);

        // Create rocks
        this.createRocks();

        // Create flowers
        this.createFlowers();

        // Create a bee
        this.createBee();

        // Ensure 'gui' is initialized before adding controls
        if (this.gui) {
            this.gui.gui.add(this, 'scaleFactor', 0.5, 3).name('Scale Factor');
            this.gui.gui.add(this, 'speedFactor', 0.1, 3).name('Speed Factor');
        }

        // Log camera setup
        console.log("Camera setup complete. Position:", this.camera.position, "Target:", this.camera.target);
    }

    initCameras() {
        this.camera = new CGFcamera(
            0.8, // Field of view (radians)
            0.1, // Near plane
            1000, // Far plane
            vec3.fromValues(20, 20, 20), // Camera position (higher to see more area)
            vec3.fromValues(0, 0, 0) // Camera target (looking at the origin)
        );

        // Log the camera position and target for debugging
        console.log("Camera position:", this.camera.position);
        console.log("Camera target:", this.camera.target);
    }

    initLights() {
        this.lights[0].setPosition(15, 0, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }

    createRocks() {
        for (let i = 0; i < 10; i++) {
            const size = Math.random() * 2 + 0.5; // Random size between 0.5 and 2.5
            const x = Math.random() * 10 - 5; // Random x position within a visible range
            const y = 0; // Keep y position fixed for simplicity
            const z = Math.random() * 10 - 5; // Random z position within a visible range

            const rock = new MyRock(this, size);
            rock.setPosition(x, y, z);
            this.rocks.push(rock);

            console.log(`Rock ${i}: Position (${x}, ${y}, ${z}) Size ${size}`);
        }
    }

    createFlowers() {
        const numFlowers = 10;
        for (let i = 0; i < numFlowers; i++) {
            const x = getRandom(-20, 20);
            const z = getRandom(-20, 20);
            const flower = new MyFlower(this);
            flower.setPosition(x, z); // Ensure y is set to 0 for ground level
            this.flowers.push(flower);
        }
    }

    createBee() {
        this.bee = new MyBee(this, "images/beeWing.jpg", "images/beeEye.jpg", "images/beeLeg.jpg");
        this.bee.setPosition(0, 5, 0);
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
    }

    update(t) {
        this.checkKeys();
        this.bee.update(t);
        this.garden.display();
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
        this.translate(0, -100, 0);
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
        this.grayAppearance.apply(); // Apply dark gray appearance once
        for (let rock of this.rocks) {
            this.pushMatrix();
            this.translate(rock.position[0], rock.position[1], rock.position[2]);
            rock.display();
            this.popMatrix();
        }

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
}
