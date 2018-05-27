"use strict";

define([
        'worker/dynamic/DynamicSpatial',
        'worker/dynamic/DynamicSkeleton'
    ],
    function(
        DynamicSpatial,
        DynamicSkeleton
    ) {


        var buildBoneConfig = function(bone, boneIndex) {
            return {
                id:bone.name,
                data:{
                    name:bone.name,
                    index:boneIndex,
                    pos:[bone.position.x, bone.position.y, bone.position.z],
                    quat:[bone.quaternion.x, bone.quaternion.y,bone.quaternion.z, bone.quaternion.w]
                }
            }
        };

        var SimpleSpatial = function(modelId, spatialBuffer) {
            this.ready = false;
            this.obj3d = new THREE.Object3D();
            this.modelId = modelId;
            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicSkeleton = new DynamicSkeleton(spatialBuffer);
            this.dynamicSpatial.setSpatialBuffer(spatialBuffer);
        };

        SimpleSpatial.prototype.setupBones = function(skeleton) {

            var bones = skeleton.bones;

            var boneIndex = 0;
            var bonesConfig = [];

            for (var i = 0; i < bones.length; i++) {
                if (bones[i].type === 'Bone') {
                    bonesConfig.push(buildBoneConfig(bones[i], boneIndex));
                    boneIndex++
                }
            }

            this.dynamicSkeleton.applyBonesConfig(bonesConfig);

            for (i = 0; i < bones.length; i++) {
                if (bones[i].type === 'Bone') {
                    var dynBone = this.dynamicSkeleton.getBoneByName(bones[i].name);
                    dynBone.inheritBonePosAndQuat(bones[i].position, bones[i].quaternion);
                }
            }

            return bonesConfig;
        };

        SimpleSpatial.prototype.initDynamicSkeleton = function(group) {

            if (!group) return;

            if (!this.dynamicSkeleton.bones.length) {
                var bonesConfig = this.setupBones(group.skeleton);
            }

            this.ready = true;
            this.onReady(this, bonesConfig);
        };

        SimpleSpatial.prototype.updateSimpleSpatial = function() {
            if (!this.ready) {
                this.initDynamicSkeleton(this.obj3d.children[0])
            }

            this.dynamicSpatial.getSpatialPosition(this.obj3d.position);
            this.dynamicSpatial.getSpatialQuaternion(this.obj3d.quaternion);
            this.dynamicSkeleton.updateDynamicSkeleton()
        };

        SimpleSpatial.prototype.setReady = function(func) {
            this.onReady = func;
        };

        return SimpleSpatial;

    });

