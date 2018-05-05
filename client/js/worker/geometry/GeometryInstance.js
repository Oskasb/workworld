"use strict";

define([
        'EffectsAPI'
    ],
    function(
        EffectsAPI
    ) {

        var GeometryInstance = function() {
            this.effect = null;
            this.size = 1;
            this.isVisible = false;
            this.wasVisible = false;
        };

        GeometryInstance.prototype.setInstanceFxId = function(fxId) {
            this.fxId = fxId;
        };

        GeometryInstance.prototype.setObject3d  = function(object3d) {
            this.object3d = object3d;
        };

        GeometryInstance.prototype.getObject3d  = function() {
            return this.object3d;
        };

        GeometryInstance.prototype.setInstancePosition = function(pos) {
            this.object3d.position.copy(pos);
            if (this.effect) {
                this.effect.updateEffectPositionSimulator(this.object3d.position);
            }
        };

        GeometryInstance.prototype.getInstancePosition = function(storeVec) {
            storeVec.copy(this.object3d.position);
        };

        GeometryInstance.prototype.setInstanceQuaternion = function(quat) {
            this.object3d.quaternion.copy(quat);
            if (this.effect) {
                this.effect.updateEffectQuaternionSimulator(this.object3d.quaternion);
            }
        };

        GeometryInstance.prototype.getInstanceQuaternion = function(storeQuat) {
            storeQuat.copy(this.object3d.quaternion);
        };

        GeometryInstance.prototype.setInstanceSize = function(size) {
            this.size = size;
            if (this.effect) {
                this.effect.updateEffectScaleSimulator(this.size);
            }
        };

        GeometryInstance.prototype.getInstanceSize = function() {
            return this.size;
        };

        GeometryInstance.prototype.lookAt = function(vec3) {
            this.object3d.lookAt(vec3);
            if (this.effect) {
                this.effect.updateEffectQuaternionSimulator(this.object3d.quaternion);
            }
        };

        GeometryInstance.prototype.renderGeometryInstance = function() {
            if (!this.effect) {
                this.effect = EffectsAPI.requestPassiveEffect(this.fxId, this.object3d.position, null, null, this.object3d.quaternion);
                this.setInstanceSize(this.size)
            }
        };

        GeometryInstance.prototype.hideGeometryInstance = function() {
            if (this.effect) {
                EffectsAPI.returnPassiveEffect(this.effect)
            }
            this.effect = null;
        };

        GeometryInstance.prototype.testIsVisible = function() {
            return WorldAPI.getWorldCamera().testPosRadiusVisible(this.object3d.position, 15);
        };

        GeometryInstance.prototype.applyVisibility = function(isVisible) {
            if (isVisible) {
                this.renderGeometryInstance();
            } else {
                this.hideGeometryInstance();
            }
            this.wasVisible = isVisible;
        };

        GeometryInstance.prototype.updateGeometryInstance = function() {

            this.isVisible = this.testIsVisible();
            if (this.isVisible !== this.wasVisible) {
                this.applyVisibility(this.isVisible);
            }

            if (this.isVisible) {
                this.effect.updateEffectPositionSimulator(this.object3d.position);
                this.effect.updateEffectQuaternionSimulator(this.object3d.quaternion);
            }

        };


        return GeometryInstance;

    });

