import { CGFinterface, dat } from '../lib/CGF.js';

export class MyInterface extends CGFinterface {
    constructor() {
        super();
        this.listenersAttached = false;
    }

    init(application) {
        super.init(application);
        this.gui = new dat.GUI();
        this.initKeys();
        return true;
    }

    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
        if (!this.listenersAttached) {
            // document.addEventListener('keydown', (event) => this.processKeyDown(event));
            // document.addEventListener('keyup', (event) => this.processKeyUp(event));
            this.listenersAttached = true;
        }
    }

    processKeyDown(event) {
        console.log(`Key Down: ${event.code}`);
        this.activeKeys[event.code] = true;
    }

    processKeyUp(event) {
        console.log(`Key Up: ${event.code}`);
        this.activeKeys[event.code] = false;
    }

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}
