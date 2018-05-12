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

        var totalSubmergedVolume;

        var currentTime;

        var WaterPhysics = function(physicsApi) {
        };


        var waveHeight = function(pos) {
            currentTime = PhysicsWorldAPI.getCom(ENUMS.BufferChannels.FRAME_RENDER_TIME);
            return 1.2 * (Math.sin(currentTime*0.33 + pos.x * 0.04) + Math.cos(currentTime * 0.28 + pos.z * 0.06));

        };

        WaterPhysics.prototype.processWaterProximity = function(dynSpat) {
            dynSpat.getSpatialQuaternion(tempQuat);
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.VELOCITY_X, tempVelVec);
            dynSpat.getVectorByFirstIndex(ENUMS.BufferSpatial.ANGULAR_VEL_X, tempAngVelVec);

            totalSubmergedVolume = 0;
            for (var i = 0; i < dynSpat.mechanicalShapes.length; i++) {

                tempVec2.copy(dynSpat.mechanicalShapes[i].offset);

                tempVolumeVelVec.crossVectors(tempVec2, tempAngVelVec);

                tempVec2.applyQuaternion(tempQuat);

                tempVecGlobalPos.addVectors(tempVec2, tempVec);


                mecSubmergedDepth = tempVec.y + tempVec2.y - dynSpat.mechanicalShapes[i].radius + waveHeight(tempVecGlobalPos);

                if (mecSubmergedDepth < 0) {
                    var displacement = MATH.sphereDisplacement(dynSpat.mechanicalShapes[i].radius, -mecSubmergedDepth);


                    totalSubmergedVolume += displacement;


                    tempVolumeVelVec.subVectors(tempVelVec , tempVolumeVelVec );

                //    tempVolumeVelVec.copy(tempVelVec)
                    var vel = tempVolumeVelVec.length();
                    tempVolumeVelVec.multiplyScalar(displacement*10 * Math.sqrt(vel) * vel * PhysicsWorldAPI.getCom(ENUMS.BufferChannels.TPF) / 1000);

                    tempVec3.set(0, displacement*1000 * PhysicsWorldAPI.getCom(ENUMS.BufferChannels.TPF) / 1000, 0);

                    tempVec3.x -= tempVolumeVelVec.x;
                    tempVec3.y -= tempVolumeVelVec.y;
                    tempVec3.z -= tempVolumeVelVec.z;


                    PhysicsWorldAPI.applyLocalForceToBodyPoint(tempVec3, dynSpat.body, tempVec2)

                    PhysicsWorldAPI.registerPhysError()

                }
            }

        };


        WaterPhysics.prototype.simulateDynamicSpatialInWater = function(dynSpat) {

            if (dynSpat.isStatic()) {
                return;
            }

            dynSpat.getSpatialPosition(tempVec);

            if (tempVec.y < dynSpat.getVisualSize()) {
                this.processWaterProximity(dynSpat);
            }

        };


        return WaterPhysics;

    });

