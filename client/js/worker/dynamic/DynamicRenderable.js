"use strict";

define([
        'worker/dynamic/DynamicSpatial',
        'worker/dynamic/DynamicFeedback',
        'worker/geometry/GeometryInstance',
        'ConfigObject'
    ],
    function(
        DynamicSpatial,
        DynamicFeedback,
        GeometryInstance,
        ConfigObject
    ) {

        var DynamicRenderable = function() {
            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();

            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicFeedback = new DynamicFeedback();
            this.geometryInstance = new GeometryInstance();
            this.dynamicSpatial.setupSpatialBuffer();
        };

        DynamicRenderable.prototype.inheritObj3D = function(obj3d) {

            this.pos.copy(obj3d.position);
            this.quat.copy(obj3d.quaternion);

        };

        DynamicRenderable.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        DynamicRenderable.prototype.initRenderable = function(renderableId, onReady) {

            var feedbackReady = function() {
                this.dynamicFeedback.inheritPosVector(this.pos);
                this.dynamicFeedback.inheritQuaternion(this.quat);
                onReady(this);
            }.bind(this);

            var configLoaded = function(data) {
                this.geometryInstance.inheritPosAndQuat(this.pos, this.quat);
                this.geometryInstance.setInstanceFxId(data.instance_id);
                this.dynamicSpatial.setSpatialFromPosAndQuat(this.pos, this.quat);
                var scale = 1+(Math.floor(Math.random()*2)*2);
                this.geometryInstance.setInstanceSize(scale);
                this.dynamicSpatial.applySpatialScaleXYZ(scale, scale, scale);
                this.dynamicSpatial.registerRigidBody(data.rigid_body);
                this.dynamicFeedback.initDynamicFeedback(data.dynamic_feedback, feedbackReady);
            }.bind(this);

            this.configObject = new ConfigObject('GEOMETRY', 'DYNAMIC_RENDERABLE', renderableId);
            this.configObject.addCallback(configLoaded);

        };

        DynamicRenderable.prototype.getDynamicPosition = function(vec3) {
            return this.dynamicSpatial.getSpatialPosition(vec3)
        };

        DynamicRenderable.prototype.getDynamicMass = function() {
            return this.dynamicSpatial.getSpatialBodyMass()
        };

        DynamicRenderable.prototype.applyForceVector = function(vec3) {
            this.dynamicSpatial.applySpatialImpulseVector(vec3)
        };

        DynamicRenderable.prototype.applyTorqueVector = function(vec3) {
            this.dynamicSpatial.applySpatialTorqueVector(vec3)
        };

        DynamicRenderable.prototype.tickRenderable = function() {
            this.dynamicSpatial.getSpatialPosition(this.geometryInstance.pos);
            this.dynamicSpatial.getSpatialQuaternion(this.geometryInstance.quat);

            this.geometryInstance.updateGeometryInstance();
            this.dynamicSpatial.notifyVisibility(this.geometryInstance.getIsVisibile());
            this.dynamicFeedback.tickDynamicFeedback(this.dynamicSpatial, this.geometryInstance.getIsVisibile());
        };

        DynamicRenderable.prototype.sampleRenderableState = function() {

        };

        return DynamicRenderable;

    });

