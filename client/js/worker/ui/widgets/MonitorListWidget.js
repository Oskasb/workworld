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

        var MonitorListWidget = function(label) {
            this.label = label;
            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.callbacks = [];
        };

        MonitorListWidget.prototype.setupTextElements = function() {
            this.header = this.surfaceElement.addSurfaceTextElement('button_label', this.label);
        };

        MonitorListWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'MONITOR_LIST_WIDGET', 'config');
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            this.surfaceElement.initSurfaceElement(surfaceReady);
        };

        MonitorListWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        MonitorListWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position ,this.configObject.getConfigByDataKey('surface'))
        };

        MonitorListWidget.prototype.updateGuiWidget = function() {
            this.updateSurfaceState();
        };


        MonitorListWidget.prototype.disableWidget = function() {
            while (this.callbacks.length) {
                GuiAPI.removeGuiUpdateCallback(this.callbacks.pop())
            }
        };

        MonitorListWidget.prototype.enableWidget = function() {

            var cb = function() {
                this.updateGuiWidget();
            }.bind(this);

            GuiAPI.addGuiUpdateCallback(cb);
            this.callbacks.push(cb);
            this.setupTextElements();
        };

        return MonitorListWidget;

    });