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
        var dynRen;
        var module;
        var key;
        var controls;
        var camera;
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
            shape = moduleState.getActiveShape();

            if (!shape) {
                shape = renderable.getSpatialShapeById(source.id);
                moduleState.setActiveShape(shape);
            }

            moduleState.setTargetState(shape.getValueByIndex(ENUMS.DynamicShape[source.key]) * source.factor)
        };

        ModuleFunctions.sampleLight = function(renderable, moduleState, trgt) {
            value = renderable.getRenderableLight(trgt).getDynamicLightIntensity();
            moduleState.setTargetState(value)
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

            shape = moduleState.getActiveShape();

            if (!shape) {
                shape = renderable.getSpatialShapeById(trgt.id);
                moduleState.setActiveShape(shape);
            }


            frameTest(shape);
            applyLimiters(renderable, moduleState, trgt);

            shape.getDynamicShapeQuaternion(calcObj.quaternion);
            calcObj[trgt.rot](moduleState.getAppliedFactor() * trgt.factor);

            shape.setDynamicShapeQuaternion(calcObj.quaternion);
        };


        ModuleFunctions.applyRotationY = function(renderable, moduleState, trgt) {

            shape = moduleState.getActiveShape();

            if (!shape) {
                shape = renderable.getSpatialShapeById(trgt);
                moduleState.setActiveShape(shape);
            }

            frameTest(shape);

            shape.getDynamicShapeQuaternion(calcObj.quaternion);
            calcObj.rotateY(moduleState.getAppliedFactor());
            shape.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.applyRotationX = function(renderable, moduleState, trgt) {
            shape = moduleState.getActiveShape();

            if (!shape) {
                shape = renderable.getSpatialShapeById(trgt);
                moduleState.setActiveShape(shape);
            }

            frameTest(shape);

            shape.getDynamicShapeQuaternion(calcObj.quaternion);
            calcObj.rotateX(moduleState.getAppliedFactor());
            shape.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.applyRotationZ = function(renderable, moduleState, trgt) {
            shape = moduleState.getActiveShape();

            if (!shape) {
                shape = renderable.getSpatialShapeById(trgt);
                moduleState.setActiveShape(shape);
            }


            frameTest(shape);

            shape.getDynamicShapeQuaternion(calcObj.quaternion);
            calcObj.rotateZ(moduleState.getAppliedFactor());
            shape.setDynamicShapeQuaternion(calcObj.quaternion);
        };

        ModuleFunctions.slaveModule = function(renderable, moduleState, trgt) {

            value = renderable.getGamePiece().getModuleStateValueById(trgt.id);

            if (MATH.valueIsBetween(value, trgt.min, trgt.max)) {
                moduleState.setTargetState(trgt.offset + ( value - trgt.min ) * ( trgt.factor / ( trgt.max - trgt.min) ) );
            } else {
                moduleState.setTargetState(0)
            }

        };

        ModuleFunctions.effectEmitter = function(renderable, moduleState, trgt) {

        };


        ModuleFunctions.cameraMode = function(renderable, moduleState, trgt) {
            if (renderable !== WorldAPI.getControlledRenderable()) return;
            if (moduleState.getTargetValue() === 0) return;

            for (i = 0; i < trgt.zero_ctrl.length; i++) {
                control = renderable.getGamePiece().getControlStateById(trgt.zero_ctrl[i]);
                control.setPieceControlTargetState(0)
            }

            module = renderable.getGamePiece().getControlableModuleById(trgt.id);

            module.calculateWorldPosition(renderable.pos, renderable.quat, calcVec);
            renderable.cameraHome.copy(module.offset);
            renderable.cameraHome.z += 1;
            calcObj.lookAt(module.direction);
        //    calcObj.quaternion.multiply(renderable.quat);

        //    calcObj.quaternion.slerp(renderable.quat, trgt.slerp);

            camera = WorldAPI.getWorldCamera().getCamera();
            camera.position.copy(calcVec);
            camera.quaternion.slerp(renderable.quat, trgt.slerp);
            camera.rotateY(Math.PI);


        };

        ModuleFunctions.flightComputerMasterSystem = function(renderable, moduleState, trgt) {

        };



        ModuleFunctions.attachGamePiece = function(renderable, moduleState, trgt) {
            if (moduleState.getAppliedFactor() < 0.99) return;
            target = WorldAPI.getDynamicRenderableByPieceId(trgt.piece_id);
            if (!target) {
                module = renderable.getGamePiece().getControlableModuleById(trgt.id);
                module.calculateWorldPosition(renderable.pos, renderable.quat, calcVec);
                calcObj.lookAt(module.direction);
                calcObj.quaternion.multiply(renderable.quat);
                calcVec.y += 3;
                WorldAPI.spawnCallPieceId(trgt.piece_id, calcVec, calcObj.quaternion);
                return;
            }


        };

        var control;

        ModuleFunctions.applyCatapultToPiece = function(renderable, moduleState, trgt) {
            if (!MATH.valueIsBetween(moduleState.getAppliedFactor(), 0.5, 0.9)) return;

            target = WorldAPI.getDynamicRenderableByPieceId(trgt.piece_id);

            if (!target) {
                return;
            }

            controls = trgt.controls;

            for (key in controls) {
                control = target.getGamePiece().getControlStateById(key);
                control.setPieceControlTargetState(controls[key])
            }

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


        var masterState;

        ModuleFunctions.lightSelectorSystem = function(renderable, moduleState, trgt) {


            masterState = renderable.getGamePiece().getModuleTargetValueById(trgt.master_module);

        //    if (!value) return;

            value = 0;

            state = moduleState.getAppliedFactor();

            for (i = 0; i < trgt.lights.length; i++) {

                light = renderable.getRenderableLight(trgt.lights[i].id);
            //    if (moduleState.getStateValue() > 0) {
                    value = MATH.valueFromCurve(state + trgt.lights[i].offset, MATH.curves[trgt.curve]) * trgt.lights[i].gain;
            //    }
                light.setDynamicLightIntensity( value * masterState);
            }
        };


        ModuleFunctions.trimControl = function(renderable, moduleState, trgt) {
            controlState = renderable.getGamePiece().getControlStateById(trgt.id);
            value = moduleState.getStateValue();

            controlState.setPieceControlTrimState((MATH.curveSigmoidMirrored(value*0.7) + value * 0.2) * trgt.factor)
        };



        return ModuleFunctions;

    });

