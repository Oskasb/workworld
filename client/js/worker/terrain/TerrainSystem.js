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

        var TerrainSystem = function(physicsApi) {
            this.terrainFunctions = new TerrainFunctions(physicsApi);
            this.terrainAreas = [];
        };


        TerrainSystem.prototype.initTerrainSystem = function(msg) {

            var terrainArea = new TerrainArea(this.terrainFunctions);
            terrainArea.createAreaOfTerrain(msg);
            this.terrainAreas.push(terrainArea)

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

