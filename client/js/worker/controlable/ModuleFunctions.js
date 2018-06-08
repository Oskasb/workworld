"use strict";

define([
        'worker/physics/ShapePhysics'
    ],
    function(
        ShapePhysics
    ) {

    var controlState;
    var shape;
    var target;

    var calcVec = new THREE.Vector3();
    var calcQuat = new THREE.Quaternion();
    var calcObj = new THREE.Object3D();

        var ModuleFunctions = function() {

        };

        var frameTest = function(dynShape) {
            if (dynShape.checkFrameUpdate() === 1) {
                dynShape.sampleBufferState();
                dynShape.setFrameUpdate(0);
                dynShape.resetDynamicShapeQuaternion();
            }
        };

        ModuleFunctions.sampleControl = function(renderable, moduleState, source) {
            controlState = renderable.getGamePiece().getControlStateById(source);
            moduleState.setTargetState(controlState.getControlStateValue())
        };

        ModuleFunctions.sampleShape = function(renderable, moduleState, source) {
            shape = renderable.getSpatialShapeById(source.id);
            moduleState.setTargetState(shape.getValueByIndex(ENUMS.DynamicShape[source.key]) * source.factor)
        };

        ModuleFunctions.applyForce = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            calcVec.copy(target.direction);
            calcVec.multiplyScalar(moduleState.getAppliedFactor()/0.016);
            target.addForceToDynamicShape(calcVec)
        };

        ModuleFunctions.rotateShape = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt.id);


            frameTest(target);

            target.getDynamicShapeQuaternion(calcObj.quaternion);

            calcObj[trgt.rot](moduleState.getAppliedFactor() * trgt.factor);

            target.setDynamicShapeQuaternion(calcObj.quaternion);
        };


        ModuleFunctions.applyRotationY = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);

            frameTest(target);

            target.getDynamicShapeQuaternion(calcObj.quaternion);
            calcObj.rotateY(moduleState.getAppliedFactor());
            target.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.applyRotationX = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);

            frameTest(target);

            target.getDynamicShapeQuaternion(calcObj.quaternion);
            calcObj.rotateX(moduleState.getAppliedFactor());
            target.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.applyRotationZ = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);

            frameTest(target);

            target.getDynamicShapeQuaternion(calcObj.quaternion);
            calcObj.rotateZ(moduleState.getAppliedFactor());
            target.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.effectEmitter = function(renderable, moduleState, source) {

        };

        return ModuleFunctions;

    });

