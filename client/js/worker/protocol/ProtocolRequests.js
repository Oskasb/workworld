"use strict";

define([],
    function() {

        var protocolMap = [];
        var messageMap = [];

        var ProtocolRequests = function() {
            this.requests = {};

            for (var key in ENUMS.Protocol) {
                protocolMap[ENUMS.Protocol[key]] = key;
            }

        };

        ProtocolRequests.prototype.setMessageHandlers = function(handlers) {

            for (var i in handlers) {
                this.setRequest(i, handlers[i])
            }
        //    console.log("Handlers set", handlers)
        };

        ProtocolRequests.prototype.setRequest = function(key, func) {
            this.requests[key] = func;
        };

        ProtocolRequests.prototype.callRequest = function(key, msg) {
            this.requests[key](msg);
        };

        ProtocolRequests.prototype.containsRequest = function(key) {
            if (typeof(this.requests[key]) === 'function') {
                return true
            }
        };

        ProtocolRequests.prototype.containsProtocol = function(key) {
            if (typeof(this.requests[key]) === 'function') {
                return true
            }
        };

        ProtocolRequests.prototype.reportProtocolError = function(msg) {
            console.log("No request", protocolMap[msg[0]], messageMap[msg[1]], msg);
        };

        ProtocolRequests.prototype.handleMessage = function(msg) {
            if (this.containsRequest(msg[0])) {
                this.callRequest(msg[0], msg);
            } else {
                this.reportProtocolError(msg)
            }
        };

        ProtocolRequests.prototype.buildMessage = function(protocolKey, data) {
            return [protocolKey, data];
        };

        ProtocolRequests.prototype.sendMessage = function(protocolKey, data) {
            postMessage(this.buildMessage(protocolKey, data))
        };

        ProtocolRequests.prototype.callWorker = function(worker, msg) {
            worker.postMessage(msg)
        };



        return ProtocolRequests;
    });
