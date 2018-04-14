"use strict";

define([
        'worker/protocol/ClientMessages',
        'worker/WorkerRunner'
    ],
    function(
        ClientMessages,
        WorkerRunner
    ) {

        var workerRunner;
        var clientMessages;

        var WorkerAPI = function() {};

        WorkerAPI.initWorkers = function() {
            workerRunner = new WorkerRunner();
            clientMessages = new ClientMessages(WorkerAPI);
        };

        WorkerAPI.registerHandlers = function() {
            workerRunner.registerWorkerHandlers(clientMessages.getMessageHandlers());
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

