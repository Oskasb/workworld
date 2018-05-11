"use strict";

define([
        'PipelineAPI',
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiMessageFunctions'
    ],
    function(
        PipelineAPI,
        ConfigObject,
        GuiSurfaceElement,
        GuiMessageFunctions
    ) {

        var i;

        var MessageBoxWidget = function(label, category, key) {
            this.label = label;
            this.category = category;
            this.key = key;
            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();

            this.guiMessageFunctions = new GuiMessageFunctions(7, 5000);

            this.guiMessageFunctions.registerMessageChannel(category, key);

            this.surfaceElement.setSamplePointer(false);
            this.surfaceElement.setOn(true);

            this.textFields = [];
            this.valueFields = [];

        };

        MessageBoxWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        MessageBoxWidget.prototype.setupTextElements = function() {

            var txtRdy = function(elem) {
                if (this.header) {
                    this.header.disableTextElement();
                }
                this.header = elem;
            }.bind(this);

            this.header = this.surfaceElement.addSurfaceTextElement(this.configRead('header'), this.label, txtRdy);

        };

        MessageBoxWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'MESSAGE_BOX_WIDGET', 'config');
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            this.surfaceElement.initSurfaceElement(surfaceReady);
        };



        MessageBoxWidget.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position ,this.configRead('surface'))
        };


        MessageBoxWidget.prototype.updateWidgetDataField = function(index, dataField) {

            if (!this.textFields[index]) {
                this.textFields[index] = this.surfaceElement.addSurfaceTextElement('message_key', dataField.key);
                this.valueFields[index] = this.surfaceElement.addSurfaceTextElement('message_value', dataField.value);

                this.getWidgetSurfaceLayout().setDynamicLayout('height', 0.05 + this.textFields.length * this.textFields[index].getTextEffectSize() * 0.21)

            } else if (dataField.dirty) {
                this.valueFields[index].setElementText(dataField.value);
            }

            this.textFields[index].setTextOffsetY(index * this.textFields[index].getTextEffectSize() * 2);
            this.valueFields[index].setTextOffsetY(index * this.textFields[index].getTextEffectSize() * 2)

        };

        MessageBoxWidget.prototype.updateWidgetDataFields = function(dataFields) {

            for (i = 0; i < dataFields.length; i++) {
                this.updateWidgetDataField(i, dataFields[i])
            }
        };

        MessageBoxWidget.prototype.updateGuiWidget = function() {
            var renderStatus = PipelineAPI.readCachedConfigKey(this.category, this.key);
            this.updateSurfaceState();

            if (Math.random() < 0.05) {
                  WorldAPI.addTextMessage('msg. '+Math.random()+' .hellow... '+Math.random())
            }

            this.guiMessageFunctions.updateMessageChannels();
            this.updateWidgetDataFields(renderStatus.view)
        };

        MessageBoxWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
        };

        MessageBoxWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        MessageBoxWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        MessageBoxWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
            this.position.z = -1;
        };

        MessageBoxWidget.prototype.enableWidget = function() {
            this.setupTextElements()
        };

        return MessageBoxWidget;

    });