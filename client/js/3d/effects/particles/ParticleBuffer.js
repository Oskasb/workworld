"use strict";

define([
        'ThreeAPI'
    ],
    function(
        ThreeAPI
    ) {



        var ParticleBuffer = function(verts, uvs, indices, normals) {
            this.buildGeometry(verts, uvs, indices, normals);
        };

        ParticleBuffer.prototype.buildGeometry = function(verts, uvarray, indices, normals) {

            var geometry = new THREE.InstancedBufferGeometry();

            var posBuffer   =     verts;
            var uvBuffer    =     uvarray;

            // per mesh data

            if (indices) {
                posBuffer   =     new Float32Array( verts );
                uvBuffer    =      new Float32Array( uvarray );

            } else {
                indices = [];
                for ( var i = 0; i < verts.length / 3; i ++ ) {
                    indices[ i ] = i;
                }
            }


            if (normals) {
                var normal = new THREE.BufferAttribute(normals , 3 );
                geometry.addAttribute( 'vertexNormal', normal );
            }


            var indexBuffer =   new Uint16Array( indices );
            geometry.setIndex( new THREE.BufferAttribute( indexBuffer , 1 ) );

            geometry.index.needsUpdate = true;

            var vertices = new THREE.BufferAttribute(posBuffer , 3 );
            geometry.addAttribute( 'vertexPosition', vertices );

            var uvs = new THREE.BufferAttribute( uvBuffer , 2 );
            geometry.addAttribute( 'uv', uvs );


            this.geometry = geometry;

            var mesh = new THREE.Mesh(geometry);
            mesh.frustumCulled = false;
            //    mesh.scale.set(1, 1, 1);
            this.applyMesh(mesh);

        };

        ParticleBuffer.prototype.applyMesh = function(mesh) {
            this.mesh = mesh;
        };

        ParticleBuffer.prototype.setInstancedCount = function(count) {
            this.mesh.geometry.maxInstancedCount = count;
        };

        ParticleBuffer.prototype.dispose = function() {
            ThreeAPI.hideModel(this.mesh);
            this.geometry.dispose();
        };

        ParticleBuffer.prototype.removeFromScene = function() {
            ThreeAPI.hideModel(this.mesh);
        };

        ParticleBuffer.prototype.addToScene = function(screenSpace) {
            if (screenSpace) {
                ThreeAPI.attachObjectToCamera(this.mesh);
            } else {
                ThreeAPI.showModel(this.mesh);
            }
        };

        return ParticleBuffer;

    });