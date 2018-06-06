"use strict";

define([
        'worker/world/WorldCamera',
        'worker/world/WorldCursor',
        'ui/widgets/WidgetLoader'
    ],
    function(
        WorldCamera,
        WorldCursor,
        WidgetLoader
    ) {

        var inputBuffer = [];
        var lastBuffer = [];
        var activeControls = [];

        var WorldControlState = function() {

            this.controlledRenderable = null;

            this.worldCamera = new WorldCamera();
            this.worldCursor = new WorldCursor();
            this.widgetLoader = new WidgetLoader();
        };

        WorldControlState.prototype.updateWorldControlState = function() {

            for (var i = 0; i < activeControls.length; i++) {
                activeControls[i].updateControl();
            }

            if (this.controlledRenderable) {
                this.controlledRenderable.calculateCameraLook(this.getWorldCamera().getCameraLookAt())
            }

            this.storeLastBuffer();
        };

        WorldControlState.prototype.setControlledRenderable = function(ren) {
            this.controlledRenderable = ren;
        };

        WorldControlState.prototype.getControlledRenderable = function() {
            return this.controlledRenderable;
        };

        WorldControlState.prototype.buildControlWidget = function(config, store) {
            this.widgetLoader.loadWidgetConfig(config, store);
        };

        WorldControlState.prototype.enableWidgetList = function(store) {
            this.widgetLoader.enableWidgetList(store);
        };

        WorldControlState.prototype.removeWidgetList = function(store) {
            this.widgetLoader.disableWidgetList(store);
        };

        WorldControlState.prototype.storeLastBuffer = function() {
            for (var i = 0; i < inputBuffer.length; i++) {
                lastBuffer[i] = inputBuffer[i]
            }
        };

        WorldControlState.prototype.frustumCoordsToView = function(coordsVector) {
            coordsVector.x *= inputBuffer[ENUMS.InputState.FRUSTUM_FACTOR] * inputBuffer[ENUMS.InputState.ASPECT];
            coordsVector.y *= inputBuffer[ENUMS.InputState.FRUSTUM_FACTOR];
        };

        WorldControlState.prototype.getControlInputBuffer = function() {
            return inputBuffer;
        };


        WorldControlState.prototype.valueFromInputBuffer = function(bufferIndex) {
            return inputBuffer[bufferIndex];
        };

        WorldControlState.prototype.enableDefaultGuiWidgets = function() {
            this.widgetLoader.enableDefaultGuiWidgets();
        };

        WorldControlState.prototype.setInputBuffer = function(buffer) {
            //        console.log("Set Input Buffer", buffer);
            inputBuffer = buffer;
            this.enableDefaultGuiWidgets();
            this.activateWorldCursor();
        };

        WorldControlState.prototype.activateWorldCursor = function() {
            this.activateControl(this.worldCursor)
        };

        WorldControlState.prototype.activateControl = function(control) {

            var onReady = function(ctrl) {
                if (activeControls.indexOf(ctrl) !== -1) {
                    WorldAPI.addTextMessage('Same Control Re-register...');
                    return;
                }
                activeControls.push(ctrl);
            };
            control.enableControl(onReady)
        };

        WorldControlState.prototype.getWorldCamera = function() {
            return this.worldCamera;
        };

        WorldControlState.prototype.disableActiveControls = function() {
            while (activeControls.length) {
                activeControls.pop().disableControl();
            }

            if (this.getControlledRenderable()) {
                this.getControlledRenderable().setIsControlled(0);
                this.getControlledRenderable().getGamePiece().deactivatePieceControls();
            }

        };

        WorldControlState.prototype.getActiveControlPosQuat = function(vec3, quat) {

            for (var i = 0; i < activeControls.length; i++) {
                if (vec3) {
                    activeControls[i].getControlPosition(vec3);
                }
                if (quat) {
                    activeControls[i].getControlQuaternion(quat);
                }
            }


        };

        WorldControlState.prototype.setActiveControlPosQuat = function(vec3, quat) {

            for (var i = 0; i < activeControls.length; i++) {

                if (vec3) {
                    activeControls[i].setControlPosition(vec3);
                }
                if (quat) {
                    activeControls[i].setControlQuaternion(quat);
                }
            }
        };

        return WorldControlState;

    });

