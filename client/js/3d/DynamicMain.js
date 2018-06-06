"use strict";


define([
    'Events',
    '3d/SimpleSpatial',
    'PipelineAPI',
    'ThreeAPI',
    '3d/CanvasMain'

], function(
    evt,
    SimpleSpatial,
    PipelineAPI,
    ThreeAPI,
    CanvasMain
) {

    var i;
    var spatials = [];
    var msg;

    var addSimpleSpatial = function(ss) {
        spatials.push(ss);
    };

    var DynamicMain = function() {

        this.canvasMain = new CanvasMain();

        var standardGeo = function(e) {
            msg = evt.args(e).msg;
            console.log("Handle DYNAMIC_MODEL, STANDARD_GEOMETRY", msg);
            var simpSpat = new SimpleSpatial(msg[0], msg[1]);

            var modelReady = function(sSpat, boneConf) {
                console.log("SimpleSpatial ready: ", boneConf, sSpat);
                PipelineAPI.setCategoryKeyValue('DYNAMIC_BONES', sSpat.modelId, boneConf);
                ThreeAPI.addToScene(sSpat.obj3d);
                sSpat.dynamicSpatial.setupMechanicalShape(msg[2])
                WorkerAPI.registerMainDynamicSpatial(sSpat.getDynamicSpatial());
            };

            ThreeAPI.loadMeshModel(simpSpat.modelId, simpSpat.obj3d);
            simpSpat.setReady(modelReady);
            addSimpleSpatial(simpSpat)
        };

        evt.on(evt.list().DYNAMIC_MODEL, standardGeo);
    };


    DynamicMain.prototype.tickDynamicMain = function() {

        for (i = 0; i < spatials.length; i++) {
            spatials[i].updateSimpleSpatial();
        }

        this.canvasMain.updateCanvasMain(spatials)

    };


    return DynamicMain;

});