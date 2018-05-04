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

        var WorkerRunner = function() {
            this.potocolRequests = new ProtocolRequests();
        };

        WorkerRunner.prototype.buildMainWorldComBuffer = function(size) {

            if (SharedArrayBuffer) {
                var sab = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * size);
                var buffer = new Float32Array(sab);
                PipelineAPI.setCategoryKeyValue("SHARED_BUFFERS", ENUMS.Key.WORLD_COM_BUFFER, buffer);
            } else {
                alert("SharedBufferArray not supported. Enable it in chrome://flags");
            }

            return buffer;
        };


        WorkerRunner.prototype.runWorldWorker = function() {
            var staticWorldWorker = new SharedWorker('./client/js/worker/StaticWorldWorker.js');
            staticWorldWorker.port.start();

            var worker = new Worker('./client/js/worker/WorldWorker.js');

            worker.postMessage({sharedWorkerPort: staticWorldWorker.port}, [staticWorldWorker.port]);

            worker.onmessage = function(msg) {
                this.onmessage(msg)
            }.bind(this);
            workers[ENUMS.Worker.WORLD] = worker;
            worldComBuffer = this.buildMainWorldComBuffer(worldCommBufferSize);
        };

        WorkerRunner.prototype.registerWorkerHandlers = function(handlers) {
            this.potocolRequests.setMessageHandlers(handlers);
        };

        WorkerRunner.prototype.onmessage = function(msg) {
            this.potocolRequests.handleMessage(msg.data);
        };

        WorkerRunner.prototype.postToWorker = function(workerKey, msg) {
            workers[workerKey].postMessage(msg);
        };

        return WorkerRunner;
    });
