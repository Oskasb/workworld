"use strict";

define([

    ],
    function(

    ) {

    var i;

        var GuiClickable = function(surfaceElem) {

            this.surfaceElement = surfaceElem;

            var acceptClick = false;

            this.masterState = {buffer:[0], index:0, match:1};
            var onButtonHover = function()  {
                acceptClick = false;
            };

            var onButtonRelease = function(active)  {
                console.log("Button Release", active);
                if (acceptClick) {
                    this.flipBufferState();
                    if (this.getBufferState() === this.masterState.match) {
                        this.surfaceElement.setOn(1);
                    } else {
                        this.surfaceElement.setOn(0);
                    }
                    this.callClickableCallbacks(this.getBufferState())
                }
                acceptClick = false;
            }.bind(this);

            var onButtonPress = function(active)  {
                if (active) {
                    acceptClick = true;
                }
            };

            this.surfaceElement.addSurfaceHoverCallback(onButtonHover);
            this.surfaceElement.addSurfaceReleaseCallback(onButtonRelease);
            this.surfaceElement.addSurfacePressCallback(onButtonPress);
            this.clickCallbacks = []

        };

        GuiClickable.prototype.callClickableCallbacks = function(value) {
            for (i = 0; i < this.clickCallbacks.length; i++) {
                this.clickCallbacks[i](value);
            }
        };

        GuiClickable.prototype.addClickableCallback = function(clickFunc) {
            this.clickCallbacks.push(clickFunc);
        };

        GuiClickable.prototype.setMasterBuffer = function(buffer, index, matchValue) {
            this.masterState.buffer = buffer;
            this.masterState.index = index;
            this.masterState.match = matchValue || 1;
        };

        GuiClickable.prototype.getBufferState = function() {
            return this.masterState.buffer[this.masterState.index];
        };

        GuiClickable.prototype.flipBufferState = function() {
            if (this.masterState.buffer[this.masterState.index] === this.masterState.match) {
                this.setBufferState(0);
            } else {
                this.setBufferState(this.masterState.match);
            }
        };

        GuiClickable.prototype.isBufferStateMatch = function() {
            return this.getBufferState() === this.getBufferMatch();
        };

        GuiClickable.prototype.getBufferMatch = function() {
            return this.masterState.match;
        };

        GuiClickable.prototype.setBufferState = function(value) {
            this.masterState.buffer[this.masterState.index] = value
        };

        return GuiClickable;

    });

