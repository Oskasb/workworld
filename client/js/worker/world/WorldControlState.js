"use strict";

define([

    ],
    function(

    ) {

        var WorldAPI;

        var inputBuffer;
        var lastBuffer = [];


        var WorldControlState = function(wApi) {
            WorldAPI = wApi;
        };

        WorldControlState.prototype.updateWorldControlState = function() {

            for (var i = 0; i < inputBuffer.length; i++) {

                if (inputBuffer[i] !== lastBuffer[i]) {
                    console.log("Input Update", ENUMS.Map.InputState[i], inputBuffer[i])
                }
            }

            this.storeLastBuffer();

        };

        WorldControlState.prototype.storeLastBuffer = function() {
            for (var i = 0; i < inputBuffer.length; i++) {
                lastBuffer[i] = inputBuffer[i]
            }
        };

        WorldControlState.prototype.setInputBuffer = function(buffer) {
            inputBuffer = buffer;
            this.storeLastBuffer();
        };

        return WorldControlState;

    });

