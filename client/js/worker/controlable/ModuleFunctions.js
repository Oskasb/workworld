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
        var light;

        var worldTime;
        var currentTime;
        var timeProgress;

        var value;
        var i;

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

        ModuleFunctions.effectEmitter = function(renderable, moduleState, trgt) {

        };

        ModuleFunctions.flightComputerMasterSystem = function(renderable, moduleState, trgt) {

        };


        ModuleFunctions.lightMasterSystem = function(renderable, moduleState, trgt) {

            value = 0;

            worldTime = WorldAPI.getWorldTime();

            for (i = 0; i < trgt.lights.length; i++) {

                light = renderable.getRenderableLight(trgt.lights[i].id);

                if (moduleState.getStateValue() > 0) {

                    currentTime = worldTime + trgt.cycle_time * trgt.lights[i].offset;
                    timeProgress = MATH.modulo(currentTime  / trgt.cycle_time, 1);
                    value = MATH.valueFromCurve(timeProgress, MATH.curves[trgt.curve]) * trgt.lights[i].gain * moduleState.getStateValue();

                }

                light.setDynamicLightIntensity( value );
            }
        };

        ModuleFunctions.trimControl = function(renderable, moduleState, trgt) {
        //    controlState = renderable.getGamePiece().getControlStateById(trgt.id);
        //    controlState.setPieceControlTrimState(moduleState.getStateValue())
        };


        return ModuleFunctions;

    });

