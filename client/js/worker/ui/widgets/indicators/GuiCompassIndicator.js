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

        var GuiCompassIndicator = function(label, configId) {
            this.obj3d = new THREE.Object3D();

            this.dynamicLayout = {};

            this.baseWidget = new BaseWidget('N', configId);
            this.guiProgress = new GuiProgress(this.indicatorElement);

        };

        GuiCompassIndicator.prototype.configRead = function(dataKey) {
            return this.baseWidget.configRead(dataKey)
        };

        GuiCompassIndicator.prototype.initGuiWidget = function(onReadyCB) {

            var baseLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.baseWidget.initBaseWidget('GUI_COMPASS', baseLoaded);

        };

        GuiCompassIndicator.prototype.addUpdateCallback = function(callback) {
            this.guiProgress.addProgressCallback(callback);
        };

        GuiCompassIndicator.prototype.setMasterBuffer = function(buffer, index) {
            this.guiProgress.setMasterBuffer(buffer, index);
        };

        GuiCompassIndicator.prototype.updateSurfaceState = function() {
            this.baseWidget.updateSurfaceState('surface', 'state');
        };

        var height;
        GuiCompassIndicator.prototype.updateGuiWidget = function() {

            if (this.guiProgress.getBufferState()) {

                state = this.guiProgress.getBufferState();

                this.baseWidget.setWidgetOn(1);

                this.guiProgress.updateProgress();

                this.baseWidget.indicateYawState(state, 'surface', 'state');

                this.updateSurfaceState();


            } else if (!this.baseWidget.surfaceElement.disabled) {
                this.disableWidget();
            }
        };

        GuiCompassIndicator.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.baseWidget.applyProgressDynLayout(dynLayout);
        };

        GuiCompassIndicator.prototype.disableWidget = function() {
            this.baseWidget.disableWidget();
        };

        GuiCompassIndicator.prototype.getWidgetProgressLayout = function() {
            return this.baseWidget.indicatorElement.getSurfaceLayout();
        };

        GuiCompassIndicator.prototype.getWidgetSurfaceLayout = function() {
            return this.baseWidget.surfaceElement.getSurfaceLayout();
        };

        GuiCompassIndicator.prototype.setWidgetPosXY = function(x, y) {
            this.baseWidget.setWidgetPosXY(x, y);
        };

        GuiCompassIndicator.prototype.enableWidget = function() {

        };

        return GuiCompassIndicator;

    });