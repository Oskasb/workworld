"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiClickable',
        'ui/functions/GuiUpdatable',
        'ui/widgets/BaseWidget'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement,
        GuiClickable,
        GuiUpdatable,
        BaseWidget
    ) {

        var GuiToggleControlWidget = function(label, configId) {

            this.position = new THREE.Vector3();
            this.baseWidget = new BaseWidget(label, configId);

            this.guiClickable = new GuiClickable(this.baseWidget.getSurfaceElement());

            this.update = {
                callback:null,
                source:null
            };
        };


        GuiToggleControlWidget.prototype.configRead = function(dataKey) {
            return this.baseWidget.configRead(dataKey)
        };

        GuiToggleControlWidget.prototype.initGuiWidget = function(onReadyCB) {

            var baseLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.baseWidget.initBaseWidget('GUI_TOGGLE_CONTROL_WIDGET', baseLoaded);
        };

        GuiToggleControlWidget.prototype.callButtonClick = function(bool) {
            this.guiClickable.callClickableCallbacks(bool);
        };

        GuiToggleControlWidget.prototype.addButtonClickCallback = function(clickFunc, source) {
            this.guiClickable.addClickableCallback(clickFunc, source);
        };

        GuiToggleControlWidget.prototype.addUpdateCallback = function(callback, source) {
            this.update.callback = callback;
            this.update.source = source;

            controlState = this.update.callback(this.update.source);

            this.setMasterBuffer(controlState.state, 'target', 1)
        };

        GuiToggleControlWidget.prototype.setMasterBuffer = function(buffer, index, onAtValue) {
            this.guiClickable.setMasterBuffer(buffer, index, onAtValue);
        };

        var controlState;
        var targetState;
        var currentState;

        GuiToggleControlWidget.prototype.updateGuiWidget = function() {

            controlState = this.update.callback(this.update.source);

            targetState = controlState.getControlStateTargetValue();
            currentState = controlState.getControlStateValue();

            if (this.guiClickable.isBufferStateMatch()) {

                if (this.baseWidget.surfaceElement.getOn() === 0) {
                    this.callButtonClick(controlState.getControlMax());
                }

                this.baseWidget.surfaceElement.setOn(1);
            } else {

                if (this.baseWidget.surfaceElement.getOn() === 1) {
                    this.callButtonClick(controlState.getControlMin());
                }

                this.baseWidget.surfaceElement.setOn(0);
            }

        //    WorldAPI.addTextMessage("Source: "+this.update.source+" _ "+state);

            this.baseWidget.setLabelText(MATH.decimalify(currentState, 100));
            this.baseWidget.indicateToggleProgress(currentState, 'surface', 'state');

        };

        GuiToggleControlWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.applyProgressDynLayout(dynLayout);
        };

        GuiToggleControlWidget.prototype.applyProgressDynLayout = function(dynLayout) {
            this.baseWidget.applyProgressDynLayout(dynLayout);
        };

        GuiToggleControlWidget.prototype.disableWidget = function() {
            this.baseWidget.disableWidget();
        };

        GuiToggleControlWidget.prototype.getWidgetProgressLayout = function() {
            return this.baseWidget.indicatorElement.getSurfaceLayout();
        };

        GuiToggleControlWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.baseWidget.surfaceElement.getSurfaceLayout();
        };

        GuiToggleControlWidget.prototype.setWidgetPosXY = function(x, y) {
            this.baseWidget.setWidgetPosXY(x, y);
        };

        GuiToggleControlWidget.prototype.enableWidget = function() {

        };


        return GuiToggleControlWidget;

    });