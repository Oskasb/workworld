"use strict";

define([
        'ConfigObject'
    ],
    function(
        ConfigObject
    ) {

        var mecSubmergedDepth;

        var tempVec = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var tempVec3 = new THREE.Vector3();
        var tempQuat = new THREE.Quaternion();
        var tempObj = new THREE.Object3D();
        var tempObj2 = new THREE.Object3D();


        var dragVec = new THREE.Vector3();
        var liftVec = new THREE.Vector3();
        var anglesOfAttack = new THREE.Vector3();
        var anglesOfIncidence = new THREE.Vector3();

        var tansformedVel = new THREE.Vector3();
        var torqueVec = new THREE.Vector3();

        var pointOfApplication = new THREE.Vector3();
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


        var liftCurves = {};
        var coefficients = {};


        var ShapePhysics = function() {

        };

        ShapePhysics.initData = function() {

            var liftCurveData = function(data) {
                liftCurves = data;
            };

            PhysicsWorldAPI.fetchConfigData('PHYSICS', 'AERODYNAMICS', 'lift_curves', liftCurveData);

            var coeffCurveData = function(data) {
                coefficients = data;
            };

            PhysicsWorldAPI.fetchConfigData('PHYSICS', 'AERODYNAMICS', 'coefficients', coeffCurveData);
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



        ShapePhysics.calculateAngleOfAttack = function(area, velocity, angleOfAttack) {
            return area*velocity*Math.sin(angleOfAttack)

            //    return Math.abs(boxVec.x*boxVec.y * velVec.z * velVec.z) + Math.abs(boxVec.z*boxVec.y * velVec.x* velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y * velVec.y);
        };

        ShapePhysics.transformShapeTo = function(area, velocity, angleOfAttack) {
            return area*velocity*Math.sin(angleOfAttack * Math.PI)


            //    return Math.abs(boxVec.x*boxVec.y * velVec.z * velVec.z) + Math.abs(boxVec.z*boxVec.y * velVec.x* velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y * velVec.y);
        };


        ShapePhysics.calculateSurfaceLiftForce = function(area, velocity, angleOfAttack, curveName) {
            return area*velocity*MATH.valueFromCurve(angleOfAttack*Math.PI, liftCurves[curveName])
        };

        ShapePhysics.curveLift = function(angleOfAttack, curveName) {
            return MATH.valueFromCurve(angleOfAttack*Math.PI, liftCurves[curveName])
        };


        ShapePhysics.torqueFromForcePoint = function(forceVector, pointOfApplication) {
            torqueVec.copy(pointOfApplication);
            torqueVec.cross(forceVector);
            return torqueVec;
        };

        var curveId;

        ShapePhysics.calculateShapeDynamicForce = function(dynSpat, dynamicShape, velocity, rootQuat, forceStore, AoAVec, speed, density) {

            tempVec.copy(dynamicShape.size);
            pointOfApplication.copy(dynamicShape.offset);

            tansformedVel.copy(velocity);

            tansformedVel.applyQuaternion(rootQuat);
            tansformedVel.multiplyScalar(-1);

            dynamicShape.getDynamicShapeQuaternion(tempQuat);

            //    tempVec.applyQuaternion(rootQuat);
            tempVec.applyQuaternion(tempQuat);

            tempVec3.set(0, 0, 1);
            tempVec3.applyQuaternion(tempQuat);

        //    anglesOfAttack.copy(tempVec3, tempVec2);

            anglesOfIncidence.addVectors(tempVec3, AoAVec);

        //    drag = Math.abs(tempVec.x*tempVec.y * velocity.z * velocity.z) + Math.abs(tempVec.z*tempVec.y * velocity.x* velocity.x) + Math.abs(tempVec.x*tempVec.z * velocity.y * velocity.y);

            drag = ShapePhysics.calculateSurfaceDragForce(tempVec, tansformedVel);

            forceStore.set(0, 0, 0);
        //    forceStore.copy(velocity);
        //    forceStore.multiplyScalar(-drag*coefficients['water_drag']);

            liftVec.set(0, 0, 0);

            curveId = dynamicShape.getAxisLiftCurve(0);
            if (curveId) {
                liftVec.x = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.y * dynamicShape.size.z, speed, anglesOfIncidence.x, curveId);
            }

            curveId = dynamicShape.getAxisLiftCurve(1);
            if (curveId) {
        //        liftVec.y = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.x * dynamicShape.size.z, tansformedVel.z, anglesOfIncidence.z, curveId);
            }

            curveId = dynamicShape.getAxisLiftCurve(2);
            if (curveId) {
        //        liftVec.z = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.y * dynamicShape.size.x, tansformedVel.x, anglesOfIncidence.x, curveId);
            }

            liftVec.multiplyScalar(density * 100 / 0.016);

        //    tempQuat.copy(rootQuat)

            liftVec.applyQuaternion(tempQuat);

            //    dynSpat.applySpatialTorqueVector(ShapePhysics.torqueFromForcePoint(pointOfApplication, liftVec));

           forceStore.addVectors(liftVec, forceStore);

        };

        return ShapePhysics;

    });

