"use strict";


define([
    'Events',
    '3d/SimpleSpatial',
    'PipelineAPI',
    'ThreeAPI'

], function(
    evt,
    SimpleSpatial,
    PipelineAPI,
    ThreeAPI
) {

    var i;
    var spatials = [];
    var msg;

    var addSimpleSpatial = function(ss) {
        spatials.push(ss);
    };

    var DynamicMain = function() {

        var standardGeo = function(e) {
            msg = evt.args(e).msg;
            console.log("Handle DYNAMIC_MODEL, STANDARD_GEOMETRY", msg);
            var simpSpat = new SimpleSpatial(msg[0], msg[1]);

            var modelReady = function(sSpat, boneConf) {
                console.log("SimpleSpatial ready: ", boneConf, sSpat);
                PipelineAPI.setCategoryKeyValue('DYNAMIC_BONES', sSpat.modelId, boneConf);
                ThreeAPI.addToScene(sSpat.obj3d);
            };

            ThreeAPI.loadMeshModel(simpSpat.modelId, simpSpat.obj3d);
            simpSpat.setReady(modelReady);
            addSimpleSpatial(simpSpat)
        };

        evt.on(evt.list().DYNAMIC_MODEL, standardGeo);
    };

    DynamicMain.prototype.setup3dScene = function(ready) {

    };

    DynamicMain.prototype.setupEffectPlayers = function(onReady) {

    };

    DynamicMain.prototype.updateSpatial = function(simpSpat) {

    };

    DynamicMain.prototype.tickDynamicMain = function() {

        for (i = 0; i < spatials.length; i++) {
            spatials[i].updateSimpleSpatial();
        }

    };


    return DynamicMain;

});