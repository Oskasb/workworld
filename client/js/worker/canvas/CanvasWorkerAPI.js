"use strict";

define([
        'PipelineAPI',
        'worker/protocol/ProtocolRequests',
        'worker/protocol/WorldMessages',
        'worker/dynamic/DynamicSpatial'
    ],
    function(
        PipelineAPI,
        ProtocolRequests,
        WorldMessages,
        DynamicSpatial
    ) {

        var comBuffer;
        var ammoApi;
        var waterPhysics;
        var airPhysics;
        var protocolRequests;
        var worldMessages;
        var fetches = {};

        var tpf;
        var skipFrames = 0;
        var skipFrame = false;
        var frameIdle;
        var frameStart;
        var frameEnd;
        var lastFrameTime;

        var stepStart;
        var stepEnd;
        var activeBodies;
        var passiveBodies;
        var staticBodies;

        var dynamicSpatials = [];
        var terrainBodies = {};

        var CanvasWorkerAPI = function() {};

        var worldCanvas;

        var worldCanvasCTX;
        var sharedCanvasBuffer;

        var cnvH = 1024;
        var cnvW = 1024;
        var canvasBuffer;

        var canvases = {};


        CanvasWorkerAPI.initCanvasWorker = function(onWorkerReady) {

            worldCanvas = new OffscreenCanvas(cnvH, cnvW);
            worldCanvasCTX = worldCanvas.getContext('2d');

            var sab = new SharedArrayBuffer(cnvH * cnvW);
            canvasBuffer = new Uint8ClampedArray(sab);

            worldMessages = new WorldMessages();
            protocolRequests = new ProtocolRequests();
            protocolRequests.setMessageHandlers(worldMessages.getMessageHandlers());
            console.log("configs static world SharedWorker", PipelineAPI.getCachedConfigs(), fetches);

            onWorkerReady();
        };

        CanvasWorkerAPI.setWorldComBuffer = function(buffer) {
            console.log("Set Canvas API worldComBiffer", buffer);
            comBuffer = buffer;

            protocolRequests.sendMessage(ENUMS.Protocol.REGISTER_CANVAS_BUFFER, ['canvas_buffer',canvasBuffer])

        };

        CanvasWorkerAPI.getWorldComBuffer = function() {
            return comBuffer;
        };

        CanvasWorkerAPI.fetchCategoryKeyData = function(category, key) {

            if (!fetches[category]) {
                fetches[category] = []
            }

            if (fetches[category].indexOf(key) === -1) {
                PhysicsWorldAPI.sendWorldMessage(ENUMS.Protocol.FETCH_PIPELINE_DATA, [category, key]);
                fetches[category].push(key);
            }
        };

        var start;

        var applyDynamicSpatials = function() {
            for (var i = 0; i < dynamicSpatials.length; i++) {
                dynamicSpatials[i].tickPhysicsUpdate(ammoApi);
            }
        };

        var updateDynamicSpatials = function(physTpf) {

            activeBodies = 0;
            passiveBodies = 0;
            staticBodies = 0;

            for (var i = 0; i < dynamicSpatials.length; i++) {
                waterPhysics.simulateDynamicSpatialInWater(dynamicSpatials[i], physTpf);
                airPhysics.simulateDynamicSpatialInAir(dynamicSpatials[i], physTpf);
                dynamicSpatials[i].sampleBodyState();
                activeBodies += dynamicSpatials[i].getSpatialSimulateFlag();
                passiveBodies += dynamicSpatials[i].getSpatialDisabledFlag();
                staticBodies += dynamicSpatials[i].isStatic();
            }
        };

        var getNow = function() {
            return (performance.now() - start) / 1000
        };

        var drawRandomlyOnContext = function(w, h, ctx) {

            ctx.fillStyle = 'black';
            ctx.fillRect(
                0,
                0,
                w,
                h
            );

            ctx.fillStyle = 'green';
            ctx.fillRect(
                Math.floor(Math.random()*w/2),
                Math.floor(Math.random()*h/2),
                Math.floor(Math.random()*w/2)+w/2,
                Math.floor(Math.random()*h/2)+h/2
            );
            ctx.commit();
        };


        CanvasWorkerAPI.callCanvasUpdate = function() {

            if (!comBuffer) return;

        //    console.log("Canvas Update...", dynamicSpatials)

            for (var key in canvases) {
                drawRandomlyOnContext(canvases[key].canvas.width, canvases[key].canvas.height, canvases[key].context)
            }
        };


        CanvasWorkerAPI.startPhysicsSimulationLoop = function() {
            start = performance.now();
            frameEnd = getNow();
        };

        var getTerrainKey = function(msg) {
            return ''+msg.posx+'_'+msg.posz;
        };

        CanvasWorkerAPI.addTerrainToPhysics = function(msg) {
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


        CanvasWorkerAPI.addSpatialToCanvasWorker = function(msg) {
            console.log("Canvas Worker Add Body:", msg);
            var dynamicSpatial = new DynamicSpatial();
            dynamicSpatial.setSpatialBuffer(msg[1]);
            dynamicSpatial.setupMechanicalShape(msg[0]);
            dynamicSpatials.push(dynamicSpatial);
            console.log("CANVAS: dynamicSpatials:", dynamicSpatials);
        };


        CanvasWorkerAPI.registerOffscreenCanvas = function(msg) {
            console.log("Register Offscreen canvas:",  msg[0], msg[1]);

            canvases[msg[0]] = {context:msg[1].getContext('2d'), canvas:msg[1]};

        };

        CanvasWorkerAPI.processRequest = function(msg) {
            protocolRequests.handleMessage(msg)
        };

        CanvasWorkerAPI.sendWorldMessage = function(protocolKey, data) {
            protocolRequests.sendMessage(protocolKey, data)
        };

        var fetchCallbacks = {};

        CanvasWorkerAPI.fetchConfigData = function(category, key, dataId, callback) {
            if (!fetchCallbacks[category]) {
                fetchCallbacks[category] = {}
            }
            if (!fetchCallbacks[category][key]) {
                fetchCallbacks[category][key] = {};
            }
            if (!fetchCallbacks[category][key][dataId]) {
                fetchCallbacks[category][key][dataId] = [];
            }

            fetchCallbacks[category][key][dataId].push(callback);
            protocolRequests.sendMessage(ENUMS.Protocol.FETCH_CONFIG_DATA, [category, key, dataId])
        };

        CanvasWorkerAPI.setConfigData = function(msg) {
            for (var i = 0; i < fetchCallbacks[msg[0][0]][msg[0][1]][msg[0][2]].length; i++) {
                fetchCallbacks[msg[0][0]][msg[0][1]][msg[0][2]][i](msg[1]);
            }
        };

        CanvasWorkerAPI.getCom = function(index) {
            return comBuffer[index];
        };

        CanvasWorkerAPI.updatePhysicsStats = function() {


        };

        return CanvasWorkerAPI;
    });

