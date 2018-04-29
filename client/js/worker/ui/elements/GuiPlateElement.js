"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/EffectList'
    ],
    function(
        GuiAPI,
        ConfigObject,
        EffectList
    ) {


        var tempVec1 = new THREE.Vector3();

        var GuiPlateElement = function() {

            this.obj3d = new THREE.Object3D();
            this.platePassiveEffect = new EffectList();
            this.plateActiveEffect = new EffectList();

            this.scale = 1;
            this.aspect = 1;
        };

        GuiPlateElement.prototype.initPlateElement = function(onReadyCB) {

            var configLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_PLATE_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };

        GuiPlateElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };


        GuiPlateElement.prototype.enablePlateEffects = function(effectList, dataKey) {
            if (effectList.effectCount() === 0) {
                effectList.enableEffectList(this.configRead(dataKey), this.obj3d.position, this.obj3d.quaternion, this.scale, this.aspect);
            }
        };

        GuiPlateElement.prototype.disablePlateEffects = function(effectList) {
            effectList.disableEffectList();
        };

        GuiPlateElement.prototype.setPlateActive = function(bool, dataKey) {

            if (bool) {
                this.enablePlateEffects(this.plateActiveEffect, dataKey)
            } else {
                this.disablePlateEffects(this.plateActiveEffect)
            }

        };

        GuiPlateElement.prototype.setPlatePassive = function(bool, dataKey) {

            if (bool) {
                this.enablePlateEffects(this.platePassiveEffect, dataKey)
            } else {
                this.disablePlateEffects(this.platePassiveEffect)
            }
        };

        GuiPlateElement.prototype.setPlateWidthAndHeight = function(width, height) {
            this.scale = width;
            this.aspect = height/width;
            this.platePassiveEffect.setEffectListAspect(this.aspect);
            this.plateActiveEffect.setEffectListAspect(this.aspect)
        };


        GuiPlateElement.prototype.getPlatePosition = function() {
            return this.obj3d.position;
        };

        GuiPlateElement.prototype.setPlateQuaternion = function(quat) {
            this.obj3d.quaternion.copy(quat);
        };

        GuiPlateElement.prototype.getPlateQuaternion = function() {
            return this.obj3d.quaternion;
        };


        return GuiPlateElement;

    });