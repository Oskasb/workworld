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
        var AoAVec = new THREE.Vector3();

        var tempVolumeVelVec = new THREE.Vector3();
        var tempVecGlobalPos = new THREE.Vector3();

        var speed;

        var velDot;
        var submergedFraction;

        var totalSubmergedVolume;

        var unsubmergedVolume;

        var currentTime;

        var radius;

        var sphereVolume;

        var totalVolForce;
        var shapeVolForce;

        var submergedVolume;
        var shape;

        var WaterPhysics = function(physicsApi) {
        //    ShapePhysics.initData();
        };


        WaterPhysics.prototype.processWaterProximity = function(dynSpat, physTpf) {
            dynSpat.getSpatialQuaternion(tempQuat);
            speed = dynSpat.spatialBuffer[ENUMS.BufferSpatial.SPEED_MPS];
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.VELOCITY_X, tempVelVec);
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.ANGULAR_VEL_X, tempAngVelVec);
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.ANGLE_OF_ATTACK_X, AoAVec);


            totalSubmergedVolume = 0;
            unsubmergedVolume = 0;
            totalVolForce = 0;
            for (var i = 0; i < dynSpat.dynamicShapes.length; i++) {

                shape = dynSpat.dynamicShapes[i]

                shape.calculateWorldPosition(tempVec, tempQuat, tempVecGlobalPos);
                shape.calculateVelocityFromAngularVelocity(tempAngVelVec, tempVolumeVelVec);

                submergedVolume = ShapePhysics.volumeBeneathSurface(shape, tempVec, tempQuat, PhysicsWorldAPI.waveHeightAtPos(tempVecGlobalPos));

                sphereVolume = shape.size.x * shape.size.y * shape.size.z ;

                unsubmergedVolume += sphereVolume;

                if (submergedVolume > 0) {

                    unsubmergedVolume-=submergedVolume;
                    totalSubmergedVolume += submergedVolume;

                    tempVolumeVelVec.addVectors(tempVelVec , tempVolumeVelVec );



                    ShapePhysics.calculateShapeDynamicForce(dynSpat, shape, tempVolumeVelVec, tempQuat, tempVec2, AoAVec,speed, 1);
            /*
                //    tempVolumeVelVec.copy(tempVelVec)
                    var vel = tempVolumeVelVec.lengthSq();

                    shapeVolForce = Math.sqrt( displacement ) * 5 * vel  * physTpf;
                    totalVolForce += shapeVolForce;

                    tempVolumeVelVec.multiplyScalar(MATH.safeInt(shapeVolForce));
*/

                //    tempVec2.multiplyScalar(MATH.calcFraction(0, sphereVolume, submergedVolume) * 1.016);
                    tempVec3.set(0, submergedVolume*100/0.016, 0);

                //    tempVec3.x += tempVec2.x;
                //    tempVec3.y += tempVec2.y;
                 //   tempVec3.z += tempVec2.z;

                //    MATH.safeForceVector(tempVec3);

                    shape.addForceToDynamicShape(tempVec3);

                    //

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

