var baseUrl = './../../../';

var WorldAPI;
var window = self;
var postMessage = self.postMessage;
var updateWorld = function() {};

importScripts(baseUrl+'client/js/ENUMS.js');
importScripts(baseUrl+'client/js/MATH.js');
importScripts(baseUrl+'client/js/lib/three.js');
importScripts(baseUrl+'client/js/lib/three/OBJLoader.js');
importScripts(baseUrl+'client/js/lib/ammo/ammo.wasm.js');
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
        'worker/world/WorldAPI'
    ],
	function(
        wApi
    ) {

        var count = 0;
        WorldAPI = wApi;


        self.WorldAPI = WorldAPI;

        var onWorkerReady = function(updateWorldCB) {
            count ++;
            console.log("World Worker loaded", count);
            WorldAPI.sendWorldMessage(ENUMS.Protocol.WORKER_READY, count);
            updateWorld = updateWorldCB;
        };

        WorldAPI.initWorld(onWorkerReady);

        onmessage = function (oEvent) {
            if (oEvent.data[0] === ENUMS.Protocol.SET_LOOP) {
                WorldAPI.notifyFrameInit();
                updateWorld();
                WorldAPI.updateStatusMonitor()
            } else {
                WorldAPI.processRequest(oEvent.data);
            }
        };
	}
);

