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
            this.lastWidth = 0;
            this.lastHeight = 0;
            this.dirty = true;
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

            this.passiveRenderable.applyRenderableDataState(this.configRead(config.passive_fx), hover, on, colorKey);
            this.activeRenderable.applyRenderableDataState(this.configRead(config.active_fx), press, on, colorKey);
        };

        GuiPlateElement.prototype.setPlateWidthAndHeight = function(width, height) {

            if (this.lastWidth !== width || this.lastHeight !== height || this.dirty === true) {

                this.passiveRenderable.setRenderableAspect(width, height);
                this.passiveRenderable.setRenderableScale(width);
                this.activeRenderable.setRenderableAspect(width, height);
                this.activeRenderable.setRenderableScale(width);
                this.lastWidth = width;
                this.lastHeight = height
            }
        };

        GuiPlateElement.prototype.setPlatePosition = function(posVec) {

            if (posVec.equals(this.obj3d.position)) {
                return;
            }
            this.dirty = true;
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
            this.dirty = true;
            this.passiveRenderable.updateRenderableQuaternion();
            this.activeRenderable.updateRenderableQuaternion()
        };

        GuiPlateElement.prototype.setPlateRotation = function(x, y, z) {
            this.obj3d.rotation.set(x, y, z);
            this.dirty = true;
            this.passiveRenderable.updateRenderableQuaternion();
            this.activeRenderable.updateRenderableQuaternion();
        };

        GuiPlateElement.prototype.getPlateQuaternion = function() {
            return this.obj3d.quaternion;
        };

        return GuiPlateElement;

    });