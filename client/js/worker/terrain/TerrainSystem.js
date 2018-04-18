"use strict";

define([
        'worker/terrain/TerrainFunctions'
    ],
    function(
        TerrainFunctions
    ) {

        var terrainOpts = {
            "type":"array",
            "state":true,
            "three_terrain":"plain_ground",
            "vegetation_system":"basic_grassland",
            "terrain_size":1000,
            "terrain_segments":127,
            "invert_hill":false,
            "terrain_edge_size":175,
            "edge_easing":"clampSin",
            "max_height":20,
            "min_height":0,
            "frequency":3,
            "steps":6
        };


        var WorldAPI;

        var TerrainSystem = function(wApi, physicsApi) {
            WorldAPI = wApi;
            this.terrainFunctions = new TerrainFunctions(physicsApi);
        };


        TerrainSystem.prototype.initTerrainSystem = function(msg) {

        //    console.log("initTerrainSystem", msg);

            var terrain = this.terrainFunctions.createTerrain(msg.options);

        //    level.addTerrainToLevel(terrain);

            var buffers = this.terrainFunctions.getTerrainBuffers(terrain);

            terrain.array1d = buffers[4];

            var terrainBody = this.terrainFunctions.addTerrainToPhysics(terrainOpts, terrain.array1d, msg.posx, msg.posz);

        //    console.log("Terrain:", terrain, terrainBody);

            WorldAPI.sendWorldMessage(ENUMS.Protocol.REGISTER_TERRAIN, [msg, buffers])

        };


        return TerrainSystem;

    });

