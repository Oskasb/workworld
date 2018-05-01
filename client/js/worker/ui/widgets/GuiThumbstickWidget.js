"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiSurfaceElement'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiSurfaceElement
    ) {

        var GuiThumbstickWidget = function() {

            this.obj3d = new THREE.Object3D();
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
            this.surfaceElement.updateSurfaceElement(this.configObject.getConfigByDataKey('surface'))
        };

        GuiThumbstickWidget.prototype.updateGuiWidget = function() {
            this.updateSurfaceState();
        };


        GuiThumbstickWidget.prototype.addWidgetText = function(text) {
            this.header = this.surfaceElement.addSurfaceTextElement('header' ,text);
        };


        GuiThumbstickWidget.prototype.disableWidget = function() {
            while (this.callbacks.length) {
                GuiAPI.removeGuiUpdateCallback(this.callbacks.pop())
            }
        };

        GuiThumbstickWidget.prototype.enableWidget = function() {

            var cb = function() {

                if (Math.random() < 0.5) {
                    this.header.setElementText('Header: '+Math.floor(Math.random()*160));
                    this.typeLabel.setElementText('Type Label: '+Math.floor(Math.random()*10));
                }


                this.updateGuiWidget();
            }.bind(this);

            GuiAPI.addGuiUpdateCallback(cb);
            this.callbacks.push(cb);

            this.setupTextElements();

        };


        return GuiThumbstickWidget;

    });