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

        var GuiProgressWidget = function(label, configId) {
            this.label = label;
            this.configId = configId;

            this.dynamicLayout = {
                width:0.1
            };

            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.progressElement = new GuiSurfaceElement();
            this.guiProgress = new GuiProgress(this.progressElement);

        };

        GuiProgressWidget.prototype.setupTextElements = function() {

            this.header = this.surfaceElement.addSurfaceTextElement(this.configRead('header_label'), this.label);
            this.typeLabel = this.surfaceElement.addSurfaceTextElement(this.configRead('value_label'), 'val..');
        };

        GuiProgressWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiProgressWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                this.setupTextElements();
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'GUI_PROGRESS_BAR', this.configId);
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            var progressReady = function() {
                this.surfaceElement.initSurfaceElement(surfaceReady);
            }.bind(this);

            this.progressElement.initSurfaceElement(progressReady);

        };

        GuiProgressWidget.prototype.addUpdateCallback = function(callback) {
            this.guiProgress.addProgressCallback(callback);
        };

        GuiProgressWidget.prototype.setMasterBuffer = function(buffer, index) {
            this.guiProgress.setMasterBuffer(buffer, index);
        };

        GuiProgressWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position, this.configRead('surface'));
            this.progressElement.updateSurfaceElement(this.position, this.configRead('progress'))
        };

        GuiProgressWidget.prototype.updateGuiWidget = function() {

            if (this.guiProgress.getBufferState()) {
                this.surfaceElement.setOn(1);
                this.progressElement.setOn(1);

                this.guiProgress.updateProgress();

                this.typeLabel.setElementText(MATH.decimalify(this.guiProgress.getBufferState(), 100));
                this.dynamicLayout.width = this.guiProgress.getBufferState() * this.configRead('surface').layout.width;

                this.applyProgressDynLayout(this.dynamicLayout);

                this.updateSurfaceState();

                if (this.guiProgress.getBufferState() >= 1) {
                    this.guiProgress.applyCompleted();
                    this.disableWidget();
                }

            } else if (!this.surfaceElement.disabled) {
                this.disableWidget();
            }
        };

        GuiProgressWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        GuiProgressWidget.prototype.applyProgressDynLayout = function(dynLayout) {
            for (var key in dynLayout) {
                this.getWidgetProgressLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        GuiProgressWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
            this.progressElement.disableSurfaceElement();
        };

        GuiProgressWidget.prototype.getWidgetProgressLayout = function() {
            return this.progressElement.getSurfaceLayout();
        };

        GuiProgressWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        GuiProgressWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        GuiProgressWidget.prototype.enableWidget = function() {

        };

        return GuiProgressWidget;

    });