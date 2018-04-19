"use strict";


define([
    'PipelineAPI',
    'EffectsAPI'

], function(
    PipelineAPI,
    EffectsAPI
) {

    var calcVec = new THREE.Vector3();
    var calcVec2 = new THREE.Vector3();

 //   ModuleEffectCreator.createPassiveEffect(fx[i].particle_effects[j].id, calcVec2, zeroVec, zeroVec, threeObj.quaternion, groundprints);

    var GuiFeedbackFunctions = function() {

    };

    var generateElement = function(pos, particleFxId, store) {
        store.push(EffectsAPI.requestPassiveEffect(particleFxId, pos, calcVec2, null, null));
    };

    GuiFeedbackFunctions.prototype.enableElement = function(elementId, posVec, particleFxId, fxStore) {
        calcVec.copy(posVec);
        return generateElement(calcVec, particleFxId, fxStore);
    };

    GuiFeedbackFunctions.prototype.updateElementPosition = function(fxElement, posVec) {
        EffectsAPI.updateEffectPosition(fxElement, posVec);
    };

    GuiFeedbackFunctions.prototype.updateElementsColor = function(fxArray, colorKey) {
        for (var i = 0; i < fxArray.length; i++) {
            EffectsAPI.updateEffectColorKey(fxArray[i], colorKey);
        }
    };

    GuiFeedbackFunctions.prototype.updateElementsSprite = function(fxArray, spriteKey) {
        for (var i = 0; i < fxArray.length; i++) {
            EffectsAPI.updateEffectSpriteKey(fxArray[i], spriteKey);
        }
    };

    GuiFeedbackFunctions.prototype.disableElement = function(fxArray) {
        while (fxArray.length) {
            EffectsAPI.returnPassiveEffect(fxArray.pop())
        }
    };

    return GuiFeedbackFunctions;

});