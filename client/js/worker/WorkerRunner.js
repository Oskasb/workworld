"use strict";

define([
        'PipelineAPI',
        'worker/protocol/ProtocolFunctions',
        'worker/protocol/ProtocolRequests'
    ],
    function(
        PipelineAPI,
        ProtocolFunctions,
        ProtocolRequests
    ) {

        var workers = [];
        var worldComBuffer;
        var worldCommBufferSize = 256;
        var staticWorldWorker;
        var physicsWorldWorker;
        var canvasWorker;

        var WorkerRunner = function() {
            this.potocolRequests = new ProtocolRequests();
        };

        WorkerRunner.prototype.buildMainWorldComBuffer = function(size) {

            if (SharedArrayBuffer) {
                var sab = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * size);
                worldComBuffer = new Float32Array(sab);
                PipelineAPI.setCategoryKeyValue("SHARED_BUFFERS", ENUMS.Key.WORLD_COM_BUFFER, worldComBuffer);
                WorkerAPI.setCom(worldComBuffer);
            } else {
                alert("SharedBufferArray not supported. Enable it in chrome://flags");
            }

            return worldComBuffer;
        };

        WorkerRunner.prototype.runWorldWorker = function() {

            var worker = new Worker('./client/js/worker/WorldWorker.js');

            worker.onmessage = function(msg) {
                this.onmessage(msg)
            }.bind(this);
            workers[ENUMS.Worker.WORLD] = worker;
            worldComBuffer = this.buildMainWorldComBuffer(worldCommBufferSize);
        };

        WorkerRunner.prototype.initSharedStaticWorldWorker = function() {

            if (staticWorldWorker) {
                console.log("staticWorldWorker already initiated... TERMINATING");
                staticWorldWorker.terminate();
            }

            staticWorldWorker = new SharedWorker('./client/js/worker/StaticWorldWorker.js');
            staticWorldWorker.port.start();
            return staticWorldWorker;
        };

        WorkerRunner.prototype.initSharedPhysicsWorker = function() {

            if (physicsWorldWorker) {
                console.log("physicsWorldWorker already initiated... TERMINATING");
                physicsWorldWorker.terminate();
            }

            physicsWorldWorker = new SharedWorker('./client/js/worker/PhysicsWorldWorker.js');
            physicsWorldWorker.port.start();
            return physicsWorldWorker;
        };

        WorkerRunner.prototype.initSharedCanvasWorker = function() {

            if (canvasWorker) {
                console.log("canvasWorker already initiated... TERMINATING");
                canvasWorker.terminate();
            }

            canvasWorker = new SharedWorker('./client/js/worker/CanvasWorker.js');
            canvasWorker.port.start();
            return canvasWorker;
        };

        WorkerRunner.prototype.registerWorkerHandlers = function(handlers) {
            this.potocolRequests.setMessageHandlers(handlers);
        };

        WorkerRunner.prototype.onmessage = function(msg) {
            this.potocolRequests.handleMessage(msg.data);
        };

        WorkerRunner.prototype.postToWorker = function(workerKey, msg, transfer) {
            workers[workerKey].postMessage(msg, transfer);
        };

        return WorkerRunner;
    });
