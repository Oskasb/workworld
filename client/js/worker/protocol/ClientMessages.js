"use strict";

define([
        'PipelineAPI'
    ],
    function(
        PipelineAPI
    ) {
        var WorkerAPI;


        var ClientMessages = function(wApi) {
            WorkerAPI = wApi;
            this.messageHandlers = [];
            this.setupMessageHandlers()

        };

        ClientMessages.prototype.setupMessageHandlers = function() {

            this.messageHandlers[ENUMS.Protocol.WORKER_READY] = function(msg) {
                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.SET_LOOP, {tpf:0.1}));
                WorkerAPI.callWorker(ENUMS.Worker.WORLD, WorkerAPI.buildMessage(ENUMS.Protocol.SET_INPUT_BUFFER, PipelineAPI.getCachedConfigs().POINTER_STATE.buffer));
                console.log("Handle (Client) WORKER_READY", msg);
            };

            this.messageHandlers[ENUMS.Protocol.NOTIFY_FRAME] = function(msg) {

            //    console.log("Handle (Client) NOTIFY_FRAME", msg[0]);

            };

        };

        ClientMessages.prototype.getMessageHandlers = function() {
            return this.messageHandlers
        };

        return ClientMessages;
    });
