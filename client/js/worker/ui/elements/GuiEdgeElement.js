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
        var GuiEdgeElement = function() {

            this.obj3d = new THREE.Object3D();

            this.passiveRenderable = new RenderableElement(this.obj3d);
            this.activeRenderable = new RenderableElement(this.obj3d);

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

        GuiEdgeElement.prototype.applyEdgeElementDataState = function(config, hover, press, on) {

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

        GuiEdgeElement.prototype.rotateEdgeY = function(rotY) {
            this.obj3d.rotateY(rotY);
            this.updateRenderableQuaternion();
        };

        GuiEdgeElement.prototype.setEdgeWidthAndHeight = function(width, height) {

            this.passiveRenderable.setRenderableScale(width);
            this.passiveRenderable.setRenderableAspect(width, height);
            this.activeRenderable.setRenderableScale(width);
            this.activeRenderable.setRenderableAspect(width, height);
        };

        GuiEdgeElement.prototype.setEdgeXY = function(x, y) {

            if (x !== this.obj3d.position.x || y !== this.obj3d.position.y) {
                this.obj3d.position.set(x, y, -1);
                this.passiveRenderable.updateRenderablePosition();
                this.activeRenderable.updateRenderablePosition();
            }
        };

        GuiEdgeElement.prototype.disableEdgeElement = function() {
            this.passiveRenderable.disableRenderableEffects();
            this.activeRenderable.disableRenderableEffects();
        };

        GuiEdgeElement.prototype.setEdgeQuaternion = function(quat) {
            this.obj3d.quaternion.copy(quat);
        };

        GuiEdgeElement.prototype.getEdgeQuaternion = function() {
            return this.obj3d.quaternion;
        };

        GuiEdgeElement.prototype.setRotation = function(x, y, z) {
            this.obj3d.rotation.set(x, y, z);
            this.passiveRenderable.updateRenderableQuaternion();
            this.activeRenderable.updateRenderableQuaternion();
        };

        return GuiEdgeElement;

    });