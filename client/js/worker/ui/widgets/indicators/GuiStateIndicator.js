"use strict";

define([
        'ConfigObject',
        'ui/functions/GuiProgress',
        'ui/widgets/BaseWidget'
    ],
    function(
        ConfigObject,
        GuiProgress,
        BaseWidget
    ) {

        var layout;
        var state;

        var GuiStateIndicator = function(label, configId) {
            this.obj3d = new THREE.Object3D();

            this.dynamicLayout = {};

            this.baseWidget = new BaseWidget('', configId);
            this.guiProgress = new GuiProgress(this.indicatorElement);

        };

        GuiStateIndicator.prototype.configRead = function(dataKey) {
            return this.baseWidget.configRead(dataKey)
        };

        GuiStateIndicator.prototype.initGuiWidget = function(onReadyCB) {

            var baseLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.baseWidget.initBaseWidget('GUI_STATE_INDICATOR', baseLoaded);

        };

        GuiStateIndicator.prototype.addUpdateCallback = function(callback) {
            this.guiProgress.addProgressCallback(callback);
        };

        GuiStateIndicator.prototype.setMasterBuffer = function(buffer, index) {
            this.guiProgress.setMasterBuffer(buffer, index);
        };

        GuiStateIndicator.prototype.updateSurfaceState = function() {
            this.baseWidget.updateSurfaceState('surface', 'state');
        };

        var height;
        GuiStateIndicator.prototype.updateGuiWidget = function() {

            if (this.guiProgress.getBufferState()) {

                state = this.guiProgress.getBufferState();

                this.baseWidget.setWidgetOn(1);

                this.guiProgress.updateProgress();

                this.baseWidget.indicateStateProgress(state, 'surface', 'state');

                this.updateSurfaceState();


            } else if (!this.baseWidget.surfaceElement.disabled) {
                this.disableWidget();
            }
        };

        GuiStateIndicator.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.baseWidget.applyProgressDynLayout(dynLayout);
        };

        GuiStateIndicator.prototype.disableWidget = function() {
            this.baseWidget.disableWidget();
        };

        GuiStateIndicator.prototype.getWidgetProgressLayout = function() {
            return this.baseWidget.indicatorElement.getSurfaceLayout();
        };

        GuiStateIndicator.prototype.getWidgetSurfaceLayout = function() {
            return this.baseWidget.surfaceElement.getSurfaceLayout();
        };

        GuiStateIndicator.prototype.setWidgetPosXY = function(x, y) {
            this.baseWidget.setWidgetPosXY(x, y);
        };

        GuiStateIndicator.prototype.enableWidget = function() {

        };

        return GuiStateIndicator;

    });