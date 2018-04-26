"use strict";

define([
        'ConfigObject',
        'EffectsAPI'
    ],
    function(
        ConfigObject,
        EffectsAPI
    ) {

        var i;

        var GuiArrowElement = function(onReadyCB, dataKey) {

            this.obj3d = new THREE.Object3D();
            this.arrowVector = new THREE.Vector3();
            this.arrowEffects = [];

            this.dataKey = dataKey;

            var configLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_ARROW_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);
        };

        GuiArrowElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiArrowElement.prototype.initGuiSystem = function(systemReady) {

        };

        GuiArrowElement.prototype.setEffectListPosition = function(effectArray, posVec) {
            for (i = 0; i < effectArray.length; i++) {
                effectArray[i].updateEffectPositionSimulator(posVec);
            }
        };

        GuiArrowElement.prototype.setEffectListQuaternion = function(effectArray, quat) {
            for (i = 0; i < effectArray.length; i++) {
                effectArray[i].updateEffectQuaternionSimulator(quat);
            }
        };

        GuiArrowElement.prototype.enableEffectList = function(effectIds, effectArray, posVec) {
            for (i = 0; i < effectIds.length; i++) {
                effectArray.push(EffectsAPI.requestPassiveEffect(effectIds[i], posVec))
            }
        };

        GuiArrowElement.prototype.disableEffectList = function(effectArray) {
            while (effectArray.length) {
                EffectsAPI.returnPassiveEffect(effectArray.pop())
            }
        };

        GuiArrowElement.prototype.drawArrowElement = function(fromVec, toVec) {

            this.obj3d.position.copy(fromVec);

            if (this.arrowEffects.length === 0) {
                this.enableEffectList(this.configRead(this.dataKey), this.arrowEffects, this.obj3d.position);
            }

            this.setEffectListPosition(this.arrowEffects, this.obj3d.position);
            this.obj3d.lookAt(toVec);
            this.setEffectListQuaternion(this.arrowEffects, this.obj3d.quaternion)
        };

        GuiArrowElement.prototype.disableElement = function() {
            this.disableEffectList(this.arrowEffects)
        };

        return GuiArrowElement;

    });