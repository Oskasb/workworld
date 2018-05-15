"use strict";

define([

    ],
    function(

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
        //    target.sampleBufferState();
            calcVec.copy(target.direction);
            target.getDynamicShapeQuaternion(calcQuat);
            calcVec.applyQuaternion(calcQuat);
            calcVec.multiplyScalar(moduleState.getAppliedFactor());
            target.addForceToDynamicShape(calcVec);
        };

        ModuleFunctions.applyRotationY = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            target.sampleBufferState();
            target.getOriginalRotation(calcObj.quaternion);
            calcObj.rotateY(moduleState.getAppliedFactor());
            WorldAPI.addTextMessage(''+moduleState.getAppliedFactor());
            target.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        return ModuleFunctions;

    });

