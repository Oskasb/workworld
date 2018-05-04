var baseUrl = './../../../';

var WorldAPI;
var StaticWorldAPI;
var window = self;
var postMessage;
var onmessage;
var StaticWorldWorkerPort;

var premauteMessageQueue = [];

console.log("Static World SharedWorker file init...");

var updateWorld = function() {};

importScripts(baseUrl+'client/js/ENUMS.js');
importScripts(baseUrl+'client/js/MATH.js');
importScripts(baseUrl+'client/js/lib/three.js');
importScripts(baseUrl+'client/js/lib/three/OBJLoader.js');
importScripts(baseUrl+'client/js/worker/terrain/ServerTerrain.js');
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
        GuiAPI:'client/js/worker/ui/GuiAPI',
        ui:'client/js/worker/ui',
        "3d":'client/js/3d',
        game:'client/js/game',
        application:'client/js/application'
    }
});

require(
    [
        'worker/static/StaticWorldAPI'
    ],
    function(
        sWApi
    ) {

        var count = 0;
        StaticWorldAPI = sWApi;
        WorldAPI = sWApi;

        self.StaticWorldAPI = sWApi;

        console.log("Static World SharedWorker loaded...");

        var onWorkerReady = function() {
            count ++;
            console.log("Static World SharedWorker loaded", count);

            StaticWorldAPI.sendWorldMessage(ENUMS.Protocol.WORKER_READY, count);

            StaticWorldWorkerPort.onmessage = function(e) {
                console.log("Shared Worker message:", e);
                StaticWorldAPI.processRequest(e.data);
            };

            while (premauteMessageQueue.length) {
                StaticWorldAPI.processRequest(premauteMessageQueue.pop().data);
            }

        };

        StaticWorldAPI.initWorld(onWorkerReady);
    }
);

onconnect = function(e) {

    console.log("Shared Worker connect:", e);
    var port = e.ports[0];

    postMessage = function(msg) {
        port.postMessage(msg);
    };

    port.onmessage = function(e) {
        console.log("Premature Shared Worker message:", e);
        premauteMessageQueue.push(e);

    };

    StaticWorldWorkerPort = port;
};