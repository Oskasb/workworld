var baseUrl = './../../../';

var WorldAPI;
var PhysicsWorldAPI;
var window = self;
var postMessage;
var onmessage;
var PhysicsWorldWorkerPort;

var premauteMessageQueue = [];


importScripts(baseUrl+'client/js/ENUMS.js');
importScripts(baseUrl+'client/js/MATH.js');
importScripts(baseUrl+'client/js/lib/three.js');
// importScripts(baseUrl+'client/js/lib/ammo/ammo.js');
importScripts(baseUrl+'client/js/lib/ammo/ammo.wasm.js');
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

var initPhysicsWorker;

require(
    [
        'worker/physics/PhysicsWorldAPI'
    ],
    function(
        sWApi
    ) {


    //    initPhysicsWorker = function() {



            PhysicsWorldAPI = sWApi;
            WorldAPI = sWApi;

            self.StaticWorldAPI = sWApi;

            console.log("Physics World SharedWorker loaded...");


            var onWorkerReady = function() {


                PhysicsWorldWorkerPort.onmessage = function(e) {
                    //    console.log("Physics Worker message:", e);
                    PhysicsWorldAPI.processRequest(e.data);
                };

                setTimeout(function() {
                    PhysicsWorldAPI.sendWorldMessage(ENUMS.Protocol.WORKER_READY, ENUMS.Worker.PHYSICS_WORLD);
                    while (premauteMessageQueue.length) {
                        PhysicsWorldAPI.processRequest(premauteMessageQueue.unshift().data);
                    }
                }, 1000);

                PhysicsWorldAPI.startPhysicsSimulationLoop();
            };

            PhysicsWorldAPI.initPhysicsWorld(onWorkerReady);

    //    }
    }
);

//If used as ServiceWorker
onmessage = function(e){
    var port = e.ports[0];

    if (!port) return;

    if (port !== PhysicsWorldWorkerPort) {
        console.log("Physics Worker attach port:", e);
    }

    console.log("Physics Shared Worker connect:", e);
    PhysicsWorldWorkerPort = e.ports[0];

    postMessage = function(msg) {
        PhysicsWorldWorkerPort.postMessage(msg);
    };

    PhysicsWorldWorkerPort.onmessage = function(e) {
        console.log("Premature Physics Shared Worker message:", e);
        premauteMessageQueue.push(e);
    };
};

//If used as SharedWorker
onconnect = function(e) {

    console.log("Physics Shared Worker connect:", e);
    PhysicsWorldWorkerPort = e.ports[0];

    postMessage = function(msg) {
        PhysicsWorldWorkerPort.postMessage(msg);
    };

    PhysicsWorldWorkerPort.onmessage = function(e) {
        console.log("Premature Physics Shared Worker message:", e);
        premauteMessageQueue.push(e);

    };

};