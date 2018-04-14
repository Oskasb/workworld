"use strict";

define([
        'io/ElementListeners',
        'Events'
    ],
    function(
        ElementListeners,
        evt
    ) {

        var InputState = function() {

            this.line = {
                up:0,
                fromX:0,
                fromY:0,
                toX:0,
                toY:0,
                w: 0,
                zrot:0
            };
            this.mouseState = {
                x:0,
                y:0,
                dx:0,
                dy:0,
                wheelDelta:0,
                drag:false,
                startDrag:[0, 0],
                dragDistance:[0, 0],
                action:[0, 0],
                lastAction:[0, 0],
                interactionTargets:[],
                pressFrames:0,
                pressingButton:false
            };
            this.elementListeners = new ElementListeners(this.mouseState);
            this.buttonDownTargets = [];
            this.dragTargets = [];
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

        InputState.prototype.processDragState = function(pointerCursor) {
            if (this.dragTargets.length) {



                pointerCursor.inputVector(
                    this.mouseState.startDrag[0],
                    this.mouseState.startDrag[1],
                    this.mouseState.x,
                    this.mouseState.y
                );
                this.buttonDownTargets.length = 0;
            }

            if (this.buttonDownTargets.length) {
                if (this.mouseState.dx || this.mouseState.dy) {
                    if (!this.mouseState.drag) {
                        this.mouseState.startDrag[0] = this.mouseState.x;
                        this.mouseState.startDrag[1] = this.mouseState.y;
                        this.mouseState.drag = true;
                        /*
                            for (var i = 0; i < this.buttonDownTargets.length; i++) {
                                if (this.buttonDownTargets[i].onDragCallbacks.length) {
                                    this.dragTargets.push(this.buttonDownTargets[i]);
                                    this.buttonDownTargets[i].beginValueManipulation();
                                }
                            }
                        */
                    }
                }
            }

            this.mouseState.dragDistance[0] = this.mouseState.startDrag[0] - this.mouseState.x;
            this.mouseState.dragDistance[1] = this.mouseState.startDrag[1] - this.mouseState.y;
            /*
            for (i = 0; i < this.dragTargets.length; i++) {
                this.dragTargets[i].setDragValue(this.mouseState.dragDistance);
                this.dragTargets[i].onControlHover();
            }
                */
        };

        InputState.prototype.updateInputState = function(pointerCursor) {
            this.mouseState.lastAction[0] = this.mouseState.action[0];
            this.mouseState.lastAction[1] = this.mouseState.action[1];

            this.processDragState(pointerCursor);

            this.elementListeners.sampleMouseState(this.mouseState);

            this.processHoverTargets();
            pointerCursor.inputMouseState(this.mouseState);

            if (this.mouseState.lastAction[0] != this.mouseState.action[0]) {
                this.dragEnded();

                if (this.mouseState.action[0] + this.mouseState.action[1]) {
                    this.mouseButtonEmployed();
                    evt.fire(evt.list().CURSOR_PRESS, this.mouseState);
                } else {
                    if (this.mouseState.pressingButton == true) {
                        this.handleReleaseTargets();
                        evt.fire(evt.list().CURSOR_RELEASE, this.mouseState);
                    }
                }
            }

            if (this.mouseState.lastAction[1] != this.mouseState.action[1]) {
                //    this.dragEnded();
                //    pointerCursor.inputMouseAction(this.mouseState.action);
                if (this.mouseState.action[1]) {
                    //        this.mouseButtonEmployed();
                    //        evt.fire(evt.list().CURSOR_PRESS, this.mouseState);
                } else {
                    if (this.mouseState.pressingButton == true) {
                        //            this.handleReleaseTargets();
                        //            evt.fire(evt.list().CURSOR_RELEASE, this.mouseState);
                    }
                }
            }

            if (this.mouseState.action[0] + this.mouseState.action[1]) {
                this.showActivatedHovered();
            }

            if (!this.buttonDownTargets.length) {
                this.mouseState.pressingButton = false;
            }
        };

        InputState.prototype.dragEnded = function() {
            this.mouseState.drag = false;
            this.dragTargets.length = 0;

            this.buttonDownTargets.length = 0;
        };

        InputState.prototype.handleReleaseTargets = function() {

            for (var i = 0 ; i < this.buttonDownTargets.length; i++) {
                this.buttonDownTargets[i].triggerOnApply();
            }
        };


        InputState.prototype.mouseButtonEmployed = function() {

            if (this.mouseState.action[0]) {
                this.handleLeftButtonPress();
            } else {
                this.dragEnded();
            }
        };

        InputState.prototype.showActivatedHovered = function() {
            this.buttonDownTargets[0] = 1;


            this.dragTargets[0] = 1;
            //	this.buttonDownTargets.length = 0;
            if (this.mouseState.pressingButton == true) {
                for (var i = 0; i < this.mouseState.interactionTargets.length; i++) {
                    this.mouseState.interactionTargets[i].onControlActive(this.buttonDownTargets);
                }
            }
        };

        InputState.prototype.handleLeftButtonPress = function() {
            if (!this.mouseState.pressingButton) {
                this.mouseState.startDrag[0] = this.mouseState.x;
                this.mouseState.startDrag[1] = this.mouseState.y;
            }

            this.mouseState.pressingButton = true;


            this.mouseState.lastAction[0] = this.mouseState.action[0];
            this.showActivatedHovered()
        };

        InputState.prototype.initFrameSample = function() {
            this.mouseState.interactionTargets.length = 0;
        };



        InputState.prototype.processHoverTargets = function() {
            if (this.mouseState.interactionTargets.length > 0) {
                for (var i = 0; i < this.mouseState.interactionTargets.length; i++) {
                    this.mouseState.interactionTargets[i].onControlHover();
                }
            }
        };

        return InputState;
    });