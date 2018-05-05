"use strict";

define([
        'ConfigObject',
        'EffectsAPI',
        'ui/elements/GuiArrowElement'
    ],
    function(
        ConfigObject,
        EffectsAPI,
        GuiArrowElement
    ) {

        var i;

        var tempVec1 = new THREE.Vector3();

        var GuiSurfaceSystem = function() {

        };

        GuiSurfaceSystem.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiSurfaceSystem.prototype.initGuiSystem = function(systemReady) {

            this.configObject = new ConfigObject('GUI_SYSTEMS', 'GUI_SURFACE_SYSTEM', 'config');

            var configLoaded = function(config) {
                this.configObject.removeCallback(configLoaded);
            //    console.log("Config: GUI_SURFACE_SYSTEM", config);
                systemReady(this);

            }.bind(this);

            this.configObject.addCallback(configLoaded);
        };


        GuiSurfaceSystem.prototype.trackInputPosition = function(effectArray, dataKey, posVec) {

            if (effectArray.length === 0) {
                this.enableEffectList(this.configRead(dataKey), effectArray, posVec);
            }

            this.setEffectListPosition(effectArray, posVec)
        };

        var dragVecConf;

        GuiSurfaceSystem.prototype.setupVectorElements = function(elementArray, dataKey) {

            var add = dragVecConf.fx_count - elementArray.length;

            if (add < 0) {
                while (elementArray.length > dragVecConf.fx_count) {
                    elementArray.pop().disableElement();
                }
            } else {
                for (i = 0; i < add; i++) {
                    var elementReady = function(elem) {
                        elementArray.push(elem)
                    };
                    new GuiArrowElement(elementReady, dataKey);
                }
            }
        };

        GuiSurfaceSystem.prototype.clearVectorElements = function(elementArray) {
            for (i = 0; i < elementArray.length; i++) {
                elementArray[i].disableElement();
            }
        };


        GuiSurfaceSystem.prototype.trackInputVector = function(elementArray, dataKey, dragVec, fromVec, toVec) {

        };

        GuiSurfaceSystem.prototype.updatePointerState = function() {

        };


        GuiSurfaceSystem.prototype.updateGuiSystem = function() {
            this.updatePointerState();
        };

        return GuiSurfaceSystem;

    });