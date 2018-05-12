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
            this.screenPos = new THREE.Vector3();

            this.selectSize = 8;

            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicFeedback = new DynamicFeedback();
            this.isVisible = false;
            this.cameraDistance = 0;
            this.renderableGeometry = new RenderableGeometry();

            this.dynamicSpatial.setupSpatialBuffer();
        };

        DynamicRenderable.prototype.setRenderableIdKey = function(id) {
            this.idKey = id;
        };

        DynamicRenderable.prototype.setSelectAnchorOffset = function(x, y, z) {
            this.selectAnchor = new THREE.Vector3(x, y, z);
        };

        DynamicRenderable.prototype.setSelectAnchorSize = function(size) {
            this.selectSize = size;
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

                if (data.select_anchor) {
                    this.setSelectAnchorOffset(data.select_anchor.offset[0], data.select_anchor.offset[1], data.select_anchor.offset[2]);
                    this.setSelectAnchorSize(data.select_anchor.size);
                } else {
                    this.setSelectAnchorSize(this.dynamicSpatial.getVisualSize()*s);
                }

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

        DynamicRenderable.prototype.updateScreenSelectPosition = function() {



            if (this.selectAnchor) {
                this.screenPos.copy(this.selectAnchor);
                this.screenPos.applyQuaternion(this.renderableGeometry.quat);
                this.screenPos.x+=this.pos.x;
                this.screenPos.y+=this.pos.y;
                this.screenPos.z+=this.pos.z;

                this.cameraDistance = WorldAPI.getWorldCamera().calcDistanceToCamera(this.screenPos);
                    WorldAPI.getWorldCamera().toScreenPosition(this.screenPos, this.screenPos);

            } else {
                this.cameraDistance = WorldAPI.getWorldCamera().calcDistanceToCamera(this.pos);
                WorldAPI.getWorldCamera().toScreenPosition(this.pos, this.screenPos);
            }
        };

        DynamicRenderable.prototype.tickRenderable = function() {
            this.dynamicSpatial.getSpatialPosition(this.renderableGeometry.pos);
            this.dynamicSpatial.getSpatialQuaternion(this.renderableGeometry.quat);

            this.updateScreenSelectPosition();

            if (this.screenPos.z > 0) {
                this.isVisible = 1;
            } else {
                this.isVisible = this.renderableGeometry.updateGeometryRenderable();
            }

            this.applyRenderableVisibility(this.isVisible)
        };

        DynamicRenderable.prototype.applyRenderableVisibility = function(isVisible) {
            this.renderableGeometry.applyVisibility(isVisible);
            this.dynamicSpatial.notifyVisibility(isVisible);
            this.dynamicFeedback.tickDynamicFeedback(this.dynamicSpatial, isVisible);
        };

        return DynamicRenderable;

    });

