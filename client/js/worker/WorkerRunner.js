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
                var sab = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * size);
                worldComBuffer = new Float64Array(sab);
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

        WorkerRunner.prototype.initSharedStaticWorldWorker = function(workerKey, callback) {

            if (staticWorldWorker) {
                console.log("staticWorldWorker already initiated... TERMINATING");
                staticWorldWorker.terminate();
            }

            staticWorldWorker = new SharedWorker('./client/js/worker/StaticWorldWorker.js');
            staticWorldWorker.port.start();

            callback(staticWorldWorker, workerKey);

        };



        WorkerRunner.prototype.initServiceWorker = function(workerKey, callback) {

            var urlMap = [];
            urlMap[ENUMS.Worker.PHYSICS_WORLD] = './client/js/worker/PhysicsWorldWorker.js';
            urlMap[ENUMS.Worker.STATIC_WORLD] = './client/js/worker/StaticWorldWorker.js';

        //    if (workerKey === ENUMS.Worker.STATIC_WORLD) return;

            if (workers[workerKey]) {
                console.log("already initiated... BAILING");
                return;
            }

            if ('serviceWorker' in navigator) {

                var setupWorker = function(url, key, cb) {

                    console.log('Init for URL!', url);

                //    navigator.serviceWorker.register(url).then(function(reg) {

                        var worker = new Worker(url);

                        var mc = new MessageChannel();
                        workers[key] = {
                            worker:worker,
                            mc:mc,
                            port:mc.port1
                        };

                        console.log('REG for Key URL!', key, url);
                        worker.postMessage(url, [workers[key].mc.port2]);
                  //      reg.active.postMessage(url, [workers[key].mc.port2]);
                        cb(workers[key], key);

                  //  }).catch(function(err) {
                  //      console.log('Boo!', err);
                  //  });
                };

                setupWorker(urlMap[workerKey], workerKey, callback);
            } else {
                alert("serviceWorker Not Supported")
            }

        };

        WorkerRunner.prototype.initSharedCanvasWorker = function() {

            if (canvasWorker) {
                console.log("canvasWorker already initiated... TERMINATING");
                canvasWorker.terminate();
            }

            canvasWorker = new ServiceWorker('./client/js/worker/CanvasWorker.js');
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
