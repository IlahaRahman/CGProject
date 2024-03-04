// MyTriangle.js
import { CGFobject } from '../lib/CGF.js';

export class MyTriangle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        // Define the vertices and indices for the right triangle in the XY plane
        // ...


        this.vertices = [
            -1,1,0,  //0
            -1,-1,0, //1
             1,-1,0, //2
            
        ];

        this.indices =[
            0,1,2,

        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
