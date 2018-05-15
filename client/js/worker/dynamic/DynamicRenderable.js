"use strict";

define([
        'worker/dynamic/DynamicSpatial',
        'worker/dynamic/DynamicFeedback',
        'worker/dynamic/ModuleRenderer',
        'worker/geometry/RenderableGeometry',
        'ConfigObject'
    ],
    function(
        DynamicSpatial,
        DynamicFeedback,
        ModuleRenderer,
        RenderableGeometry,
        ConfigObject
    ) {

        var DynamicRenderable = function() {
            this.idKey = '';
            this.scale = 1;

            this.cameraHome = new THREE.Vector3(0, 50, -200);
            this.cameraLook = new THREE.Vector3(0, 50, -200);
            this.controlPos = new THREE.Vector3();
            this.screenPos = new THREE.Vector3();

            this.selectSize = 8;

            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.scale3d = new THREE.Vector3();
            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicFeedback = new DynamicFeedback();
            this.isVisible = false;
            this.cameraDistance = 0;
            this.dynamicGamePiece = null;
            this.renderableGeometry = new RenderableGeometry();

            this.moduleRenderer = new ModuleRenderer();
            this.dynamicSpatial.setupSpatialBuffer();

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

                if (data.rigid_body.shape === "Box") {
                    this.scale3d.x *= data.rigid_body.args[0];
                    this.scale3d.y *= data.rigid_body.args[1];
                    this.scale3d.z *= data.rigid_body.args[2];
                }

                this.renderableGeometry.inheritScale3d(this.scale3d);
                this.dynamicSpatial.applySpatialScaleXYZ(this.scale3d.x, this.scale3d.y, this.scale3d.z);
                this.dynamicSpatial.setupMechanicalShape(data.rigid_body);
                this.dynamicSpatial.setVisualSize(data.visual_size || 1);

                this.renderableGeometry.inheritPosAndQuat(this.pos, this.quat);

                this.dynamicSpatial.setSpatialFromPosAndQuat(this.pos, this.quat);

                this.renderableGeometry.setRenderableVisualSize(this.dynamicSpatial.getVisualSize());
                this.dynamicFeedback.initDynamicFeedback(data.dynamic_feedback, feedbackReady);

                this.dynamicSpatial.registerRigidBody(data.rigid_body);

                if (data.instance_id) {
                    this.renderableGeometry.setupInstanceFxId(data.instance_id);
                } else if (data.model_id) {
                    this.renderableGeometry.setupStandardModelId(data.model_id, this.dynamicSpatial);
                } else {
                    console.log("No model_id or instance_id for dynamic renderable:", this.idKey);
                    return;
                }

                if (data.select_anchor) {
                    this.setSelectAnchorOffset(data.select_anchor.offset[0], data.select_anchor.offset[1], data.select_anchor.offset[2]);
                    this.setSelectAnchorSize(data.select_anchor.size);
                } else {
                    this.setSelectAnchorSize(this.dynamicSpatial.getVisualSize() * this.scale3d.manhattanLength()/3);
                }

                if (data.camera_home) {
                    this.setCameraHome(data.camera_home.offset[0], data.camera_home.offset[1], data.camera_home.offset[2]);
                    this.setCameraLook(data.camera_home.lookat[0], data.camera_home.lookat[1], data.camera_home.lookat[2]);
                } else {

                }

            }.bind(this);

            this.configObject = new ConfigObject('GEOMETRY', 'DYNAMIC_RENDERABLE', this.idKey);
            this.configObject.addCallback(configLoaded);

        };

        DynamicRenderable.prototype.setIsControlled = function(bool) {
            this.isControlled = bool;
        };

        DynamicRenderable.prototype.getIsControlled = function() {
            return this.isControlled;
        };

        DynamicRenderable.prototype.setCameraLook = function(x, y, z) {
            this.cameraLook.set(x, y, z);
        };

        DynamicRenderable.prototype.getCameraLook = function() {
            return this.cameraLook;
        };

        DynamicRenderable.prototype.setCameraHome = function(x, y, z) {
            this.cameraHome.set(x, y, z);
        };

        DynamicRenderable.prototype.getCameraHome = function() {
            return this.cameraHome;
        };

        DynamicRenderable.prototype.setGamePiece = function(dynamicGamePiece) {
            this.dynamicGamePiece = dynamicGamePiece;
        };

        DynamicRenderable.prototype.getGamePiece = function() {
            return this.dynamicGamePiece;
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


    //    DynamicRenderable.prototype.setRenderableScale = function(scl) {
    //        this.renderableGeometry.setRenderableSize(scl);
    //    };

        DynamicRenderable.prototype.setRenderablePosition = function(pos) {
            this.pos.copy(pos);
        };

        DynamicRenderable.prototype.setRenderableQuaternion = function(quat) {
            this.quat.copy(quat);
        };

        DynamicRenderable.prototype.setRenderableScaleXYZ = function(x, y, z) {
            this.scale3d.set(x, y, z);
        };

        DynamicRenderable.prototype.getControlPosition = function() {
            return this.controlPos;
        };

        DynamicRenderable.prototype.getDynamicScale = function(vec3) {
            return this.dynamicSpatial.getSpatialScale(vec3)
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

        DynamicRenderable.prototype.calculateCameraHome = function(vec3) {
            vec3.copy(this.getCameraHome());
            this.localToWorld(vec3);
        };

        DynamicRenderable.prototype.calculateCameraLook = function(vec3) {
            vec3.copy(this.getCameraLook());
            this.localToWorld(vec3);
        };

        DynamicRenderable.prototype.localToWorld = function(vec3) {
            vec3.applyQuaternion(this.renderableGeometry.quat);
            vec3.x+=this.pos.x;
            vec3.y+=this.pos.y;
            vec3.z+=this.pos.z;
        };

        DynamicRenderable.prototype.updateScreenSelectPosition = function() {

            if (this.selectAnchor) {
                this.controlPos.copy(this.selectAnchor);
                this.localToWorld(this.controlPos);
                this.cameraDistance = WorldAPI.getWorldCamera().calcDistanceToCamera(this.controlPos);
                WorldAPI.getWorldCamera().toScreenPosition(this.controlPos, this.screenPos);

            } else {
                this.controlPos.copy(this.pos);
                this.cameraDistance = WorldAPI.getWorldCamera().calcDistanceToCamera(this.controlPos);
                WorldAPI.getWorldCamera().toScreenPosition(this.controlPos, this.screenPos);
            }
        };

        DynamicRenderable.prototype.tickRenderable = function() {
            this.dynamicSpatial.getSpatialPosition(this.renderableGeometry.pos);
            this.dynamicSpatial.getSpatialQuaternion(this.renderableGeometry.quat);
            this.dynamicSpatial.getSpatialScale(this.renderableGeometry.scale3d);

            this.updateScreenSelectPosition();

            if (this.screenPos.z > 0) {
                this.isVisible = 1;
            } else {
                this.isVisible = this.renderableGeometry.updateGeometryRenderable();
            }

            if (this.getGamePiece()) {
                this.moduleRenderer.renderGamePieceModules(this.getGamePiece(), this)
            }

            this.applyRenderableVisibility(this.isVisible)
        };

        DynamicRenderable.prototype.applyRenderableVisibility = function(isVisible) {
            this.renderableGeometry.applyVisibility(isVisible);
            this.dynamicSpatial.notifyVisibility(isVisible);
            this.dynamicFeedback.tickDynamicFeedback(this.dynamicSpatial, isVisible);


            if (WorldAPI.getCom(ENUMS.BufferChannels.DRAW_DYN_SHAPES)) {
                this.renderableGeometry.drawDebugShapes(this.dynamicSpatial);
                this.debug = true;
            } else if (this.debug) {
                this.renderableGeometry.clearDebugShapes();
                this.debug = false;
            }

        };

        return DynamicRenderable;

    });

