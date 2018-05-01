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
        var GuiCornerElement = function() {

            this.obj3d = new THREE.Object3D();

            this.passiveRenderable = new RenderableElement(this.obj3d);
            this.activeRenderable = new RenderableElement(this.obj3d);
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

        GuiCornerElement.prototype.applyCornerElementDataState = function(config, hover, press, on) {

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

        GuiCornerElement.prototype.setCornerXY = function(x, y) {

            if (x !== this.obj3d.position.x || y !== this.obj3d.position.y) {
                this.obj3d.position.set(x, y, -1);
                this.passiveRenderable.updateRenderablePosition();
                this.activeRenderable.updateRenderablePosition();
            }
        };

        GuiCornerElement.prototype.setCornerQuaternion = function(quat) {
            this.obj3d.quaternion.copy(quat);
        };

        GuiCornerElement.prototype.getCornerQuaternion = function() {
            return this.obj3d.quaternion;
        };


        return GuiCornerElement;

    });