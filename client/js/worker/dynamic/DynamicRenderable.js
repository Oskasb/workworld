"use strict";

define([
        'worker/dynamic/DynamicSpatial',
        'worker/dynamic/DynamicFeedback',
        'worker/geometry/RenderableGeometry',
        'ConfigObject'
    ],
    function(
        DynamicSpatial,
        DynamicFeedback,
        RenderableGeometry,
        ConfigObject
    ) {

    var s;

        var DynamicRenderable = function() {
            this.idKey = '';
            this.scale = 1;
            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicFeedback = new DynamicFeedback();

            this.renderableGeometry = new RenderableGeometry();

            this.dynamicSpatial.setupSpatialBuffer();
        };

        DynamicRenderable.prototype.setRenderableIdKey = function(id) {
            this.idKey = id;
        };

        DynamicRenderable.prototype.setRenderableScale = function(scl) {
            this.renderableGeometry.setRenderableSize(scl);
        };

        DynamicRenderable.prototype.setRenderablePosition = function(pos) {
            this.pos.copy(pos);
        };

        DynamicRenderable.prototype.setRenderableQuaternion = function(quat) {
            this.quat.copy(quat);
        };

        DynamicRenderable.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        DynamicRenderable.prototype.initRenderable = function(onReady) {

            var feedbackReady = function() {
                this.dynamicFeedback.inheritPosVector(this.pos);
                this.dynamicFeedback.inheritQuaternion(this.quat);
                onReady(this);
            }.bind(this);

            var configLoaded = function(data) {

                this.renderableGeometry.inheritPosAndQuat(this.pos, this.quat);

                if (data.instance_id) {
                    this.renderableGeometry.setupInstanceFxId(data.instance_id);
                } else if (data.model_id) {
                    this.renderableGeometry.setupStandardModelId(data.model_id, this.dynamicSpatial);
                } else {
                    console.log("No model_id or instance_id for dynamic renderable:", this.idKey);
                    return;
                }

                this.dynamicSpatial.setSpatialFromPosAndQuat(this.pos, this.quat);

                s = this.renderableGeometry.getRenderableSize();
                this.dynamicSpatial.applySpatialScaleXYZ(s, s, s);
                this.dynamicSpatial.setVisualSize(data.visual_size || 1);
                this.renderableGeometry.setRenderableVisualSize(this.dynamicSpatial.getVisualSize());
                this.dynamicSpatial.registerRigidBody(data.rigid_body);
                this.dynamicFeedback.initDynamicFeedback(data.dynamic_feedback, feedbackReady);
            }.bind(this);

            this.configObject = new ConfigObject('GEOMETRY', 'DYNAMIC_RENDERABLE', this.idKey);
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
            this.dynamicSpatial.getSpatialPosition(this.renderableGeometry.pos);
            this.dynamicSpatial.getSpatialQuaternion(this.renderableGeometry.quat);
            this.renderableGeometry.updateGeometryRenderable();
            this.applyRenderableVisibility(this.renderableGeometry.getIsVisibile())
        };

        DynamicRenderable.prototype.applyRenderableVisibility = function(isVisible) {
            this.renderableGeometry.applyVisibility(isVisible);
            this.dynamicSpatial.notifyVisibility(isVisible);
            this.dynamicFeedback.tickDynamicFeedback(this.dynamicSpatial, isVisible);
        };

        return DynamicRenderable;

    });

