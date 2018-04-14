"use strict";


define([
    '3d/ThreeController',
    'EffectsAPI',
    '3d/effects/EffectListeners',
    'game/modules/ModuleEffectCreator'

], function(
    ThreeController,
    EffectsAPI,
    EffectListeners,
    ModuleEffectCreator
) {
    
    var SceneController = function() {

    };
    

    SceneController.prototype.setup3dScene = function(ready) {
        ThreeController.setupThreeRenderer(ready);
    };

    SceneController.prototype.setupEffectPlayers = function(onReady) {
        EffectsAPI.initEffects(onReady);
        EffectListeners.setupListeners();
        EffectListeners.setEffectCallbacks(ModuleEffectCreator)
    };

    SceneController.prototype.tickEffectPlayers = function(tpf) {
        EffectListeners.tickEffects(tpf)
    };

    
    return SceneController;

});