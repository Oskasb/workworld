"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement
    ) {

        var BaseWidget = function(label, configId) {
            this.label = label;
            this.configId = configId;
            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.indicatorElement = new GuiSurfaceElement();
        };


        BaseWidget.prototype.setupTextElements = function() {

            this.header = this.surfaceElement.addSurfaceTextElement(this.configRead('header_label'), this.label);
            this.typeLabel = this.surfaceElement.addSurfaceTextElement(this.configRead('value_label'), '');
        };

        BaseWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        BaseWidget.prototype.initBaseWidget = function(dataKey, onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                this.setupTextElements();
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', dataKey, this.configId);
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            var progressReady = function() {
                this.surfaceElement.initSurfaceElement(surfaceReady);
            }.bind(this);

            this.indicatorElement.initSurfaceElement(progressReady);

        };

        BaseWidget.prototype.setLabelText = function(text) {
            this.typeLabel.setElementText(text);
        };

        BaseWidget.prototype.addUpdateCallback = function(callback) {
            this.guiProgress.addProgressCallback(callback);
        };

        BaseWidget.prototype.setMasterBuffer = function(buffer, index) {
            this.guiProgress.setMasterBuffer(buffer, index);
        };

        BaseWidget.prototype.updateSurfaceState = function(container, indicator) {
            this.surfaceElement.updateSurfaceElement(this.position, this.configRead(container));
            this.indicatorElement.updateSurfaceElement(this.position, this.configRead(indicator))
        };


        BaseWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.applyProgressDynLayout(dynLayout);
        };

        BaseWidget.prototype.applyProgressDynLayout = function(dynLayout) {
            for (var key in dynLayout) {
                this.getWidgetProgressLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        BaseWidget.prototype.setWidgetOn = function(bool) {
            this.surfaceElement.setOn(bool);
            this.indicatorElement.setOn(bool);
        };

        BaseWidget.prototype.getSurfaceElement = function() {
            return this.surfaceElement;
        };
        BaseWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
            this.indicatorElement.disableSurfaceElement();
        };

        BaseWidget.prototype.getWidgetProgressLayout = function() {
            return this.indicatorElement.getSurfaceLayout();
        };

        BaseWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        BaseWidget.prototype.setIndicatorQuaternion = function(quat) {
            this.indicatorElement.setSurfaceQuaternion(quat);
        };

        BaseWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        BaseWidget.prototype.enableWidget = function() {

        };

        return BaseWidget;

    });