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

        var GuiRollIndicator = function(label, configId) {

            this.obj3d = new THREE.Object3D();

            this.dynamicLayout = {
                width:0.1,
                left:0.5
            };

            this.baseWidget = new BaseWidget(label, configId);
            this.guiProgress = new GuiProgress(this.indicatorElement);
        };

        GuiRollIndicator.prototype.configRead = function(dataKey) {
            return this.baseWidget.configRead(dataKey)
        };

        GuiRollIndicator.prototype.initGuiWidget = function(onReadyCB) {

            var baseLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.baseWidget.initBaseWidget('GUI_ROLL_INDICATOR', baseLoaded);

        };

        GuiRollIndicator.prototype.addUpdateCallback = function(callback) {
            this.guiProgress.addProgressCallback(callback);
        };

        GuiRollIndicator.prototype.setMasterBuffer = function(buffer, index) {
            this.guiProgress.setMasterBuffer(buffer, index);
        };

        GuiRollIndicator.prototype.updateSurfaceState = function() {
            this.baseWidget.updateSurfaceState('surface', 'state');
        };

        GuiRollIndicator.prototype.updateGuiWidget = function() {

            if (this.guiProgress.getBufferState()) {
                this.baseWidget.setWidgetOn(1);

                this.guiProgress.updateProgress();

                this.baseWidget.setLabelText(MATH.decimalify(this.guiProgress.getBufferState(), 100))



            //    this.dynamicLayout.width = this.configRead('state').layout.width;

            //    this.dynamicLayout.margin_x = this.guiProgress.getBufferState() * this.configRead('surface').layout.width * 0.5 + this.configRead('surface').layout.margin_x +  this.configRead('surface').layout.width * 0.5;


                this.obj3d.quaternion.set(0, 0, 0, 1);

                this.obj3d.rotateZ(-this.guiProgress.getBufferState());
                this.baseWidget.setIndicatorQuaternion(this.obj3d.quaternion);


                this.baseWidget.applyProgressDynLayout(this.dynamicLayout);

                this.updateSurfaceState();

            } else if (!this.baseWidget.surfaceElement.disabled) {
                this.disableWidget();
            }
        };

        GuiRollIndicator.prototype.applyDynamicLayout = function(dynLayout) {
            this.baseWidget.applyDynamicLayout(dynLayout);
        };

        GuiRollIndicator.prototype.applyProgressDynLayout = function(dynLayout) {
            this.baseWidget.applyProgressDynLayout(dynLayout);
        };

        GuiRollIndicator.prototype.disableWidget = function() {
            this.baseWidget.disableWidget();
        };

        GuiRollIndicator.prototype.getWidgetProgressLayout = function() {
            return this.baseWidget.indicatorElement.getSurfaceLayout();
        };

        GuiRollIndicator.prototype.getWidgetSurfaceLayout = function() {
            return this.sbaseWidget.urfaceElement.getSurfaceLayout();
        };

        GuiRollIndicator.prototype.setWidgetPosXY = function(x, y) {
            this.baseWidget.setWidgetPosXY(x, y);
        };

        GuiRollIndicator.prototype.enableWidget = function() {

        };

        return GuiRollIndicator;

    });