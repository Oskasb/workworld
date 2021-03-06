"use strict";

define([

    ],
    function(

    ) {

    var i;

        var GuiDraggable = function() {

            this.whileDragCallbacks = [];

            this.masterState = {buffer:[0], index:0};
        };

        GuiDraggable.prototype.addDragCallback = function(callback) {
            this.whileDragCallbacks.push(callback)
        };

        GuiDraggable.prototype.callDragCallbacks = function(value, source) {
            for (i = 0; i < this.whileDragCallbacks.length; i++) {
                this.whileDragCallbacks[i](value, source);
            }
        };

        GuiDraggable.prototype.setMasterBuffer = function(buffer, index) {
            this.masterState.buffer = buffer;
            this.masterState.index = index
        };

        GuiDraggable.prototype.getBufferState = function() {
            return this.masterState.buffer[this.masterState.index];
        };


        GuiDraggable.prototype.updateDraggable = function(surfaceElement, value, source) {
            if (surfaceElement.getPress()) {
                this.callDragCallbacks(value, source);
            }
        };

        return GuiDraggable;

    });

