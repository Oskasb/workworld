"use strict";

define([
    'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/elements/GuiCrossElement'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiSurfaceElement,
        GuiCrossElement
    ) {

        var GuiHoverDynamic = function(label, configId) {
            this.label = label;
            this.configId = configId;

            this.isActive = false;

            this.hoverTimeStart = 0;

            this.currentHover = null;

            this.dynamicLayout = {
                width:0.1,
                height:0.1
            };

            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();

            this.crossElement = new GuiCrossElement();

        };

        GuiHoverDynamic.prototype.setupTextElements = function() {

        //    this.header = this.surfaceElement.addSurfaceTextElement('message_header', this.label);
        //    this.typeLabel = this.surfaceElement.addSurfaceTextElement('type_label', '');
        };

        GuiHoverDynamic.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        GuiHoverDynamic.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                this.setupTextElements();
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', 'GUI_HOVER_DYNAMIC', this.configId);
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            var crossRdy = function() {
                this.surfaceElement.initSurfaceElement(surfaceReady);
            }.bind(this);

            this.crossElement.initCrossElement(crossRdy);
            this.samplePointer = false;
        };

        GuiHoverDynamic.prototype.updateSurfaceState = function() {
            this.surfaceElement.updateSurfaceElement(this.position, this.configObject.getConfigByDataKey('surface'));
            this.crossElement.updateCrossElement(this.position, this.configObject.getConfigByDataKey('cross'))
        };

        var timeNow;
        var timeScale;
        var elapsed;

        GuiHoverDynamic.prototype.updateGuiWidget = function() {

            this.currentHover = WorldAPI.getDynamicHover();


            if (this.currentHover) {

                this.crossElement.setOn(1);
                this.crossElement.hover = true;

                timeNow = WorldAPI.getCom(ENUMS.BufferChannels.FRAME_RENDER_TIME);

                if (this.surfaceElement.hover || this.surfaceElement.press) {

                    if (!this.isActive) {
                        this.hoverTimeStart = timeNow;
                        this.isActive = true;
                    }

                    elapsed = timeNow - this.hoverTimeStart;
                    timeScale = MATH.valueFromCurve(elapsed*3, MATH.curves.oneToZero)*0.5 + (1 - Math.sin(elapsed*5)*0.1);

                } else {
                    this.isActive = false;
                    timeScale = 1 - Math.sin(elapsed*4)*0.14
                }

                if (this.surfaceElement.press) {
                    timeScale += 1;
                }


                this.setWidgetPosXY(this.currentHover.screenPos.x, this.currentHover.screenPos.y);

                this.dynamicLayout.height = (this.currentHover.selectSize * timeScale) / this.currentHover.cameraDistance;
                this.dynamicLayout.width = (this.currentHover.selectSize * timeScale) / this.currentHover.cameraDistance;

                this.applyDynamicLayout(this.dynamicLayout);
                this.updateSurfaceState();

            } else {

                this.crossElement.hover = false;

                if (!this.surfaceElement.disabled) {
                    this.disableWidget();
                    this.isActive = false;
                }
            }

        };


        GuiHoverDynamic.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        GuiHoverDynamic.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
            this.crossElement.disableCrossElement();
        };

        GuiHoverDynamic.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        GuiHoverDynamic.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        GuiHoverDynamic.prototype.enableWidget = function() {

        };

        return GuiHoverDynamic;
    });