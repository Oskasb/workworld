"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiProgress'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement,
        GuiProgress
    ) {

        var GuiGaugeWidget = function(label, configId) {
            this.label = label;
            this.configId = configId;

            this.dynamicLayout = {
                width:0.1,
                left:0.5
            };

            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.progressElement = new GuiSurfaceElement();
            this.guiProgress = new GuiProgress(this.progressElement);

        };

        GuiGaugeWidget.prototype.setupTextElements = function() {

            this.header = this.surfaceElement.addSurfaceTextElement(this.configRead('header_label'), this.label);
            this.typeLabel = this.surfaceElement.addSurfaceTextElement(this.configRead('value_label'), 'val..');
        };

        GuiGaugeWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiGaugeWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                this.setupTextElements();
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'GUI_GAUGE_WIDGET', this.configId);
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            var progressReady = function() {
                this.surfaceElement.initSurfaceElement(surfaceReady);
            }.bind(this);

            this.progressElement.initSurfaceElement(progressReady);

        };

        GuiGaugeWidget.prototype.addUpdateCallback = function(callback) {
            this.guiProgress.addProgressCallback(callback);
        };

        GuiGaugeWidget.prototype.setMasterBuffer = function(buffer, index) {
            this.guiProgress.setMasterBuffer(buffer, index);
        };

        GuiGaugeWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position, this.configRead('surface'));
            this.progressElement.updateSurfaceElement(this.position, this.configRead('state'))
        };

        GuiGaugeWidget.prototype.updateGuiWidget = function() {

            if (this.guiProgress.getBufferState()) {
                this.surfaceElement.setOn(1);
                this.progressElement.setOn(1);

                this.guiProgress.updateProgress();

                this.typeLabel.setElementText(MATH.decimalify(this.guiProgress.getBufferState(), 100));

                this.dynamicLayout.width = this.configRead('state').layout.width;
                this.dynamicLayout.margin_x = this.guiProgress.getBufferState() * this.configRead('surface').layout.width * 0.5 + this.configRead('surface').layout.margin_x +  this.configRead('surface').layout.width * 0.5;

                this.applyProgressDynLayout(this.dynamicLayout);

                this.updateSurfaceState();


            } else if (!this.surfaceElement.disabled) {
                this.disableWidget();
            }
        };

        GuiGaugeWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.applyProgressDynLayout(dynLayout);
        };

        GuiGaugeWidget.prototype.applyProgressDynLayout = function(dynLayout) {
            for (var key in dynLayout) {
                this.getWidgetProgressLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        GuiGaugeWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
            this.progressElement.disableSurfaceElement();
        };

        GuiGaugeWidget.prototype.getWidgetProgressLayout = function() {
            return this.progressElement.getSurfaceLayout();
        };

        GuiGaugeWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        GuiGaugeWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        GuiGaugeWidget.prototype.enableWidget = function() {

        };

        return GuiGaugeWidget;

    });