"use strict";

define([
        'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiUpdatable'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiSurfaceElement,
        GuiUpdatable
    ) {

        var i;

        var count = 0;

        var GuiButtonWidget = function(label, configId) {
            count++;
            this.label = label;
            this.configId = configId || 'default';
            this.id = 'button_'+label+'_'+count;
            this.position = new THREE.Vector3();
            this.guiUpdatable = new GuiUpdatable();
            this.surfaceElement = new GuiSurfaceElement();

            this.masterState = {buffer:[0], index:0, match:1};

            var acceptClick = false;

            var onButtonHover = function()  {
                acceptClick = false;
            };

            var onButtonRelease = function(active)  {
                console.log("Button Release", active);
                if (acceptClick) {
                    this.flipButtonState();
                    if (this.getBufferState() === this.masterState.match) {
                        this.surfaceElement.setOn(1);
                    } else {
                        this.surfaceElement.setOn(0);
                    }
                    this.callButtonClick(this.getBufferState())
                }
                acceptClick = false;
            }.bind(this);

            var onButtonPress = function(active)  {
                if (active) {
                    acceptClick = true;
                }
            };

            this.surfaceElement.addSurfaceHoverCallback(onButtonHover);
            this.surfaceElement.addSurfaceReleaseCallback(onButtonRelease);
            this.surfaceElement.addSurfacePressCallback(onButtonPress);
            this.clickCallbacks = []
        };

        GuiButtonWidget.prototype.setMasterBuffer = function(buffer, index, matchValue) {
            this.masterState.buffer = buffer;
            this.masterState.index = index;
            this.masterState.match = matchValue || 1;
        };

        GuiButtonWidget.prototype.getBufferState = function() {
                return this.masterState.buffer[this.masterState.index];
        };

        GuiButtonWidget.prototype.flipButtonState = function() {
            if (this.masterState.buffer[this.masterState.index] === this.masterState.match) {
                this.setBufferState(0);
            } else {
                this.setBufferState(this.masterState.match);
            }
        };

        GuiButtonWidget.prototype.setBufferState = function(value) {
            this.masterState.buffer[this.masterState.index] = value;
        };

        GuiButtonWidget.prototype.setupTextElements = function() {
            this.header = this.surfaceElement.addSurfaceTextElement(this.configRead('label_key'), this.label);
        };

        GuiButtonWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);

                if (this.getBufferState() === this.masterState.match) {
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

        GuiButtonWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiButtonWidget.prototype.updateSurfaceState = function() {

            if (this.getBufferState() === this.masterState.match) {

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

        GuiButtonWidget.prototype.getMatch = function() {
            return this.masterState.match;
        };

        GuiButtonWidget.prototype.updateGuiWidget = function() {
            this.updateSurfaceState();
        };

        GuiButtonWidget.prototype.callButtonClick = function(bool) {
            for (i = 0; i < this.clickCallbacks.length; i++) {
                this.clickCallbacks[i](bool);
            }
        };

        GuiButtonWidget.prototype.addButtonClickCallback = function(clickFunc) {
            this.clickCallbacks.push(clickFunc);
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