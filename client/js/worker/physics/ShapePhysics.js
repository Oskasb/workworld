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
        var tempObj = new THREE.Object3D();
        var tempObj2 = new THREE.Object3D();

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

        var depth;

        var drag;
        var dragCoeff = 0.1;
        var elevation;

        var ShapePhysics = function() {

        };

        ShapePhysics.volumeBeneathSurface = function(dynamicShape, pos, quat, surfaceElevation) {

            dynamicShape.calculateWorldPosition(pos, quat, tempVec);
            elevation = tempVec.y - surfaceElevation;

            depth = Math.max(dynamicShape.size.y*0.5- elevation, 0);

            return Math.abs(dynamicShape.size.x * depth * dynamicShape.size.z);

        };


        ShapePhysics.calculateSurfaceDragForce = function(boxVec, velVec) {
            //     return Math.abs(boxVec.x*boxVec.y * velVec.z ) + Math.abs(boxVec.z*boxVec.y * velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y );

         return Math.abs(boxVec.x*boxVec.y * velVec.z * velVec.z) + Math.abs(boxVec.z*boxVec.y * velVec.x* velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y * velVec.y);
        };

        ShapePhysics.calculateSurfaceLiftForce = function(area, velocity, angleOfAttack) {
            return area*velocity*Math.sin(angleOfAttack)

            //    return Math.abs(boxVec.x*boxVec.y * velVec.z * velVec.z) + Math.abs(boxVec.z*boxVec.y * velVec.x* velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y * velVec.y);
        };

        ShapePhysics.calculateAngleOfAttack = function(area, velocity, angleOfAttack) {
            return area*velocity*Math.sin(angleOfAttack)

            //    return Math.abs(boxVec.x*boxVec.y * velVec.z * velVec.z) + Math.abs(boxVec.z*boxVec.y * velVec.x* velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y * velVec.y);
        };

        ShapePhysics.transformShapeTo = function(area, velocity, angleOfAttack) {
            return area*velocity*Math.sin(angleOfAttack * Math.PI)

            //    return Math.abs(boxVec.x*boxVec.y * velVec.z * velVec.z) + Math.abs(boxVec.z*boxVec.y * velVec.x* velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y * velVec.y);
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

        //    drag = Math.abs(tempVec.x*tempVec.y * velocity.z * velocity.z) + Math.abs(tempVec.z*tempVec.y * velocity.x* velocity.x) + Math.abs(tempVec.x*tempVec.z * velocity.y * velocity.y);

            drag = ShapePhysics.calculateSurfaceDragForce(tempVec, velocity);

            forceStore.copy(velocity);
            forceStore.multiplyScalar(-drag*dragCoeff);

            liftVec.y =  ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.x * dynamicShape.size.z, velocity.z, anglesOfAttack.z);

            liftVec.x = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.y * dynamicShape.size.z, velocity.z, anglesOfAttack.y);

            liftVec.z =  ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.y * dynamicShape.size.x, velocity.x, anglesOfAttack.x);


            liftVec.multiplyScalar(100);

            forceStore.addVectors(liftVec, forceStore);

        };


        return ShapePhysics;

    });

