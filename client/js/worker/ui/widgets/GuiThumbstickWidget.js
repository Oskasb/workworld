"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiDraggable'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement,
        GuiDraggable
    ) {

        var GuiThumbstickWidget = function() {

            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.guiDraggable = new GuiDraggable(this.surfaceElement);

        };

        GuiThumbstickWidget.prototype.setupTextElements = function() {

            this.header = this.surfaceElement.addSurfaceTextElement('header', 'Header');
            this.typeLabel = this.surfaceElement.addSurfaceTextElement('type_label', 'Type Label');
            this.typeLabel2 = this.surfaceElement.addSurfaceTextElement('type_label', 'Type Label');
            this.typeLabel.setTextOffsetY(this.typeLabel.getTextEffectSize() * 0.2);
            this.typeLabel3 = this.surfaceElement.addSurfaceTextElement('type_label', 'Type Label');
            this.typeLabel3.setTextOffsetY(this.typeLabel.getTextEffectSize() * 0.4);
        };


        GuiThumbstickWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'GUI_THUMBSTICK_WIDGET', 'config');
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            this.surfaceElement.initSurfaceElement(surfaceReady);
        };

        GuiThumbstickWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiThumbstickWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position, this.configObject.getConfigByDataKey('surface'))
        };

        GuiThumbstickWidget.prototype.addDragCallback = function(callback) {
            this.guiDraggable.addDragCallback(callback);
        };

        GuiThumbstickWidget.prototype.updateGuiWidget = function() {

            this.header.setElementText('STEER');
            this.typeLabel.setElementText('Drag X: '+ MATH.decimalify(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X), 100));
            this.typeLabel2.setElementText('Drag Y: '+ MATH.decimalify(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y), 100));
            this.typeLabel3.setElementText('PressIdx: '+ WorldAPI.getCom(ENUMS.BufferChannels.UI_PRESS_SOURCE));

            this.updateSurfaceState();
            this.guiDraggable.updateDraggable();
        };

        GuiThumbstickWidget.prototype.setGuiWidgetPosition = function(posVec) {
            this.position.copy(posVec);
            this.updateSurfaceState();
        };

        GuiThumbstickWidget.prototype.addWidgetText = function(text) {
            this.header = this.surfaceElement.addSurfaceTextElement('header' ,text);
        };

        GuiThumbstickWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
        };

        GuiThumbstickWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        GuiThumbstickWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        GuiThumbstickWidget.prototype.enableWidget = function() {
            this.setupTextElements();
        };


        return GuiThumbstickWidget;

    });