"use strict";

define([
        'EffectsAPI',
        'worker/geometry/GeometryInstance',
        'worker/geometry/StandardGeometry'
    ],
    function(
        EffectsAPI,
        GeometryInstance,
        StandardGeometry
    ) {

        var tempObj3d = new THREE.Object3D();

        var RenderableGeometry = function() {
            this.renderable = null;
            this.size = 1;
            this.visualSize = 1;

            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();

            this.isVisible = false;
            this.wasVisible = false;
        };

        RenderableGeometry.prototype.setupStandardModelId = function(model_id, dynamicSpatial) {
            this.renderable = new StandardGeometry(model_id, dynamicSpatial);
            this.renderable.setGeometrySize(this.size)
        };

        RenderableGeometry.prototype.setupInstanceFxId = function(fxId) {
            this.renderable = new GeometryInstance(fxId);
            this.renderable.inheritPosAndQuat(this.pos, this.quat);
            this.renderable.setGeometrySize(this.size)
        };

        RenderableGeometry.prototype.inheritPosAndQuat  = function(pos, quat) {
            this.pos = pos;
            this.quat = quat
        };

        RenderableGeometry.prototype.setRenderableSize = function(size) {
            this.size = size;

        };

        RenderableGeometry.prototype.setRenderableVisualSize = function(size) {
            this.visualSize = size;
        };

        RenderableGeometry.prototype.getRenderableSize = function() {
            return this.size;
        };

        RenderableGeometry.prototype.lookAt = function(vec3) {
            tempObj3d.position.copy(this.pos);
            tempObj3d.lookAt(vec3);
            this.quat.copy(tempObj3d.quaternion);
            if (this.renderable) {
                this.renderable.setGeometryQuaternion(this.quat);
            }
        };

        RenderableGeometry.prototype.renderGeometryRenderable = function() {
            this.renderable.renderGeometryInstance();  //  = EffectsAPI.requestPassiveEffect(this.fxId, this.pos, null, null, this.quat);

        };

        RenderableGeometry.prototype.hideGeometryRenderable = function() {
            this.renderable.hideGeometryRenderable();
        };

        RenderableGeometry.prototype.getIsVisibile = function() {
            return this.isVisible;
        };

        RenderableGeometry.prototype.testIsVisible = function() {
            return WorldAPI.getWorldCamera().testPosRadiusVisible(this.pos, this.size*0.65*this.visualSize);
        };

        RenderableGeometry.prototype.applyVisibility = function(isVisible) {

            if (isVisible) {
                this.renderGeometryRenderable();
            } else {
                this.hideGeometryRenderable();
            }

            if (isVisible) {
                this.renderable.applyGeometryVisibility(isVisible);
            }

            this.wasVisible = isVisible;
        };

        RenderableGeometry.prototype.updateGeometryRenderable = function() {
            this.isVisible = this.testIsVisible();
        };

        return RenderableGeometry;

    });

