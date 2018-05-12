"use strict";

define([
    ],
    function(

    ) {

    var mecSubmergedDepth;

        var tempVec = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempVec3 = new THREE.Vector3();
        var tempQuat = new THREE.Quaternion();

        var tempVelVec = new THREE.Vector3();
        var tempAngVelVec = new THREE.Vector3();

        var tempVolumeVelVec = new THREE.Vector3();

        var tempVecGlobalPos = new THREE.Vector3();

        var velDot;
        var submergedFraction;

        var totalSubmergedVolume;

        var unsubmergedVolume;

        var currentTime;

        var radius;

        var totalVolForce;
        var shapeVolForce;

        var WaterPhysics = function(physicsApi) {
        };


        var waveHeight = function(pos) {
            currentTime = PhysicsWorldAPI.getCom(ENUMS.BufferChannels.FRAME_RENDER_TIME);
            return 1.0 * (Math.sin(currentTime*0.33 + pos.x * 0.04) + Math.cos(currentTime * 0.28 + pos.z * 0.06));

        };

        WaterPhysics.prototype.processWaterProximity = function(dynSpat, physTpf) {
            dynSpat.getSpatialQuaternion(tempQuat);
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.VELOCITY_X, tempVelVec);
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.ANGULAR_VEL_X, tempAngVelVec);

            totalSubmergedVolume = 0;
            unsubmergedVolume = 0;
            totalVolForce = 0;
            for (var i = 0; i < dynSpat.mechanicalShapes.length; i++) {

                tempVec2.copy(dynSpat.mechanicalShapes[i].offset);

                tempVolumeVelVec.crossVectors(tempVec2, tempAngVelVec);

                tempVec2.applyQuaternion(tempQuat);

                tempVecGlobalPos.addVectors(tempVec2, tempVec);

                radius = dynSpat.mechanicalShapes[i].radius;

                mecSubmergedDepth = tempVec.y + tempVec2.y - radius + waveHeight(tempVecGlobalPos);

                unsubmergedVolume += MATH.sphereDisplacement(radius, radius*2);

                if (mecSubmergedDepth < 0) {
                    var displacement = MATH.sphereDisplacement(radius, -mecSubmergedDepth);

                    unsubmergedVolume-=displacement;
                    totalSubmergedVolume += displacement;

                    tempVolumeVelVec.subVectors(tempVelVec , tempVolumeVelVec );

                //    tempVolumeVelVec.copy(tempVelVec)
                    var vel = tempVolumeVelVec.lengthSq();

                    shapeVolForce =  displacement * 1 * vel  * physTpf;
                    totalVolForce += shapeVolForce;

                    tempVolumeVelVec.multiplyScalar(MATH.safeInt(shapeVolForce));

                    tempVec3.set(0, displacement*1000 * physTpf, 0);

                    tempVec3.x -= tempVolumeVelVec.x;
                    tempVec3.y -= tempVolumeVelVec.y;
                    tempVec3.z -= tempVolumeVelVec.z;

                    MATH.safeForceVector(tempVec3);

                    PhysicsWorldAPI.applyLocalForceToBodyPoint(tempVec3, dynSpat.body, tempVec2);

                }
            }

            submergedFraction = MATH.calcFraction(0, unsubmergedVolume+totalSubmergedVolume,  totalSubmergedVolume);
            PhysicsWorldAPI.setBodyDamping(dynSpat.body, Math.min(dynSpat.baseDamping + Math.sqrt(submergedFraction*2)*0.8, 0.95),Math.min( dynSpat.baseDamping + Math.sqrt(submergedFraction*2) *0.7, 0.95)  )

        };


        WaterPhysics.prototype.simulateDynamicSpatialInWater = function(dynSpat, physTpf) {

            if (dynSpat.isStatic()) {
                return;
            }

            dynSpat.getSpatialPosition(tempVec);

            if (tempVec.y < dynSpat.getVisualSize()) {
                this.processWaterProximity(dynSpat, physTpf);
            }

        };


        return WaterPhysics;

    });

