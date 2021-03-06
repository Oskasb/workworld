"use strict";

define([
        'ConfigObject',
        'ui/elements/RenderableElement',
        'Events'
    ],
    function(
        ConfigObject,
        RenderableElement,
        evt
    ) {
        var colorKey;
        var GuiEdgeElement = function() {

            this.obj3d = new THREE.Object3D();

            this.passiveRenderable = new RenderableElement(this.obj3d);
            this.activeRenderable = new RenderableElement(this.obj3d);

            this.scale = 1;
            this.aspect = 1;

            this.press = true;
            this.hover = true;
            this.on = true;
            this.colorKey = true;
            this.dirty = true;

            var onResize = function() {
                this.dirty = true;
            }.bind(this);

            evt.on(evt.list().NOTIFY_RESIZE, onResize)

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

            if (this.dirty === false && this.hover === hover && this.press === press && this.on === on && this.colorKey === colorKey) {

            } else {

                this.passiveRenderable.applyRenderableDataState(this.configRead(config.passive_fx), hover, on, colorKey);
                this.activeRenderable.applyRenderableDataState(this.configRead(config.active_fx), press, on, colorKey);

                this.hover = hover;
                this.press = press;
                this.on = on;
                this.colorKey = colorKey;
                this.dirty = false;

            }
        };

        GuiEdgeElement.prototype.rotateEdgeY = function(rotY) {
            this.obj3d.rotateY(rotY);
            this.updateRenderableQuaternion();
        };

        GuiEdgeElement.prototype.setEdgeWidthAndHeight = function(width, height) {

            if (this.lastWidth !== width || this.lastHeight !== height) {

            this.passiveRenderable.setRenderableScale(width);
            this.passiveRenderable.setRenderableAspect(width, height);
            this.activeRenderable.setRenderableScale(width);
            this.activeRenderable.setRenderableAspect(width, height);

                this.lastWidth = width;
                this.lastHeight = height
            }
        };

        GuiEdgeElement.prototype.setEdgeXY = function(x, y) {

            if (x !== this.obj3d.position.x || y !== this.obj3d.position.y) {
                this.obj3d.position.set(x, y, -1);
                this.passiveRenderable.updateRenderablePosition();
                this.activeRenderable.updateRenderablePosition();
                this.dirty = true;
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

            if (x !== this.obj3d.rotation.x || y !== this.obj3d.rotation.y || z !== this.obj3d.rotation.z) {

                this.obj3d.rotation.set(x, y, z);
                this.passiveRenderable.updateRenderableQuaternion();
                this.activeRenderable.updateRenderableQuaternion();
                this.dirty = true;
            }

        };

        return GuiEdgeElement;

    });