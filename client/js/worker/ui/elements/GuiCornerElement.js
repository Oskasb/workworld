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

        var GuiCornerElement = function() {

            this.obj3d = new THREE.Object3D();

            this.cornerPassiveEffect = new EffectList();
            this.cornerActiveEffect = new EffectList();
        };

        GuiCornerElement.prototype.initCornerElement = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_CORNER_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };

        GuiCornerElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiCornerElement.prototype.enableCornerEffects = function(effectList, dataKey) {
            if (effectList.effectCount() === 0) {
                effectList.enableEffectList(this.configRead(dataKey), this.obj3d.position, this.obj3d.quaternion);
            }
        };

        GuiCornerElement.prototype.disableCornerEffects = function(effectList) {
            effectList.disableEffectList();
        };

        GuiCornerElement.prototype.setCornerActive = function(bool, dataKey) {

            if (bool) {
                this.enableCornerEffects(this.cornerActiveEffect, dataKey)
            } else {
                this.disableCornerEffects(this.cornerActiveEffect)
            }

        };

        GuiCornerElement.prototype.setCornerPassive = function(bool, dataKey) {

            if (bool) {
                this.enableCornerEffects(this.cornerPassiveEffect, dataKey)
            } else {
                this.disableCornerEffects(this.cornerPassiveEffect)
            }
        };


        GuiCornerElement.prototype.setCornerXY = function(x, y) {
            this.obj3d.position.set(x, y, -1);
        };

        GuiCornerElement.prototype.setCornerQuaternion = function(quat) {
            this.obj3d.quaternion.copy(quat);
        };

        GuiCornerElement.prototype.getCornerQuaternion = function() {
            return this.obj3d.quaternion;
        };


        return GuiCornerElement;

    });