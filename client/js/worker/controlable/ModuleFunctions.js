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

        var limitByModuleByValue = function(value, moduleState, limiter) {
            if (MATH.valueIsBetween(value, limiter.min, limiter.max)) {
                moduleState.setTargetState(value * limiter.factor );
            }
        };


        var limitByTargetModuleState = function(renderable, moduleState, limiter) {
            value = renderable.getGamePiece().getModuleStateValueById(limiter.id);
            limitByModuleByValue(value, moduleState, limiter);
        };

        var limitByTargetControlState = function(renderable, moduleState, limiter) {
            controlState = renderable.getGamePiece().getControlStateById(limiter.id);
            limitByModuleByValue(controlState.getControlStateValue(), moduleState, limiter);
        };

        var applyLimiters = function(renderable, moduleState, trgt) {
            if (trgt.limiters) {
                for (i = 0; i < trgt.limiters.length; i++) {
                    limitByTargetControlState(renderable, moduleState, trgt.limiters[i])
                }
            }
        };

        ModuleFunctions.sampleControl = function(renderable, moduleState, source) {
            controlState = renderable.getGamePiece().getControlStateById(source);
            moduleState.setTargetState(controlState.getControlStateValue())
        };

        ModuleFunctions.sampleModule = function(renderable, moduleState, source) {
            value = renderable.getGamePiece().getModuleStateValueById(source);
            moduleState.setTargetState(value)
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

        ModuleFunctions.applyModuleTargetState = function(renderable, moduleState, trgt) {
            target = renderable.getGamePiece().getControlableModuleById(trgt.id);
            value = moduleState.getStateValue();
            target.setModuleTargetState(value);
        };


        ModuleFunctions.rotateShape = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt.id);


            frameTest(target);
            applyLimiters(renderable, moduleState, trgt)

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

        ModuleFunctions.slaveModule = function(renderable, moduleState, trgt) {

        };

        ModuleFunctions.effectEmitter = function(renderable, moduleState, trgt) {

        };

        ModuleFunctions.flightComputerMasterSystem = function(renderable, moduleState, trgt) {

        };

        ModuleFunctions.limitByTargetControlState = function(renderable, moduleState, trgt) {
            limitByTargetControlState(renderable, moduleState, trgt);
        };

        ModuleFunctions.limitByTargetModuleState = function(renderable, moduleState, trgt) {
            limitByTargetModuleState(renderable, moduleState, trgt);
        };

        var links;

        var average;
        var state;
        var piece;
        var count;

        ModuleFunctions.linkModuleTargetStates = function(renderable, moduleState, trgt) {

            value = moduleState.getStateValue();

            if (!value) return;

            links = trgt.links;
            count = links.length;

            average = 0;

            piece = renderable.getGamePiece();

            for (i = 0; i < count; i++) {
                average += piece.getModuleTargetValueById(links[i]) / count;
            }

            for (i = 0; i < count; i++) {
                state = piece.getControlableModuleById(links[i]).moduleState;
                target = state.getTargetValue();
                state.setTargetState((1-value)*target + average);
            }

        };

        ModuleFunctions.linkControlTargetStates = function(renderable, moduleState, trgt) {

            value = moduleState.getStateValue();

            if (!value) return;

            links = trgt.links;
            count = links.length;

            average = 0;

            piece = renderable.getGamePiece();

            for (i = 0; i < count; i++) {
                average += piece.getControlStateById(links[i]).getControlTargetValue() / count;
            }

            for (i = 0; i < count; i++) {
                state = piece.getControlStateById(links[i]);
                target = state.getControlTargetValue();
                state.setPieceControlTargetState(average*value + target*(1-value));
            }

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
            controlState = renderable.getGamePiece().getControlStateById(trgt.id);
            value = moduleState.getStateValue();

            controlState.setPieceControlTrimState((MATH.curveSigmoidMirrored(value*0.7) + value * 0.2) * trgt.factor)
        };



        return ModuleFunctions;

    });

