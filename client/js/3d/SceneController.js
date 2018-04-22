"use strict";


define([
    '3d/ThreeController',
    'EffectsAPI',
    '3d/effects/EffectListeners'

], function(
    ThreeController,
    EffectsAPI,
    EffectsListeners
) {
    
    var SceneController = function() {

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

    return SceneController;

});