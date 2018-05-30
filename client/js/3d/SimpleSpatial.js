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

            var group = skeleton.bones;

            var boneIndex = 0;
            var bonesConfig = [];

            var bones = [];

            var addBone = function(bone) {
                bonesConfig.push(buildBoneConfig(bone, boneIndex));
                boneIndex++;
                bones.push(bone);
            };


            var parseChildGroup = function(obj) {
                for (var j = 0; j < obj.length; j++) {

                    if (obj[j].type === 'Bone') {
                        addBone(obj[j])
                    }

                    if (obj[j].type === 'Group') {
                        addBone(obj[j]);
                        parseChildGroup(obj[j])
                    }
                }
            };


            var parseBoneGroup = function(obj) {
                for (var i = 0; i < obj.length; i++) {

                    if (obj[i].type === 'Bone') {
                        addBone(obj[i])
                    }

                    if (obj[i].type === 'Group') {
                        addBone(obj[i]);
                        parseChildGroup(obj[i])
                    }
                }
            };

            parseBoneGroup(group);

            this.dynamicSkeleton.applyBonesConfig(bonesConfig);

            for (var i = 0; i < bones.length; i++) {
                if (bones[i].type === 'Bone') {
                    var dynBone = this.dynamicSkeleton.getBoneByName(bones[i].name);
                    dynBone.inheritBonePosQuatScale(bones[i].position, bones[i].quaternion, bones[i].scale);
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

