

import { CGFobject } from '../lib/CGF.js';

export class MyRock extends CGFobject {
    constructor(scene, size) {
        super(scene);
        this.size = size; // Size of the rock
        this.position=vec3.create();
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
    
        // Generate random vertices to represent the rock shape
        const numVertices = 100; // Example: Number of vertices
        const radius = this.size; // Example: Radius of the rock
        
        for (let i = 0; i < numVertices; i++) {
            const theta = Math.random() * Math.PI * 2; // Random angle
            const phi = Math.random() * Math.PI; // Random angle in upper hemisphere
    
            // Generate a random radius to create irregularity in the shape
            const randRadius = radius + Math.random() * radius * 0.5; // Example: Random radius
    
            // Calculate vertex position
            const x = randRadius * Math.sin(phi) * Math.cos(theta);
            const y = randRadius * Math.sin(phi) * Math.sin(theta);
            const z = randRadius * Math.cos(phi);
    
            // Push vertex position
            this.vertices.push(x, y, z);
    
            // Calculate vertex normal (for simplicity, let's use a normalized vector from the origin to the vertex)
            const normal = vec3.fromValues(x, y, z);
            vec3.normalize(normal, normal);
            this.normals.push(...normal);
        }
    
        // Generate indices for drawing triangles (you can use a simple triangle strip or another method)
        for (let i = 0; i < numVertices - 2; i++) {
            this.indices.push(0, i + 1, i + 2); // Example: Triangle strip
        }
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    setPosition (x,y,z)
    {
        this.position=vec3.fromValues(x,y,z);
    }

    display()
    {
        this.scene.translate(this.position[0], this.position[1], this.position[2]);

        super.display();
    }
    
}
