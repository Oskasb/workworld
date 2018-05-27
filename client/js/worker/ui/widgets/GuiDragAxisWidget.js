"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiDraggable',
        'ui/widgets/BaseWidget'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement,
        GuiDraggable,
        BaseWidget
    ) {

        var GuiDragAxisWidget = function(label, configId) {

            this.position = new THREE.Vector3();
            this.baseWidget = new BaseWidget(label, configId);
            this.guiDraggable = new GuiDraggable();

        };


        GuiDragAxisWidget.prototype.configRead = function(dataKey) {
            return this.baseWidget.configRead(dataKey)
        };

        GuiDragAxisWidget.prototype.initGuiWidget = function(onReadyCB) {

            var baseLoaded = function() {
                onReadyCB(this);
            }.bind(this);

            this.baseWidget.initBaseWidget('GUI_DRAG_AXIS_WIDGET', baseLoaded);
        };

        GuiDragAxisWidget.prototype.addDragCallback = function(callback) {
            this.guiDraggable.addDragCallback(callback);
        };


        GuiDragAxisWidget.prototype.setMasterBuffer = function(buffer, index) {
            this.guiDraggable.setMasterBuffer(buffer, index);
        };

        var state;

        GuiDragAxisWidget.prototype.updateGuiWidget = function() {

            state = this.guiDraggable.getBufferState();

            this.baseWidget.setLabelText(MATH.decimalify(state, 100));
            this.baseWidget.indicateControlState(state, 'surface', 'state');

            this.guiDraggable.updateDraggable(this.baseWidget.getSurfaceElement());
        };

        GuiDragAxisWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.baseWidget.applyProgressDynLayout(dynLayout);
        };

        GuiDragAxisWidget.prototype.disableWidget = function() {
            this.baseWidget.disableWidget();
        };

        GuiDragAxisWidget.prototype.getWidgetProgressLayout = function() {
            return this.baseWidget.indicatorElement.getSurfaceLayout();
        };

        GuiDragAxisWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.baseWidget.surfaceElement.getSurfaceLayout();
        };

        GuiDragAxisWidget.prototype.setWidgetPosXY = function(x, y) {
            this.baseWidget.setWidgetPosXY(x, y);
        };

        GuiDragAxisWidget.prototype.enableWidget = function() {

        };


        return GuiDragAxisWidget;

    });