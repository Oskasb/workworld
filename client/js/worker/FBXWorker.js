var baseUrl = './../../../';

importScripts(baseUrl+'client/js/lib/three.js');
importScripts(baseUrl+'client/js/lib/three/inflate.min.js');
importScripts(baseUrl+'client/js/lib/three/FBXLoader.js');

var err = function(e, x) {
    console.log("FBXWorker ERROR:", e, x);
}

var prog = function(p, x) {
    console.log("FBXWorker PROGRESS:", p, x);
}

window = self;

        var loadOk = function(modelId, model) {
            console.log("Worker model loaded", modelId, model);
            postMessage([modelId, model.toJSON()]);
        };

        var loadFbxUrl = function(msg) {

            var url = msg[1];
            var modelId = msg[0];

            console.log("FBXWorker..", modelId, url);

            var loader = new THREE.FBXLoader();

            loader.load(baseUrl + url, function ( model ) {

                console.log("FBXWorker LOADED: ",model);
                loadOk(modelId, model);

            }, prog, err);

        };

onmessage = function (oEvent) {
    loadFbxUrl(oEvent.data);
};