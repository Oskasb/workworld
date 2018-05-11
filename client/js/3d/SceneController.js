"use strict";


define([
    '3d/ThreeController',
    'EffectsAPI',
    '3d/effects/EffectListeners',
    '3d/DynamicMain'

], function(
    ThreeController,
    EffectsAPI,
    EffectsListeners,
    DynamicMain
) {

    var SceneController = function() {
        this.dynamicMain = new DynamicMain()
    };

    SceneController.prototype.setup3dScene = function(ready) {
        ThreeController.setupThreeRenderer(ready);
    };

    SceneController.prototype.setupEffectPlayers = function(onReady) {
        EffectsListeners.setupListeners();
        EffectsAPI.initEffects(onReady);

    };

    SceneController.prototype.tickEffectsAPI = function(systemTime) {
        EffectsAPI.tickEffectSimulation(systemTime);
    };


    SceneController.prototype.tickDynamicScene = function() {
        this.dynamicMain.tickDynamicMain();
    };


    return SceneController;

});