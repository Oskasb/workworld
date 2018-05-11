"use strict";

define([
        'worker/dynamic/DynamicSpatial'
    ],
    function(
        DynamicSpatial
    ) {



        var SimpleSpatial = function(modelId, spatialBuffer) {
            this.obj3d = new THREE.Object3D();
            this.modelId = modelId;
            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicSpatial.setSpatialBuffer(spatialBuffer);
        };


        SimpleSpatial.prototype.setGeometryQuaternion = function(quat) {

        };

        SimpleSpatial.prototype.setGeometrySize = function(size) {
            this.size = size;
        };

        SimpleSpatial.prototype.renderGeometryInstance = function() {

        };

        SimpleSpatial.prototype.updateSimpleSpatial = function() {
            this.dynamicSpatial.getSpatialPosition(this.obj3d.position);
            this.dynamicSpatial.getSpatialQuaternion(this.obj3d.quaternion);
        };

        SimpleSpatial.prototype.applyGeometryVisibility = function(isVisible) {

            if (isVisible) {

            }

        };

        return SimpleSpatial;

    });

