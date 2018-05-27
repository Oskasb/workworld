"use strict";

define([
'ConfigObject',
        'worker/dynamic/DynamicSkeleton'
    ],
    function(
        ConfigObject,
        DynamicSkeleton
    ) {

        var StandardGeometry = function(modelId, dynamicSpatial) {
            this.modelId = modelId;
            this.dynamicSpatial = dynamicSpatial;
            WorldAPI.sendWorldMessage(ENUMS.Protocol.REGISTER_GEOMETRY, [this.modelId, this.dynamicSpatial.getSpatialBuffer()]);

            this.dynamicSkeleton = new DynamicSkeleton(this.dynamicSpatial.getSpatialBuffer());

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

        StandardGeometry.prototype.renderGeometryInstance = function() {

        };

        StandardGeometry.prototype.getDynamicBone = function(name) {
            return this.dynamicSkeleton.getBoneByName(name);
        };

        StandardGeometry.prototype.hideGeometryRenderable = function() {

        };

        StandardGeometry.prototype.applyGeometryVisibility = function(isVisible) {

            if (isVisible) {

            }
        };

        return StandardGeometry;

    });

