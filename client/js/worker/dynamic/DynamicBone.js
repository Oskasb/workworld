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

            this.originalPos = new THREE.Vector3();
            this.originalQuat = new THREE.Quaternion();
            this.pos = new THREE.Vector3();
            this.quat = new THREE.Quaternion();
        };

        DynamicBone.prototype.setOriginalPosAndQuat = function(pos, quat) {
            this.originalPos.set(pos[0], pos[1], pos[2]);
            this.originalQuat.set(quat[0], quat[1], quat[2], quat[3])
        };

        DynamicBone.prototype.inheritBonePosAndQuat = function(pos, quat) {
            this.pos = pos;
            this.quat = quat;
            this.setDynamicBonePosition(pos);
            this.setDynamicBoneQuaternion(quat)
        };

        DynamicBone.prototype.setDynamicBoneUpdate = function(bool) {
            this.buffer[this.bsi + ENUMS.DynamicBone.HAS_UPDATE] = bool;
        };

        DynamicBone.prototype.getDynamicBoneUpdate = function() {
            return this.buffer[this.bsi + ENUMS.DynamicBone.HAS_UPDATE];
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
            this.setDynamicBoneUpdate(1);
        };

        DynamicBone.prototype.setDynamicBoneQuaternion = function(quat) {
            this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_X] = quat.x;
            this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_Y] = quat.y;
            this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_Z] = quat.z;
            this.buffer[this.bsi + ENUMS.DynamicBone.QUAT_W] = quat.w;
            this.setDynamicBoneUpdate(1);
        };

        DynamicBone.prototype.applyDynamicBoneUpdate = function() {
            this.getDynamicBonePosition(this.pos);
            this.getDynamicBoneQuaternion(this.quat);
        };

        DynamicBone.prototype.updateDynamicBone = function() {

            if (this.getDynamicBoneUpdate()) {
                this.applyDynamicBoneUpdate();
                this.setDynamicBoneUpdate(0);
            }

        };

        return DynamicBone;

    });
