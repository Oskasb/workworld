"use strict";

define([
        'worker/dynamic/DynamicSpatial',
        'worker/geometry/GeometryInstance',
        'ConfigObject'
    ],
    function(
        DynamicSpatial,
        GeometryInstance,
        ConfigObject
    ) {

        var forceApply = false;
        var torqueApply = false;

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempQuat = new THREE.Quaternion();


        var DynamicRenderable = function() {
            this.obj3d = new THREE.Object3D();
            this.dynamicSpatial = new DynamicSpatial();
            this.geometryInstance = new GeometryInstance();
            this.dynamicSpatial.setupSpatialBuffer();
        };

        DynamicRenderable.prototype.inheritObj3D = function(obj3d) {
            this.obj3d.position.copy(obj3d.position);
            this.obj3d.quaternion.copy(obj3d.quaternion);
        };

        DynamicRenderable.prototype.configRead = function(dataKey) {
            return this.configObject.getConfigByDataKey(dataKey)
        };

        DynamicRenderable.prototype.initRenderable = function(renderableId, onReady) {

            var configLoaded = function(data) {
                this.geometryInstance.setObject3d(this.obj3d);
                this.geometryInstance.setInstanceFxId(data.instance_id);
                this.dynamicSpatial.setSpatialFromObj3d(this.obj3d);

                var scale = 1+(Math.floor(Math.random()*4)*3);
                this.geometryInstance.setInstanceSize(scale);
                this.dynamicSpatial.applySpatialScaleXYZ(scale, scale, scale);
                this.dynamicSpatial.registerRigidBody(data.rigid_body);
                onReady(this);
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

            this.dynamicSpatial.setObj3dFromSpatial(this.geometryInstance.getObject3d());
            this.geometryInstance.updateGeometryInstance();
            this.dynamicSpatial.notifyVisibility(this.geometryInstance.getIsVisibile());
        };


        DynamicRenderable.prototype.sampleRenderableState = function() {

        };

        return DynamicRenderable;

    });

