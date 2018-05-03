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

        var WorldControlState = function() {
            this.worldCamera = new WorldCamera();
            this.worldCursor = new WorldCursor();
            this.widgetLoader = new WidgetLoader();
        };

        WorldControlState.prototype.updateWorldControlState = function() {

            for (var i = 0; i < inputBuffer.length; i++) {

                if (inputBuffer[i] !== lastBuffer[i]) {
                //    console.log("Input Update", ENUMS.Map.InputState[i], inputBuffer[i])
                }
            }

            this.worldCamera.applyCameraComBuffer(WorldAPI.getWorldComBuffer());

            WorldAPI.updateUiSystem(inputBuffer, lastBuffer);

            this.worldCursor.updateWorldCursor()
            this.worldCamera.relayCamera(WorldAPI.getWorldComBuffer());
            this.storeLastBuffer();

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

            this.widgetLoader.enableDefaultGuiWidgets();

        };

        WorldControlState.prototype.setInputBuffer = function(buffer) {
    //        console.log("Set Input Buffer", buffer);
            inputBuffer = buffer;
            this.enableDefaultGuiWidgets()
            this.worldCursor.enableWorldCursor();
        };

        WorldControlState.prototype.getWorldCamera = function() {
            return this.worldCamera;
        };

        WorldControlState.prototype.getWorldCursor = function() {
            return this.worldCursor;
        };

        return WorldControlState;

    });

