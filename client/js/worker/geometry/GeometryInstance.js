"use strict";

define([
        'EffectsAPI'
    ],
    function(
        EffectsAPI
    ) {

        var tempObj3d = new THREE.Object3D();

        var GeometryInstance = function() {
            this.effect = null;
            this.size = 1;

            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();

            this.lastPos = new THREE.Vector3();
            this.lastQuat = new THREE.Quaternion();
            this.isVisible = false;
            this.wasVisible = false;
        };

        GeometryInstance.prototype.setInstanceFxId = function(fxId) {
            this.fxId = fxId;
        };

        GeometryInstance.prototype.inheritPosAndQuat  = function(pos, quat) {
            this.pos = pos;
            this.quat = quat
        };

        GeometryInstance.prototype.setInstancePosition = function(pos) {
            this.pos.copy(pos);
            if (this.effect) {
                this.effect.updateEffectPositionSimulator(this.pos);
                this.lastPos.copy(this.pos);
            }
        };

        GeometryInstance.prototype.getInstancePosition = function(storeVec) {
            storeVec.copy(this.pos);
        };

        GeometryInstance.prototype.setInstanceQuaternion = function(quat) {
            this.quat.copy(quat);
            if (this.effect) {
                this.effect.updateEffectQuaternionSimulator(this.quat);
            }
        };

        GeometryInstance.prototype.getInstanceQuaternion = function(storeQuat) {
            storeQuat.copy(this.quat);
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
            tempObj3d.position.copy(this.pos);
            tempObj3d.lookAt(vec3);
            this.quat.copy(tempObj3d.quaternion);
            if (this.effect) {
                this.lastQuat.copy(this.quat);
                this.effect.updateEffectQuaternionSimulator(this.quat);
            }
        };

        GeometryInstance.prototype.renderGeometryInstance = function() {
            if (!this.effect) {
                this.effect = EffectsAPI.requestPassiveEffect(this.fxId, this.pos, null, null, this.quat);
                this.setInstanceSize(this.size)
                this.lastQuat.copy(this.quat);
                this.lastPos.copy(this.pos);
            }
        };

        GeometryInstance.prototype.hideGeometryInstance = function() {
            if (this.effect) {
                EffectsAPI.returnPassiveEffect(this.effect)
            }
            this.effect = null;
        };

        GeometryInstance.prototype.getIsVisibile = function() {
            return this.isVisible;
        };

        GeometryInstance.prototype.testIsVisible = function() {
            return WorldAPI.getWorldCamera().testPosRadiusVisible(this.pos, this.size*0.65);
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
                if (!this.lastPos.equals(this.pos)) {
                    this.effect.updateEffectPositionSimulator(this.pos);
                    this.lastPos.copy(this.pos);
                }

                if (!this.lastQuat.equals(this.quat)) {
                    this.effect.updateEffectQuaternionSimulator(this.quat);
                    this.lastQuat.copy(this.quat);
                }
            }
        };


        return GeometryInstance;

    });

