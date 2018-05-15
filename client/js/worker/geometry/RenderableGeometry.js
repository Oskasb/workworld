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
        var tempVec = new THREE.Vector3();
        var tempQuat = new THREE.Quaternion();


        var RenderableGeometry = function() {
            this.renderable = null;
            this.visualSize = 1;

            this.pos = new THREE.Vector3();
            this.scale3d = new THREE.Vector3(1, 1, 1);
            this.quat = new THREE.Quaternion();

            this.isVisible = false;
            this.wasVisible = false;

            this.debugShapes = [];
        };

        RenderableGeometry.prototype.setupStandardModelId = function(model_id, dynamicSpatial) {
            this.renderable = new StandardGeometry(model_id, dynamicSpatial);
        //    this.renderable.setGeometrySize(this.size)
        };

        RenderableGeometry.prototype.setupInstanceFxId = function(fxId) {
            this.renderable = new GeometryInstance(fxId);
            this.renderable.inheritPosAndQuat(this.pos, this.quat);
            this.renderable.inheritScale3d(this.scale3d);
        };

        RenderableGeometry.prototype.inheritPosAndQuat  = function(pos, quat) {
            this.pos = pos;
            this.quat = quat
        };

        RenderableGeometry.prototype.inheritScale3d  = function(scale3d) {
            this.scale3d = scale3d;
        };

        RenderableGeometry.prototype.setRenderableVisualSize = function(size) {
            this.visualSize = size;
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
            return this.isVisible;
        };

        RenderableGeometry.prototype.drawDebugShapes = function(dynamicSpatial) {

            if (this.debugShapes.length !==  dynamicSpatial.dynamicShapes.length) {
                this.clearDebugShapes();
                for (var i = 0; i < dynamicSpatial.dynamicShapes.length; i++) {
                    this.debugShapes.push(new GeometryInstance("creative_crate_geometry_effect"));
                    dynamicSpatial.getSpatialScale(tempVec);
                    this.debugShapes[i].setGeometryScale3d(dynamicSpatial.dynamicShapes[i].size);
                }
                console.log("DEBUG DRAW ENABLED")
            }

            dynamicSpatial.getSpatialPosition(tempVec);
            dynamicSpatial.getSpatialQuaternion(tempQuat);

            for (var i = 0; i < this.debugShapes.length; i++) {

                var instance = this.debugShapes[i];
                var shape = dynamicSpatial.dynamicShapes[i];

                shape.calculateWorldPosition(tempVec, tempQuat, instance.pos);
                instance.quat.multiplyQuaternions(tempQuat , shape.rotation);

                instance.renderGeometryInstance();
            }

        };

        RenderableGeometry.prototype.clearDebugShapes = function() {
            while (this.debugShapes.length) {
                this.debugShapes.pop().hideGeometryRenderable();
            }

        };


        return RenderableGeometry;

    });

