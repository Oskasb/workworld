"use strict";

define([
        'worker/physics/ShapePhysics'
    ],
    function(
        ShapePhysics
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

        var sphereVolume;

        var totalVolForce;
        var shapeVolForce;

        var WaterPhysics = function(physicsApi) {

        };


        WaterPhysics.prototype.processWaterProximity = function(dynSpat, physTpf) {
            dynSpat.getSpatialQuaternion(tempQuat);
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.VELOCITY_X, tempVelVec);
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.ANGULAR_VEL_X, tempAngVelVec);

            totalSubmergedVolume = 0;
            unsubmergedVolume = 0;
            totalVolForce = 0;
            for (var i = 0; i < dynSpat.dynamicShapes.length; i++) {

                dynSpat.dynamicShapes[i].calculateWorldPosition(tempVec, tempQuat, tempVecGlobalPos);
                dynSpat.dynamicShapes[i].calculateVelocityFromAngularVelocity(tempAngVelVec, tempVolumeVelVec);

                radius = dynSpat.dynamicShapes[i].radius;
                mecSubmergedDepth = tempVecGlobalPos.y - radius;
                mecSubmergedDepth += PhysicsWorldAPI.waveHeightAtPos(tempVecGlobalPos);
                sphereVolume = MATH.sphereDisplacement(radius, radius*2);
                unsubmergedVolume += sphereVolume;

                if (mecSubmergedDepth < 0) {

                    var displacement = MATH.sphereDisplacement(radius, -mecSubmergedDepth);

                    unsubmergedVolume-=displacement;
                    totalSubmergedVolume += displacement;

                    tempVolumeVelVec.addVectors(tempVelVec , tempVolumeVelVec );

                    ShapePhysics.calculateShapeDynamicForce(dynSpat.dynamicShapes[i], tempVolumeVelVec, tempQuat, tempVec2);
            /*
                //    tempVolumeVelVec.copy(tempVelVec)
                    var vel = tempVolumeVelVec.lengthSq();

                    shapeVolForce = Math.sqrt( displacement ) * 5 * vel  * physTpf;
                    totalVolForce += shapeVolForce;

                    tempVolumeVelVec.multiplyScalar(MATH.safeInt(shapeVolForce));
*/

                    tempVec2.multiplyScalar(MATH.calcFraction(0, sphereVolume, displacement) * 1.016);
                    tempVec3.set(0, displacement*1000 * physTpf, 0);

                    tempVec3.x += tempVec2.x;
                    tempVec3.y += tempVec2.y;
                    tempVec3.z += tempVec2.z;

                    MATH.safeForceVector(tempVec3);

                    dynSpat.dynamicShapes[i].addForceToDynamicShape(tempVec3);

                }
            }

            submergedFraction = MATH.calcFraction(0, unsubmergedVolume+totalSubmergedVolume,  totalSubmergedVolume);
            PhysicsWorldAPI.setBodyDamping(dynSpat.body, Math.min(dynSpat.baseDamping + Math.sqrt(submergedFraction*2)*0.25, 0.75),Math.min( dynSpat.baseDamping + Math.sqrt(submergedFraction*2) *0.25, 0.55)  )

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

