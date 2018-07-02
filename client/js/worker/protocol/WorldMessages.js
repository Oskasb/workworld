"use strict";

define([
        'PipelineAPI',
        'ConfigObject',
        '3d/three/ThreeModelLoader'
    ],
    function(
        PipelineAPI,
        ConfigObject,
        ThreeModelLoader
    ) {
        var WorldAPI;

        var WorldMessages = function(wApi) {
            WorldAPI = wApi;
            this.messageHandlers = [];
            this.setupMessageHandlers()

        };

        WorldMessages.prototype.setupMessageHandlers = function() {

            this.messageHandlers[ENUMS.Protocol.SET_LOOP] = function(msg) {
                console.log("Handle (World) SET_LOOP", msg);
            };

            this.messageHandlers[ENUMS.Protocol.SHARED_WORKER_PORT] = function(msg) {
                WorldAPI.registerSharedWorkerPort(msg[1][0], msg[1][1])
            };

            this.messageHandlers[ENUMS.Protocol.NOTIFY_FRAME] = function(msg) {


                WorldAPI.notifyFrameInit();
                WorldAPI.updateStatusMonitor()
            };

            this.messageHandlers[ENUMS.Protocol.SET_INPUT_BUFFER] = function(msg) {
            //    console.log("Handle (World) SET_INPUT_BUFFER", msg[0], msg[1]);
                WorldAPI.setWorldInputBuffer(msg[1]);
            };

            this.messageHandlers[ENUMS.Protocol.CREATE_WORLD] = function(msg) {
                WorldAPI.addWorldArea(msg[1]);
            };


            this.messageHandlers[ENUMS.Protocol.WORKER_READY] = function(msg) {
                WorldAPI.notifyWorkerReady(msg[1]);
            };


            this.messageHandlers[ENUMS.Protocol.GENERATE_STATIC_AREA] = function(msg) {
                StaticWorldAPI.generateStaticArea(msg[1]);
            };

            this.messageHandlers[ENUMS.Protocol.STATIC_AREA_DATA] = function(msg) {
                WorldAPI.applyStaticWorldData(msg[1]);
            };

            this.messageHandlers[ENUMS.Protocol.SEND_PIPELINE_DATA] = function(msg) {
                PipelineAPI.setCategoryKeyValue(msg[1].category, msg[1].key, msg[1].value);
            };


            this.messageHandlers[ENUMS.Protocol.FETCH_CONFIG_DATA] = function(msg) {

                var fetcher = new ConfigObject(msg[1][0], msg[1][1], msg[1][2]);

                var dataUpdated = function(data) {
                    WorldAPI.callSharedWorker(ENUMS.Worker.PHYSICS_WORLD, ENUMS.Protocol.SET_CONFIG_DATA, [msg[1], data]);
                };

                fetcher.addCallback(dataUpdated);

            };

            this.messageHandlers[ENUMS.Protocol.SET_CONFIG_DATA] = function(msg) {
                PhysicsWorldAPI.setConfigData(msg[1])
            };

            this.messageHandlers[ENUMS.Protocol.PHYSICS_TERRAIN_ADD] = function(msg) {
                PhysicsWorldAPI.addTerrainToPhysics(msg[1])
            };

            this.messageHandlers[ENUMS.Protocol.PHYSICS_BODY_ADD] = function(msg) {
                PhysicsWorldAPI.addBodyToPhysics(msg[1])
            };

            this.messageHandlers[ENUMS.Protocol.PHYSICS_CALL_UPDATE] = function() {
                PhysicsWorldAPI.callPhysicsSimulationUpdate()
            };

            this.messageHandlers[ENUMS.Protocol.SET_WORLD_COM_BUFFER] = function(msg) {

                console.log("SET WORLD COM BUFFER", msg);

                if (typeof(PhysicsWorldAPI) !== 'undefined') {
                    PhysicsWorldAPI.setWorldComBuffer(msg[1])
                }

                if (typeof(CanvasWorkerAPI) !== 'undefined') {
                    CanvasWorkerAPI.setWorldComBuffer(msg[1])
                }

            };

            this.messageHandlers[ENUMS.Protocol.FETCH_GEOMETRY_BUFFER] = function(msg) {

                var cb = function(mesh) {
                    console.log("Fetch GEO BUFFER", mesh)
                    WorldAPI.callSharedWorker(ENUMS.Worker.PHYSICS_WORLD, ENUMS.Protocol.SET_GEOMETRY_BUFFER, [msg[1], mesh.geometry.attributes.position.array]);
                };

                ThreeModelLoader.fetchPooledMeshModel(msg[1], cb);

            };


            this.messageHandlers[ENUMS.Protocol.SET_GEOMETRY_BUFFER] = function(msg) {
                PhysicsWorldAPI.setPhysicsGeometryBuffer(msg[1])
            };

            this.messageHandlers[ENUMS.Protocol.CANVAS_DYNAMIC_ADD] = function(msg) {
                CanvasWorkerAPI.addSpatialToCanvasWorker(msg[1])
            };
            this.messageHandlers[ENUMS.Protocol.CANVAS_CALL_UPDATE] = function() {
                CanvasWorkerAPI.callCanvasUpdate()
            };

            this.messageHandlers[ENUMS.Protocol.REGISTER_CANVAS_BUFFER] = function(msg) {

                console.log("REG CANVAS SHARED BUFFER", msg);
            };

            this.messageHandlers[ENUMS.Protocol.OFFSCREEN_CANVAS] = function(msg) {

                CanvasWorkerAPI.registerOffscreenCanvas(msg)

            };


        };

        WorldMessages.prototype.getMessageHandlers = function() {
            return this.messageHandlers
        };

        return WorldMessages;
    });
