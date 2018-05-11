"use strict";



define([
    'Events',
        'PipelineAPI',
        'ThreeAPI'
    ],
    function(
        evt,
        PipelineAPI,
        ThreeAPI
    ) {

        var ClientMessages = function() {
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
                console.log("Handle (Client) WORKER_READY", msg);

                if (msg[1] === ENUMS.Worker.WORLD) {

                    var wakeupMessage = WorkerAPI.buildMessage(ENUMS.Protocol.NOTIFY_FRAME);
                    var wakeupFunc = function() {
                        WorkerAPI.callWorker(ENUMS.Worker.WORLD, wakeupMessage);
                    };

                    WorkerAPI.setWakeupFunction(wakeupFunc);
                    WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.SET_INPUT_BUFFER, PipelineAPI.getCachedConfigs().POINTER_STATE.buffer));
                }
            };

            this.messageHandlers[ENUMS.Protocol.NOTIFY_FRAME] = function(msg) {
                WorkerAPI.callOnWorkerFrameCallbacks(msg);
                //    console.log("Handle (Client) NOTIFY_FRAME", msg[0]);
            };

            this.messageHandlers[ENUMS.Protocol.FETCH_PIPELINE_DATA] = function(msg) {
                send(msg[1][0], msg[1][1]);
            };

            this.messageHandlers[ENUMS.Protocol.REQUEST_SHARED_WORKER] = function(msg) {
                var workerKey = msg[1];
                var sharedWorker = WorkerAPI.requestSharedWorker(workerKey);

                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.SHARED_WORKER_PORT, [workerKey, sharedWorker.port]), [sharedWorker.port])
            };

            this.messageHandlers[ENUMS.Protocol.REGISTER_TERRAIN] = function(msg) {

                console.log("Handle (Client) REGISTER_TERRAIN", msg[1]);

                var rootObj = ThreeAPI.loadGround(msg[1][0].options, msg[1][1], ThreeAPI.createRootObject());

                rootObj.position.x = msg[1][0].posx;
                rootObj.position.z = msg[1][0].posz;

                ThreeAPI.addToScene(rootObj);

            };


            this.messageHandlers[ENUMS.Protocol.REGISTER_GEOMETRY] = function(msg) {

                console.log("Handle (Client) REGISTER_GEOMETRY", msg[1]);

                evt.fire(evt.list().DYNAMIC_MODEL, {msg:msg[1]});

            //    PipelineAPI.setCategoryKeyValue('DYNAMIC_MODEL', 'STANDARD_GEOMETRY', msg[1]);

            };

        };

        ClientMessages.prototype.getMessageHandlers = function() {
            return this.messageHandlers
        };

        return ClientMessages;
    });
