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

        PieceControlState.prototype.getControlMax = function() {
            return this.state.max;
        };

        PieceControlState.prototype.getControlMin = function() {
            return this.state.min;
        };

        PieceControlState.prototype.setPieceControlTargetState = function(value) {
            this.state.target = MATH.clamp(value, this.state.min, this.state.max);
        };

        PieceControlState.prototype.renderControlableModule = function(renderable) {

        };

        PieceControlState.prototype.getControlStateTargetValue = function() {
            return this.state.target;
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

