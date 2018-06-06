var baseUrl = './../../../';

var WorldAPI;
var CanvasWorkerAPI;
var window = self;
var postMessage;
var onmessage;
var CanvasWorkerPort;
var CanvasWorkerPorts = [];

var premauteMessageQueue = [];

var canvasWorkerLoaded;

importScripts(baseUrl+'client/js/ENUMS.js');
importScripts(baseUrl+'client/js/MATH.js');
importScripts(baseUrl+'client/js/lib/three.js');
importScripts(baseUrl+'client/js/lib/require.js');

require.config({
    baseUrl: baseUrl,
    paths: {
        data_pipeline:'client/js/lib/data_pipeline/src',
        ThreeAPI:'client/js/3d/three/ThreeWorkerAPI',
        EffectsAPI:'client/js/3d/effects/EffectsAPI',
        PipelineAPI:'client/js/io/PipelineAPI',
        PipelineObject:'client/js/PipelineObject',
        ConfigObject:'client/js/ConfigObject',
        Events:'client/js/Events',
        EventList:'client/js/EventList',
        worker:'client/js/worker',
        three:'client/js/3d/three',
        ui:'client/js/worker/ui',
        "3d":'client/js/3d',
        game:'client/js/game',
        application:'client/js/application'
    }
});

require(
    [
        'worker/canvas/CanvasWorkerAPI'
    ],
    function(
        cWApi
    ) {

        CanvasWorkerAPI = cWApi;
        console.log("Canvas SharedWorker loaded...");

        var onWorkerReady = function() {

            CanvasWorkerAPI.sendWorldMessage(ENUMS.Protocol.WORKER_READY, ENUMS.Worker.CANVAS_WORKER);

            while (premauteMessageQueue.length) {
                CanvasWorkerAPI.processRequest(premauteMessageQueue.pop().data);
            }
            canvasWorkerLoaded = true;

        };

        CanvasWorkerAPI.initCanvasWorker(onWorkerReady);
    }
);

var addPort = function(port) {

    CanvasWorkerPorts.push(port);

    port.onmessage = function(e) {

        if (!canvasWorkerLoaded) {
        //    console.log("Premature Canvas Shared Worker message:", e);
            premauteMessageQueue.push(e);
        } else {
            CanvasWorkerAPI.processRequest(e.data);
        }
    };

};

var postToPorts = function(msg) {
    for (var i = 0; i < CanvasWorkerPorts.length; i++) {
        CanvasWorkerPorts[i].postMessage(msg)
    }
};

postMessage = function(msg) {
    postToPorts(msg);
};

onconnect = function(e) {

    console.log("Canvas Shared Worker connect:", e, e.ports);
    addPort(e.ports[0]);

};