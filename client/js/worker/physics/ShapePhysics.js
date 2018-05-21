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
        var tempEuler = new THREE.Euler();


        var dragVec = new THREE.Vector3();
        var liftVec = new THREE.Vector3();
        var anglesOfAttack = new THREE.Vector3();
        var anglesOfIncidence = new THREE.Vector3();

        var transformedVel = new THREE.Vector3();
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

        var volumeDrag;
        var dirDot;
        var xDrag;
        var yDrag;
        var zDrag;


        ShapePhysics.calculateSurfaceDragForce = function(boxVec, direction, anglesOfIncidence, speed, dragVec) {

            xDrag = Math.abs(boxVec.z * boxVec.y * speed * speed * (direction.x + Math.abs(Math.sin(anglesOfIncidence.y) + Math.abs(Math.sin(anglesOfIncidence.z)))));

            yDrag = Math.abs(boxVec.z * boxVec.x * speed * speed * (direction.y + Math.abs(Math.sin(anglesOfIncidence.x) + Math.abs(Math.sin(anglesOfIncidence.z)))));

            zDrag = Math.abs(boxVec.y * boxVec.x * speed * speed * (direction.z + Math.abs(Math.sin(anglesOfIncidence.x) + Math.abs(Math.sin(anglesOfIncidence.y)))));

            dragVec.set(xDrag, yDrag, zDrag);

            return xDrag + yDrag + zDrag;

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
            torqueVec.copy(forceVector);
            torqueVec.cross(pointOfApplication);
            return torqueVec;
        };

        var curveId;
var incidence;

        ShapePhysics.calculateShapeDynamicForce = function(dynSpat, dynamicShape, velocity, rootQuat, forceStore, AoAVec, speed, density) {

            tempVec.copy(dynamicShape.size);

            tempVec.applyQuaternion(rootQuat);

            dynamicShape.getDynamicShapeQuaternion(tempQuat);

            tempVec.applyQuaternion(tempQuat);
            tempObj.quaternion.copy(tempQuat);

            tempQuat.multiply(rootQuat);
            transformedVel.copy(velocity);
            transformedVel.applyQuaternion(tempQuat);


            tempEuler.setFromQuaternion(tempObj.quaternion, 'YZX');

            anglesOfIncidence.x = MATH.addAngles(AoAVec.x , tempEuler.x  );
            anglesOfIncidence.y = MATH.addAngles(AoAVec.y , tempEuler.y  );
            anglesOfIncidence.z = MATH.addAngles(AoAVec.z , tempEuler.z  );

            drag = ShapePhysics.calculateSurfaceDragForce(dynamicShape.size, dynamicShape.direction, anglesOfIncidence, speed, dragVec);


            dragVec.copy(velocity);
            dragVec.multiplyScalar(-drag*density*coefficients['base_drag']);
        //    dragVec.applyQuaternion(rootQuat)
            liftVec.set(0, 0, 0);

            curveId = dynamicShape.getAxisLiftCurve(0);

            if (curveId) {
                liftVec.x = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.y * dynamicShape.size.z, speed, anglesOfIncidence.y, curveId);
            }

            curveId = dynamicShape.getAxisLiftCurve(1);
            if (curveId) {
                liftVec.y = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.x * dynamicShape.size.z, speed, anglesOfIncidence.x, curveId);
            }

            curveId = dynamicShape.getAxisLiftCurve(2);
            if (curveId) {
                liftVec.z = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.y * dynamicShape.size.x, speed, anglesOfIncidence.z, curveId);
            }

            liftVec.multiplyScalar(density * coefficients['base_lift'] / 0.016);
            dynSpat.applySpatialImpulseVector(dragVec);
        //    pointOfApplication.copy(dynamicShape.offset);
        //    pointOfApplication.applyQuaternion(rootQuat);
        //    dynSpat.applySpatialTorqueVector(ShapePhysics.torqueFromForcePoint(pointOfApplication, dragVec));

        //    dragVec.applyQuaternion(tempQuat);
        //    dynamicShape.addForceToDynamicShape(dragVec);
            dynamicShape.addForceToDynamicShape(liftVec);

        };

        return ShapePhysics;

    });

