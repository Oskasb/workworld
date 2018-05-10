"use strict";

define([

    ],
    function(

    ) {

    var i;

        var GuiDraggable = function(surfaceElem) {

            this.surfaceElement = surfaceElem;
            this.whileDragCallbacks = []

        };

        GuiDraggable.prototype.addDragCallback = function(callback) {
            this.whileDragCallbacks.push(callback)
        };

        GuiDraggable.prototype.callDragCallbacks = function(value) {
            for (i = 0; i < this.whileDragCallbacks.length; i++) {
                this.whileDragCallbacks[i](value);
            }
        };

        GuiDraggable.prototype.updateDraggable = function() {
            if (this.surfaceElement.getPress()) {
                this.callDragCallbacks();
            }
        };

        return GuiDraggable;

    });

