"use strict";

define([
        'EffectsAPI'
    ],
    function(
        EffectsAPI
    ) {

        var i;

        var EffectList = function() {
            this.effects = [];
            this.lastScale = null;
            this.lastPos = new THREE.Vector3();
            this.lastVel = new THREE.Vector3();
            this.lastQuat = new THREE.Quaternion();
            this.lastColorKey = '';

        };

        EffectList.prototype.enableEffectList = function(effectIds, posVec, quat, size, aspect) {
            this.lastScale = null;
            if (posVec) {this.lastPos.copy(posVec)}
            if (quat) {this.lastQuat.copy(quat)}
            this.lastColorKey = '';
            for (i = 0; i < effectIds.length; i++) {
                this.addEffectToList(effectIds[i], posVec, quat, size, aspect)
            }
        };

        EffectList.prototype.addEffectToList = function(effectId, posVec, quat, size, aspect, colorKey) {
            this.effects.push(EffectsAPI.requestPassiveEffect(effectId, posVec, null, null, quat, size, aspect, colorKey))
        };

        EffectList.prototype.setEffectListScale = function(scale) {
            if (this.lastScale === scale) {
                return;
            } else {
                this.lastScale = scale;
            }
            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].setAliveParticlesSize(scale/2);
            }
        };

        EffectList.prototype.setEffectIndexSpriteKey = function(index, spriteKey) {
            EffectsAPI.updateEffectSpriteKey( this.effects[index], spriteKey);
        };

        EffectList.prototype.setEffectIndexColorKey = function(index, colorKey) {
            this.lastColorKey = colorKey;
            EffectsAPI.updateEffectColorKey( this.effects[index], colorKey);
        };

        EffectList.prototype.setEffectIndexAlphaKey = function(index, alphaKey) {
            EffectsAPI.updateEffectAlphaKey( this.effects[index], alphaKey);
        };

        EffectList.prototype.setEffectIndexScale = function(index, scale) {
            this.effects[index].setAliveParticlesSize(scale);
        };

        EffectList.prototype.setEffectIndexVelocity = function(index, velVec) {
            this.lastVel.copy(velVec);
            this.effects[index].updateEffectVelocitySimulator(velVec);
        };

        EffectList.prototype.setEffectListColorKey = function(colorKey) {
            if (this.lastColorKey === colorKey) {
                return;
            }
            for (i = 0; i < this.effects.length; i++) {
                this.setEffectIndexColorKey(i, colorKey);
            }

        };

        EffectList.prototype.setEffectListAspect = function(aspect) {
            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].updateEffectScaleTexelRow(aspect);
            }
        };

        EffectList.prototype.setEffectListPosition = function(posVec) {
            if (this.lastPos.equals(posVec)) {
                return;
            }
            for (i = 0; i < this.effects.length; i++) {
                this.setEffectIndexPosition(i, posVec);
            }
        };

        EffectList.prototype.setEffectListVelocity = function(velVec) {
            if (this.lastVel.equals(velVec)) {
                return;
            }
            for (i = 0; i < this.effects.length; i++) {
                this.setEffectIndexVelocity(i, velVec);
            }
        };

        EffectList.prototype.setEffectIndexPosition = function(index, posVec) {
            this.lastPos.copy(posVec);
            this.effects[index].updateEffectPositionSimulator(posVec);
        };

        EffectList.prototype.setEffectListQuaternion = function(quat) {
            if (this.lastQuat.equals(quat)) {
                return;
            } else {
                this.lastQuat.copy(quat)
            }

            for (i = 0; i < this.effects.length; i++) {
                this.effects[i].updateEffectQuaternionSimulator(quat);
            }
        };

        EffectList.prototype.disableEffectList = function() {
            this.lastScale = null;
            this.lastPos.set(0, 0, 0);
            this.lastVel.set(0, 0, 0);
            this.lastQuat.set(0, 0, 0, 0);
            this.lastColorKey = '';

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