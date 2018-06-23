"use strict";

define([
        'Events',
        'ui/elements/EffectList'
    ],
    function(
        evt,
        EffectList
    ) {

        var target;
        var i;
        var light;

        var speed;
        var value;
        var dynBone;

        var conf;

        var tempVec1 = new THREE.Vector3();
        var tempVec2 = new THREE.Vector3();
        var fxPos = new THREE.Vector3();
        var fxVel = new THREE.Vector3();
        var fxQuat = new THREE.Quaternion();
        var tempObj = new THREE.Object3D();

        var up = new THREE.Vector3(0, 1, 0);

        tempObj.lookAt(up);
        var fxArgs = {effect:'', pos:fxPos, vel:fxVel, quat:fxQuat, scale:1};



        var ModuleEffectFunctions = function() {

        };

        var rotateBone = function(dynBone, rotFunc, value) {
        //    frameTestBoneRot(dynBone);
            if (!dynBone) return;

            dynBone.getDynamicBoneQuaternion(tempObj.quaternion);
            tempObj[rotFunc](value);
            dynBone.setDynamicBoneQuaternion(tempObj.quaternion);
        };


        var applyLightFeedback = function(renderable, moduleState, trgt) {

            if (trgt.light) {

                light = moduleState.getActiveLight();

                        if (!light) {
                            light = renderable.getRenderableLight(trgt.light.id);
                            moduleState.setActiveLight(light);
                        }



                light.setDynamicLightIntensity(moduleState.getStateValue() * trgt.light.gain);

            }

        };

        var spawnTargetEffect = function(renderable, target, fxId) {
            fxArgs.effect = fxId;
            evt.fire(evt.list().WATER_EFFECT, fxArgs);
            fxArgs.scale = 1;
        };


        var randomPosAtShapeEdge = function(renderable, shape, store) {
            store.set(shape.size.x + (Math.random()*0.01) + shape.size.x * MATH.sign(shape.offset.x) * 2,  shape.size.y * (Math.random()-0.5), shape.size.z * (Math.random()-0.5));
            store.applyQuaternion(renderable.quat);
            store.applyQuaternion(shape.rotation);
        };

        var randomPosInShape = function(renderable, shape, store) {
            store.set(shape.size.x * (Math.random()-0.5),  shape.size.y * (Math.random()-0.5), shape.size.z * (Math.random()-0.5));
            store.applyQuaternion(renderable.quat);
            store.applyQuaternion(shape.rotation);
        };


        ModuleEffectFunctions.propellerEffect = function(renderable, moduleState, trgt) {

            speed = renderable.getDynamicSpeed();

            if (Math.random() * 30 > speed -4) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

            randomPosInShape(renderable, target, tempVec2);

            fxArgs.pos.add(tempVec2);

            if (fxArgs.pos.y > 2) return;

            fxArgs.pos.y -= 2.5;
            fxArgs.vel.set(2*(Math.random()-0.5), 1, -1*(Math.random()+0.5));

            fxArgs.vel.applyQuaternion(renderable.quat);
            fxArgs.vel.y +=0.1;



            spawnTargetEffect(renderable, target, 'prop_effect');
        };

        var min;

        ModuleEffectFunctions.jetExhaustEffect = function(renderable, moduleState, trgt) {

            applyLightFeedback(renderable, moduleState, trgt);

            target = renderable.getSpatialShapeById(trgt.id);

            if (!target.effectList) {
                target.effectList = new EffectList();
            }

        //    var effectList = target.effectList;

            min = trgt.min;
            value = moduleState.getStateValue();

            if (value < min) {

                if (target.effectList.effectCount()) {
                    target.effectList.disableEffectList();
                }

                return;
            } else {

                target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

                if (!target.effectList.effectCount()) {
                    target.effectList.enableEffectList(trgt.effects, fxArgs.pos)
                } else {
                    target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);
                    target.effectList.setEffectListPosition(fxArgs.pos);
                }


            }

            target.effectList.setEffectListScale((value) * trgt.scale);

            fxArgs.vel.copy(target.direction);
            fxArgs.vel.multiplyScalar(-moduleState.getStateValue() -trgt.min);
            fxArgs.vel.applyQuaternion(renderable.quat);

            target.effectList.setEffectListVelocity(fxArgs.vel)


        };

        ModuleEffectFunctions.conTrailEffect = function(renderable, moduleState, trgt) {

            target = renderable.getSpatialShapeById(trgt);
            spawnTargetEffect(renderable, target, 'condensation');

        };

        var shape;

        ModuleEffectFunctions.shapeFittedEffect = function(renderable, moduleState, trgt) {

            value = moduleState.getStateValue();

            if (Math.abs(value) < trgt.threshold) return;

            shape = moduleState.getActiveShape();

            if (!shape) {
                shape = renderable.getSpatialShapeById(trgt.id);
                moduleState.setActiveShape(shape);
            }

            shape.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);
            randomPosInShape(renderable, shape, tempVec2);
            fxArgs.pos.add(tempVec2);

            fxArgs.vel.copy(shape.direction);
            fxArgs.vel.applyQuaternion(renderable.quat);

            spawnTargetEffect(renderable, shape, trgt.effect);
        };


        ModuleEffectFunctions.moduleFittedEffect = function(renderable, moduleState, trgt) {

            value = moduleState.getStateValue();

            if (Math.abs(value) < trgt.threshold) return;

            target = moduleState.getActiveObject();

            if (!target) {
                target = renderable.getGamePiece().getControlableModuleById(trgt.id);
                moduleState.setActiveObject(target);
                if (target.parentShapeId) {
                    target.setParentShape(renderable.getSpatialShapeById(target.parentShapeId))
                }
            }


            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

            if (trgt.vel) {
                renderable.getDynamicSpatialVelocity(fxArgs.vel);
                if (trgt.vel !== 1) {
                    fxArgs.vel.multiplyScalar(trgt.vel)
                }
            } else {
                fxArgs.vel.set(0, 0, 0)
            }

            if (trgt.scale) {
                fxArgs.scale = (Math.abs(value) - trgt.threshold) * trgt.scale;
            }

            spawnTargetEffect(renderable, shape, trgt.effect);
        };

        ModuleEffectFunctions.moduleAttachedLightEffect = function(renderable, moduleState, trgt) {

            value = moduleState.getStateValue();

            target = moduleState.getActiveObject();

            if (!target) {
                target = renderable.getGamePiece().getControlableModuleById(trgt.id);
                moduleState.setActiveObject(target);
                if (target.parentShapeId) {
                    target.setParentShape(renderable.getSpatialShapeById(target.parentShapeId))
                }
                target.effectList = new EffectList();
            }

            min = trgt.threshold;

            if (value < min) {

                if (target.effectList.effectCount()) {
                    target.effectList.setEffectListScale(0);
                    target.effectList.disableEffectList();
                }
                return;

            } else {

                target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

                if (!target.effectList.effectCount()) {
                    target.effectList.enableEffectList(trgt.effects, fxArgs.pos, null, (value - min) * trgt.scale);
                    target.effectList.setEffectListColorKey(trgt.color);
                } else {
                    target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);
                    target.effectList.setEffectListPosition(fxArgs.pos);
                }

            }

            target.effectList.setEffectListScale((value - min) * trgt.scale);

        //    target.effectList.setEffectListVelocity(fxArgs.vel)

        };

        var scale;

        ModuleEffectFunctions.moduleAttachedEffect = function(renderable, moduleState, trgt) {

            value = moduleState.getStateValue();

            target = moduleState.getActiveObject();

            if (!target) {
                target = renderable.getGamePiece().getControlableModuleById(trgt.id);
                moduleState.setActiveObject(target);
                if (target.parentShapeId) {
                    target.setParentShape(renderable.getSpatialShapeById(target.parentShapeId))
                }
                target.effectList = new EffectList();
            }

            min = trgt.threshold;

            if (value < min) {

                if (target.effectList.effectCount()) {
                    target.effectList.setEffectListScale(0);
                    target.effectList.disableEffectList();
                }
                return;

            } else {

                target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

                fxArgs.vel.copy(target.direction);
                fxArgs.vel.multiplyScalar(value * trgt.factor);
                target.applyWorldRotation(renderable.pos, renderable.quat, fxArgs.vel);

                if (!target.effectList.effectCount()) {
                    target.effectList.enableEffectList(trgt.effects, fxArgs.pos, null, (value - min) * trgt.scale);
                    target.effectList.setEffectListColorKey(trgt.color);
                } else {
                    target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);
                    target.effectList.setEffectListPosition(fxArgs.pos);

                    scale = (target.moduleState.getStateValue() * trgt.factor) || 0;
                    target.effectList.setEffectListScale(trgt.scale + scale);
                }
            }

            target.effectList.setEffectListVelocity(fxArgs.vel)

        };


        ModuleEffectFunctions.rudderEffect = function(renderable, moduleState, trgt) {

            speed = renderable.getDynamicSpeed();

            if (Math.random() * 220 > speed -3) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

            randomPosInShape(renderable, target, tempVec2);
            fxArgs.pos.add(tempVec2);
            if (fxArgs.pos.y > 2) return;

            tempObj.quaternion.set(0, 0.72, 0.72, 0);
            tempObj.rotateZ(Math.random()*5);

            fxArgs.quat.copy(tempObj.quaternion);
            fxArgs.pos.y = 1.5;
            fxArgs.vel.set(0, 0, 0);
            spawnTargetEffect(renderable, target, 'wake_effect');
        };


        ModuleEffectFunctions.baseEffect = function(renderable, moduleState, trgt) {
            target = renderable.getSpatialShapeById(trgt);
            spawnTargetEffect(renderable, target, 'prop_effect');
        };

        ModuleEffectFunctions.bowEffect = function(renderable, moduleState, trgt) {

            speed = renderable.getDynamicSpeed();

            if (Math.random() * 5 > speed-1) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);
            renderable.getDynamicSpatialVelocity(tempVec1);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);


            fxArgs.vel.set(1*(Math.random()-0.5), 1, -1*(Math.random()+0.5));

            fxArgs.vel.applyQuaternion(renderable.quat);

            tempVec1.multiplyScalar(Math.random()*0.5);
            fxArgs.pos.add(tempVec1);

            randomPosAtShapeEdge(renderable, target, tempVec2);

            fxArgs.pos.add(tempVec2);

            if (fxArgs.pos.y > 2) return;

            fxArgs.pos.y = -2;

            spawnTargetEffect(renderable, target, 'prop_effect');

            if (Math.random() * 520 > speed -1) {
                return;
            }

            fxArgs.pos.sub(tempVec1);

            fxArgs.pos.y = 1.5;

            spawnTargetEffect(renderable, target, 'bow_splash');

        };

        ModuleEffectFunctions.applyLightState = function(renderable, moduleState, trgt) {
            applyLightFeedback(renderable, moduleState, trgt);
        };

        var offset;

        ModuleEffectFunctions.applyBoneRotation = function(renderable, moduleState, trgt) {

            dynBone = moduleState.getActiveObject();
            if (!dynBone) {
                dynBone = renderable.getRenderableBone(trgt.id);

                moduleState.setActiveObject(dynBone);
                if (!dynBone) {
                    console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                    return;
                }
            }

            value = moduleState.getAppliedFactor();

            if (value !== moduleState.getActiveValue()) {
                moduleState.setActiveValue(value);
                applyLightFeedback(renderable, moduleState, trgt);
                offset = trgt.offset || 0;
                rotateBone(dynBone, trgt.rot, value * trgt.factor + offset)
            }

        };


        ModuleEffectFunctions.applyFeedbackOffsets = function(renderable, moduleState, trgt) {

            if (trgt.rotate_bones) {
                for (i = 0; i < trgt.rotate_bones.length; i++) {
                    conf = trgt.rotate_bones[i];
                    dynBone = renderable.getRenderableBone(conf.id);
                    rotateBone(dynBone, conf.rot, conf.offset)
                }
            }

        };

        ModuleEffectFunctions.setBoneRotationX = function(renderable, moduleState, trgt) {

            dynBone = moduleState.getActiveObject();
            if (!dynBone) {
                dynBone = renderable.getRenderableBone(trgt);

                moduleState.setActiveObject(dynBone);
                if (!dynBone) {
                    console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                    return;
                }
            }

            value = moduleState.getAppliedFactor();

            if (value !== moduleState.getActiveValue()) {
                moduleState.setActiveValue(value)
                tempObj.quaternion.copy(dynBone.originalQuat);
                tempObj.rotateX(value);
                dynBone.setDynamicBoneQuaternion(tempObj.quaternion);

            }




        };

        ModuleEffectFunctions.setBoneRotationY = function(renderable, moduleState, trgt) {

            dynBone = renderable.getRenderableBone(trgt);

            if (!dynBone) {
                console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                return;
            }

            tempObj.quaternion.copy(dynBone.originalQuat);
            tempObj.rotateY(moduleState.getAppliedFactor());
            dynBone.setDynamicBoneQuaternion(tempObj.quaternion);

        };

        ModuleEffectFunctions.setBoneRotationZ = function(renderable, moduleState, trgt) {

            dynBone = renderable.getRenderableBone(trgt);

            if (!dynBone) {
                console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                return;
            }

            tempObj.quaternion.copy(dynBone.originalQuat);
            tempObj.rotateZ(moduleState.getAppliedFactor());
            dynBone.setDynamicBoneQuaternion(tempObj.quaternion);

        };

        ModuleEffectFunctions.rotateBoneX = function(renderable, moduleState, trgt) {

            dynBone = renderable.getRenderableBone(trgt);

            if (!dynBone) {
                console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                return;
            }

            dynBone.addRotationX(moduleState.getAppliedFactor());

        };

        ModuleEffectFunctions.setBoneTranslationX = function(renderable, moduleState, trgt) {

            dynBone = renderable.getRenderableBone(trgt);

            if (!dynBone) {
                console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                return;
            }

            tempObj.position.copy(dynBone.originalPos);
            tempObj.position.x += moduleState.getAppliedFactor();
            dynBone.setDynamicBonePosition(tempObj.position);

        };

        ModuleEffectFunctions.setBoneTranslationY = function(renderable, moduleState, trgt) {

            dynBone = renderable.getRenderableBone(trgt);

            if (!dynBone) {
                console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                return;
            }

            tempObj.position.copy(dynBone.originalPos);
            tempObj.position.y += moduleState.getAppliedFactor();
            dynBone.setDynamicBonePosition(tempObj.position);

        };



        ModuleEffectFunctions.setBoneTranslationZ = function(renderable, moduleState, trgt) {

            dynBone = renderable.getRenderableBone(trgt);

            if (!dynBone) {
                console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                return;
            }

            tempObj.position.copy(dynBone.originalPos);
            tempObj.position.z += moduleState.getAppliedFactor();
            dynBone.setDynamicBonePosition(tempObj.position);

        };

        ModuleEffectFunctions.translateBoneX = function(renderable, moduleState, trgt) {




        };

        ModuleEffectFunctions.setBoneScaleUniform = function(renderable, moduleState, trgt) {

            dynBone = renderable.getRenderableBone(trgt);

            if (!dynBone) {
                console.log("No Dynamic Bone:", trgt, renderable, moduleState);
                return;
            }

            tempObj.scale.copy(dynBone.originalScale);
            tempObj.scale.multiplyScalar(1-moduleState.getAppliedFactor());
            dynBone.setDynamicBoneScale(tempObj.scale);

        };

        ModuleEffectFunctions.wakeEffect = function(renderable, moduleState, trgt) {
            speed = renderable.getDynamicSpeed();

            if (Math.random() * 520 > speed -3) {
                return;
            }

            target = renderable.getSpatialShapeById(trgt);


            if (!target) return;
            renderable.getDynamicSpatialVelocity(tempVec1);
            target.calculateWorldPosition(renderable.pos, renderable.quat, fxArgs.pos);

            randomPosAtShapeEdge(renderable, target, tempVec2);
            if (fxArgs.pos.y > 2) return;

            fxArgs.vel.copy(target.offset);
            fxArgs.vel.z = 0;
            fxArgs.vel.normalize();

            fxArgs.pos.add(tempVec2);
            fxArgs.pos.y = 1.5;
            fxArgs.vel.applyQuaternion(renderable.quat);
            spawnTargetEffect(renderable, target, 'bow_splash');



        };

        ModuleEffectFunctions.zeroEffect = function(renderable, moduleState, trgt) {




        };


        return ModuleEffectFunctions;

    });

