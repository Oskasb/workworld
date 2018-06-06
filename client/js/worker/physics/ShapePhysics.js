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
        var tempRootQuat = new THREE.Quaternion();
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

        var vol
        var volumeDrag;
        var dirDot;
        var xDrag;
        var yDrag;
        var zDrag;


        ShapePhysics.surfaceCrossSection = function(sizeA, sizeB, angA, angB, angC) {
            return Math.abs(sizeA * sizeB) * (Math.abs(Math.sin(angA) + Math.abs(Math.sin(angB))))
        };

        var volumeOfVec = function(vec) {
            return Math.abs(vec.x*vec.y*vec.z);
        };

        ShapePhysics.calculateSurfaceDragForce = function(boxVec, anglesOfIncidence, velocity, volume, dragVec) {


            xDrag = -velocity.x * (volume + ShapePhysics.surfaceCrossSection(boxVec.z, boxVec.y , anglesOfIncidence.z , anglesOfIncidence.y ));
            yDrag = -velocity.y * (volume + ShapePhysics.surfaceCrossSection(boxVec.z, boxVec.x , anglesOfIncidence.z , anglesOfIncidence.x ));
            zDrag = -velocity.z * (volume + ShapePhysics.surfaceCrossSection(boxVec.x, boxVec.y , anglesOfIncidence.x , anglesOfIncidence.y ));

            dragVec.set(xDrag, yDrag, zDrag);

        };


        ShapePhysics. calculateAngleOfAttack = function(area, velocity, angleOfAttack) {
            return area*velocity*Math.sin(angleOfAttack)

            //    return Math.abs(boxVec.x*boxVec.y * velVec.z * velVec.z) + Math.abs(boxVec.z*boxVec.y * velVec.x* velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y * velVec.y);
        };

        ShapePhysics.transformShapeTo = function(area, velocity, angleOfAttack) {
            return area*velocity*Math.sin(angleOfAttack * Math.PI)

            //    return Math.abs(boxVec.x*boxVec.y * velVec.z * velVec.z) + Math.abs(boxVec.z*boxVec.y * velVec.x* velVec.x) + Math.abs(boxVec.x*boxVec.z * velVec.y * velVec.y);
        };


        ShapePhysics.calculateSurfaceLiftForce = function(area, velocity, anglesOfIncidence, curveName) {
            return area*velocity*MATH.valueFromCurve(MATH.angleInsideCircle(anglesOfIncidence), liftCurves[curveName])
        };

        ShapePhysics.curveLift = function(angleOfAttack, curveName) {
            return MATH.valueFromCurve(angleOfAttack*2, liftCurves[curveName])
        };


        ShapePhysics.torqueFromForcePoint = function(forceVector, pointOfApplication) {
            torqueVec.copy(forceVector);
            torqueVec.cross(pointOfApplication);
            return torqueVec;
        };

        var curveId;

        var incidence;

        ShapePhysics.calculateShapeDynamicForce = function(dynSpat, dynamicShape, velocity, rootQuat, forceStore, AoAVec, speed, density) {

            if (dynamicShape.size.lengthSq() < 5) return;

            tempObj.quaternion.copy(rootQuat);

        //    tempObj.rotateX(Math.PI);
        //    tempObj.rotateY(Math.PI);
        //    tempRootQuat.conjugate();

            tempRootQuat.copy(tempObj.quaternion);

            tempVec.copy(dynamicShape.size);

        //    tempVec.applyQuaternion(tempRootQuat);

            dynamicShape.getDynamicShapeQuaternion(tempQuat);


            tempObj.quaternion.copy(tempQuat);
            tempQuat.multiply(tempRootQuat);

            tempVec.applyQuaternion(tempQuat);

        //    transformedVel.copy(velocity);
        //    transformedVel.applyQuaternion(tempQuat);

        //    tempObj.rotateX(-Math.PI/2);
            tempVec3.set(0, 0, 1);
            tempVec3.applyQuaternion(tempObj.quaternion);

        //    tempEuler.setFromQuaternion(tempObj.quaternion, 'YZX');

            anglesOfIncidence.x = MATH.addAngles(AoAVec.x , -Math.atan2(tempVec3.y, tempVec3.z) );
            anglesOfIncidence.y = MATH.addAngles(AoAVec.y , -Math.atan2(tempVec3.x, tempVec3.z) );
            anglesOfIncidence.z = MATH.addAngles(AoAVec.z , tempEuler.z );

            vol = volumeOfVec(dynamicShape.size);

            dynamicShape.getDynamicShapeQuaternion(tempQuat);

            dynamicShape.setDynamicIncidenceAngles(anglesOfIncidence);

            dragVec.multiplyScalar(speed * density * coefficients['base_drag']);

        //    dynSpat.applySpatialImpulseVector(dragVec);
        //    dragVec.multiplyScalar(0.01);


        //    dragVec.x = velocity.x;
        //    dragVec.y = velocity.y;
        //    dragVec.z = velocity.z;

        //    dragVec.multiplyScalar(speed);

            tempRootQuat.conjugate();
        //    dragVec.applyQuaternion(tempRootQuat);

        //    dragVec.applyQuaternion(tempRootQuat);
        //    dragVec.z *= -1;

            dynamicShape.addForceToDynamicShape(dragVec);

            liftVec.set(0, 0, 0);

            curveId = dynamicShape.getAxisLiftCurve(1);

            if (curveId) {
                liftVec.x = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.y * dynamicShape.size.z, speed, anglesOfIncidence.y, curveId);
            }

            curveId = dynamicShape.getAxisLiftCurve(0);
            if (curveId) {
                liftVec.y = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.x * dynamicShape.size.z, speed, anglesOfIncidence.x, curveId);
            }

            curveId = dynamicShape.getAxisLiftCurve(2);
            if (curveId) {
            //    liftVec.z = ShapePhysics.calculateSurfaceLiftForce(dynamicShape.size.y * dynamicShape.size.x, speed, anglesOfIncidence.z, curveId);
            }

            liftVec.multiplyScalar(speed * density * coefficients['base_lift'] ) // 0.016);

        //    pointOfApplication.copy(dynamicShape.offset);
            //    pointOfApplication.applyQuaternion(tempRootQuat);
        //    tempVec.set(drag * AoAVec.x, drag * AoAVec.y, -drag * Math.cos(AoAVec.z));
            //    tempVec.multiplyScalar(-drag*density*coefficients['base_drag']);
        //    dynSpat.applySpatialTorqueVector(ShapePhysics.torqueFromForcePoint(pointOfApplication, tempVec));

            //    dragVec.applyQuaternion(tempQuat);
            //   dynamicShape.addForceToDynamicShape(tempVec);
            dynamicShape.addForceToDynamicShape(liftVec);

        };

        return ShapePhysics;

    });

