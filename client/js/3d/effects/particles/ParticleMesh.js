

"use strict";

define([

        '3d/three/ThreeModelLoader'
    ],
    function(
        ThreeModelLoader
    ) {

        var stampVerts = [
            -1,  0,  1,
            1,   0,  1,
            -1,  0, -1,
            1,   0, -1
        ];
      
        var quadVerts = [
            -1, -1, 0,
            1,  -1, 0,
            -1,  1, 0,
            1,   1, 0
        ];


        var quadUvs = [
            0, 0,
            1, 0,
            0, 1,
            1, 1
        ];

        var quadInds =[
            0, 1, 2,
            2, 1, 3
        ];

        var plantUvs = [
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            1, 0,
            0, 0,
            1, 1,
            0, 1
        ];

        var plantInds =[
            0, 1, 2,
            2, 1, 3,
            4, 5, 6,
            6, 5, 7
        ];


        var plantVerts = [
            // Front
            -1, -0.2,  0.1,
             1, -0.2, -0.1,
            -1,  1.8,  0.1,
             1,  1.8, -0.1,

            // Left
             0.1, -0.2, -1,
            -0.1, -0.2,  1,
             0.1,  1.8, -1,
            -0.1,  1.8,  1

        ];


        var cross3Verts = [
            // Front
            -1,  1, 0,
            1,   1, 0,
            -1, -1, 0,
            1,  -1, 0,
            // Back
            1,  1,  0,
            -1,  1, 0,
            1, -1,  0,
            -1, -1, 0,
            // Left
            0,  1, -1,
            0,  1,  1,
            0, -1, -1,
            0, -1,  1,
            // Right
            0,  1,  1,
            0,  1, -1,
            0, -1,  1,
            0, -1, -1,
            // Top
            -1, 0,  1,
            1,  0,  1,
            -1, 0, -1,
            1,  0, -1,
            // Bottom
            1,  0,  1,
            -1, 0,  1,
            1,  0, -1,
            -1, 0, -1
        ];








        var trailGeometry = new THREE.PlaneBufferGeometry(2, 2, 5, 1);



        var ParticleMesh = function() {2

        };

        var plantclamped = false;

        ParticleMesh.plant3d = function() {
            if (!plantclamped) {
                for (var i = 0; i < plantUvs.length; i++) {
                    plantUvs[i] = MATH.clamp(plantUvs[i], 0.01, 0.99);
                }
                plantclamped = true;
            }

            return {verts:plantVerts, indices:plantInds, uvs:plantUvs};
        };

        ParticleMesh.cross3d = function() {
            return {verts:cross3Verts, indices:boxIndices, uvs:boxUvs};
        };

        ParticleMesh.quad = function() {
            return {verts:quadVerts, indices:quadInds, uvs:quadUvs};
        };

        ParticleMesh.trail5 = function() {

            console.log("trailGeometry :", trailGeometry);

            var verts = trailGeometry.attributes.position.array;
            var uv =    trailGeometry.attributes.uv.array;
            var ind =   trailGeometry.index.array;

            return {verts:verts, indices:ind, uvs:uv};
        };


        ParticleMesh.stamp = function() {
            return {verts:stampVerts, indices:quadInds, uvs:quadUvs};
        };

        var boxclamped = false;

       var boxNormals;
        var boxVerts = [];

        var boxUvs = [];

        var boxIndices = [];

        ParticleMesh.box3d = function() {

            if (!boxclamped) {

                var box = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);

                boxVerts   = box.attributes.position.array;
                boxNormals = box.attributes.normal.array;
                boxUvs     = box.attributes.uv.array;
                boxIndices = box.index.array;
                for (var i = 0; i < boxUvs.length; i++) {
                    boxUvs[i] = MATH.clamp(boxUvs[i], 0.01, 0.99);
                }
                boxclamped = true;
            }

            return {verts:boxVerts, indices:boxIndices, normals:boxNormals, uvs:boxUvs};
        };

        var geomStore = {};

        ParticleMesh.modelGeometry = function(modelConf, callback) {

            var modelId = modelConf.model_id;

            var modelPool = ThreeModelLoader.getModelPool();


            if (!geomStore[modelId]) {
                var mesh = modelPool[modelId][0];
                geomStore[modelId] = mesh.geometry;
            }

            var geometry = geomStore[modelId];

        //    geometry.indices.needsUpdate = true;

            var verts   = geometry.attributes.position.array;
            var normals = geometry.attributes.normal.array;
            var uvs     = geometry.attributes.uv.array;

            callback({verts:verts, normals:normals, uvs:uvs});
        };

        return ParticleMesh;

    });