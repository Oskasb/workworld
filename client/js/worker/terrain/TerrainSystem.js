"use strict";

define([
        'worker/terrain/TerrainFunctions',
        'worker/terrain/TerrainArea'
    ],
    function(
        TerrainFunctions,
        TerrainArea
    ) {



        var TerrainSystem = function(physicsApi) {
            this.terrainFunctions = new TerrainFunctions(physicsApi);
            this.terrainAreas = [];
        };


        TerrainSystem.prototype.initTerrainSystem = function(msg) {

            var terrainArea = new TerrainArea(this.terrainFunctions);

            terrainArea.createAreaOfTerrain(msg);

            this.terrainAreas.push(terrainArea)
        };

        TerrainSystem.prototype.updateTerrainSystem = function(tpf) {

            for (var i = 0; i < this.terrainAreas.length; i++) {
                this.terrainAreas[i].updateTerrainArea(tpf);
            }
        };

        return TerrainSystem;

    });

