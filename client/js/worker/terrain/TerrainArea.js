"use strict";

define([
        'worker/terrain/AreaFunctions',
        'worker/terrain/TerrainFeature'
    ],
    function(
        AreaFunctions,
        TerrainFeature
    ) {

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempObj3d = new THREE.Object3D();

        var TerrainArea = function(terrainFunctions) {
            this.size = 0;
            this.origin = new THREE.Vector3();
            this.extents = new THREE.Vector3();
            this.terrainFunctions = terrainFunctions;
            this.areaFunctions = new AreaFunctions(terrainFunctions);
            this.terrainOptions = null;
            this.buffers = null;
            this.terrain = null;
            this.terrainFeatures = [];
        };

        TerrainArea.prototype.setTerrainOptions = function(options) {
            this.terrainOptions = options;
        };

        TerrainArea.prototype.setTerrainPosXYZ = function(x, y, z) {
            this.origin.x = x;
            this.origin.y = y;
            this.origin.z = z;
        };

        TerrainArea.prototype.getTerrain = function() {
            return this.terrain;
        };

        TerrainArea.prototype.getOrigin = function() {
            return this.origin;
        };

        TerrainArea.prototype.getExtents = function() {
            return this.extents;
        };

        TerrainArea.prototype.setTerrainExtentsXYZ = function(x, y, z) {
            this.extents.x = x;
            this.extents.y = y;
            this.extents.z = z;
        };

        TerrainArea.prototype.addTerrainFeatures = function() {

            for (var key in ENUMS.TerrainFeature) {
                this.terrainFeatures[ENUMS.TerrainFeature[key]] = new TerrainFeature(ENUMS.TerrainFeature[key]);
            }

        };

        TerrainArea.prototype.createAreaOfTerrain = function(msg) {

            this.setTerrainOptions(msg.options);
            this.size = this.terrainOptions.terrain_size;
            this.setTerrainPosXYZ(msg.posx, this.terrainOptions.min_height, msg.posz);
            this.setTerrainExtentsXYZ(this.size, this.terrainOptions.max_height - this.terrainOptions.min_height, this.size);

            this.terrain = this.terrainFunctions.createTerrain(this.terrainOptions);
            this.buffers = this.terrainFunctions.getTerrainBuffers(this.terrain);
            this.terrain.array1d = this.buffers[4];
            this.terrainBody = this.terrainFunctions.addTerrainToPhysics(this.terrainOptions, this.terrain.array1d, this.origin.x, this.origin.z);
            this.areaFunctions.setTerrainArea(this);

            WorldAPI.sendWorldMessage(ENUMS.Protocol.REGISTER_TERRAIN, [msg, this.buffers]);

            this.addTerrainFeatures();

            this.generateTerrainFeature(ENUMS.TerrainFeature.WOODS, 0.1);

        };

        TerrainArea.prototype.generateTerrainFeature = function(featureType, density) {

            var x;
            var y;

            var countX = Math.floor(density*this.size);
            var countY = countX;

            var featureSize = this.size/countX;

            for (var i = 0; i < countX; i++) {
                for (var j = 0; j < countY; j++) {

                    tempVec1.x = this.getOrigin().x + i*featureSize + Math.random()*0.8*featureSize;
                    tempVec1.y = this.getOrigin().y;
                    tempVec1.z = this.getOrigin().z + j*featureSize + Math.random()*0.8*featureSize;

                    tempVec1.y = this.areaFunctions.getHeightAtPos(tempVec1, tempVec2);

                    var hits = 0;

                    if (tempVec1.y < 9 && tempVec1.y > - 9) {

                        for (var k = 0; k < 250; k++) {

                            tempVec1.x = this.getOrigin().x + i*featureSize + Math.random()*featureSize*1.0 - featureSize*0.0;
                            tempVec1.z = this.getOrigin().z + j*featureSize + Math.random()*featureSize*1.0 - featureSize*0.0;

                            tempVec1.y = this.areaFunctions.getHeightAtPos(tempVec1, tempVec2);

                            if (tempVec1.y < 0.01 && tempVec1.y > - 2) {
                                tempVec1.y = 0.7;
                                hits++;
                                this.terrainFeatures[ENUMS.TerrainFeature.SHORELINE].generateTerrainElement(tempVec1, tempVec2);

                                if (hits > 2){
                                    k+=45;
                                }
                            }

                        }

                    }

                    if (Math.random() < 0.2) {
                        if (tempVec1.y > 5 && tempVec2.y > 0.95) {
                            tempVec1.y += 6;
                            this.terrainFeatures[ENUMS.TerrainFeature.WOODS].generateTerrainElement(tempVec1, tempVec2);
                        }
                    }

                }
            }

            this.terrainFeatures[ENUMS.TerrainFeature.WOODS].visualizeFeatureElements();

        };


        TerrainArea.prototype.updateTerrainArea = function(tpf) {

            this.terrainFeatures[ENUMS.TerrainFeature.SHORELINE].updateTerrainFeatureFX(tpf);

        };

        return TerrainArea;

    });

