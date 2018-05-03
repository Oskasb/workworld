"use strict";

define([
        'PipelineAPI',
        'GuiAPI',
        'worker/physics/AmmoAPI',
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/world/WorldMain',
        'worker/terrain/TerrainSystem',
        'worker/world/WorldControlState',
        'worker/StatusMonitor'
    ],
    function(
        PipelineAPI,
        GuiAPI,
        AmmoAPI,
        ProtocolRequests,
        WorldMessages,
        WorldMain,
        TerrainSystem,
        WorldControlState,
        StatusMonitor
    ) {

        var frameStartTime;
        var physicsApi;
        var worldMain;
        var protocolRequests;
        var worldMessages;
        var worldControlState;
        var terrainSystem;
        var statusMonitor;
        var fetches = {};

        var WorldAPI = function() {};

        WorldAPI.initWorld = function(onWorkerReady) {

            var ammoReady = function() {
                physicsApi.initPhysics();
                worldMessages = new WorldMessages(WorldAPI);
                worldControlState = new WorldControlState(WorldAPI);
                terrainSystem = new TerrainSystem(physicsApi);
                worldMain = new WorldMain(WorldAPI);
                protocolRequests = new ProtocolRequests();
                protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers());
                //    fetchData();
                worldMain.initWorldSystems(onWorkerReady);
                //    onWorkerReady();
                statusMonitor = new StatusMonitor();
                console.log("configs world worker", PipelineAPI.getCachedConfigs(), fetches);
            };
            GuiAPI.initGuiApi();
            physicsApi = new AmmoAPI(ammoReady);
        };

        WorldAPI.fetchCategoryKeyData = function(category, key) {
            if (!fetches[category]) {
                fetches[category] = []
            }

            if (fetches[category].indexOf(key) === -1) {
                WorldAPI.sendWorldMessage(ENUMS.Protocol.FETCH_PIPELINE_DATA, [category, key]);
                fetches[category].push(key);
            }

            //    console.log("FETCHES:", fetches);

        };

        WorldAPI.updateUiSystem = function(input, lastInput) {
            GuiAPI.updateGui(input, lastInput)
        };

        WorldAPI.fitView = function(frustumCoords) {
            worldControlState.frustumCoordsToView(frustumCoords)
        };

        WorldAPI.sampleInputBuffer = function(inputIndex) {
            return worldControlState.valueFromInputBuffer(inputIndex)
        };

        WorldAPI.getWorldComBuffer = function() {
            return worldMain.worldComBuffer()
        };

        WorldAPI.getWorldCamera = function() {
            return worldControlState.getWorldCamera()
        };

        WorldAPI.getWorldCursor = function() {
            return worldControlState.getWorldCursor()
        };

        WorldAPI.visibilityTest = function(pos, radius) {
            return worldControlState.getWorldCamera().testPosRadiusVisible(pos, radius);
        };

        WorldAPI.notifyFrameInit = function() {
            frameStartTime = performance.now();
        };

        WorldAPI.updateStatusMonitor = function() {
            statusMonitor.tick(frameStartTime);
        };

        WorldAPI.constructWorld = function(msg) {
            terrainSystem.initTerrainSystem(msg)
        };

        WorldAPI.getTerrainSystem = function() {
            return terrainSystem;
        };

        WorldAPI.getTerrainElevationAtPos = function(pos, normalStore) {
            return terrainSystem.getTerrainHeightAndNormal(pos, normalStore);
        };

        WorldAPI.processRequest = function(msg) {
            protocolRequests.handleMessage(msg)
        };

        WorldAPI.sendWorldMessage = function(protocolKey, data) {
            protocolRequests.sendMessage(protocolKey, data)
        };

        WorldAPI.setWorldInputBuffer = function(buffer) {
            worldControlState.setInputBuffer(buffer);
            GuiAPI.enableGuiSystems();
        };

        WorldAPI.updateWorldWorkerFrame = function(tpf, frame) {
            worldControlState.updateWorldControlState();
            terrainSystem.updateTerrainSystem(tpf);
            WorldAPI.sendWorldMessage(ENUMS.Protocol.NOTIFY_FRAME, frame)
        };

        WorldAPI.getWorldTime = function() {
            return worldMain.worldComBuffer()[ENUMS.BufferChannels.FRAME_RENDER_TIME]
        };

        return WorldAPI;
    });

