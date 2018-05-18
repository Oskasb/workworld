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

        var GuiThumbstickWidget = function() {

            this.position = new THREE.Vector3();
            this.guiDraggable = new GuiDraggable();
            this.baseWidget = new BaseWidget("STEER", "config");
        };

        GuiThumbstickWidget.prototype.setupTextElements = function() {

            this.baseWidget.typeLabel2 = this.baseWidget.surfaceElement.addSurfaceTextElement(this.configRead('value_label'), 'Type Label');
            this.baseWidget.typeLabel.setTextOffsetY(this.baseWidget.typeLabel.getTextEffectSize() * 0.2);
            this.baseWidget.typeLabel3 = this.baseWidget.surfaceElement.addSurfaceTextElement(this.configRead('value_label'), 'Type Label');
            this.baseWidget.typeLabel3.setTextOffsetY(this.baseWidget.typeLabel.getTextEffectSize() * 0.4);
            this.baseWidget.typeLabel4 = this.baseWidget.surfaceElement.addSurfaceTextElement(this.configRead('value_label'), 'Type Label');
            this.baseWidget.typeLabel4.setTextOffsetY(this.baseWidget.typeLabel.getTextEffectSize() * 0.6);
        };


        GuiThumbstickWidget.prototype.initGuiWidget = function(onReadyCB) {

            var baseLoaded = function() {
                onReadyCB(this);
                this.setupTextElements();
            }.bind(this);

            this.baseWidget.initBaseWidget('GUI_THUMBSTICK_WIDGET', baseLoaded);

        };

        GuiThumbstickWidget.prototype.configRead = function(dataKey) {
            return this.baseWidget.configRead(dataKey)
        };

        GuiThumbstickWidget.prototype.updateSurfaceState = function() {
            this.baseWidget.updateSurfaceState('surface', 'state');
        };

        GuiThumbstickWidget.prototype.addDragCallback = function(callback) {
            this.guiDraggable.addDragCallback(callback);
        };

        GuiThumbstickWidget.prototype.updateGuiWidget = function() {

            this.baseWidget.typeLabel.setElementText('Drag X: '+ MATH.decimalify(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X), 100));
            this.baseWidget.typeLabel2.setElementText('Drag Y: '+ MATH.decimalify(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y), 100));
            this.baseWidget.typeLabel3.setElementText('PressIdx: '+ WorldAPI.getCom(ENUMS.BufferChannels.UI_PRESS_SOURCE));
            this.baseWidget.typeLabel4.setElementText('HoverIdx: '+ WorldAPI.getCom(ENUMS.BufferChannels.UI_HOVER_SOURCE));

            this.updateSurfaceState();
            this.guiDraggable.updateDraggable(this.baseWidget.getSurfaceElement());
        };

        GuiThumbstickWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.applyProgressDynLayout(dynLayout);
        };

        GuiThumbstickWidget.prototype.applyDynamicLayout = function(dynLayout) {
            this.baseWidget.applyDynamicLayout(dynLayout);
        };

        GuiThumbstickWidget.prototype.applyProgressDynLayout = function(dynLayout) {
            this.baseWidget.applyProgressDynLayout(dynLayout);
        };

        GuiThumbstickWidget.prototype.disableWidget = function() {
            this.baseWidget.disableWidget();
        };

        GuiThumbstickWidget.prototype.getWidgetProgressLayout = function() {
            return this.baseWidget.indicatorElement.getSurfaceLayout();
        };

        GuiThumbstickWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.baseWidget.surfaceElement.getSurfaceLayout();
        };

        GuiThumbstickWidget.prototype.setWidgetPosXY = function(x, y) {
            this.baseWidget.setWidgetPosXY(x, y);
        };

        GuiThumbstickWidget.prototype.enableWidget = function() {

        };


        return GuiThumbstickWidget;

    });