"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiUpdatable'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiSurfaceElement,
        GuiUpdatable
    ) {

        var i;

        var GuiButtonWidget = function(label) {
            this.label = label;
            this.position = new THREE.Vector3();
            this.guiUpdatable = new GuiUpdatable();
            this.surfaceElement = new GuiSurfaceElement();

            var acceptClick = false;

            var onButtonHover = function(bool)  {
                acceptClick = false;
            }.bind(this);

            var onButtonRelease = function(active)  {
                console.log("Button Release", active);
                if (acceptClick) {
                    this.surfaceElement.setOn(!this.surfaceElement.getOn());
                    this.callButtonClick(this.surfaceElement.getOn())
                }
                acceptClick = false;
            }.bind(this);

            var onButtonPress = function(active)  {
                if (active) {
                    acceptClick = true;
                }
            }.bind(this);

            this.surfaceElement.addSurfaceHoverCallback(onButtonHover);
            this.surfaceElement.addSurfaceReleaseCallback(onButtonRelease);
            this.surfaceElement.addSurfacePressCallback(onButtonPress);

            this.clickCallbacks = []
        };


        GuiButtonWidget.prototype.setupTextElements = function() {
            this.header = this.surfaceElement.addSurfaceTextElement('button_label', this.label);
        };

        GuiButtonWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'GUI_BUTTON_WIDGET', 'config');
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            this.surfaceElement.initSurfaceElement(surfaceReady);
        };

        GuiButtonWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiButtonWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position ,this.configObject.getConfigByDataKey('surface'))
        };

        GuiButtonWidget.prototype.updateGuiWidget = function() {
            this.updateSurfaceState();
        };

        GuiButtonWidget.prototype.callButtonClick = function(bool) {
            for (i = 0; i < this.clickCallbacks.length; i++) {
                this.clickCallbacks[i](bool);
            }
        };

        GuiButtonWidget.prototype.addButtonClickCallback = function(clickFunc) {
            this.clickCallbacks.push(clickFunc);
        };

        GuiButtonWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
        };

        GuiButtonWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        GuiButtonWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        GuiButtonWidget.prototype.enableWidget = function() {
            this.setupTextElements()

        };

        return GuiButtonWidget;

    });