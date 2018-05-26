"use strict";

define([
        'worker/dynamic/DynamicSpatial'
    ],
    function(
        DynamicSpatial
    ) {

        var skel;

        var SimpleSpatial = function(modelId, spatialBuffer) {
            this.obj3d = new THREE.Object3D();
            this.modelId = modelId;
            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicSpatial.setSpatialBuffer(spatialBuffer);
            this.bones = null;

        };


        SimpleSpatial.prototype.setGeometryQuaternion = function(quat) {

        };

        SimpleSpatial.prototype.setGeometrySize = function(size) {
            this.size = size;
        };

        SimpleSpatial.prototype.setupBones = function(skeleton) {

            var bones = skeleton.bones;

            this.bones = {};

            for (var i = 0; i < bones.length; i++) {

                if (bones[i].type === 'Bone') {
                    this.bones[bones[i].name] = bones[i];
                }

            }

        };

        SimpleSpatial.prototype.applyAnimationState = function(group) {

            if (!group) return;

            if (!this.bones) {
                this.setupBones(group.skeleton);
            }

            if (this.bones['radar_main']) {
                this.bones['radar_main'].rotateX(0.022)
            }

            if (this.bones['radar_mast_1']) {
                this.bones['radar_mast_1'].rotateX(0.065)
            }

            if (this.bones['radar_mast_2']) {
                this.bones['radar_mast_2'].rotateX(0.037)
            }

            if (this.bones['radar_mast_flat']) {
                this.bones['radar_mast_flat'].rotateX(-0.08)
            }

            if (this.bones['radar_square']) {
                this.bones['radar_square'].rotateX(0.046)
            }

            if (this.bones['radar_square_small']) {
                this.bones['radar_square_small'].rotateX(0.035)
            }


        };


        SimpleSpatial.prototype.updateSimpleSpatial = function() {
            this.dynamicSpatial.getSpatialPosition(this.obj3d.position);
            this.dynamicSpatial.getSpatialQuaternion(this.obj3d.quaternion);
            this.applyAnimationState(this.obj3d.children[0])


        };

        SimpleSpatial.prototype.applyGeometryVisibility = function(isVisible) {

            if (isVisible) {

            }

        };

        return SimpleSpatial;

    });

