"use strict";

define([
        'PipelineAPI'
    ],
    function(
        PipelineAPI
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
                WorldAPI.callSharedWorker(ENUMS.Worker.PHYSICS_WORLD, ENUMS.Protocol.PHYSICS_CALL_UPDATE, null);

                WorldAPI.notifyFrameInit();
                WorldAPI.updateStatusMonitor()
            };

            this.messageHandlers[ENUMS.Protocol.SET_INPUT_BUFFER] = function(msg) {
            //    console.log("Handle (World) SET_INPUT_BUFFER", msg[0], msg[1]);
                WorldAPI.setWorldInputBuffer(msg[1]);
            };

            this.messageHandlers[ENUMS.Protocol.CREATE_WORLD] = function(msg) {
                WorldAPI.constructWorld(msg[1]);
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
                PhysicsWorldAPI.setWorldComBuffer(msg[1])
            };

        };

        WorldMessages.prototype.getMessageHandlers = function() {
            return this.messageHandlers
        };

        return WorldMessages;
    });
