"use strict";

define([
        'PipelineAPI',
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiUpdatable'
    ],
    function(
        PipelineAPI,
        ConfigObject,
        GuiSurfaceElement,
        GuiUpdatable
    ) {

var i;

        var MonitorListWidget = function(label, category, key) {
            this.label = label;
            this.category = category;
            this.key = key;
            this.position = new THREE.Vector3();
            this.guiUpdatable = new GuiUpdatable();
            this.surfaceElement = new GuiSurfaceElement();

            this.surfaceElement.setSamplePointer(false);
            this.surfaceElement.setOn(true);

            this.textFields = [];
            this.valueFields = [];

        };

        MonitorListWidget.prototype.setupTextElements = function() {

            var txtRdy = function(elem) {
                this.header = elem;
            }.bind(this);

            this.header = this.surfaceElement.addSurfaceTextElement('list_header', this.label, txtRdy);

        };

        MonitorListWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'MONITOR_LIST_WIDGET', 'config');
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            this.surfaceElement.initSurfaceElement(surfaceReady);
        };

        MonitorListWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        MonitorListWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position ,this.configObject.getConfigByDataKey('surface'))
        };


        MonitorListWidget.prototype.updateWidgetDataField = function(index, dataField) {

            if (!this.textFields[index]) {
                this.textFields[index] = this.surfaceElement.addSurfaceTextElement('list_key', dataField.key);
                this.valueFields[index] = this.surfaceElement.addSurfaceTextElement('list_value', dataField.value);

                this.getWidgetSurfaceLayout().setDynamicLayout('height', 0.055 + this.textFields.length * this.textFields[index].getTextEffectSize() * 0.2)

            } else if (dataField.dirty || false) {
                this.valueFields[index].setElementText(dataField.value);
            }

            this.textFields[index].setTextOffsetY(-index * this.textFields[index].getTextEffectSize() * 2);
            this.valueFields[index].setTextOffsetY(-index * this.textFields[index].getTextEffectSize() * 2)

        };

        MonitorListWidget.prototype.updateWidgetDataFields = function(dataFields) {

            for (i = 0; i < dataFields.length; i++) {
                this.updateWidgetDataField(i, dataFields[i])
            }
        };

        MonitorListWidget.prototype.updateGuiWidget = function() {
            var renderStatus = PipelineAPI.readCachedConfigKey(this.category, this.key);
            this.updateSurfaceState();
            this.updateWidgetDataFields(renderStatus)
        };

        MonitorListWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
        };

        MonitorListWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        MonitorListWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
            this.position.z = -1;
        };

        MonitorListWidget.prototype.enableWidget = function() {
            this.setupTextElements()
        };

        return MonitorListWidget;

    });