"use strict";

var WorkerAPI;

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

        var comBuffer;

        var wakeupFunction = function() {};

        WorkerAPI = function() {};

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

        WorkerAPI.setCom = function(buffer) {
            comBuffer = buffer;
        };

        WorkerAPI.getCom = function(index) {
            return comBuffer[index]
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


        WorkerAPI.requestSharedWorker = function(workerKey) {

            if (workerKey === ENUMS.Worker.PHYSICS_WORLD) {
                return workerRunner.initSharedPhysicsWorker();
            }

            if (workerKey === ENUMS.Worker.STATIC_WORLD) {
                return workerRunner.initSharedStaticWorldWorker();
            }

            console.log("No worker create call for workerKey", workerKey);

        };

        WorkerAPI.buildMessage = function(protocolKey, data) {
            return [protocolKey, data];
        };

        WorkerAPI.callWorker = function(workerKey, msg, transfer) {
            workerRunner.postToWorker(workerKey, msg, transfer);
        };

        return WorkerAPI;
    });

