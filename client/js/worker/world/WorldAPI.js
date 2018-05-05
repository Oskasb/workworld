"use strict";

define([
        'PipelineAPI',
        'GuiAPI',
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/world/WorldMain',
        'worker/dynamic/DynamicWorld',
        'worker/terrain/TerrainSystem',
        'worker/world/WorldControlState',
        'worker/StatusMonitor'
    ],
    function(
        PipelineAPI,
        GuiAPI,
        ProtocolRequests,
        WorldMessages,
        WorldMain,
        DynamicWorld,
        TerrainSystem,
        WorldControlState,
        StatusMonitor
    ) {

        var frameStartTime;
        var worldMain;
        var dynamicWorld;
        var protocolRequests;
        var worldMessages;
        var worldControlState;
        var terrainSystem;
        var statusMonitor;
        var fetches = {};

        var SHARED_WORKER_PORTS = [];

        var WorldAPI = function() {};

        WorldAPI.initWorkerCom = function() {
            worldMessages = new WorldMessages(WorldAPI);
            protocolRequests = new ProtocolRequests();
            protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers());
        };

        WorldAPI.initWorld = function(onWorkerReady) {

            GuiAPI.initGuiApi();

            worldControlState = new WorldControlState(WorldAPI);
            terrainSystem = new TerrainSystem();
            worldMain = new WorldMain(WorldAPI);
            dynamicWorld = new DynamicWorld();
            //    fetchData();
            worldMain.initWorldSystems(onWorkerReady);
            //    onWorkerReady();
            statusMonitor = new StatusMonitor();
            console.log("configs world worker", PipelineAPI.getCachedConfigs(), fetches);

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
            worldMain.updateWorld();
            worldMain.updateWorldEffects()
        };

        WorldAPI.updateStatusMonitor = function() {
            statusMonitor.tick(frameStartTime);
        };


        WorldAPI.constructWorld = function(msg) {
            terrainSystem.initTerrainSystem(msg)
        };

        WorldAPI.applyStaticWorldData = function(msg) {
            terrainSystem.applyTerrainAreaData(msg)
        };

        WorldAPI.getTerrainSystem = function() {
            return terrainSystem;
        };

        WorldAPI.getDynamicWorld = function() {
            return dynamicWorld;
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

        WorldAPI.registerSharedWorkerPort = function(workerKey, port) {

            if (SHARED_WORKER_PORTS[workerKey]) {
                console.log( "PORT ALREADY IN USE... OVERWRITING", SHARED_WORKER_PORTS);
            }

            SHARED_WORKER_PORTS[workerKey] = port;

            port.onmessage = function(e) {
                WorldAPI.processRequest(e.data);
            };

            console.log("Register Shared worker Port", SHARED_WORKER_PORTS)

        };

        WorldAPI.callSharedWorker = function(workerKey, protocolKey, data) {
            SHARED_WORKER_PORTS[workerKey].postMessage(protocolRequests.buildMessage(protocolKey, data))
        };

        WorldAPI.callStaticWorldWorker = function(protocolKey, data) {
            StaticWorldWorkerPort.postMessage(protocolRequests.buildMessage(protocolKey, data))
        };

        WorldAPI.setWorldInputBuffer = function(buffer) {
            worldControlState.setInputBuffer(buffer);
            GuiAPI.enableGuiSystems();
        };

        WorldAPI.updateWorldWorkerFrame = function(tpf, frame) {
            WorldAPI.sendWorldMessage(ENUMS.Protocol.NOTIFY_FRAME, frame);
            worldControlState.updateWorldControlState();
            dynamicWorld.updateDynamicWorld();
            terrainSystem.updateTerrainSystem(tpf);
        };


        WorldAPI.getWorldTime = function() {
            return worldMain.worldComBuffer()[ENUMS.BufferChannels.FRAME_RENDER_TIME]
        };

        return WorldAPI;
    });

