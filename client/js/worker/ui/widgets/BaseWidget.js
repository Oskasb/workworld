"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement
    ) {

        var BaseWidget = function(label, configId) {
            this.label = label;
            this.configId = configId;
            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.indicatorElement = new GuiSurfaceElement();

            this.stateLayout = {};
        };


        BaseWidget.prototype.setupTextElements = function() {

            this.header = this.surfaceElement.addSurfaceTextElement(this.configRead('header_label'), this.label);
            this.typeLabel = this.surfaceElement.addSurfaceTextElement(this.configRead('value_label'), '');
        };

        BaseWidget.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        BaseWidget.prototype.initBaseWidget = function(dataKey, onReadyCB) {

            var configLoaded = function() {
                this.configObject.removeCallback(configLoaded);
                this.setupTextElements();
                onReadyCB(this);
            }.bind(this);

            var surfaceReady = function() {
                this.configObject = new ConfigObject('GUI_WIDGETS', dataKey, this.configId);
                this.configObject.addCallback(configLoaded);
            }.bind(this);

            var progressReady = function() {
                this.surfaceElement.initSurfaceElement(surfaceReady);
            }.bind(this);

            this.indicatorElement.initSurfaceElement(progressReady);

        };

        BaseWidget.prototype.setLabelText = function(text) {
            this.typeLabel.setElementText(text);
        };

        BaseWidget.prototype.addUpdateCallback = function(callback) {
            this.guiProgress.addProgressCallback(callback);
        };

        BaseWidget.prototype.setMasterBuffer = function(buffer, index) {
            this.guiProgress.setMasterBuffer(buffer, index);
        };

        BaseWidget.prototype.updateSurfaceState = function(container, indicator) {
            this.surfaceElement.updateSurfaceElement(this.position, this.configRead(container));
            this.indicatorElement.updateSurfaceElement(this.position, this.configRead(indicator))
        };

        var height;
        var width;
        var layout;
        var axis;
        var posx;

        var surfaceLayout;

        BaseWidget.prototype.indicateYawState = function(state, parentId, targetId) {

            layout = this.getWidgetSurfaceLayout().layout;

            posx = 0.9*state/MATH.TWO_PI + 0.5;
            //    var state =Math.abs( Math.sin(new Date().getTime() * 0.01) )// * Math.PI;
        //    posx =Math.abs( Math.sin(new Date().getTime() * 0.003) )// * Math.PI;
            width = layout.width // this.getWidgetSurfaceWidth();
            this.stateLayout.margin_x = layout.margin_x + width * posx / WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT) - 0.0005;

            this.header.setTextOffsetX(this.getWidgetSurfaceWidth() * posx);

            this.applyProgressDynLayout(this.stateLayout);
        };

        BaseWidget.prototype.indicatePitchState = function(state, parentId, targetId) {

            layout = this.configRead(parentId).layout;
            height = layout.height*0.5 - state * layout.height * 0.5 / Math.PI;

            this.stateLayout.height = -height;
            this.stateLayout.margin_y = layout.margin_y - this.stateLayout.height + layout.height * 0.5;

            this.applyProgressDynLayout(this.stateLayout);
        };

        var stateConfig;
        var progressconfig;
        var min;
        var max;
        var offset;
        var anchor;

        var span;
        var factor;
        var value;

        var calcSpan = function(value, offset, total) {
            return value * total + total*0.0// * value // (((value*(1-offset))+offset) + total*offset)
        }

        BaseWidget.prototype.indicateStateProgress = function(state, parentId, targetId) {

            if (!state) {
                this.indicatorElement.setOn(0);
                this.updateSurfaceState(parentId, targetId);
                return;
            }

           // state = Math.abs(Math.sin( new Date().getTime() * 0.005 ))

            stateConfig = this.configRead(targetId);
            progressconfig = stateConfig.progress;
            axis = progressconfig.axis;

            min = progressconfig.min;
            max = progressconfig.max;
            offset = progressconfig.offset;
            anchor = progressconfig.anchor;
            factor = progressconfig.factor;

            this.indicatorElement.setOn(1);

            value = MATH.clamp( factor*state / (max-min) , min, max) ;

            if (axis[0]) {

                layout =  this.getWidgetSurfaceLayout().layout;
                span = - value * layout.width * 1;

                if (anchor) {

                    this.stateLayout.width = span * 2 / WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT)// + layout.height * offset  ;
                    this.stateLayout.margin_x = layout.margin_x + layout.width * offset / WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT)

                } else {

                    this.stateLayout.width = -this.configRead(targetId).layout.width // + layout.height * offset  ;
                    this.stateLayout.margin_x = layout.margin_x + layout.width * offset / WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT) + span / WorldAPI.sampleInputBuffer(ENUMS.InputState.ASPECT) //  - this.stateLayout.width *0.5 + layout.width * (offset);// * (1-offset);

                }


            } else {
                layout = this.configRead(parentId).layout;
                span = - value * layout.height;

                if (anchor) {
                    this.stateLayout.height = span // + layout.height * offset  ;
                    this.stateLayout.margin_y = layout.margin_y - span + layout.height * 0.5 + layout.height * (offset);
                } else {
                    this.stateLayout.height = -this.configRead(targetId).layout.height // + layout.height * offset  ;
                    this.stateLayout.margin_y = layout.margin_y + layout.height * 0.5 - span - this.stateLayout.height *0.5 + layout.height * (offset);// * (1-offset);
                }

            }

            this.applyProgressDynLayout(this.stateLayout);
        };

        BaseWidget.prototype.indicateControlState = function(state, parentId, targetId) {


            if (!state) {
                this.indicatorElement.setOn(0);
                this.updateSurfaceState(parentId, targetId);
                return;
            }
            axis = this.configRead(targetId).axis;
            this.indicatorElement.setOn(1);

            surfaceLayout =  this.getWidgetSurfaceLayout().layout;

            layout = surfaceLayout // this.configRead(parentId).layout;

            if (axis[0]) {
                this.indicatorElement.setBackplateRotation(0, 0, Math.PI);
                //   this.stateLayout.width = layout.height*0.5
                this.stateLayout.width = 0.004;
                this.stateLayout.margin_x = layout.margin_x+layout.width * 0.5 - state * layout.width * 0.5 * axis[1] - 0.002;
            } else {
                this.stateLayout.height = state * layout.height * 0.5  * axis[1];
                this.stateLayout.margin_y = layout.margin_y+layout.height * 0.5;
            }

            this.applyProgressDynLayout(this.stateLayout);
            this.updateSurfaceState(parentId, targetId);

        };

        BaseWidget.prototype.indicateToggleProgress = function(state, parentId, targetId) {
            axis = this.configRead(targetId).axis;


            if (!state) {
                this.indicatorElement.setOn(0);
                this.updateSurfaceState(parentId, targetId);
                return;
            }

            this.indicatorElement.setOn(1);

            surfaceLayout =  this.getWidgetSurfaceLayout().layout;

            layout = surfaceLayout // this.configRead(parentId).layout;

            if (axis[0]) {
                this.indicatorElement.setBackplateRotation(0, 0, Math.PI);
                //   this.stateLayout.width = layout.height*0.5
                this.stateLayout.width = 0.004;
                this.stateLayout.margin_x = layout.margin_x+layout.width - state * layout.width * axis[1] - 0.002;
            } else {
                this.stateLayout.height = state * layout.height * axis[1];
                this.stateLayout.margin_y = layout.margin_y+layout.height * 0;
            }

            this.applyProgressDynLayout(this.stateLayout);
            this.updateSurfaceState(parentId, targetId);

        };

        BaseWidget.prototype.applyDynamicLayout = function(dynLayout) {
            if (!dynLayout) return;
            for (var key in dynLayout) {
                this.getWidgetSurfaceLayout().setDynamicLayout(key, dynLayout[key])
            }
            this.applyProgressDynLayout(dynLayout);
        };

        BaseWidget.prototype.applyProgressDynLayout = function(dynLayout) {
            for (var key in dynLayout) {
                this.getWidgetProgressLayout().setDynamicLayout(key, dynLayout[key])
            }
        };

        BaseWidget.prototype.setWidgetOn = function(bool) {
            this.surfaceElement.setOn(bool);
            this.indicatorElement.setOn(bool);
        };

        BaseWidget.prototype.getSurfaceElement = function() {
            return this.surfaceElement;
        };
        BaseWidget.prototype.disableWidget = function() {
            this.surfaceElement.disableSurfaceElement();
            this.indicatorElement.disableSurfaceElement();
        };

        BaseWidget.prototype.getWidgetProgressLayout = function() {
            return this.indicatorElement.getSurfaceLayout();
        };

        BaseWidget.prototype.getWidgetSurfaceLayout = function() {
            return this.surfaceElement.getSurfaceLayout();
        };

        BaseWidget.prototype.getWidgetSurfaceWidth = function() {
            return this.surfaceElement.getSurfaceLayout().getLayoutWidth();
        };

        BaseWidget.prototype.setIndicatorQuaternion = function(quat) {
            this.indicatorElement.setSurfaceQuaternion(quat);
        };

        BaseWidget.prototype.setWidgetPosXY = function(x, y) {
            this.position.x = x;
            this.position.y = y;
        };

        BaseWidget.prototype.enableWidget = function() {

        };

        return BaseWidget;

    });