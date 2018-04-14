var baseUrl = './../../../';

var WorldAPI;
var window = self;
var postMessage = self.postMessage;

importScripts(baseUrl+'client/js/ENUMS.js');
importScripts(baseUrl+'client/js/MATH.js');
importScripts(baseUrl+'client/js/lib/three/three.js');
importScripts(baseUrl+'client/js/lib/three/OBJLoader.js');
importScripts(baseUrl+'client/js/lib/ammo/ammo.wasm.js');
importScripts(baseUrl+'client/js/worker/terrain/ServerTerrain.js');
importScripts(baseUrl+'client/js/lib/require.js');


require.config({
	baseUrl: baseUrl,
	paths: {
        data_pipeline:'client/js/lib/data_pipeline/src',
        ThreeAPI:'client/js/3d/three/ThreeWorkerAPI',
        PipelineAPI:'client/js/io/PipelineAPI',
        PipelineObject:'client/js/PipelineObject',
        Events:'client/js/Events',
        EventList:'client/js/EventList',
		worker:'client/js/worker',
        three:'client/js/3d/three',
        "3d":'client/js/3d',
        game:'client/js/game',
        application:'client/js/application'
	}
});

require(
	[
        'worker/world/WorldAPI'
    ],
	function(
        wApi
    ) {

        var count = 0;
        WorldAPI = wApi;

        var onWorkerReady = function() {
            count ++;
            console.log("World Worker loaded", count);
            WorldAPI.sendWorldMessage(ENUMS.Protocol.WORKER_READY, count);
        };

        WorldAPI.initWorld();
        onWorkerReady()
	}
);

var handleMessage = function(oEvent) {
    console.log("WorldMain GetMessage", oEvent.data);
    WorldAPI.processRequest(oEvent.data);
};

onmessage = function (oEvent) {
	handleMessage(oEvent);
};