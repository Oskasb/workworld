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

        var GuiDragAxisWidget = function(label, configId) {
            this.label = label;
            this.configId = configId;

            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.guiDraggable = new GuiDraggable(this.surfaceElement);

        };

        GuiDragAxisWidget.prototype.setupTextElements = function() {

            this.header = this.surfaceElement.addSurfaceTextElement('message_header', this.label);
            this.typeLabel = this.surfaceElement.addSurfaceTextElement('type_label', 'val..');
        };

        GuiDragAxisWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiDragAxisWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'GUI_DRAG_AXIS_WIDGET', this.configId);
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            this.surfaceElement.initSurfaceElement(surfaceReady);
        };


        GuiDragAxisWidget.prototype.addDragCallback = function(callback) {
            this.guiDraggable.addDragCallback(callback);
        };


        GuiDragAxisWidget.prototype.setMasterBuffer = function(buffer, index) {
            this.guiDraggable.setMasterBuffer(buffer, index);
        };


        GuiDragAxisWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position, this.configObject.getConfigByDataKey('surface'))
        };


        GuiDragAxisWidget.prototype.updateGuiWidget = function() {

            this.guiDraggable.updateDraggable();
            this.typeLabel.setElementText(MATH.decimalify(this.guiDraggable.getBufferState(), 100));
            this.updateSurfaceState();
        };


        GuiDragAxisWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        GuiDragAxisWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
        };

        GuiDragAxisWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        GuiDragAxisWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        GuiDragAxisWidget.prototype.enableWidget = function() {
            this.setupTextElements();
        };


        return GuiDragAxisWidget;

    });