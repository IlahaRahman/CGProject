import { CGFobject } from '../lib/CGF.js';

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, inverted = false) {
        super(scene);
        this.slices = slices || 30; // default number of slices
        this.stacks = stacks || 30; // default number of stacks
        this.inverted = inverted;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var phi, theta;
        var x, y, z;
        var normalX, normalY, normalZ;

        var stackStep = this.stacks !== 0 ? (this.inverted ? -1 : 1) : 0;
        var sliceStep = this.slices !== 0 ? (this.inverted ? -1 : 1) : 0;


        for (var stack = 0; stack <= this.stacks; stack+=stackStep) {
            for (var slice = 0; slice <= this.slices; slice+=sliceStep) {
                phi = (stack * Math.PI) / this.stacks;
                theta = (slice * 2 * Math.PI) / this.slices;

                x = Math.cos(theta) * Math.sin(phi);
                y = Math.cos(phi);
                z = Math.sin(theta) * Math.sin(phi);

                normalX = x;
                normalY = y;
                normalZ = z;

                this.vertices.push(x, y, z);
                this.normals.push(normalX, normalY, normalZ);
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }

        for (var stack = 0; stack < this.stacks; stack++) {
            for (var slice = 0; slice < this.slices; slice++) {
                var first = stack * (this.slices + 1) + slice;
                var second = first + this.slices + 1;
                
                if(!this.inverted)
                {
                this.indices.push(first, second + 1, second);
                this.indices.push(first, first + 1, second + 1);
                }
                else {
                    this.indices.push(first, second, second + 1);
                    this.indices.push(first, second + 1, first + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
