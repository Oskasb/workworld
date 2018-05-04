"use strict";

define([
        'worker/protocol/ClientMessages',
        'worker/WorkerRunner'
    ],
    function(
        ClientMessages,
        WorkerRunner
    ) {
        var i;
        var workerRunner;
        var clientMessages;
        var onWorkerFrameCallbacks = [];

        var wakeupFunction = function() {};

        var WorkerAPI = function() {};

        WorkerAPI.initWorkers = function() {
            workerRunner = new WorkerRunner();
            clientMessages = new ClientMessages(WorkerAPI);
        };

        WorkerAPI.registerHandlers = function() {
            workerRunner.registerWorkerHandlers(clientMessages.getMessageHandlers());
        };

        WorkerAPI.wakeWorldThread = function() {
            wakeupFunction();
        };

        WorkerAPI.setWakeupFunction = function(func) {
            wakeupFunction = func;
        };

        WorkerAPI.addOnWorkerFrameCallback = function(cb) {
            onWorkerFrameCallbacks.push(cb);
        };

        WorkerAPI.removeOnWorkerFrameCallback = function(cb) {
            onWorkerFrameCallbacks.splice(onWorkerFrameCallbacks.indexOf(cb), 1)
        };

        WorkerAPI.callOnWorkerFrameCallbacks = function(msg) {
            for (i = 0; i < onWorkerFrameCallbacks.length; i++) {
                onWorkerFrameCallbacks[i](msg);
            }
        };

        WorkerAPI.runWorkers = function() {
            workerRunner.runWorldWorker();
        };

        WorkerAPI.buildMessage = function(protocolKey, data) {
            return [protocolKey, data];
        };

        WorkerAPI.callWorker = function(workerKey, msg) {
            workerRunner.postToWorker(workerKey, msg);
        };

        return WorkerAPI;
    });

