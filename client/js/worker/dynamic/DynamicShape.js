"use strict";

define([

    ],
    function(

    ) {

        var calcObj = new THREE.Object3D();
        var tempVec = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempVec3 = new THREE.Vector3();
        var tempQuat = new THREE.Quaternion();

        var DynamicShape = function(shapeConfig, shapeIndex, buffer) {


            this.id = shapeConfig.id;
            this.index = shapeIndex;
            this.buffer = buffer;

            this.bsi = ENUMS.BufferSpatial.DYNAMIC_FIRST_INDEX + ENUMS.DynamicShape.STRIDE * this.index;

            if (this.bsi > ENUMS.BufferSpatial.BUFFER_SIZE + ENUMS.DynamicShape.STRIDE) {
                console.log("SHAPE BUFFER OVERFLOW..");
            }

            this.offset = new THREE.Vector3();
            this.size = new THREE.Vector3();
            this.rotation = new THREE.Quaternion();
            this.quat = new THREE.Quaternion();
            this.direction = new THREE.Vector3();
            this.impulseVector = new THREE.Vector3();
            this.radius = 0;
            this.applyShapeConfig(shapeConfig);
        };

        DynamicShape.prototype.applyShapeConfig = function(conf) {
            if (conf.shape === 'Box') {
                this.size.set(conf.args[0],conf.args[1],conf.args[2]);

                this.direction.set(0, 0, 1);

                if (conf.offset) {
                    this.offset.set(conf.offset[0],conf.offset[1],conf.offset[2]);
                }

                if (conf.rotation) {
                    calcObj.rotation.set(conf.rotation[0],conf.rotation[1],conf.rotation[2]);
                    this.rotation.copy(calcObj.quaternion);
                }

                this.setDynamicShapeQuaternion(this.rotation);
                this.direction.applyQuaternion(this.rotation);
                this.quat.copy(this.rotation);
                this.updateRadius();

            } else {
                console.log("Non Box Shape.. NOT SUPPORTED!");
            }
        };

        DynamicShape.prototype.approximateRadius = function(size) {
            return Math.pow( size.x*size.y*size.z / (4/(3*3.14)), 0.333);
        };

        DynamicShape.prototype.updateRadius = function() {
            this.radius = this.approximateRadius(this.size);
        };

        DynamicShape.prototype.scaleDynamicShape = function(vec3) {
            this.offset.x *= vec3.x;
            this.offset.y *= vec3.y;
            this.offset.z *= vec3.z;
            this.size.x *= vec3.x;
            this.size.y *= vec3.y;
            this.size.z *= vec3.z;
            this.updateRadius();
            this.setDynamicShapeOffset(this.offset);
        };

        DynamicShape.prototype.getVectorByFirstIndex = function(indx, storeVec) {
            storeVec.x = this.buffer[indx];
            storeVec.y = this.buffer[indx+1];
            storeVec.z = this.buffer[indx+2];
            return storeVec;
        };

        DynamicShape.prototype.setVectorByFirstIndex = function(indx, vec3) {
            this.buffer[indx]   =vec3.x;
            this.buffer[indx+1] =vec3.y;
            this.buffer[indx+2] =vec3.z
        };

        DynamicShape.prototype.addVectorByFirstIndex = function(indx, vec3) {
            this.buffer[indx]  +=vec3.x;
            this.buffer[indx+1]+=vec3.y;
            this.buffer[indx+2]+=vec3.z
        };

        DynamicShape.prototype.setDynamicShapeQuaternion = function(quat) {
            this.buffer[this.bsi + ENUMS.DynamicShape.QUAT_X] = quat.x;
            this.buffer[this.bsi + ENUMS.DynamicShape.QUAT_Y] = quat.y;
            this.buffer[this.bsi + ENUMS.DynamicShape.QUAT_Z] = quat.z;
            this.buffer[this.bsi + ENUMS.DynamicShape.QUAT_W] = quat.w;
        };

        DynamicShape.prototype.getDynamicShapeQuaternion = function(quat) {
            quat.x = this.buffer[this.bsi + ENUMS.DynamicShape.QUAT_X];
            quat.y = this.buffer[this.bsi + ENUMS.DynamicShape.QUAT_Y];
            quat.z = this.buffer[this.bsi + ENUMS.DynamicShape.QUAT_Z];
            quat.w = this.buffer[this.bsi + ENUMS.DynamicShape.QUAT_W]
        };

        DynamicShape.prototype.clearDynamicShapeForce = function() {
            this.buffer[this.bsi + ENUMS.DynamicShape.HAS_FORCE] = 0;
            this.buffer[this.bsi + ENUMS.DynamicShape.FORCE_APPLIED_X] = 0;
            this.buffer[this.bsi + ENUMS.DynamicShape.FORCE_APPLIED_Y] = 0;
            this.buffer[this.bsi + ENUMS.DynamicShape.FORCE_APPLIED_Z] = 0
        };

        DynamicShape.prototype.addForceToDynamicShape = function(vec3) {
            this.buffer[this.bsi + ENUMS.DynamicShape.HAS_FORCE] = 1;
            this.addVectorByFirstIndex(this.bsi + ENUMS.DynamicShape.FORCE_APPLIED_X, vec3);
        };

        DynamicShape.prototype.getDynamicShapeForce = function(vec3) {
            return this.getVectorByFirstIndex(this.bsi + ENUMS.DynamicShape.FORCE_APPLIED_X, vec3);
        };

        DynamicShape.prototype.setDynamicShapeOffset = function(vec3) {
            this.setVectorByFirstIndex(this.bsi + ENUMS.DynamicShape.OFFSET_X, vec3);
        };

        DynamicShape.prototype.getDynamicShapeOffset = function(vec3) {
            return this.getVectorByFirstIndex(this.bsi + ENUMS.DynamicShape.OFFSET_X, vec3);
        };


        DynamicShape.prototype.hasDynamicShapeForce = function() {
            return this.buffer[this.bsi + ENUMS.DynamicShape.HAS_FORCE];
        };

        DynamicShape.prototype.sampleBufferState = function() {
            this.getDynamicShapeQuaternion(this.rotation);
            this.getDynamicShapeOffset(this.offset);
        };

        DynamicShape.prototype.getOriginalRotation = function(quat) {
            quat.copy(this.quat);
        };

        DynamicShape.prototype.calculateWorldPosition = function(parentPos, parentQuat, store) {

            store.copy(this.offset);
            store.applyQuaternion(parentQuat);
            store.addVectors(store, parentPos);

        };

        DynamicShape.prototype.calculateVelocityFromAngularVelocity = function(angularVelocity, store) {
            store.crossVectors(angularVelocity , this.offset);
        };

        DynamicShape.prototype.applyDynamicShapeForceToBody = function(ammoApi, body) {
            if (this.hasDynamicShapeForce()) {
                this.getDynamicShapeForce(this.impulseVector);
                this.getDynamicShapeOffset(this.offset);
                PhysicsWorldAPI.applyLocalForceToBodyPoint(this.impulseVector, body, this.offset);
                this.clearDynamicShapeForce();
            }
        };


        return DynamicShape;

    });

