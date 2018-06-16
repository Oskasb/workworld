"use strict";

define([

    ],
    function(

    ) {

        var ModuleState = function() {

            this.state = {
                offset:0,
                value :0,
                target : 0,
                min : -Number.MAX_VALUE,
                max : Number.MAX_VALUE,
                speed : 1,
                factor : 1
            }
        };

        ModuleState.prototype.applyConfig = function(conf) {
            for (var key in conf) {
                this.state[key] = conf[key]
            }
            this.setTargetState(this.state.value)
        };

        ModuleState.prototype.setTargetState = function(value) {
            this.state.target = value;
        };

        ModuleState.prototype.getTargetValue = function() {
            return this.state.target;
        };

        ModuleState.prototype.getStateValue = function() {
            return this.state.value + this.state.offset;
        };

        ModuleState.prototype.getAppliedFactor = function() {
            return this.getStateValue() * this.state.factor;
        };

        ModuleState.prototype.renderControlableModule = function(renderable) {

        };

        ModuleState.prototype.updateModuleState = function() {
            var diff = MATH.clamp(this.state.target - this.state.value, -this.state.speed, this.state.speed);
            this.state.value = MATH.clamp(this.state.value + diff, this.state.min, this.state.max)
        };


        return ModuleState;

    });

