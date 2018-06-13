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
        var tempVec2 = new THREE.Vector3();
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
            this.debugForces = [];
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

        RenderableGeometry.prototype.renderGeometryRenderable = function(isVisible) {
            this.renderable.renderGeometryInstance(isVisible);  //  = EffectsAPI.requestPassiveEffect(this.fxId, this.pos, null, null, this.quat);

        };

        RenderableGeometry.prototype.hideGeometryRenderable = function() {
            this.renderable.hideGeometryRenderable();
        };

        RenderableGeometry.prototype.getIsVisibile = function() {
            return this.isVisible;
        };

        RenderableGeometry.prototype.testIsVisible = function() {
            return WorldAPI.getWorldCamera().testPosRadiusVisible(this.pos, 0.65*this.visualSize);
        };

        RenderableGeometry.prototype.getGeometry = function() {
            return this.renderable;
        };

        RenderableGeometry.prototype.applyVisibility = function(isVisible) {

            if (isVisible) {
                this.renderGeometryRenderable(isVisible);
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

        RenderableGeometry.prototype.notifyFrameUpdated  = function() {
            if (this.renderable.dynamicSkeleton) {
                this.renderable.dynamicSkeleton.notifyDynamicSkeletonFrame();
            }

        };


        RenderableGeometry.prototype.clearDebugShapes = function() {
            while (this.debugShapes.length) {
                this.debugShapes.pop().hideGeometryRenderable();
            }
        };

        var drawForceAxis = function(shape, instance, pos, quat, axis, colorIdx) {


            shape.calculateWorldPosition(pos, quat, instance.pos);
            instance.quat.copy(quat) //  , shape.rotation);


            var axisForce = shape.sampleActingForce()[axis];

            tempVec2.set(0.3, 0.3, 0.3);

            var ext = 0;




            while (Math.abs(axisForce) > 10) {
                tempVec2.multiplyScalar(1.002);
                axisForce *= 0.99;
                ext += 0.05;
            };

            tempVec2[axis] = axisForce + ext * Math.sign(axisForce);


            instance.scale3d.copy(tempVec2);
            tempVec2.multiplyScalar(0.5);

            if (tempVec2[axis] !== 0) {
        //        WorldAPI.addTextMessage('ActingForce '+axis+' = '+tempVec2[axis])
            }

            tempVec2.applyQuaternion(instance.quat);
            instance.pos.addVectors(instance.pos, tempVec2);

            instance.renderGeometryInstance();
            EffectsAPI.updateEffectColorKey(instance.effect, ENUMS.getKey('ColorCurve', colorIdx));
        };

        RenderableGeometry.prototype.drawDebugForces = function(dynamicSpatial) {

            if (this.debugForces.length !== dynamicSpatial.dynamicShapes.length * 3) {
                this.clearDebugForces();
                for (var i = 0; i < dynamicSpatial.dynamicShapes.length * 3; i+=3) {
                    this.debugForces[i] =   new GeometryInstance("creative_crate_geometry_effect");
                    this.debugForces[i+1] = new GeometryInstance("creative_crate_geometry_effect");
                    this.debugForces[i+2] = new GeometryInstance("creative_crate_geometry_effect");
                    dynamicSpatial.getSpatialScale(tempVec);
                }
            }

            dynamicSpatial.getSpatialPosition(tempVec);
            dynamicSpatial.getSpatialQuaternion(tempQuat);

            for (var i = 0; i < dynamicSpatial.dynamicShapes.length; i++) {
                var shape = dynamicSpatial.dynamicShapes[i];
                drawForceAxis(shape, this.debugForces[3*i],   tempVec, tempQuat, 'x', ENUMS.ColorCurve.cyan_3);
                drawForceAxis(shape, this.debugForces[3*i+1], tempVec, tempQuat, 'y', ENUMS.ColorCurve.purple_3);
                drawForceAxis(shape, this.debugForces[3*i+2], tempVec, tempQuat, 'z', ENUMS.ColorCurve.yellow_3);
            }
        };

        RenderableGeometry.prototype.clearDebugForces = function() {
            while (this.debugForces.length) {
                this.debugForces.pop().hideGeometryRenderable();
            }
        };

        return RenderableGeometry;

    });

