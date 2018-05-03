"use strict";

define([
        'worker/terrain/AreaFunctions',
        'worker/terrain/TerrainSection'
    ],
    function(
        AreaFunctions,
        TerrainSection
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
            this.terrainSections = [];

        };

        TerrainArea.prototype.setTerrainOptions = function(options) {
            this.terrainOptions = options;
        };

        TerrainArea.prototype.setTerrainPosXYZ = function(x, y, z) {
            this.origin.x = x;
            this.origin.y = y;
            this.origin.z = z;
        };

        TerrainArea.prototype.getTerrainVegetationSystemId = function() {
            return this.terrainOptions.vegetation_system;
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

        TerrainArea.prototype.positionIsWithin = function(pos) {
            if (pos.x > this.origin.x && pos.x < this.extents.x + this.origin.x && pos.z > this.origin.z && pos.z < this.extents.z + this.origin.z) {
                return true
            }
        };

        TerrainArea.prototype.getHeightAndNormalForPos = function(pos, norm) {
            return this.areaFunctions.getHeightAtPos(pos, norm);
        };

        TerrainArea.prototype.setTerrainExtentsXYZ = function(x, y, z) {
            this.extents.x = x;
            this.extents.y = y;
            this.extents.z = z;
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

            this.generateTerrainSectons(0.0025);

        };

        TerrainArea.prototype.generateTerrainSectons = function(density) {

            var countX = Math.floor(density*this.size);
            var countY = countX;

            var featureSize = this.size/countX;

            for (var i = 0; i < countX; i++) {
                for (var j = 0; j < countY; j++) {

                    tempVec1.x = this.getOrigin().x + i*featureSize;
                    tempVec1.z = this.getOrigin().z + j*featureSize;

                    tempVec1.y = this.areaFunctions.getHeightAtPos(tempVec1);

                    var section = new TerrainSection(this, tempVec1, featureSize);

                    section.genereateSectionFeatures(4);

                    this.terrainSections.push(section);

                }
            }

        };


        TerrainArea.prototype.updateTerrainArea = function(tpf) {

            for (var i = 0; i < this.terrainSections.length; i++) {
                this.terrainSections[i].updateTerrainSection(tpf)
            }

        };

        return TerrainArea;

    });

