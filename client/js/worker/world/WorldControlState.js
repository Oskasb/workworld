"use strict";

define([
        'worker/world/WorldCamera',
        'ui/widgets/GuiThumbstickWidget'
    ],
    function(
        WorldCamera,
        GuiThumbstickWidget
    ) {


        var inputBuffer = [];
        var lastBuffer = [];

        var thumbstick;

        var WorldControlState = function() {
            this.worldCamera = new WorldCamera();

            thumbstick = new GuiThumbstickWidget();
        };

        WorldControlState.prototype.updateWorldControlState = function() {

            for (var i = 0; i < inputBuffer.length; i++) {

                if (inputBuffer[i] !== lastBuffer[i]) {
                //    console.log("Input Update", ENUMS.Map.InputState[i], inputBuffer[i])
                }
            }

            WorldAPI.updateUiSystem(inputBuffer, lastBuffer);
            this.storeLastBuffer();
            this.worldCamera.applyCameraComBuffer(WorldAPI.getWorldComBuffer());
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

        WorldControlState.prototype.valueFromInputBuffer = function(bufferIndex) {
            return inputBuffer[bufferIndex];
        };

        WorldControlState.prototype.enableDefaultGuiWidgets = function() {


            var stickReady = function(stick) {
                stick.enableWidget();
            };

            thumbstick.initGuiWidget(stickReady);

        };



        WorldControlState.prototype.setInputBuffer = function(buffer) {
    //        console.log("Set Input Buffer", buffer);
            inputBuffer = buffer;
            this.enableDefaultGuiWidgets()
        };

        WorldControlState.prototype.getWorldCamera = function() {
            return this.worldCamera;
        };


        return WorldControlState;

    });

