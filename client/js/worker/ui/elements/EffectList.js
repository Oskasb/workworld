"use strict";

define([
        'EffectsAPI'
    ],
    function(
        EffectsAPI
    ) {

        var i;

        var EffectList = function() {
            this.effects = []
        };

        EffectList.prototype.enableEffectList = function(effectIds, posVec, quat, size, aspect) {
            for (i = 0; i < effectIds.length; i++) {
                this.effects.push(EffectsAPI.requestPassiveEffect(effectIds[i], posVec, null, null, quat, size, aspect))
            }
        };

        EffectList.prototype.setEffectListScale = function(scale) {
            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].setAliveParticlesSize(scale);
            }
        };

        EffectList.prototype.setEffectListAspect = function(aspect) {
            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].updateEffectScaleTexelRow(aspect);
            }
        };

        EffectList.prototype.setEffectListPosition = function(posVec) {
            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].updateEffectPositionSimulator(posVec);
            }
        };

        EffectList.prototype.setEffectListQuaternion = function(quat) {
            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].updateEffectQuaternionSimulator(quat);
            }
        };

        EffectList.prototype.disableEffectList = function() {
            while (this.effects.length) {
                EffectsAPI.returnPassiveEffect(this.effects.pop())
            }
        };

        EffectList.prototype.effectCount = function() {
           return this.effects.length;
        };

        return EffectList;

    });