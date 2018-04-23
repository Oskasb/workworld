"use strict";

define([
        'EffectsAPI'
    ],
    function(
        EffectsAPI
    ) {

        var GeometryInstance = function(fxId) {

            this.fxId = fxId;
            this.object3d = new THREE.Object3D();
            this.frustumCoords = new THREE.Vector3();
            this.effect = null;
            this.size = 1;
        };

        GeometryInstance.prototype.setInstancePosition = function(pos) {
            this.object3d.position.copy(pos);
            if (this.effect) {
                EffectsAPI.updateEffectPosition(this.effect, this.object3d.position)
            }
        };

        GeometryInstance.prototype.getInstancePosition = function(storeVec) {
            storeVec.copy(this.object3d.position);
        };

        GeometryInstance.prototype.setInstanceQuaternion = function(quat) {
            this.object3d.quaternion.copy(quat);
            if (this.effect) {
                EffectsAPI.updateEffectQuaternion(this.effect, this.object3d.quaternion)
            }
        };

        GeometryInstance.prototype.getInstanceQuaternion = function(storeQuat) {
            storeQuat.copy(this.object3d.quaternion);
        };

        GeometryInstance.prototype.setInstanceSize = function(size) {
            this.size = size;
            if (this.effect) {
                EffectsAPI.updateEffectScale(this.effect, this.size)
            }
        };

        GeometryInstance.prototype.getInstanceSize = function() {
            return this.size;
        };

        GeometryInstance.prototype.lookAt = function(vec3) {
            this.object3d.lookAt(vec3);
            if (this.effect) {
                EffectsAPI.updateEffectQuaternion(this.effect, this.object3d.quaternion)
            }
        };

        GeometryInstance.prototype.renderGeometryInstance = function() {
            if (!this.effect) {
                this.effect = EffectsAPI.requestPassiveEffect(this.fxId, this.object3d.position, null, null, this.object3d.quaternion);
                EffectsAPI.updateEffectScale(this.effect, this.size)
            }
        };

        GeometryInstance.prototype.hideGeometryInstance = function() {
            if (this.effect) {
                EffectsAPI.returnPassiveEffect(this.effect)
            }
            this.effect = null;
        };

        GeometryInstance.prototype.testIsVisible = function() {

            this.isVisible = WorldAPI.getWorldCamera().cameraFrustumContainsPoint(this.object3d.position);

            //  MATH.valueIsBetween(this.frustumCoords.x, 0, 1) && MATH.valueIsBetween(this.frustumCoords.y, 0, 1);

            if (!this.isVisible) {
                this.isVisible = WorldAPI.getWorldCamera().cameraTestXYZRadius(this.object3d.position, 15);
            } else {
            //    console.log("Visible")
            }

            return this.isVisible;
        };

        return GeometryInstance;

    });

