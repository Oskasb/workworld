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

        var liftVec = new THREE.Vector3();
        var anglesOfAttack = new THREE.Vector3();

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

        var drag;
        var dragCoeff = 1;

        var ShapePhysics = function(physicsApi) {

        };



        ShapePhysics.calculateShapeDynamicForce = function(dynamicShape, velocity, rootQuat, forceStore) {

            tempVec.copy(dynamicShape.size);
            tempVec2.copy(velocity).normalize();
            dynamicShape.getDynamicShapeQuaternion(tempQuat);
            tempQuat.multiply(rootQuat);
            tempVec.applyQuaternion(tempQuat);

            tempVec3.set(0, 0, 1);
            tempVec3.applyQuaternion(tempQuat);
            anglesOfAttack.subVectors(tempVec3, tempVec2);

            drag = Math.abs(tempVec.x*tempVec.y * velocity.z * velocity.z) + Math.abs(tempVec.z*tempVec.y * velocity.x* velocity.x) + Math.abs(tempVec.x*tempVec.z * velocity.y * velocity.y);

            forceStore.copy(velocity);
            forceStore.multiplyScalar(-drag*dragCoeff);

            liftVec.y = dynamicShape.size.x * dynamicShape.size.z * velocity.z  * velocity.z* Math.sin(anglesOfAttack.y * 1);
        //    liftVec.y += dynamicShape.size.x * dynamicShape.size.z * velocity.x *velocity.x * Math.cos(anglesOfAttack.z * 1);

            liftVec.x = dynamicShape.size.y * dynamicShape.size.z * velocity.z * velocity.z * Math.sin(anglesOfAttack.x * 1);
        //    liftVec.x += dynamicShape.size.y * dynamicShape.size.z * velocity.y *velocity.y * Math.cos(anglesOfAttack.y * 1);

            liftVec.z = dynamicShape.size.y * dynamicShape.size.x * velocity.x * velocity.x * Math.sin(anglesOfAttack.z * 1);
        //    liftVec.z += dynamicShape.size.y * dynamicShape.size.x * velocity.y *velocity.y * Math.cos(anglesOfAttack.x * 1);

            liftVec.multiplyScalar(50);

            forceStore.addVectors(liftVec, forceStore);

        };


        return ShapePhysics;

    });

