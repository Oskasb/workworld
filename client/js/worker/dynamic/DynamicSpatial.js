"use strict";

define([

    ],
    function(

    ) {


        var MechanicalSphere = function(ofVec, radius) {
            this.offset = new THREE.Vector3();
            this.offset.copy(ofVec);
            this.radius = radius;
        };

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempQuat = new THREE.Quaternion();

        var TRANSFORM_AUX;
        var VECTOR_AUX;

        var DynamicSpatial = function() {

            this.mechanicalShapes = [];

            this.stillLimit = 5;
            this.visiblePingFrames = 200;
        };

        //Used inside the physics worker
        DynamicSpatial.prototype.setPhysicsBody = function(body) {

            if (!TRANSFORM_AUX) {
                TRANSFORM_AUX = new Ammo.btTransform();
                VECTOR_AUX = new Ammo.btVector3()
            }

            this.setSpatialBodyPointer(body.a);
            return this.body = body;
        };

        //Used inside the physics worker
        DynamicSpatial.prototype.setSpatialBuffer = function(buffer) {
            return this.spatialBuffer = buffer;

        };

        //Used inside the physics worker
        DynamicSpatial.prototype.setupMechanicalShape = function(body_config) {
            console.log("Request Physics for spatial from here...", body_config);

            if (body_config.shape === 'Compound') {

                for (var i = 0; i < body_config.args.length; i++) {
                    var offset = body_config.args[i].offset;
                    var args = body_config.args[i].args;
                    var radiusApprox = Math.pow(args[0]*args[1]*args[2] / (4/(3*3.14)), 0.333);
                    tempVec1.set(offset[0], offset[1], offset[2]);
                    this.mechanicalShapes.push(new MechanicalSphere(tempVec1, radiusApprox))
                }

            } else if (body_config.shape === 'Box') {
                var args = body_config.args;
                var radiusApprox = Math.pow(args[0]*args[1]*args[2] / (4/(3*3.14)), 0.333);
                tempVec1.set(0, 0, 0);
                this.mechanicalShapes.push(new MechanicalSphere(tempVec1, radiusApprox))
            } else {
                tempVec1.set(0, 0, 0);
                this.mechanicalShapes.push(new MechanicalSphere(tempVec1, 2))
            }

        };

        //Used in the Dynamic World Worker
        DynamicSpatial.prototype.registerRigidBody = function(msg) {
            console.log("Request Physics for spatial from here...", msg);
            WorldAPI.callSharedWorker(ENUMS.Worker.PHYSICS_WORLD, ENUMS.Protocol.PHYSICS_BODY_ADD, [msg, this.getSpatialBuffer()])// this.terrainBody = this.terrainFunctions.addTerrainToPhysics(this.terrainOptions, this.terrain.array1d, this.origin.x, this.origin.z);
        };

        //Used in the Dynamic World Worker
        DynamicSpatial.prototype.setupSpatialBuffer = function() {
            var sab = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * ENUMS.BufferSpatial.BUFFER_SIZE);
            this.spatialBuffer = new Float32Array(sab);
            this.applySpatialScaleXYZ(1, 1, 1);
        };

        DynamicSpatial.prototype.getSpatialBuffer = function() {
            return this.spatialBuffer;
        };

        DynamicSpatial.prototype.getSpatialPosition = function(storeVec) {
            storeVec.x = this.spatialBuffer[ENUMS.BufferSpatial.POS_X];
            storeVec.y = this.spatialBuffer[ENUMS.BufferSpatial.POS_Y];
            storeVec.z = this.spatialBuffer[ENUMS.BufferSpatial.POS_Z];
            return storeVec;
        };

        DynamicSpatial.prototype.getSpatialQuaternion = function(storeQuat) {
            storeQuat.x = this.spatialBuffer[ENUMS.BufferSpatial.QUAT_X];
            storeQuat.y = this.spatialBuffer[ENUMS.BufferSpatial.QUAT_Y];
            storeQuat.z = this.spatialBuffer[ENUMS.BufferSpatial.QUAT_Z];
            storeQuat.w = this.spatialBuffer[ENUMS.BufferSpatial.QUAT_W];
            return storeQuat;
        };

        DynamicSpatial.prototype.getSpatialScale = function(storeVec) {
            storeVec.x = this.spatialBuffer[ENUMS.BufferSpatial.SCALE_X];
            storeVec.y = this.spatialBuffer[ENUMS.BufferSpatial.SCALE_Y];
            storeVec.z = this.spatialBuffer[ENUMS.BufferSpatial.SCALE_Z];
            return storeVec;
        };

        DynamicSpatial.prototype.getVectorByFirstIndex = function(indx, storeVec) {
            storeVec.x = this.spatialBuffer[indx];
            storeVec.y = this.spatialBuffer[indx+1];
            storeVec.z = this.spatialBuffer[indx+2];
            return storeVec;
        };

        DynamicSpatial.prototype.copyBufferAByFirstIndexToBufferB = function(indxA, indxB) {
            this.spatialBuffer[indxB]   = this.spatialBuffer[indxA];
            this.spatialBuffer[indxB+1] = this.spatialBuffer[indxA+1];
            this.spatialBuffer[indxB+2] = this.spatialBuffer[indxA+2];
        };

        DynamicSpatial.prototype.bufferAByFirstIndexSubBufferB = function(indxA, indxB) {
            this.spatialBuffer[indxA]   -= this.spatialBuffer[indxB];
            this.spatialBuffer[indxA+1] -= this.spatialBuffer[indxB+1];
            this.spatialBuffer[indxA+2] -= this.spatialBuffer[indxB+2];
        };

        DynamicSpatial.prototype.applySpatialPositionXYZ = function(x, y, z) {
            this.spatialBuffer[ENUMS.BufferSpatial.POS_X] = x;
            this.spatialBuffer[ENUMS.BufferSpatial.POS_Y] = y;
            this.spatialBuffer[ENUMS.BufferSpatial.POS_Z] = z;
        };

        DynamicSpatial.prototype.applySpatialQuaternionXYZW = function(x, y, z, w) {
            this.spatialBuffer[ENUMS.BufferSpatial.QUAT_X] = x;
            this.spatialBuffer[ENUMS.BufferSpatial.QUAT_Y] = y;
            this.spatialBuffer[ENUMS.BufferSpatial.QUAT_Z] = z;
            this.spatialBuffer[ENUMS.BufferSpatial.QUAT_W] = w;
        };

        DynamicSpatial.prototype.applySpatialScaleXYZ = function(x, y, z) {
            this.spatialBuffer[ENUMS.BufferSpatial.SCALE_X] = x;
            this.spatialBuffer[ENUMS.BufferSpatial.SCALE_Y] = y;
            this.spatialBuffer[ENUMS.BufferSpatial.SCALE_Z] = z;
        };

        DynamicSpatial.prototype.applyVelocityXYZ = function(x, y, z) {
            this.spatialBuffer[ENUMS.BufferSpatial.VELOCITY_X] = x;
            this.spatialBuffer[ENUMS.BufferSpatial.VELOCITY_Y] = y;
            this.spatialBuffer[ENUMS.BufferSpatial.VELOCITY_Z] = z;
        };

        DynamicSpatial.prototype.applyAngularVelocityXYZ = function(x, y, z) {
            this.spatialBuffer[ENUMS.BufferSpatial.ANGULAR_VEL_X] = x;
            this.spatialBuffer[ENUMS.BufferSpatial.ANGULAR_VEL_Y] = y;
            this.spatialBuffer[ENUMS.BufferSpatial.ANGULAR_VEL_Z] = z;
        };

        DynamicSpatial.prototype.getSpatialForce = function(storeVec) {
            storeVec.x = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_X];
            storeVec.y = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Y];
            storeVec.z = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Z];
        };

        DynamicSpatial.prototype.applySpatialImpulseVector = function(threeVec) {
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_X] += threeVec.x;
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Y] += threeVec.y;
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Z] += threeVec.z;
            this.setSpatialStillFrames(0)
        };

        DynamicSpatial.prototype.getSpatialTorque = function(storeVec) {
            storeVec.x = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_X];
            storeVec.y = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Y];
            storeVec.z = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Z];
        };

        DynamicSpatial.prototype.applySpatialTorqueVector = function(threeVec) {
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_X] += threeVec.x;
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Y] += threeVec.y;
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Z] += threeVec.z;
            this.setSpatialStillFrames(0)
        };

        DynamicSpatial.prototype.bufferContainsForce = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.FORCE_X] || this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Y] || this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Z];
        };

        DynamicSpatial.prototype.bufferContainsTorque = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_X] || this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Y] || this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Z];
        };

        DynamicSpatial.prototype.getTorqueApplied = function(storeVec) {
            storeVec.x = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_APPLIED_X];
            storeVec.y = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_APPLIED_Y];
            storeVec.z = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_APPLIED_Z];
        };

        DynamicSpatial.prototype.getForceApplied = function(storeVec) {
            storeVec.x = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_APPLIED_X];
            storeVec.y = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_APPLIED_Y];
            storeVec.z = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_APPLIED_Z];
        };

        DynamicSpatial.prototype.clearSpatialForce = function() {
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_APPLIED_X] = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_X];
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_APPLIED_Y] = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Y];
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_APPLIED_Z] = this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Z];
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_X] = 0;
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Y] = 0;
            this.spatialBuffer[ENUMS.BufferSpatial.FORCE_Z] = 0;
        };

        DynamicSpatial.prototype.clearSpatialTorque = function() {
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_APPLIED_X] = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_X];
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_APPLIED_Y] = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Y];
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_APPLIED_Z] = this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Z];
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_X] = 0;
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Y] = 0;
            this.spatialBuffer[ENUMS.BufferSpatial.TORQUE_Z] = 0;
        };


        DynamicSpatial.prototype.setSpatialBodyPointer = function(ptr) {
            this.spatialBuffer[ENUMS.BufferSpatial.BODY_POINTER] = ptr;
        };

        DynamicSpatial.prototype.getSpatialBodyPointer = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.BODY_POINTER];
        };

        DynamicSpatial.prototype.setVisualSize = function(size) {
            this.spatialBuffer[ENUMS.BufferSpatial.VISUAL_SIZE] = size;
        };

        DynamicSpatial.prototype.getVisualSize = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.VISUAL_SIZE];
        };

        DynamicSpatial.prototype.setSpatialBodyMass = function(mass) {
            this.spatialBuffer[ENUMS.BufferSpatial.BODY_MASS] = mass;
        };

        DynamicSpatial.prototype.getSpatialBodyMass = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.BODY_MASS];
        };

        DynamicSpatial.prototype.setSpatialDynamicFlag = function(value) {
            this.spatialBuffer[ENUMS.BufferSpatial.DYNAMIC] = value;
        };

        DynamicSpatial.prototype.getSpatialDynamicFlag = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.DYNAMIC];
        };

        DynamicSpatial.prototype.setSpatialSimulateFlag = function(value) {
            this.spatialBuffer[ENUMS.BufferSpatial.SIMULATE] = value;
        };

        DynamicSpatial.prototype.getSpatialSimulateFlag = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.SIMULATE];
        };

        DynamicSpatial.prototype.setSpatialDisabledFlag = function(value) {
            this.spatialBuffer[ENUMS.BufferSpatial.BODY_IS_DISABLED] = value;
        };

        DynamicSpatial.prototype.getSpatialDisabledFlag = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.BODY_IS_DISABLED];
        };

        DynamicSpatial.prototype.setSpatialStillFrames = function(value) {
            this.spatialBuffer[ENUMS.BufferSpatial.STILL_FRAMES] = value;
        };

        DynamicSpatial.prototype.getSpatialStillFrames = function() {
            return this.spatialBuffer[ENUMS.BufferSpatial.STILL_FRAMES];
        };

        DynamicSpatial.prototype.isStatic = function() {
            return 1 - this.getSpatialDynamicFlag();
        };

        DynamicSpatial.prototype.setSpatialFromPosAndQuat = function(pos, quat) {
            this.applySpatialPositionXYZ(pos.x, pos.y,pos.z);
            this.applySpatialQuaternionXYZW(quat.x, quat.y,quat.z, quat.w)
        };


        DynamicSpatial.prototype.getScaleKey = function() {
            return '_scale_'+this.spatialBuffer[ENUMS.BufferSpatial.SCALE_X]+this.spatialBuffer[ENUMS.BufferSpatial.SCALE_Y]+this.spatialBuffer[ENUMS.BufferSpatial.SCALE_Z]
        };

        DynamicSpatial.prototype.notifyVisibility = function(isVisible) {

            if (isVisible) {
                if (this.getSpatialStillFrames() > this.visiblePingFrames) {
                    this.setSpatialStillFrames(this.stillLimit-2);
                }
            } else {

            }
        };

        DynamicSpatial.prototype.tickPhysicsForces = function(ammoApi) {

            if (this.bufferContainsTorque() || this.bufferContainsForce()) {
                console.log("Apply forces...");
                this.getSpatialForce(tempVec1);
                this.getSpatialTorque(tempVec2);
                ammoApi.applyForceAndTorqueToBody(tempVec1, this.body, tempVec2)
            }
        };

        DynamicSpatial.prototype.testVectorByFirstIndex = function(indx) {
            return (Math.abs(this.spatialBuffer[indx]) + Math.abs(this.spatialBuffer[indx+1]) + Math.abs(this.spatialBuffer[indx+2]))
        };

        var motion;

        DynamicSpatial.prototype.testSpatialMotion = function() {
            motion = this.testVectorByFirstIndex(ENUMS.BufferSpatial.VELOCITY_X)+this.testVectorByFirstIndex(ENUMS.BufferSpatial.ANGULAR_VEL_X);

            if (motion < 0.0001) {
                this.setSpatialStillFrames(this.getSpatialStillFrames()+1);
            } else {
                this.setSpatialStillFrames(0);
            }

        };

        DynamicSpatial.prototype.tickPhysicsUpdate = function(ammoApi) {

            this.testSpatialMotion();



            if (this.getSpatialStillFrames() < this.stillLimit) {
                this.setSpatialSimulateFlag(1)
            } else {
                this.setSpatialSimulateFlag(0)
            }

            if (this.getSpatialSimulateFlag()) {

                if (this.getSpatialDisabledFlag()) {
                    ammoApi.includeBody(this.body);
                    this.setSpatialDisabledFlag(0);
                }
                this.tickPhysicsForces(ammoApi);

            } else {

                if (!this.getSpatialDisabledFlag()) {
                    ammoApi.excludeBody(this.body);
                    this.setSpatialDisabledFlag(1);
                }
            }

            this.clearSpatialForce();
            this.clearSpatialTorque();

        };

        var vel;
        var angVel;

        DynamicSpatial.prototype.sampleBodyState = function() {

            if (this.getSpatialDisabledFlag()) {
                return;
            }

            this.copyBufferAByFirstIndexToBufferB(ENUMS.BufferSpatial.VELOCITY_X, ENUMS.BufferSpatial.ACCELERATION_X);
            this.copyBufferAByFirstIndexToBufferB(ENUMS.BufferSpatial.ANGULAR_VEL_X, ENUMS.BufferSpatial.ANGULAR_ACCEL_X);

            if (!this.body.getMotionState) {
                PhysicsWorldAPI.registerPhysError();
                console.log("Bad physics body", this.body);
                return;
            }

            var ms = this.body.getMotionState();
            if (ms) {
                ms.getWorldTransform(TRANSFORM_AUX);
                var p = TRANSFORM_AUX.getOrigin();
                var q = TRANSFORM_AUX.getRotation();
                if (isNaN(p.x())) {

                    PhysicsWorldAPI.registerPhysError();

                    if (Math.random() < 0.1) {
                        console.log("Bad body transform", this.body)
                    }
                    return;
                }

                this.applySpatialPositionXYZ(p.x(), p.y(), p.z());
                this.applySpatialQuaternionXYZW(q.x(), q.y(), q.z(), q.w());

                vel = this.body.getLinearVelocity();
                this.applyVelocityXYZ(vel.x(), vel.y(), vel.z());

                angVel = this.body.getAngularVelocity();
                this.applyAngularVelocityXYZ(angVel.x(), angVel.y(), angVel.z());

            } else {
                PhysicsWorldAPI.registerPhysError();
            }

            this.bufferAByFirstIndexSubBufferB(ENUMS.BufferSpatial.ACCELERATION_X, ENUMS.BufferSpatial.VELOCITY_X);
            this.bufferAByFirstIndexSubBufferB(ENUMS.BufferSpatial.ANGULAR_ACCEL_X, ENUMS.BufferSpatial.ANGULAR_VEL_X);

        };


        return DynamicSpatial;

    });

