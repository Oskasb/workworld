"use strict";

define([

    ],
    function(

    ) {

        var StandardGeometry = function(modelId, dynamicSpatial) {
            this.modelId = modelId;
            this.dynamicSpatial = dynamicSpatial;
            WorldAPI.sendWorldMessage(ENUMS.Protocol.REGISTER_GEOMETRY, [this.modelId, this.dynamicSpatial.getSpatialBuffer()]);
        };


        StandardGeometry.prototype.setGeometryQuaternion = function(quat) {

        };

        StandardGeometry.prototype.setGeometrySize = function(size) {
            this.size = size;
        };

        StandardGeometry.prototype.renderGeometryInstance = function() {

        };

        StandardGeometry.prototype.hideGeometryRenderable = function() {

        };

        StandardGeometry.prototype.applyGeometryVisibility = function(isVisible) {

            if (isVisible) {

            }
        };

        return StandardGeometry;

    });

