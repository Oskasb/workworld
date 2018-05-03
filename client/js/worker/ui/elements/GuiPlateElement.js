"use strict";

define([
        'ConfigObject',
        'ui/elements/RenderableElement'
    ],
    function(
        ConfigObject,
        RenderableElement
    ) {

    var colorKey;

        var GuiPlateElement = function() {

            this.obj3d = new THREE.Object3D();

            this.passiveRenderable = new RenderableElement(this.obj3d);
            this.activeRenderable = new RenderableElement(this.obj3d);

            this.scale = 1;
            this.aspect = 1;
        };

        GuiPlateElement.prototype.initPlateElement = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            this.configObject = new ConfigObject('GUI_ELEMENTS', 'GUI_PLATE_ELEMENT', 'config');
            this.configObject.addCallback(configLoaded);

        };

        GuiPlateElement.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiPlateElement.prototype.applyPlateElementDataState = function(config, hover, press, on) {

            colorKey = null;
            if (config.color) {
                colorKey = config.color;
                if (on && config.color_on) {
                    colorKey = config.color_on;
                }
            }

            this.passiveRenderable.applyRenderableDataState(this.configRead(config.passive_fx), hover, on);
            this.activeRenderable.applyRenderableDataState(this.configRead(config.active_fx), press, on, colorKey);
        };

        GuiPlateElement.prototype.setPlateWidthAndHeight = function(width, height) {
            this.passiveRenderable.setRenderableWidthAndHeight(width, height);
            this.activeRenderable.setRenderableWidthAndHeight(width, height);
        };

        GuiPlateElement.prototype.setPlatePosition = function(posVec) {

            if (posVec.equals(this.obj3d.position)) {
                return;
            }

            this.obj3d.position.copy(posVec);
            this.passiveRenderable.updateRenderablePosition();
            this.activeRenderable.updateRenderablePosition();

        };

        GuiPlateElement.prototype.disablePlateElement = function() {
            this.passiveRenderable.disableRenderableEffects();
            this.activeRenderable.disableRenderableEffects();
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