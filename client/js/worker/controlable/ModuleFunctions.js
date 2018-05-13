"use strict";

define([

    ],
    function(

    ) {

    var controlState;

    var calcVec = new THREE.Vector3();
    var calcQuat = new THREE.Quaternion();

        var ModuleFunctions = function() {

        };

        ModuleFunctions.sampleControl = function(renderable, moduleState, controlId) {

            controlState = renderable.getGamePiece().getControlStateById(controlId);
            moduleState.setTargetState(controlState.getControlStateValue())

        };

        ModuleFunctions.applyForce = function(renderable, moduleState, module) {
            calcVec.copy(module.direction);
            calcVec.applyQuaternion(renderable.quat)
            calcVec.multiplyScalar(moduleState.getAppliedFactor());
            renderable.applyForceVector(calcVec);

        };

        ModuleFunctions.applyTorque = function(renderable, moduleState, module) {
            calcVec.copy(module.direction);
            calcVec.multiplyScalar(moduleState.getAppliedFactor());
            renderable.applyTorqueVector(calcVec);

        };

        return ModuleFunctions;

    });

