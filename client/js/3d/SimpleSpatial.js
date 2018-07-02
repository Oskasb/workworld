"use strict";

define([
        'worker/dynamic/DynamicSpatial',
        'worker/dynamic/DynamicSkeleton',
        'worker/dynamic/DynamicLights',
        'worker/dynamic/DynamicCanvas'
    ],
    function(
        DynamicSpatial,
        DynamicSkeleton,
        DynamicLights,
        DynamicCanvas
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

        var SimpleSpatial = function(modelId, spatialBuffer, pieceConfKey, pieceConfId) {
            this.ready = false;
            this.obj3d = new THREE.Object3D();
            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
            this.modelId = modelId;
            this.dynamicSpatial = new DynamicSpatial();
            this.dynamicLights = new DynamicLights(spatialBuffer);
            this.dynamicSkeleton = new DynamicSkeleton(spatialBuffer);
            this.dynamicSpatial.setSpatialBuffer(spatialBuffer)
        };

        SimpleSpatial.prototype.getSkeletons = function(rootGroup) {

            var skeletons = [];

            if (rootGroup.skeleton) {
                skeletons.push(rootGroup.skeleton)
            }

            for (var i = 0; i < rootGroup.children.length; i++) {
                if (rootGroup.children[i].skeleton) {
                    skeletons.push(rootGroup.children[i].skeleton)
                }

                if (rootGroup.children[i].type === 'Group') {
            //        skeletons.push(rootGroup.children[i].children)
                }

            }

            return skeletons;
        };

        SimpleSpatial.prototype.parseSkeleton = function(skeleton, bonesConfig, bones) {

            var group = skeleton.bones;

            var addBone = function(bone) {

                if (bones.indexOf(bone) === -1) {

                    bonesConfig.push(buildBoneConfig(bone, boneIndex));
                    boneIndex++;
                    bones.push(bone);

                }
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
        };

        var boneIndex;

        SimpleSpatial.prototype.setupBones = function(rootGroup) {


            var skeletons = this.getSkeletons(rootGroup);

            if (!skeletons.length) return;

            boneIndex = 0;

            var bonesConfig = [];
            var bones = [];

            for (var i = 0; i < skeletons.length; i++) {
                this.parseSkeleton(skeletons[i], bonesConfig, bones)
            }

            this.dynamicSkeleton.applyBonesConfig(bonesConfig);

            for (var i = 0; i < bones.length; i++) {
                if (bones[i].type === 'Bone') {
                    var dynBone = this.dynamicSkeleton.getBoneByName(bones[i].name);
                    dynBone.inheritBonePosQuatScale(bones[i].position, bones[i].quaternion, bones[i].scale);
                }
            }

            return bonesConfig;
        };

        SimpleSpatial.prototype.initDynamicModel = function(group) {

            if (!group) return;

            if (!this.dynamicSkeleton.bones.length) {
                var bonesConfig = this.setupBones(group);
            }

            if (group.userData.canvasTextures) {

                this.dynamicLights.initDynamicLights(group.userData.dynamicTexture);

                for (var key in group.userData.canvasTextures) {
                    for (var i = 0; i < group.userData.canvasTextures[key].length; i++) {
                        this.dynamicLights.addDynamicCanvas(new DynamicCanvas(group.userData.canvasTextures[key][i]))
                    }
                }

            }

            this.ready = true;
            this.onReady(this, bonesConfig);
        };

        SimpleSpatial.prototype.updateSimpleSpatial = function() {

            if (!this.ready) {
                this.initDynamicModel(this.obj3d.children[0]);
                return;
            }

            this.dynamicSpatial.getSpatialPosition(this.pos);
            this.dynamicSpatial.getSpatialQuaternion(this.quat);
            this.dynamicSkeleton.updateDynamicSkeleton();
            this.dynamicLights.updateDynamicLights();
        };

        SimpleSpatial.prototype.getDynamicSpatial = function() {
            return this.dynamicSpatial
        };

        SimpleSpatial.prototype.setReady = function(func) {
            this.onReady = func;
        };

        return SimpleSpatial;

    });