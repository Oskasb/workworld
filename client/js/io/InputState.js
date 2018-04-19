"use strict";

define([
        'io/ElementListeners',
        'Events'
    ],
    function(
        ElementListeners,
        evt
    ) {

    var POINTER_STATE = {};


        var InputState = function() {

            POINTER_STATE.line = {
                up:0,
                fromX:0,
                fromY:0,
                toX:0,
                toY:0,
                w: 0,
                zrot:0
            };

            POINTER_STATE.mouseState = {
                x:0,
                y:0,
                dx:0,
                dy:0,
                wheelDelta:0,
                startDrag:[0, 0],
                dragDistance:[0, 0],
                action:[0, 0],
                lastAction:[0, 0],
                pressFrames:0
            };
            POINTER_STATE.buffer = [];

            this.line = POINTER_STATE.line;
            this.mouseState = POINTER_STATE.mouseState;

            this.elementListeners = new ElementListeners();
        };

        var minLine = 5;

        InputState.prototype.setLine = function(x1, y1, x2, y2, distance, zrot) {
            this.line.up = y2-y1;
            this.line.fromX = x1;
            this.line.fromY=y1;
            this.line.toX = x2;
            this.line.toY = y2;
            this.line.w = distance+0.4;
            if (this.line.w < minLine) zrot = 0.00001;
            this.line.zrot = zrot;
        };

        InputState.prototype.getLine = function() {
            return this.line;
        };

        InputState.prototype.setuoUpdateCallback = function(cb) {
            this.elementListeners.attachUpdateCallback(cb);
        };

        InputState.prototype.getPointerState = function() {
            return POINTER_STATE;
        };

        InputState.prototype.processDragState = function() {

            this.mouseState.dragDistance[0] = this.mouseState.startDrag[0] - this.mouseState.x;
            this.mouseState.dragDistance[1] = this.mouseState.startDrag[1] - this.mouseState.y;
        };

        InputState.prototype.updateInputState = function() {
            this.mouseState.lastAction[0] = this.mouseState.action[0];
            this.mouseState.lastAction[1] = this.mouseState.action[1];

            this.elementListeners.sampleMouseState(this.mouseState);

            if (this.mouseState.lastAction[0] !== this.mouseState.action[0]) {

                if (this.mouseState.action[0] + this.mouseState.action[1]) {
                    this.mouseButtonEmployed();
                    evt.fire(evt.list().CURSOR_PRESS, this.mouseState);
                } else {
                    if (this.mouseState.pressingButton) {
                        evt.fire(evt.list().CURSOR_RELEASE, this.mouseState);
                    }
                }
            }

            if (this.mouseState.lastAction[1] !== this.mouseState.action[1]) {
                if (this.mouseState.action[1]) {
                    this.mouseState.pressingButton = 1;
                } else {
                    if (this.mouseState.pressingButton) {
                        this.mouseState.pressingButton = 0;
                    }
                }
            }

            if (this.mouseState.action[0] + this.mouseState.action[1]) {
                this.processDragState();
            }
        };

        InputState.prototype.mouseButtonEmployed = function() {

            if (this.mouseState.action[0]) {
                this.handleLeftButtonPress();
            }
        };

        InputState.prototype.handleLeftButtonPress = function() {
            if (!this.mouseState.pressingButton) {
                this.mouseState.startDrag[0] = this.mouseState.x;
                this.mouseState.startDrag[1] = this.mouseState.y;
            }

            this.mouseState.pressingButton = 1;
        };

        return InputState;

    });