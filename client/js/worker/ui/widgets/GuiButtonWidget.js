"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiClickable',
        'ui/functions/GuiUpdatable'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiSurfaceElement,
        GuiClickable,
        GuiUpdatable
    ) {

        var count = 0;

        var GuiButtonWidget = function(label, configId) {
            count++;
            this.label = label;
            this.configId = configId || 'default';
            this.id = 'button_'+label+'_'+count;
            this.position = new THREE.Vector3();
            this.guiUpdatable = new GuiUpdatable();
            this.surfaceElement = new GuiSurfaceElement();
            this.guiClickable = new GuiClickable(this.surfaceElement);
        };

        GuiButtonWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiButtonWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);

                if (this.guiClickable.isBufferStateMatch()) {
                    this.callButtonClick(1);
                }

                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'GUI_BUTTON_WIDGET', this.configId);
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            this.surfaceElement.initSurfaceElement(surfaceReady);
        };

        GuiButtonWidget.prototype.setupTextElements = function() {
            this.header = this.surfaceElement.addSurfaceTextElement(this.configRead('label_key'), this.label);
        };

        GuiButtonWidget.prototype.setMasterBuffer = function(buffer, index, matchValue) {
            this.guiClickable.setMasterBuffer(buffer, index, matchValue);
        };

        GuiButtonWidget.prototype.callButtonClick = function(bool) {
            this.guiClickable.callClickableCallbacks(bool);
        };

        GuiButtonWidget.prototype.addButtonClickCallback = function(clickFunc) {
            this.guiClickable.addClickableCallback(clickFunc);
        };

        GuiButtonWidget.prototype.getButtonIsActive = function() {
            return this.guiClickable.isBufferStateMatch();
        };

        GuiButtonWidget.prototype.updateSurfaceState = function() {

            if (this.guiClickable.isBufferStateMatch()) {

                if (this.surfaceElement.getOn() === 0) {
                    this.callButtonClick(1);
                }

                this.surfaceElement.setOn(1);
            } else {

                if (this.surfaceElement.getOn() === 1) {
                    this.callButtonClick(0);
                }

                this.surfaceElement.setOn(0);
            }

            this.surfaceElement.updateSurfaceElement(this.position , this.configRead('surface'))
        };

        GuiButtonWidget.prototype.updateGuiWidget = function() {
            this.updateSurfaceState();
        };


        GuiButtonWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
        };

        GuiButtonWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        GuiButtonWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        GuiButtonWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        GuiButtonWidget.prototype.enableWidget = function() {
            this.setupTextElements()
        };

        return GuiButtonWidget;

    });