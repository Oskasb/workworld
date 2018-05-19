"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiDraggable',
        'ui/functions/GuiUpdatable',
        'ui/widgets/BaseWidget'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement,
        GuiDraggable,
        GuiUpdatable,
        BaseWidget
    ) {

        var GuiDragControlWidget = function(label, configId) {

            this.position = new THREE.Vector3();
            this.baseWidget = new BaseWidget(label, configId);
            this.guiDraggable = new GuiDraggable();

            this.startDragState = 0;

            this.update = {
                callback:null,
                source:null
            };

        };


        GuiDragControlWidget.prototype.configRead = function(dataKey) {
            return this.baseWidget.configRead(dataKey)
        };

        GuiDragControlWidget.prototype.initGuiWidget = function(onReadyCB) {

            var baseLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.baseWidget.initBaseWidget('GUI_DRAG_CONTROL_WIDGET', baseLoaded);
        };

        GuiDragControlWidget.prototype.addDragCallback = function(callback) {
            this.guiDraggable.addDragCallback(callback);
        };

        GuiDragControlWidget.prototype.addUpdateCallback = function(callback, source) {
            this.update.callback = callback;
            this.update.source = source;
        };

        GuiDragControlWidget.prototype.setMasterBuffer = function(buffer, index) {
            this.guiDraggable.setMasterBuffer(buffer, index);
        };

        var state;

        var sourceState;

        GuiDragControlWidget.prototype.updateGuiWidget = function() {

            state = 0;
            sourceState = this.update.callback(this.update.source);

            if (this.baseWidget.surfaceElement.getPress()) {

                if (this.startDragState === null) {
                    this.startDragState = sourceState;
                    state = this.startDragState;
                } else {
                    state = this.guiDraggable.getBufferState() * 0.1;
                    this.guiDraggable.updateDraggable(this.baseWidget.getSurfaceElement(), state);
                }
            } else {
                state = sourceState;
                this.startDragState = null;
            }

        //    WorldAPI.addTextMessage("Source: "+this.update.source+" _ "+state);

            this.baseWidget.setLabelText(MATH.decimalify(sourceState, 100));
            this.baseWidget.indicateControlState(sourceState, 'surface', 'state');

        };

        GuiDragControlWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.applyProgressDynLayout(dynLayout);
        };

        GuiDragControlWidget.prototype.applyDynamicLayout = function(dynLayout) {
            this.baseWidget.applyDynamicLayout(dynLayout);

        };

        GuiDragControlWidget.prototype.applyProgressDynLayout = function(dynLayout) {
            this.baseWidget.applyProgressDynLayout(dynLayout);
        };

        GuiDragControlWidget.prototype.disableWidget = function() {
            this.baseWidget.disableWidget();
        };

        GuiDragControlWidget.prototype.getWidgetProgressLayout = function() {
            return this.baseWidget.indicatorElement.getSurfaceLayout();
        };

        GuiDragControlWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.baseWidget.surfaceElement.getSurfaceLayout();
        };

        GuiDragControlWidget.prototype.setWidgetPosXY = function(x, y) {
            this.baseWidget.setWidgetPosXY(x, y);
        };

        GuiDragControlWidget.prototype.enableWidget = function() {

        };


        return GuiDragControlWidget;

    });