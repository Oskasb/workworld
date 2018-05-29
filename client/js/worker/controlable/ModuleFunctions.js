"use strict";

define([
        'worker/physics/ShapePhysics'
    ],
    function(
        ShapePhysics
    ) {

    var controlState;
    var target;

    var calcVec = new THREE.Vector3();
    var calcQuat = new THREE.Quaternion();
    var calcObj = new THREE.Object3D();

        var ModuleFunctions = function() {

        };

        ModuleFunctions.sampleControl = function(renderable, moduleState, source) {

            controlState = renderable.getGamePiece().getControlStateById(source);
            moduleState.setTargetState(controlState.getControlStateValue())
        };

        ModuleFunctions.applyForce = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            calcVec.copy(target.direction);
            //     target.getDynamicShapeQuaternion(calcQuat);
            //     calcVec.applyQuaternion(calcQuat);
            calcVec.multiplyScalar(moduleState.getAppliedFactor()/0.016);

            //    renderable.applyTorqueVector(ShapePhysics.torqueFromForcePoint(calcVec, target.offset))

            //       calcVec.applyQuaternion(renderable.quat);
            //    renderable.applyForceVector(calcVec);
            target.addForceToDynamicShape(calcVec)

        };

        ModuleFunctions.applyRotationY = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            target.sampleBufferState();
            target.getOriginalRotation(calcObj.quaternion);
            calcObj.rotateY(moduleState.getAppliedFactor());
            target.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.applyRotationX = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            target.sampleBufferState();
            target.getOriginalRotation(calcObj.quaternion);
            calcObj.rotateX(moduleState.getAppliedFactor());
            target.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.applyRotationZ = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            target.sampleBufferState();
            target.getOriginalRotation(calcObj.quaternion);
            calcObj.rotateZ(moduleState.getAppliedFactor());
            target.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.effectEmitter = function(renderable, moduleState, source) {

        };

        return ModuleFunctions;

    });

