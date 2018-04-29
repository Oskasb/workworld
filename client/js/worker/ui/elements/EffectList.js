"use strict";

define([
        'EffectsAPI'
    ],
    function(
        EffectsAPI
    ) {

        var i;

        var tempVec1 = new THREE.Vector3();

        var EffectList = function() {
            this.effects = [];
        };

        EffectList.prototype.enableEffectList = function(effectIds, posVec, quat, size, aspect) {
            for (i = 0; i < effectIds.length; i++) {
                this.addEffectToList(effectIds[i], posVec, quat, size, aspect)
            }
        };

        EffectList.prototype.addEffectToList = function(effectId, posVec, quat, size, aspect) {
            this.effects.push(EffectsAPI.requestPassiveEffect(effectId, posVec, null, null, quat, size, aspect))
        };

        EffectList.prototype.setEffectListScale = function(scale) {
            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].setAliveParticlesSize(scale);
            }
        };

        EffectList.prototype.setEffectIndexSpriteKey = function(index, spriteKey) {
            EffectsAPI.updateEffectSpriteKey( this.effects[index], spriteKey);
        };

        EffectList.prototype.getEffectIndexSpriteKey = function(index) {
            return this.effects[index].dynamicSprite;
        };


        EffectList.prototype.setEffectListAspect = function(aspect) {
            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].updateEffectScaleTexelRow(aspect);
            }
        };

        EffectList.prototype.setEffectListPosition = function(posVec) {
            for (i = 0; i < this.effects.length; i++) {
                this.setEffectIndexPosition(i, posVec);
            }
        };

        EffectList.prototype.setEffectIndexPosition = function(index, posVec) {
            this.effects[index].updateEffectPositionSimulator(posVec);
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

        EffectList.prototype.removeEffectListElementCount = function(count) {
            for (var i = 0; i < count; i++) {
                EffectsAPI.returnPassiveEffect(this.effects.pop())
            }
        };

        EffectList.prototype.effectCount = function() {
           return this.effects.length;
        };

        return EffectList;

    });