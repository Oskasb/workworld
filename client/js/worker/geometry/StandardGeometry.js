"use strict";

define([
        'ConfigObject',
        'worker/dynamic/DynamicSkeleton',
        'worker/dynamic/DynamicLights'
    ],
    function(
        ConfigObject,
        DynamicSkeleton,
        DynamicLights
    ) {

        var StandardGeometry = function(modelId, dynamicSpatial) {
            this.modelId = modelId;
            this.dynamicSpatial = dynamicSpatial;
            WorldAPI.sendWorldMessage(ENUMS.Protocol.REGISTER_GEOMETRY, [this.modelId, this.dynamicSpatial.getSpatialBuffer(), this.dynamicSpatial.bodyConfig, this.dynamicSpatial.pieceConfKey, this.dynamicSpatial.pieceConfId]);

            this.dynamicSkeleton = new DynamicSkeleton(this.dynamicSpatial.getSpatialBuffer());

            this.dynamicLights = new DynamicLights(this.dynamicSpatial.getSpatialBuffer());
            this.dynamicLights.attachModelConfig(modelId);

            var bonesData = function(x, data) {
                console.log("Get Bone Data", x, data, this.configObject);
                this.dynamicSkeleton.applyBonesConfig(data);

            }.bind(this);

            this.configObject = new ConfigObject('DYNAMIC_BONES', this.modelId, 'bones');
            this.configObject.addCallback(bonesData)
        };

        StandardGeometry.prototype.getBone = function(quat) {

        };

        StandardGeometry.prototype.setGeometryQuaternion = function(quat) {

        };

        StandardGeometry.prototype.setGeometrySize = function(size) {
            this.size = size;
        };

        StandardGeometry.prototype.renderGeometryInstance = function(isVisible) {
            if (isVisible) {
            }
        };

        StandardGeometry.prototype.getDynamicBone = function(name) {
            return this.dynamicSkeleton.getBoneByName(name);
        };

        StandardGeometry.prototype.getDynamicLight = function(id) {
            return this.dynamicLights.getLightById(id);
        };

        StandardGeometry.prototype.hideGeometryRenderable = function() {

        };

        StandardGeometry.prototype.applyGeometryVisibility = function(isVisible) {

            if (isVisible) {

            }
        };

        return StandardGeometry;

    });

