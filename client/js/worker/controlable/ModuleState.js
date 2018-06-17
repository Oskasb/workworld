"use strict";

define([

    ],
    function(

    ) {

        var ModuleState = function() {

            this.active = {
                target:0,
                value:0,
                object:null,
                light:null,
                effect:null,
                shape:null
            };

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

        ModuleState.prototype.getActiveValue = function() {
            return this.active.value;
        };

        ModuleState.prototype.setActiveValue = function(value) {
            this.active.value = value;
        };

        ModuleState.prototype.getActiveEffect = function() {
            return this.active.effect;
        };

        ModuleState.prototype.setActiveEffect = function(fx) {
            this.active.effect = value;
        };

        ModuleState.prototype.getActiveShape = function() {
            return this.active.shape;
        };

        ModuleState.prototype.setActiveShape = function(shape) {
            this.active.shape = shape;
        };

        ModuleState.prototype.setActiveObject = function(dynamicObject) {
            this.active.object = dynamicObject;
        };

        ModuleState.prototype.getActiveObject = function() {
            return this.active.object;
        };

        ModuleState.prototype.setActiveLight = function(light) {
            this.active.light = light;
        };

        ModuleState.prototype.getActiveLight = function() {
            return this.active.light;
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

