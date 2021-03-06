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
        'worker/world/WaterEffects',
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
        WaterEffects,
        StatusMonitor
    ) {

        var frameStartTime;
        var worldMain;
        var dynamicWorld;
        var protocolRequests;
        var worldMessages;
        var worldControlState;
        var terrainSystem;
        var waterEffects;
        var statusMonitor;
        var fetches = {};

        var SHARED_WORKER_PORTS = [];

        var WorldAPI = function() {};

        var onWorkersReady;

        WorldAPI.initWorkerCom = function(workersReady) {
            onWorkersReady = workersReady;
            worldMessages = new WorldMessages(WorldAPI);
            protocolRequests = new ProtocolRequests();
            protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers());

            WorldAPI.sendWorldMessage(ENUMS.Protocol.REQUEST_SHARED_WORKER, ENUMS.Worker.STATIC_WORLD);
            WorldAPI.sendWorldMessage(ENUMS.Protocol.REQUEST_SHARED_WORKER, ENUMS.Worker.PHYSICS_WORLD)

        };

        WorldAPI.initWorld = function(onWorkerReady) {

            GuiAPI.initGuiApi();
            waterEffects = new WaterEffects();
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

        WorldAPI.getInputBuffer = function() {
            return worldControlState.getControlInputBuffer()
        };

        WorldAPI.getWorldComBuffer = function() {
            return worldMain.worldComBuffer()
        };

        WorldAPI.getDynamnicSpatialBufferByRenderableId = function(id) {

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

        WorldAPI.positionToScreenCoords = function(posVec, store) {
            return worldControlState.getWorldCamera().toScreenPosition(posVec, store)
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


        WorldAPI.getDynamicRenderableByPieceId = function(pieceId) {
            return dynamicWorld.getRenderableFromDynMap(pieceId);
        };

        WorldAPI.spawnCallPieceId = function(pieceId, pos, quat) {
            return dynamicWorld.requestPieceSpawn(pieceId, pos, quat);
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

            console.log("Register Shared worker Port", SHARED_WORKER_PORTS);

        };

        WorldAPI.notifyWorkerReady = function(workerKey) {

            if  (workerKey === ENUMS.Worker.PHYSICS_WORLD) {
                console.log("PhysicsWorker ready response");
                onWorkersReady()
            }

            if  (workerKey === ENUMS.Worker.STATIC_WORLD) {
                console.log("Static World ready response");
            }

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
        //    WorldAPI.callSharedWorker(ENUMS.Worker.CANVAS_WORKER, ENUMS.Protocol.CANVAS_CALL_UPDATE, null);

            WorldAPI.getWorldCamera().applyCameraComBuffer(WorldAPI.getWorldComBuffer());

            WorldAPI.getWorldCamera().updateCameraLookAt();

            dynamicWorld.initDynamicFrame();
            dynamicWorld.updateDynamicWorld();

            WorldAPI.sendWorldMessage(ENUMS.Protocol.NOTIFY_FRAME, frame);
            worldControlState.updateWorldControlState();

            terrainSystem.updateTerrainSystem(tpf);

            GuiAPI.updateGui();

            WorldAPI.getWorldCamera().followActiveSelection(WorldAPI.getControlledRenderable());

            WorldAPI.getWorldCamera().updateCameraControlState();

            WorldAPI.getWorldCamera().relayCamera(WorldAPI.getWorldComBuffer());
            worldMain.updateWorldEffects();

            WorldAPI.callSharedWorker(ENUMS.Worker.PHYSICS_WORLD, ENUMS.Protocol.PHYSICS_CALL_UPDATE, null);

        };

        WorldAPI.getWorldTime = function() {
            return worldMain.worldComBuffer()[ENUMS.BufferChannels.FRAME_RENDER_TIME]
        };

        return WorldAPI;
    });

