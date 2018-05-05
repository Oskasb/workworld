"use strict";

define([
        'PipelineAPI',
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/physics/AmmoAPI',
        'worker/dynamic/DynamicSpatial'
    ],
    function(
        PipelineAPI,
        ProtocolRequests,
        WorldMessages,
        AmmoAPI,
        DynamicSpatial
    ) {

        var ammoApi;
        var protocolRequests;
        var worldMessages;
        var fetches = {};

        var dynamicSpatials = [];
        var terrainBodies = {};

        var PhysicsWorldAPI = function() {};

        PhysicsWorldAPI.initPhysicsWorld = function(onWorkerReady) {

            var ammoReady = function() {
                worldMessages = new WorldMessages();
                protocolRequests = new ProtocolRequests();
                protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers());
                console.log("configs static world SharedWorker", PipelineAPI.getCachedConfigs(), fetches);
                ammoApi.initPhysics();
                onWorkerReady();
            };

            ammoApi = new AmmoAPI(ammoReady);
        };

        PhysicsWorldAPI.fetchCategoryKeyData = function(category, key) {

            if (!fetches[category]) {
                fetches[category] = []
            }

            if (fetches[category].indexOf(key) === -1) {
                PhysicsWorldAPI.sendWorldMessage(ENUMS.Protocol.FETCH_PIPELINE_DATA, [category, key]);
                fetches[category].push(key);
            }
        };

        PhysicsWorldAPI.startPhysicsSimulationLoop = function(tickMs) {

            var applyDynamicSpatials = function() {
                for (var i = 0; i < dynamicSpatials.length; i++) {
                    dynamicSpatials[i].tickPhysicsForces();
                }
            };

            var updateDynamicSpatials = function() {
                for (var i = 0; i < dynamicSpatials.length; i++) {
                    dynamicSpatials[i].sampleBodyState();
                }
            };

            var tickPhysics = function() {
                applyDynamicSpatials();
                ammoApi.updatePhysicsSimulation(performance.now() / 1000000);
                updateDynamicSpatials()
            };

            setInterval(tickPhysics, tickMs)
        };

        var getTerrainKey = function(msg) {
            return ''+msg.posx+'_'+msg.posz;
        };

        PhysicsWorldAPI.addTerrainToPhysics = function(msg) {
            console.log("Physics Worker Add Terrain:", msg);

            var addTerrainToPhysics = function(terrainOpts, buffer, posX, posZ) {

                var opts = terrainOpts;
                var body = ammoApi.buildPhysicalTerrain(
                    buffer,
                    opts.terrain_size,
                    posX + opts.terrain_size / 2,
                    posZ + opts.terrain_size / 2,
                    opts.min_height,
                    opts.max_height);

                return body;
            };

            var terrainBody = addTerrainToPhysics(msg[0].options, msg[1], msg[0].posx, msg[0].posz);
            terrainBodies[getTerrainKey(msg[0])] = terrainBody;
            ammoApi.includeBody(terrainBody);
            var dynamicSpatial = new DynamicSpatial();
            dynamicSpatial.setSpatialBuffer(msg[2]);
            dynamicSpatial.setPhysicsBody(terrainBody);
            dynamicSpatials.push(dynamicSpatial);
            console.log("dynamicSpatials:", dynamicSpatials);
        };

        PhysicsWorldAPI.getTerrainSystem = function() {
            return terrainSystem;
        };



        PhysicsWorldAPI.processRequest = function(msg) {
            protocolRequests.handleMessage(msg)
        };

        PhysicsWorldAPI.sendWorldMessage = function(protocolKey, data) {
            protocolRequests.sendMessage(protocolKey, data)
        };

        PhysicsWorldAPI.updateWorldWorkerFrame = function(tpf, frame) {

        };

        return PhysicsWorldAPI;
    });

