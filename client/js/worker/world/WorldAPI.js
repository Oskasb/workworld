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

        WorldAPI.updateUiSystem = function() {

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

        WorldAPI.addTextMessage = function(message) {

            var channel = PipelineAPI.readCachedConfigKey('GUI_MESSAGES', 'CHANNEL_ONE');
            channel.messages.unshift(message)
        };

        WorldAPI.setCom = function(index, value) {
            worldMain.worldComBuffer()[index] = value;
        };

        WorldAPI.getCom = function(index) {
            return worldMain.worldComBuffer()[index]
        };

        WorldAPI.buildDynamicRenderable = function(renderableId, pos, quat, scale) {
            return dynamicWorld.setupDynamicRenderable(renderableId, pos, quat, scale)
        };

        WorldAPI.attachDynamicRenderable = function(renderable) {
            dynamicWorld.includeDynamicRenderable(renderable)
        };

        WorldAPI.detachDynamicRenderable = function(renderable) {
            dynamicWorld.spliceDynamicRenderable(renderable)
        };

        WorldAPI.getDynamicHover = function() {
            return dynamicWorld.getCurrentProbeHover();
        };

        WorldAPI.getWorldCamera = function() {
            return worldControlState.getWorldCamera()
        };

        WorldAPI.setControlledRenderable = function(ren) {
            return worldControlState.setControlledRenderable(ren)
        };

        WorldAPI.getControlledRenderable = function() {
            return worldControlState.getControlledRenderable()
        };

        WorldAPI.loadGuiWidgetConfig = function(config, store) {
            return worldControlState.buildControlWidget(config, store)
        };

        WorldAPI.enableGuiWidgetStore = function(store) {
            return worldControlState.enableWidgetList(store)
        };

        WorldAPI.removeGuiWidgets = function(store) {
            return worldControlState.removeWidgetList(store)
        };

        WorldAPI.getContoledPiecePosition = function(vec3) {
            return worldControlState.getActiveControlPosition(vec3)
        };

        WorldAPI.setContolPosAndQuat = function(vec3, quat) {
            return worldControlState.setActiveControlPosQuat(vec3, quat)
        };

        WorldAPI.getContoledPiecePosAndQuat = function(vec3, quat) {
            return worldControlState.getActiveControlPosQuat(vec3, quat)
        };

        WorldAPI.visibilityTest = function(pos, radius) {
            return worldControlState.getWorldCamera().testPosRadiusVisible(pos, radius);
        };

        WorldAPI.notifyFrameInit = function() {
            frameStartTime = performance.now();
            worldMain.updateWorld();
        };

        WorldAPI.updateStatusMonitor = function() {
            statusMonitor.tick(frameStartTime);
        };

        WorldAPI.initControlChange = function(dynamicRenderable) {
            worldControlState.disableActiveControls();
            dynamicWorld.changeControlTarget(dynamicRenderable);
        };

        WorldAPI.completeControlChange = function() {
            dynamicWorld.controlChangeComplete();
        };

        WorldAPI.addWorldArea = function(configId) {
            terrainSystem.initTerrainSystem(configId)
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

            WorldAPI.getWorldCamera().applyCameraComBuffer(WorldAPI.getWorldComBuffer());

            WorldAPI.sendWorldMessage(ENUMS.Protocol.NOTIFY_FRAME, frame);
            worldControlState.updateWorldControlState();
            dynamicWorld.updateDynamicWorld();
            terrainSystem.updateTerrainSystem(tpf);

            GuiAPI.updateGui();
            WorldAPI.getWorldCamera().relayCamera(WorldAPI.getWorldComBuffer());
            worldMain.updateWorldEffects();
        };

        WorldAPI.getWorldTime = function() {
            return worldMain.worldComBuffer()[ENUMS.BufferChannels.FRAME_RENDER_TIME]
        };

        return WorldAPI;
    });

