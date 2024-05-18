import { CGFobject } from '../lib/CGF.js';

class Triangle extends CGFobject {
    constructor(scene, length, peakHeight) {
        super(scene);
        this.length = length;
        this.peakHeight = peakHeight;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0, 0, 0,
            this.length, 0, 0,
            this.length / 2, this.peakHeight, 0
        ];

        this.indices = [0, 1, 2];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

export { Triangle };
