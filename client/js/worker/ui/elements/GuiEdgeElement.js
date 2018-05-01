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

        var GuiEdgeElement = function() {

            this.obj3d = new THREE.Object3D();

            this.edgePassiveEffect = new EffectList();
            this.edgeActiveEffect = new EffectList();
            this.scale = 1;
            this.aspect = 1;
        };

        GuiEdgeElement.prototype.initEdgeElement = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_EDGE_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };

        GuiEdgeElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiEdgeElement.prototype.enableEdgeEffects = function(effectList, dataKey) {
            if (effectList.effectCount() === 0) {
                effectList.enableEffectList(this.configRead(dataKey), this.obj3d.position, this.obj3d.quaternion, this.scale, this.aspect);
            }
        };

        GuiEdgeElement.prototype.disableEdgeEffects = function(effectList) {
            effectList.disableEffectList();
        };

        GuiEdgeElement.prototype.setEdgeActive = function(bool, dataKey) {

            if (bool) {
                this.enableEdgeEffects(this.edgeActiveEffect, dataKey)
            } else {
                this.disableEdgeEffects(this.edgeActiveEffect)
            }

        };

        GuiEdgeElement.prototype.setEdgePassive = function(bool, dataKey) {

            if (bool) {
                this.enableEdgeEffects(this.edgePassiveEffect, dataKey)
            } else {
                this.disableEdgeEffects(this.edgePassiveEffect)
            }
        };

        GuiEdgeElement.prototype.setEdgeWidthAndHeight = function(width, height) {
            this.scale = width;
            this.aspect = height/width;
            this.edgePassiveEffect.setEffectListAspect(this.aspect);
            this.edgePassiveEffect.setEffectListAspect(this.aspect)
        };

        GuiEdgeElement.prototype.setEdgeXY = function(x, y) {
            this.obj3d.position.set(x, y, -1);
        };

        GuiEdgeElement.prototype.setEdgeQuaternion = function(quat) {
            this.obj3d.quaternion.copy(quat);
        };

        GuiEdgeElement.prototype.getEdgeQuaternion = function() {
            return this.obj3d.quaternion;
        };

        GuiEdgeElement.prototype.setRotation = function(x, y, z) {
            return this.obj3d.rotation.set(x, y, z);
        };

        return GuiEdgeElement;

    });