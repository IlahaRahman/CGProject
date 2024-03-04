
import { CGFobject } from '../lib/CGF.js';

export class MyParalellogram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        // Define the vertices and indices for the right triangle in the XY plane
        // ...


        this.vertices = [
            1,1,0, //0
            0,0,0, //1
            2,0,0, //2
            3,1,0, //3
            
        ];

        this.indices =[
            0,1,3,
            1,2,3,

        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
