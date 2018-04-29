"use strict";

define([
    'GuiAPI',
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/elements/EffectList'
    ],
    function(
        GuiAPI,
        ConfigObject,
        GuiSurfaceElement,
        EffectList
    ) {

        var GuiThumbstickWidget = function() {

            this.obj3d = new THREE.Object3D();
            this.surfaceElement = new GuiSurfaceElement();
            this.arrowEffects = new EffectList();
            this.callbacks = [];
        };


        GuiThumbstickWidget.prototype.initGuiWidget = function(onReadyCB) {

            var configLoaded = function() {
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

        GuiThumbstickWidget.prototype.updateSurfaceState = function(fromVec, toVec) {

            this.surfaceElement.updateSurfaceElement(this.configObject.getConfigByDataKey('surface'))

        };


        GuiThumbstickWidget.prototype.updateGuiWidget = function() {

            this.updateSurfaceState();

        };


        GuiThumbstickWidget.prototype.disableWidget = function() {

            while (this.callbacks.length) {
                GuiAPI.removeGuiUpdateCallback(this.callbacks.pop())
            }

        };

        GuiThumbstickWidget.prototype.enableWidget = function() {

            var cb = function() {
                this.updateGuiWidget();
            }.bind(this);

            GuiAPI.addGuiUpdateCallback(cb);
            this.callbacks.push(cb);
        };


        return GuiThumbstickWidget;

    });