"use strict";


define([
    'io/PipelineAPI',
    'EffectsAPI',
    'game/modules/ModuleEffectCreator'

], function(
    PipelineAPI,
    EffectsAPI,
    ModuleEffectCreator
) {

    var calcVec = new THREE.Vector3();
    var calcVec2 = new THREE.Vector3();

 //   ModuleEffectCreator.createPassiveEffect(fx[i].particle_effects[j].id, calcVec2, zeroVec, zeroVec, threeObj.quaternion, groundprints);

    var GuiFeedbackFunctions = function() {

    };

    var generateElement = function(pos, particleFxId, store) {

        return ModuleEffectCreator.createPassiveEffect(
            particleFxId,
            pos,
            calcVec2,
            null,
            null,
            store
        );
    };

    GuiFeedbackFunctions.prototype.enableElement = function(elementId, posVec, particleFxId, fxStore) {
        calcVec.copy(posVec);
        return generateElement(calcVec, particleFxId, fxStore);
    };

    GuiFeedbackFunctions.prototype.updateElementPosition = function(fxElement, posVec) {
        ModuleEffectCreator.setEffectPosition(fxElement, posVec);
    };

    GuiFeedbackFunctions.prototype.updateElementsColor = function(fxArray, colorKey) {
        ModuleEffectCreator.applyColorKeyToFxArray(fxArray, colorKey);
    };

    GuiFeedbackFunctions.prototype.updateElementsSprite = function(fxArray, spriteKey) {
        ModuleEffectCreator.applySpriteKeyToFxArray(fxArray, spriteKey);
    };

    GuiFeedbackFunctions.prototype.disableElement = function(fxStore) {
        ModuleEffectCreator.removeModuleStaticEffect(fxStore)
    };

    return GuiFeedbackFunctions;

});