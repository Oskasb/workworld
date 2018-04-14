"use strict";


define([
    '3d/ThreeController',
    'EffectsAPI',
    '3d/effects/EffectListeners'

], function(
    ThreeController,
    EffectsAPI
) {
    
    var SceneController = function() {

    };

    SceneController.prototype.setup3dScene = function(ready) {
        ThreeController.setupThreeRenderer(ready);
    };

    SceneController.prototype.setupEffectPlayers = function(onReady) {
        EffectsAPI.initEffects(onReady);
    };

    return SceneController;

});