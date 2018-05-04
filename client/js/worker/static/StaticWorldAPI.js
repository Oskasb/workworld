"use strict";

define([
        'PipelineAPI',
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/terrain/TerrainFunctions'
    ],
    function(
        PipelineAPI,
        ProtocolRequests,
        WorldMessages,
        TerrainFunctions
    ) {

        var terrainFunctions;
        var protocolRequests;
        var worldMessages;
        var terrainSystem;
        var fetches = {};

        var StaticWorldAPI = function() {};

        StaticWorldAPI.initWorld = function(onWorkerReady) {
            terrainFunctions = new TerrainFunctions();
            worldMessages = new WorldMessages();
            protocolRequests = new ProtocolRequests();
            protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers());
            console.log("configs static world SharedWorker", PipelineAPI.getCachedConfigs(), fetches);
            onWorkerReady();
        };

        StaticWorldAPI.fetchCategoryKeyData = function(category, key) {

            if (!fetches[category]) {
                fetches[category] = []
            }

            if (fetches[category].indexOf(key) === -1) {
                StaticWorldAPI.sendWorldMessage(ENUMS.Protocol.FETCH_PIPELINE_DATA, [category, key]);
                fetches[category].push(key);
            }
            //    console.log("FETCHES:", fetches);
        };


        StaticWorldAPI.generateStaticArea = function(msg) {

            console.log("Static World generate area..", msg);
            var terrain = terrainFunctions.createTerrain(msg.options);
            terrain.children[0].geometry.computeFaceNormals();
            terrain.children[0].geometry.computeVertexNormals();
            var buffers = terrainFunctions.getTerrainBuffers(terrain);
            console.log("Static World generated area..", buffers);

            StaticWorldAPI.sendWorldMessage(ENUMS.Protocol.STATIC_AREA_DATA, [msg, buffers])
        };

        StaticWorldAPI.getTerrainSystem = function() {
            return terrainSystem;
        };

        StaticWorldAPI.getTerrainElevationAtPos = function(pos, normalStore) {
            return terrainSystem.getTerrainHeightAndNormal(pos, normalStore);
        };

        StaticWorldAPI.processRequest = function(msg) {
            protocolRequests.handleMessage(msg)
        };

        StaticWorldAPI.sendWorldMessage = function(protocolKey, data) {
            protocolRequests.sendMessage(protocolKey, data)
        };

        StaticWorldAPI.updateWorldWorkerFrame = function(tpf, frame) {

        };

        return StaticWorldAPI;
    });

