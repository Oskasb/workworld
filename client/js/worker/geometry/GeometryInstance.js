"use strict";

define([
        'EffectsAPI'
    ],
    function(
        EffectsAPI
    ) {

        var GeometryInstance = function(fxId) {
            this.fxId = fxId;
            this.effect = null;
            this.size = 1;
            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.scale3d = new THREE.Vector3();

            this.lastScale3d = new THREE.Vector3();
            this.lastPos = new THREE.Vector3();
            this.lastQuat = new THREE.Quaternion();
        };

        GeometryInstance.prototype.setInstanceFxId = function(fxId) {
            this.fxId = fxId;
        };

        GeometryInstance.prototype.inheritPosAndQuat  = function(pos, quat) {
            this.pos = pos;
            this.quat = quat
        };

        GeometryInstance.prototype.inheritScale3d  = function(vec3) {
            this.scale3d = vec3;
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

        GeometryInstance.prototype.setGeometryQuaternion = function(quat) {
            this.quat.copy(quat);
            if (this.effect) {
                this.effect.updateEffectQuaternionSimulator(this.quat);
            }
        };

        GeometryInstance.prototype.getInstanceQuaternion = function(storeQuat) {
            storeQuat.copy(this.quat);
        };

        GeometryInstance.prototype.setGeometrySize = function(size) {
            this.size = size;
            if (this.effect) {
                this.effect.updateEffectScaleSimulator(this.size);
            }
        };

        GeometryInstance.prototype.setGeometryScale3d = function(vec3) {
            this.scale3d.copy(vec3);
            if (this.effect) {
                this.effect.updateEffectScale3d(this.scale3d);

            }
        };


        GeometryInstance.prototype.renderGeometryInstance = function() {
            if (!this.effect) {
                this.effect = EffectsAPI.requestPassiveEffect(this.fxId, this.pos, null, null, this.quat);
                this.setGeometrySize(this.size);
                this.setGeometryScale3d(this.scale3d);
                this.lastQuat.copy(this.quat);
                this.lastPos.copy(this.pos);
            //    this.lastScale3d.copy(this.scale3d);
            } else {
                this.applyGeometryVisibility(true);
            }
        };


        GeometryInstance.prototype.hideGeometryRenderable = function() {
            if (this.effect) {
                EffectsAPI.returnPassiveEffect(this.effect)
            }
            this.effect = null;
        };

        GeometryInstance.prototype.getIsVisibile = function() {
            return this.isVisible;
        };

        GeometryInstance.prototype.testIsVisible = function() {
            return WorldAPI.getWorldCamera().testPosRadiusVisible(this.pos, this.size*0.65*this.visualSize);
        };

        GeometryInstance.prototype.applyGeometryVisibility = function(isVisible) {

            if (isVisible) {
                if (!this.lastPos.equals(this.pos)) {
                    this.effect.updateEffectPositionSimulator(this.pos);
                    this.lastPos.copy(this.pos);
                }

                if (!this.lastQuat.equals(this.quat)) {
                    this.effect.updateEffectQuaternionSimulator(this.quat);
                    this.lastQuat.copy(this.quat);
                }

                if (!this.lastScale3d.equals(this.scale3d)) {
                    this.effect.updateEffectScale3d(this.scale3d);
                    this.lastScale3d.copy(this.scale3d);
                }
            }
        };


        return GeometryInstance;

    });

