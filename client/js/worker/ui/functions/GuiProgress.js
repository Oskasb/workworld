"use strict";

define([

    ],
    function(

    ) {

    var i;

        var GuiProgress = function(surfaceElem) {
            this.surfaceElement = surfaceElem;
            this.progressCallbacks = [];
            this.masterState = {buffer:[0], index:0};
        };

        GuiProgress.prototype.addProgressCallback = function(callback) {
            this.progressCallbacks.push(callback)
        };

        GuiProgress.prototype.callProgressCallbacks = function(value) {
            for (i = 0; i < this.progressCallbacks.length; i++) {
                this.progressCallbacks[i](value);
            }
        };

        GuiProgress.prototype.setMasterBuffer = function(buffer, index) {
            this.masterState.buffer = buffer;
            this.masterState.index = index
        };

        GuiProgress.prototype.getBufferState = function() {
            return this.masterState.buffer[this.masterState.index];
        };

        GuiProgress.prototype.applyCompleted = function() {
            this.masterState.buffer[this.masterState.index] = 0;
        };

        GuiProgress.prototype.updateProgress = function() {
        //    return;   this.callProgressCallbacks(Math.random());
            if (this.getBufferState()) {
                this.callProgressCallbacks(this.getBufferState());
            }
        };

        return GuiProgress;

    });

