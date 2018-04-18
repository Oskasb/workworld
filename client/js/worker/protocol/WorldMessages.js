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
                WorldAPI.setWorldLoopTpf(msg[1].tpf);
            //    console.log("Handle (World) SET_LOOP", msg);
            };

            this.messageHandlers[ENUMS.Protocol.NOTIFY_FRAME] = function(msg) {
            //    console.log("Handle (World) NOTIFY_FRAME", msg[0], msg[1]);
            };

            this.messageHandlers[ENUMS.Protocol.SET_INPUT_BUFFER] = function(msg) {
                console.log("Handle (World) SET_INPUT_BUFFER", msg[0], msg[1]);
                WorldAPI.setWorldInputBuffer(msg[1]);
            };

            this.messageHandlers[ENUMS.Protocol.CREATE_WORLD] = function(msg) {
            //    console.log("Handle (World) CREATE_WORLD", msg[0], msg[1]);
                WorldAPI.constructWorld(msg[1]);
            };

            this.messageHandlers[ENUMS.Protocol.SEND_PIPELINE_DATA] = function(msg) {
            //    console.log("Handle (World) SEND_PIPELINE_DATA", msg[0], msg[1]);
            //    WorldAPI.constructWorld(msg[1]);
                PipelineAPI.setCategoryKeyValue(msg[1].category, msg[1].key, msg[1].value);
            };

        };

        WorldMessages.prototype.getMessageHandlers = function() {
            return this.messageHandlers
        };

        return WorldMessages;
    });
