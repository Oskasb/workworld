"use strict";

define([
        'ConfigObject',
        'ui/elements/GuiSurfaceElement',
        'ui/functions/GuiUpdatable'
    ],
    function(
        ConfigObject,
        GuiSurfaceElement,
        GuiUpdatable
    ) {

        var GuiThumbstickWidget = function() {

            this.guiUpdatable = new GuiUpdatable();

            this.position = new THREE.Vector3();
            this.surfaceElement = new GuiSurfaceElement();
            this.callbacks = [];

            this.lookVec = new THREE.Vector3();
            this.sourceVec = new THREE.Vector3();

        };

        GuiThumbstickWidget.prototype.setupTextElements = function() {

            this.header = this.surfaceElement.addSurfaceTextElement('header', 'Header');
            this.typeLabel = this.surfaceElement.addSurfaceTextElement('type_label', 'Type Label');
            this.typeLabel2 = this.surfaceElement.addSurfaceTextElement('type_label', 'Type Label');
            this.typeLabel.setTextOffsetY(this.typeLabel.getTextEffectSize() * 0.2);
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

        var lookAt = new THREE.Vector3();

        GuiThumbstickWidget.prototype.updateGuiWidget = function() {


            this.header.setElementText('STEER');
            this.typeLabel.setElementText('Drag X: '+ MATH.decimalify(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X), 100));
            this.typeLabel2.setElementText('Drag Y: '+ MATH.decimalify(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y), 100));

            this.updateSurfaceState();

            if (this.surfaceElement.getPress()) {

                this.lookVec.x = MATH.clamp(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X) * 5, -2, 2);
                this.lookVec.y = MATH.clamp(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y) * 5, -2, 2);
                this.lookVec.z = 0;
                this.lookVec.applyQuaternion(WorldAPI.getWorldCamera().getCamera().quaternion);

                lookAt.addVectors(WorldAPI.getWorldCamera().getCameraLookAt(), this.lookVec);
                WorldAPI.getWorldCamera().setLookAtVec(lookAt);

            } else {

                this.sourceVec.x = MATH.clamp(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_X) * 5, -2, 2);
                this.sourceVec.y = 0;
                this.sourceVec.z = 0;

                this.sourceVec.applyQuaternion(WorldAPI.getWorldCamera().getCamera().quaternion);
                this.sourceVec.y = MATH.clamp(WorldAPI.sampleInputBuffer(ENUMS.InputState.DRAG_DISTANCE_Y) * 5, -2, 2);

                WorldAPI.getWorldCamera().getCamera().position.x += this.sourceVec.x;
                WorldAPI.getWorldCamera().getCamera().position.y += this.sourceVec.y;
                WorldAPI.getWorldCamera().getCamera().position.z += this.sourceVec.z;
            }

            WorldAPI.getWorldCamera().updateCameraLookAt();
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