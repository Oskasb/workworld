"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiUpdatable'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement,
        GuiUpdatable
    ) {

        var GuiThumbstickWidget = function() {

            this.guiUpdatable = new GuiUpdatable();

            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.callbacks = [];

        };

        GuiThumbstickWidget.prototype.setupTextElements = function() {

            this.header = this.surfaceElement.addSurfaceTextElement('header', 'Header');
            this.typeLabel = this.surfaceElement.addSurfaceTextElement('type_label', 'Type Label');

        };


        GuiThumbstickWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'GUI_THUMBSTICK_WIDGET', 'config');
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            this.surfaceElement.initSurfaceElement(surfaceReady);
        };

        GuiThumbstickWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiThumbstickWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position, this.configObject.getConfigByDataKey('surface'))
        };

        GuiThumbstickWidget.prototype.updateGuiWidget = function() {

            this.position.x = Math.sin(WorldAPI.getWorldTime()*3.7)*0.1;
            this.position.y = Math.cos(WorldAPI.getWorldTime()*3.7)*0.1;

            if (Math.random() < 0.5) {

                this.header.setElementText('Header: '+Math.floor(Math.random()*160));
                this.typeLabel.setElementText('Type Label: '+Math.floor(Math.random()*10));
            }


            this.updateSurfaceState();
        };

        GuiThumbstickWidget.prototype.setGuiWidgetPosition = function(posVec) {
            this.position.copy(posVec);

            this.updateSurfaceState();

        };

        GuiThumbstickWidget.prototype.addWidgetText = function(text) {
            this.header = this.surfaceElement.addSurfaceTextElement('header' ,text);
        };

        GuiThumbstickWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
        };

        GuiThumbstickWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        GuiThumbstickWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        GuiThumbstickWidget.prototype.enableWidget = function() {
            this.setupTextElements();
        };


        return GuiThumbstickWidget;

    });