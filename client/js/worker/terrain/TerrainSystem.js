"use strict";

define([

        'worker/terrain/TerrainFunctions',
        'worker/terrain/TerrainArea'
    ],
    function(

        TerrainFunctions,
        TerrainArea
    ) {

        var tempVec = new THREE.Vector3();


        var scatter = 100;

        var gridSpacing = 4000;
        var gridWidth = 3;
        var minX = -3000;
        var minZ = -3000;

        var spawnCount = 0;
        var row = 0;
        var col = 0;

        var TerrainSystem = function(physicsApi) {
            this.terrainFunctions = new TerrainFunctions(physicsApi);
            this.terrainAreas = [];

        };


var gridPosX = function() {
    row = MATH.moduloPositive(spawnCount, gridWidth);
    return minX + row*gridSpacing + Math.random()*scatter
};

var gridPosZ = function() {
    col = Math.floor(spawnCount / gridWidth);
    return minZ + col*gridSpacing+ Math.random()*scatter
};

        TerrainSystem.prototype.initTerrainSystem = function(configId) {

            var areaConfigReady = function(tArea) {

                spawnCount++;
                tArea.createAreaOfTerrain(gridPosX(), gridPosZ());
                this.terrainAreas.push(tArea)

            }.bind(this);

            new TerrainArea(this.terrainFunctions, configId, areaConfigReady);
        };

        TerrainSystem.prototype.applyTerrainAreaData = function(msg) {

            tempVec.x = msg[0].posx + msg[0].options.terrain_size * 0.5;
            tempVec.y = 0;
            tempVec.z = msg[0].posz + msg[0].options.terrain_size * 0.5;

            var area = this.getTerrainAreaAtPos(tempVec);
            area.applyStaticTerrainData(msg);
        };


        TerrainSystem.prototype.updateTerrainSystem = function(tpf) {

            for (var i = 0; i < this.terrainAreas.length; i++) {
                this.terrainAreas[i].updateTerrainArea(tpf);
            }
        };

        TerrainSystem.prototype.getTerrainHeightAndNormal = function(pos, normalStore) {

            for (var i = 0; i < this.terrainAreas.length; i++) {
                if (this.terrainAreas[i].positionIsWithin(pos)) {
                    return this.terrainAreas[i].getHeightAndNormalForPos(pos, normalStore)
                }
            }
        };

        TerrainSystem.prototype.getTerrainAreaAtPos = function(pos) {

            for (var i = 0; i < this.terrainAreas.length; i++) {
                if (this.terrainAreas[i].positionIsWithin(pos)) {
                    return this.terrainAreas[i];
                }
            }
        };

        return TerrainSystem;

    });

