"use strict";

define([

    ],
    function(

    ) {

        var PieceControlState = function(config) {

            this.state = {
                value :config.value || 1,
                target :config.target || 0,
                min :config.min || -Number.MAX_VALUE,
                max : config.max || Number.MAX_VALUE,
                speed : config.speed || 1,
                factor : config.factor || 1
            }

        };

        PieceControlState.prototype.setPieceControlTargetState = function(value) {
            this.state.target = value;
        };

        PieceControlState.prototype.renderControlableModule = function(renderable) {

        };

        PieceControlState.prototype.getControlStateValue = function() {
            return this.state.value;
        };

        PieceControlState.prototype.updatePieceControlState = function() {
            var diff = MATH.clamp(this.state.target - this.state.value, -this.state.speed, this.state.speed);
            this.state.value = MATH.clamp(this.state.value + diff, this.state.min, this.state.max)
        };



        return PieceControlState;

    });

