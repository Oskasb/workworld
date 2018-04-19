"use strict";

define([

    ],
    function(

    ) {



        var inputBuffer = [];
        var lastBuffer = [];


        var WorldControlState = function() {

        };


        WorldControlState.prototype.updateWorldControlState = function() {

            for (var i = 0; i < inputBuffer.length; i++) {

                if (inputBuffer[i] !== lastBuffer[i]) {
                //    console.log("Input Update", ENUMS.Map.InputState[i], inputBuffer[i])
                }

            }

            WorldAPI.updateUiSystem(inputBuffer, lastBuffer);
            this.storeLastBuffer();
        };

        WorldControlState.prototype.storeLastBuffer = function() {
            for (var i = 0; i < inputBuffer.length; i++) {
                lastBuffer[i] = inputBuffer[i]
            }
        };

        WorldControlState.prototype.frustumCoordsToView = function(coordsVector) {
            coordsVector.x *= lastBuffer[ENUMS.InputState.FRUSTUM_FACTOR] * lastBuffer[ENUMS.InputState.ASPECT];
            coordsVector.y *= lastBuffer[ENUMS.InputState.FRUSTUM_FACTOR];
        };

        WorldControlState.prototype.valueFromInputBuffer = function(bufferIndex) {
            return inputBuffer[bufferIndex];
        };

        WorldControlState.prototype.setInputBuffer = function(buffer) {
            console.log("Set Input Buffer", buffer);
            inputBuffer = buffer;
        //    this.storeLastBuffer();
        };

        return WorldControlState;

    });

