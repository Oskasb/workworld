"use strict";

define([
        'worker/physics/AmmoAPI',
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/world/WorldMain',
        'worker/terrain/TerrainSystem',
        'worker/world/WorldControlState'
    ],
    function(
        AmmoAPI,
        ProtocolRequests,
        WorldMessages,
        WorldMain,
        TerrainSystem,
        WorldControlState
    ) {

        var physicsApi;
        var worldMain;
        var protocolRequests;
        var worldMessages;
        var worldControlState;
        var terrainSystem;

        var WorldAPI = function() {};

        WorldAPI.initWorld = function(onWorkerReady) {

            var ammoReady = function() {
                physicsApi.initPhysics();
                worldMessages = new WorldMessages(WorldAPI);
                worldControlState = new WorldControlState(WorldAPI);
                terrainSystem = new TerrainSystem(WorldAPI, physicsApi);
                worldMain = new WorldMain(WorldAPI);
                protocolRequests = new ProtocolRequests();
                protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers())
                onWorkerReady();
            };

            physicsApi = new AmmoAPI(ammoReady);
        };

        WorldAPI.setWorldLoopTpf = function(tpf) {
            worldMain.setLoopTpf(tpf)
        };

        WorldAPI.constructWorld = function(msg) {
            terrainSystem.initTerrainSystem(msg)
        };

        WorldAPI.processRequest = function(msg) {
            protocolRequests.handleMessage(msg)
        };

        WorldAPI.sendWorldMessage = function(protocolKey, data) {
            protocolRequests.sendMessage(protocolKey, data)
        };

        WorldAPI.setWorldInputBuffer = function(buffer) {
            worldControlState.setInputBuffer(buffer)
        };

        WorldAPI.updateWorldWorkerFrame = function(tpf, frame) {
            worldControlState.updateWorldControlState()
            WorldAPI.sendWorldMessage(ENUMS.Protocol.NOTIFY_FRAME, frame)
        };

        return WorldAPI;
    });

