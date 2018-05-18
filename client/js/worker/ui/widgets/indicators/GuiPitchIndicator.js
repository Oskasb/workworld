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

        var GuiPitchIndicator = function(label, configId) {
            this.obj3d = new THREE.Object3D();

            this.dynamicLayout = {
                width:0.1,
                left:0.5
            };

            this.baseWidget = new BaseWidget(label, configId);
            this.guiProgress = new GuiProgress(this.indicatorElement);

        };

        GuiPitchIndicator.prototype.configRead = function(dataKey) {
            return this.baseWidget.configRead(dataKey)
        };

        GuiPitchIndicator.prototype.initGuiWidget = function(onReadyCB) {

            var baseLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.baseWidget.initBaseWidget('GUI_PITCH_INDICATOR', baseLoaded);

        };

        GuiPitchIndicator.prototype.addUpdateCallback = function(callback) {
            this.guiProgress.addProgressCallback(callback);
        };

        GuiPitchIndicator.prototype.setMasterBuffer = function(buffer, index) {
            this.guiProgress.setMasterBuffer(buffer, index);
        };

        GuiPitchIndicator.prototype.updateSurfaceState = function() {
            this.baseWidget.updateSurfaceState('surface', 'state');
        };

        var height;
        GuiPitchIndicator.prototype.updateGuiWidget = function() {

            if (this.guiProgress.getBufferState()) {

                layout =  this.configRead('surface').layout;

                state = this.guiProgress.getBufferState() / Math.PI;

                this.baseWidget.setWidgetOn(1);

                this.guiProgress.updateProgress();

                this.baseWidget.setLabelText(MATH.decimalify(state, 100))

                height = layout.height*0.5 + state * layout.height * 0.5;

                this.dynamicLayout.height = -height;
                this.dynamicLayout.margin_y = layout.margin_y - this.dynamicLayout.height + layout.height * 0.5;

                this.baseWidget.applyProgressDynLayout(this.dynamicLayout);

                this.updateSurfaceState();


            } else if (!this.baseWidget.surfaceElement.disabled) {
                this.disableWidget();
            }
        };

        GuiPitchIndicator.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.applyProgressDynLayout(dynLayout);
        };

        GuiPitchIndicator.prototype.applyDynamicLayout = function(dynLayout) {
            this.baseWidget.applyDynamicLayout(dynLayout);
        };

        GuiPitchIndicator.prototype.applyProgressDynLayout = function(dynLayout) {
            this.baseWidget.applyProgressDynLayout(dynLayout);
        };

        GuiPitchIndicator.prototype.disableWidget = function() {
            this.baseWidget.disableWidget();
        };

        GuiPitchIndicator.prototype.getWidgetProgressLayout = function() {
            return this.baseWidget.indicatorElement.getSurfaceLayout();
        };

        GuiPitchIndicator.prototype.getWidgetSurfaceLayout = function() {
            return this.sbaseWidget.urfaceElement.getSurfaceLayout();
        };

        GuiPitchIndicator.prototype.setWidgetPosXY = function(x, y) {
            this.baseWidget.setWidgetPosXY(x, y);
        };

        GuiPitchIndicator.prototype.enableWidget = function() {

        };

        return GuiPitchIndicator;

    });