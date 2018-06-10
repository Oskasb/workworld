"use strict";

define([

    ],
    function(

    ) {

        var DynamicBone = function(boneName, boneIndex, buffer) {
            this.name = boneName;
            this.index = boneIndex;
            this.buffer = buffer;

            this.bsi = ENUMS.BufferSpatial.BONE_FIRST_INDEX + ENUMS.DynamicBone.STRIDE * this.index;

            if (this.bsi > ENUMS.BufferSpatial.BUFFER_SIZE + ENUMS.DynamicBone.STRIDE) {
                console.log("BONE BUFFER OVERFLOW..");
            }

            this.quatUpdate = false;
            this.scaleupdate = false;
            this.posUpdate = false;

            this.originalPos = new THREE.Vector3();
            this.originalScale = new THREE.Vector3(1, 1, 1);
            this.originalQuat = new THREE.Quaternion();
            this.pos = new THREE.Vector3();
            this.scale = new THREE.Vector3(1, 1, 1);
            this.quat = new THREE.Quaternion();
        };

        DynamicBone.prototype.setOriginalPosAndQuat = function(pos, quat) {
            this.originalPos.set(pos[0], pos[1], pos[2]);
            this.originalQuat.set(quat[0], quat[1], quat[2], quat[3])
        };

        DynamicBone.prototype.inheritBonePosQuatScale = function(pos, quat, scale) {
            this.pos = pos;
            this.quat = quat;
            this.scale = scale;
            this.setDynamicBonePosition(pos);
            this.setDynamicBoneQuaternion(quat);
            this.setDynamicBoneScale(scale)
        };

        DynamicBone.prototype.setDynamicBoneUpdate = function(bool) {
            this.buffer[this.bsi + ENUMS.DynamicBone.HAS_UPDATE] = bool;
            if (bool === 0) {
                this.posUpdate = 0;
                this.scaleUpdate = 0;
                this.quatUpdate = 0;
            }
        };

        DynamicBone.prototype.getDynamicBoneUpdate = function() {
            return this.buffer[this.bsi + ENUMS.DynamicBone.HAS_UPDATE];
        };

        DynamicBone.prototype.getDynamicBoneScale = function(store) {
            store.x = this.buffer[this.bsi + ENUMS.DynamicBone.SCALE_X];
            store.y = this.buffer[this.bsi + ENUMS.DynamicBone.SCALE_Y];
            store.z = this.buffer[this.bsi + ENUMS.DynamicBone.SCALE_Z]
        };


        DynamicBone.prototype.getDynamicBonePosition = function(store) {
            store.x = this.buffer[this.bsi + ENUMS.DynamicBone.POS_X];
            store.y = this.buffer[this.bsi + ENUMS.DynamicBone.POS_Y];
            store.z = this.buffer[this.bsi + ENUMS.DynamicBone.POS_Z]
        };

        DynamicBone.prototype.getDynamicBoneQuaternion = function(store) {
            store.x = this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_X];
            store.y = this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_Y];
            store.z = this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_Z];
            store.w = this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_W];
        };

        DynamicBone.prototype.setDynamicBonePosition = function(pos) {
            this.buffer[this.bsi + ENUMS.DynamicBone.POS_X] = pos.x;
            this.buffer[this.bsi + ENUMS.DynamicBone.POS_Y] = pos.y;
            this.buffer[this.bsi + ENUMS.DynamicBone.POS_Z] = pos.z;
            this.posUpdate = 1;
            this.setDynamicBoneUpdate(1);
        };

        DynamicBone.prototype.setDynamicBoneScale = function(scale) {
            this.buffer[this.bsi + ENUMS.DynamicBone.SCALE_X] = scale.x;
            this.buffer[this.bsi + ENUMS.DynamicBone.SCALE_Y] = scale.y;
            this.buffer[this.bsi + ENUMS.DynamicBone.SCALE_Z] = scale.z;
            this.scaleUpdate = 1;
            this.setDynamicBoneUpdate(1);
        };

        DynamicBone.prototype.setDynamicBoneQuaternion = function(quat) {
            this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_X] = quat.x;
            this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_Y] = quat.y;
            this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_Z] = quat.z;
            this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_W] = quat.w;
            this.quatUpdate = 1;
            this.setDynamicBoneUpdate(1);
        };

        DynamicBone.prototype.applyDynamicBoneUpdate = function() {
            this.getDynamicBonePosition(this.pos);
            this.getDynamicBoneQuaternion(this.quat);
            this.getDynamicBoneScale(this.scale);
        };

        DynamicBone.prototype.resetDynamicBoneQuat = function() {
            this.setDynamicBoneQuaternion(this.originalQuat)
        };

        DynamicBone.prototype.resetDynamicBonePos = function() {
            this.setDynamicBonePosition(this.originalPos)
        };

        DynamicBone.prototype.resetDynamicBoneScale = function() {
            this.setDynamicBoneScale(this.originalScale)
        };

        DynamicBone.prototype.updateDynamicBone = function() {

            if (this.getDynamicBoneUpdate()) {
                this.applyDynamicBoneUpdate();
                this.setDynamicBoneUpdate(0);
            }

        };

        return DynamicBone;

    });

