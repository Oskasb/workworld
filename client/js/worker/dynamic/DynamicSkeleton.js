"use strict";

define([
        'worker/dynamic/DynamicBone'
    ],
    function(
        DynamicBone
    ) {

    var i;

        var DynamicSkeleton = function(spatialBuffer) {
            this.buffer = spatialBuffer;
            this.bones = [];
            this.boneMap = {};
        };

        DynamicSkeleton.prototype.addDynamicBone = function(boneConfig) {
            var dynamicBone = new DynamicBone(boneConfig.name, boneConfig.index, this.buffer);
            dynamicBone.setOriginalPosAndQuat(boneConfig.pos, boneConfig.quat);
            this.boneMap[boneConfig.name] = boneConfig.index;
            this.bones[boneConfig.index] = dynamicBone;
        };

        DynamicSkeleton.prototype.applyBonesConfig = function(bonesConfig) {
            for (i = 0; i < bonesConfig.length; i++) {
                this.addDynamicBone(bonesConfig[i].data);
            }
        };

        DynamicSkeleton.prototype.attachModelBone = function(bone, boneConfig) {
            this.bones[boneConfig.index].inheritBonePosAndQuat(bone.position, bone.quaternion);
        };

        DynamicSkeleton.prototype.getBoneByName = function(boneName) {
            return this.bones[this.boneMap[boneName]];
        };

        DynamicSkeleton.prototype.updateDynamicSkeleton = function() {
            for (i = 0; i < this.bones.length; i++) {
                this.bones[i].updateDynamicBone();
            }
        };

        DynamicSkeleton.prototype.notifyDynamicSkeletonFrame = function() {
            for (i = 0; i < this.bones.length; i++) {
                this.bones[i].notifyDynamicBoneFrame();
            }
        };



        return DynamicSkeleton;

    });

