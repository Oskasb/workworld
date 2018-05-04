"use strict";

define([
        'PipelineAPI',
        'ThreeAPI'
    ],
    function(
        PipelineAPI,
        ThreeAPI
    ) {
        var WorkerAPI;

        var terrainOpts = {
            "type":"array",
            "state":true,
            "three_terrain":"plain_ground",
            "vegetation_system":"basic_grassland",
            "terrain_size":1000,
            "terrain_segments":63,
            "invert_hill":false,
            "terrain_edge_size":105,
            "edge_easing":"clampSin",
            "max_height":25,
            "min_height":-15,
            "frequency":5,
            "steps":4
        };

        var terrainOpts2 = {
            "type":"array",
            "state":true,
            "three_terrain":"plain_ground",
            "vegetation_system":"basic_grassland",
            "terrain_size":1000,
            "terrain_segments":63,
            "invert_hill":false,
            "terrain_edge_size":105,
            "edge_easing":"clampSin",
            "max_height":15,
            "min_height":-25,
            "frequency":3,
            "steps":4
        };

        var terrainOpts3 = {
            "type":"array",
            "state":true,
            "three_terrain":"plain_ground",
            "vegetation_system":"basic_grassland",
            "terrain_size":4000,
            "terrain_segments":127,
            "invert_hill":false,
            "terrain_edge_size":305,
            "edge_easing":"clampSin",
            "max_height":280,
            "min_height":-15,
            "frequency":2,
            "steps":4
        };

        var ClientMessages = function(wApi) {
            WorkerAPI = wApi;
            this.messageHandlers = [];
            this.setupMessageHandlers()

        };

        var send = function(cat, key) {

            var onDataRespond = function(src, data) {
                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.SEND_PIPELINE_DATA, {category:cat, key:key, value:data}));
            };

            PipelineAPI.subscribeToCategoryKey(cat, key, onDataRespond);
        };

        ClientMessages.prototype.setupMessageHandlers = function() {

            this.messageHandlers[ENUMS.Protocol.WORKER_READY] = function(msg) {

                var wakeupFunc = function() {
                    WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.SET_LOOP, {tpf:0.01}));
                };

                WorkerAPI.setWakeupFunction(wakeupFunc);

                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.CREATE_WORLD,{posx:1500, posz:-1230, options:terrainOpts2}));
                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.CREATE_WORLD,{posx:-1500, posz:-1200, options:terrainOpts}));
                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.CREATE_WORLD,{posx:-400, posz:-350, options:terrainOpts}));
                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.CREATE_WORLD,{posx:-200, posz:-1300, options:terrainOpts}));
                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.CREATE_WORLD,{posx:1000, posz:1000, options:terrainOpts3}));
                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.SET_INPUT_BUFFER, PipelineAPI.getCachedConfigs().POINTER_STATE.buffer));
                console.log("Handle (Client) WORKER_READY", msg);
            };

            this.messageHandlers[ENUMS.Protocol.NOTIFY_FRAME] = function(msg) {
                WorkerAPI.callOnWorkerFrameCallbacks(msg);
                //    console.log("Handle (Client) NOTIFY_FRAME", msg[0]);
            };

            this.messageHandlers[ENUMS.Protocol.FETCH_PIPELINE_DATA] = function(msg) {
                send(msg[1][0], msg[1][1]);
            };

            this.messageHandlers[ENUMS.Protocol.REGISTER_TERRAIN] = function(msg) {

                console.log("Handle (Client) REGISTER_TERRAIN", msg[1]);

                var rootObj = ThreeAPI.loadGround(msg[1][0].options, msg[1][1], ThreeAPI.createRootObject());

                rootObj.position.x = msg[1][0].posx;
                rootObj.position.z = msg[1][0].posz;

                ThreeAPI.addToScene(rootObj);

            };

        };

        ClientMessages.prototype.getMessageHandlers = function() {
            return this.messageHandlers
        };

        return ClientMessages;
    });
